// src/utils/hebrewSpacing.js

// Detect Hebrew letter (Unicode block U+0590–U+05FF)
const HEBREW_LETTER = /[\u0590-\u05FF]/;

// Safe punctuation that may need a trailing space in running text
const PUNCT_THAT_NEEDS_SPACE_AFTER = /[.,!?;:)]/;

function hasAnyWhitespace(s) {
    return /\s/.test(s);
}

/**
 * Locale-aware final-pass formatter for Hebrew.
 * It never inserts spaces inside words and only adds them
 * where a word boundary is detected per UAX#29 / Intl.Segmenter.
 * Falls back to conservative regex rules if Segmenter is unavailable.
 * See: MDN Intl.Segmenter & Unicode Text Segmentation UAX #29.
 */
export function formatFinalHebrew(text) {
    if (!text || typeof text !== "string") return text;

    // Normalize CRLF/newlines lightly but keep layout
    let src = text.replace(/\r\n/g, "\n");

    // Prefer Intl.Segmenter when available (Baseline 2024+).
    // This yields word-like segments; we only add spaces between
    // consecutive word-like segments if the original substring between
    // them had no whitespace or punctuation.
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
        try {
            const seg = new Intl.Segmenter("he", { granularity: "word" });
            const it = seg.segment(src);
            const segments = Array.from(it); // [{segment, index, isWordLike}, ...]

            // Nothing to do if we can't segment
            if (!segments.length) return src;

            let out = "";
            for (let i = 0; i < segments.length; i++) {
                const cur = segments[i];
                const prev = segments[i - 1];

                // Emit any untouched chars before the first segment
                if (i === 0 && cur.index > 0) {
                    out += src.slice(0, cur.index);
                }

                if (i > 0) {
                    const gapStart = prev.index + prev.segment.length;
                    const gap = src.slice(gapStart, cur.index);

                    if (hasAnyWhitespace(gap)) {
                        // Preserve user/LLM-provided whitespace
                        out += gap;
                    } else if (!gap && prev.isWordLike && cur.isWordLike) {
                        // No explicit gap & both are "words": insert a single safe space
                        out += " ";
                    } else if (!gap) {
                        // No gap and at least one is non-word (punctuation etc.): none
                    } else {
                        // Some non-whitespace gap (punctuation etc.): preserve as-is
                        out += gap;
                    }
                }

                out += cur.segment;
            }

            // Emit any tail remaining after the last segment
            const last = segments[segments.length - 1];
            const tailStart = last.index + last.segment.length;
            if (tailStart < src.length) out += src.slice(tailStart);

            // Minimal polish: ensure a space after certain punctuation before Hebrew letters
            out = out.replace(
                new RegExp(`(${PUNCT_THAT_NEEDS_SPACE_AFTER.source})(?=${HEBREW_LETTER.source})`, "g"),
                "$1 "
            );

            return out;
        } catch {
            // Fall through to conservative fallback
        }
    }

    // ---- Fallback (no Intl.Segmenter) ----
    // 1) Never touch spaces inside existing text
    // 2) Ensure space after punctuation if followed immediately by Hebrew letter
    let out = src.replace(
        new RegExp(`(${PUNCT_THAT_NEEDS_SPACE_AFTER.source})(?=${HEBREW_LETTER.source})`, "g"),
        "$1 "
    );

    // 3) Ensure spaces between numbers and Hebrew (both directions) if glued
    out = out
        .replace(/(\d)(?=[\u0590-\u05FF])/g, "$1 ")
        .replace(/([\u0590-\u05FF])(?=\d)/g, "$1 ");

    return out;
}

/**
 * Convenience helper for arrays/blocks (e.g., step-by-step items).
 * Accepts string or array-of-strings and formats only for Hebrew UI.
 */
export function formatFinalHebrewBlocks(value, uiLang) {
    if (uiLang !== "he") return value;
    if (Array.isArray(value)) return value.map((v) => formatFinalHebrew(v));
    return formatFinalHebrew(value);
}
