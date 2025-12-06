const replaceStrict = (text, from, to, flags = "g") => {
    const esc = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`\\b${esc}\\b`, flags), to);
};

// Helper: loose replace (substring)
const replaceLoose = (text, from, to, flags = "gi") => {
    const esc = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(esc, flags), to);
};

// Normalize spacing
const normalizeSpaces = (s) =>
    s
        .replace(/\u00A0/g, " ")
        .replace(/[ ]{2,}/g, " ")
        .replace(/[ \t]*\n[ \t]*/g, "\n")
        .replace(/^[ \t]+|[ \t]+$/gm, "");

// Final pass: remove common English filler words but keep math tokens
const finalScrubEnglish = (s) => {
    // Preserve these tokens if they appear standalone
    const allow = new Set([
        "pi", "π", "r", "C", "A", "B", "H", "L", "W",
        "cm", "mm", "m", "km", "deg", "tan", "sin", "cos", "sqrt"
    ]);

    // Common English fillers to Hebrew
    const direct = [
        ["Given", "נתון"],
        ["Where", "כאשר"],
        ["Now", "כעת"],
        ["So", "לכן"],
        ["Therefore", "לכן"],
        ["Thus", "לכן"],
        ["Then", "ואז"],
        ["approximately", "בקירוב"],
        ["approximate", "בקירוב"],
        ["rounded to two decimal places", "בעיגול לשתי ספרות עשרוניות"],
        ["rounded to three decimal places", "בעיגול לשלוש ספרות עשרוניות"],
        ["units", "יחידות"],
        ["square units", "יחידות שטח"],
        ["From the ones we only have", "בספרת האחדות יש לנו רק"],
        ["From the tens we only have", "בספרת העשרות יש לנו רק"],
        ["From the hundreds we only have", "בספרת המאות יש לנו רק"],
        ["of", "של"],
        ["from", "מ-"],
    ];

    for (const [en, he] of direct) s = replaceLoose(s, en, he);

    // Remove any left English word of 3+ letters that isn't allowed
    s = s.replace(/\b([A-Za-z]{3,})\b/g, (m) => (allow.has(m) ? m : ""));

    // Collapse double spaces that might have been created
    s = s.replace(/[ ]{2,}/g, " ");
    return s;
};

// Main translator
export const translateSolutionSteps = (raw, t) => {
    if (!raw) return "";
    let s = raw;

    // ============================================================
    // 1. Geometry Question Full-Sentence Patterns
    // ============================================================

    // Rectangle: "Rectangle with length X and width Y. Find its area and perimeter."
    s = s.replace(
        /Rectangle with length (\d+) and width (\d+)\. Find its area and perimeter\.?/gi,
        "נתון מלבן באורך $1 ורוחב $2. חשבו את השטח וההיקף."
    );

    // Circle: "Circle with radius X. Find its area and circumference."
    s = s.replace(
        /Circle with radius (\d+)\. Find its area and circumference\.?/gi,
        "נתון מעגל ברדיוס $1. חשבו את השטח וההיקף."
    );

    // Triangle: "Right triangle with base X and height Y. Find its area and hypotenuse."
    s = s.replace(
        /Right triangle with base (\d+) and height (\d+)\. Find its area and hypotenuse\.?/gi,
        "נתון משולש ישר-זווית עם בסיס $1 וגובה $2. חשבו את השטח ואת היתר."
    );

    // Polygon: "Regular pentagon with side length X. Find its approximate area."
    s = s.replace(
        /Regular pentagon with side length (\d+)\. Find its approximate area\.?/gi,
        "נתון מחומש משוכלל עם צלע באורך $1. חשבו את השטח (בקירוב)."
    );

    // ============================================================
    // 2. Arithmetic & Generic Patterns
    // ============================================================

    // --- Subtraction Patterns ---
    // 1. New Format: To subtract B from A, simply perform the subtraction to get ANSWER.
    s = s.replace(/To subtract (\d+) from (\d+), simply perform the subtraction to get (\d+)\.?/gi,
        "כדי לחסר את $1 מ-$2, פשוט בצעו את החיסור לקבלת $3.");

    // 2. Simple Subtraction: To subtract B from A, simply subtract B from A to get ANSWER.
    s = s.replace(/To subtract (\d+) from (\d+), simply subtract (\d+) from (\d+) to get (\d+)\.?/gi,
        "כדי לחסר את $1 מ-$2, פשוט מחסרים את $3 מ-$4 ומקבלים $5.");

    // Pattern: To subtract B from A, count backwards...
    s = s.replace(/To subtract (\d+) from (\d+), count backwards (\d+) steps from (\d+) to get (\d+)\.?/gi,
        "כדי לחסר את $1 מ-$2, ספרו אחורה $3 צעדים מ-$4 לקבלת $5.");

    // Pattern: To subtract B from A: (Bridge 10 intro)
    s = s.replace(/To subtract (\d+) from (\d+):/gi,
        "כדי לחסר את $1 מ-$2:");

    // Pattern: First subtract X from Y to get down to 10.
    s = s.replace(/First subtract (\d+) from (\d+) to get down to 10\.?/gi,
        "ראשית, מחסרים $1 מ-$2 כדי להגיע ל-10.");

    // Pattern: You still need to subtract X.
    s = s.replace(/You still need to subtract (\d+)\.?/gi,
        "כעת נותר לחסר עוד $1.");

    // Pattern: Subtract X from 10 to get Y.
    s = s.replace(/Subtract (\d+) from 10 to get (\d+)\.?/gi,
        "מחסרים $1 מ-10 ומקבלים $2.");

    // --- Addition Patterns ---
    // Pattern: To add A and B, simply add them together to get ANSWER.
    s = s.replace(/To add (\d+) and (\d+), simply add them together to get (\d+)\.?/gi,
        "כדי לחבר את $1 ו-$2, פשוט מחברים אותם יחד ומקבלים $3.");

    // Pattern: To add A and B, simply add A to B to get ANSWER.
    s = s.replace(/To add (\d+) and (\d+), simply add (\d+) to (\d+) to get (\d+)\.?/gi,
        "כדי לחבר את $1 ו-$2, פשוט מוסיפים את $3 ל-$4 ומקבלים $5.");

    // Pattern: To add A and B: (Bridge 10 intro)
    s = s.replace(/To add (\d+) and (\d+):/gi,
        "כדי לחבר את $1 ו-$2:");

    // Pattern: Take X from Y and give it to Z to make 10.
    s = s.replace(/Take (\d+) from (\d+) and give it to (\d+) to make 10\.?/gi,
        "לוקחים $1 מ-$2 ומעבירים ל-$3 כדי להשלים ל-10.");

    // Pattern: Then add the remaining X to 10 to get Y.
    s = s.replace(/Then add the remaining (\d+) to 10 to get (\d+)\.?/gi,
        "לאחר מכן מוסיפים את היתרה ($1) ל-10 ומקבלים $2.");

    // Pattern: To add X to the ones place of Y...
    s = s.replace(/simply add (\d+) to the ones place of (\d+) to get (\d+)\.?/gi,
        "פשוט מוסיפים את $1 ספרת האחדות של $2 כדי לקבל $3.");

    // Pattern: To add A to B (general)
    s = s.replace(/To add (\d+) to (\d+),/gi,
        "כדי להוסיף את $1 ל-$2,");

    // Pattern: To add A and B (general)
    s = s.replace(/To add (\d+) and (\d+),/gi,
        "כדי לחבר את $1 ו-$2,");

    // --- Multiplication Patterns ---
    // Pattern: Multiply X by Y (from Z)
    s = s.replace(/Multiply (-?\d+) by (-?\d+) \(from (-?\d+)\)/gi, "הכפל/י את $1 ב-$2 (מתוך $3)");

    // Pattern: Multiply X by Y (General)
    s = s.replace(/Multiply (-?\d+) by (-?\d+)/gi, "הכפל/י את $1 ב-$2");

    // Pattern: Current result: X
    s = s.replace(/Current result: (-?\d+)/gi, "תוצאה נוכחית: $1");

    // ==== Headings / structure ====
    s = replaceLoose(s, "Step", "שלב");
    s = replaceLoose(s, "Steps", "שלבים");
    s = replaceLoose(s, "Solution steps", "שלבי פתרון");
    s = replaceLoose(s, "Solution", "פתרון");
    s = replaceLoose(s, "Alternative solution", "פתרון חלופי");

    // ==== Generic actions ====
    s = replaceLoose(s, "Break down the numbers", "נפרק את המספרים");
    s = replaceLoose(s, "Write the numbers", "כתוב/כתבי את המספרים");
    s = replaceLoose(s, "Combine the parts", "אחד/י את החלקים");
    s = replaceLoose(s, "Now combine all the parts", "כעת אחד/י את כל החלקים");
    s = replaceLoose(s, "Combine differences", "אחד/י את ההפרשים");
    s = replaceLoose(s, "Add all partial sums", "חבר/י את סכומי הביניים");
    s = replaceLoose(s, "Add the partial sums", "חבר/י את סכומי הביניים");

    s = replaceLoose(s, "Combine tens", "שלב/י את העשרות");
    s = replaceLoose(s, "Combine ones", "שלב/י את האחדות");
    s = replaceLoose(s, "Combine hundreds", "שלב/י את המאות");

    s = replaceLoose(s, "Subtract tens", "חסר/י עשרות");
    s = replaceLoose(s, "Subtract ones", "חסר/י אחדות");
    s = replaceLoose(s, "Subtract hundreds", "חסר/י מאות");
    s = replaceLoose(s, "Tens difference", "הפרש העשרות");
    s = replaceLoose(s, "Ones difference", "הפרש האחדות");
    s = replaceLoose(s, "Hundreds difference", "הפרש המאות");

    s = replaceLoose(s, "Bring down the ones", "הורד/י את האחדות");
    s = replaceLoose(s, "Bring down the tens", "הורד/י את העשרות");
    s = replaceLoose(s, "Bring down the hundreds", "הורד/י את המאות");

    s = replaceLoose(s, "Divide the numbers", "חלק/י את המספרים");
    s = replaceLoose(s, "Apply the sign", "החיל/י את הסימן");
    s = replaceLoose(s, "Multiply", "הכפל/י");
    s = replaceLoose(s, "Add", "חבר/י");
    s = replaceLoose(s, "Subtract", "חסר/י");

    // ==== English filler sentences often used by LLM ====
    s = replaceLoose(s, "The sum of", "הסכום של");
    s = replaceLoose(s, "The result of", "התוצאה של");
    s = replaceLoose(s, "The answer is", "התשובה היא");
    s = replaceLoose(s, "is", "הוא/היא");
    s = replaceLoose(s, "and", "ו");
    s = replaceLoose(s, "or", "או");

    // ==== Fractions ====
    s = replaceLoose(s, "common denominator", "מכנה משותף");
    s = replaceLoose(s, "least common multiple", "מכפלה משותפת קטנה");
    s = replaceLoose(s, "denominator", "מכנה");
    s = replaceLoose(s, "numerator", "מונה");
    s = replaceLoose(s, "Convert each fraction", "המר/י כל שבר");
    s = replaceLoose(s, "Add numerators", "חבר/י את המונים");
    s = replaceLoose(s, "Final fraction", "שבר סופי");
    s = replaceLoose(s, "simplifies to", "מצטמצם ל־");
    s = replaceLoose(s, "with different denominators", "עם מכנים שונים");

    // ==== Geometry: shapes & terms ====
    s = replaceStrict(s, "rectangle", "מלבן");
    s = replaceStrict(s, "Rectangle", "מלבן");
    s = replaceStrict(s, "triangle", "משולש");
    s = replaceStrict(s, "Triangle", "משולש");
    s = replaceLoose(s, "right triangle", "משולש ישר־זווית");
    s = replaceLoose(s, "hypotenuse", "יתר");
    s = replaceLoose(s, "base", "בסיס");
    s = replaceLoose(s, "height", "גובה");
    s = replaceStrict(s, "circle", "מעגל");
    s = replaceStrict(s, "Circle", "מעגל");
    s = replaceLoose(s, "circumference", "היקף (מעגל)");
    s = replaceLoose(s, "radius", "רדיוס");
    s = replaceLoose(s, "diameter", "קוטר");
    s = replaceLoose(s, "perimeter", "היקף");
    s = replaceLoose(s, "area", "שטח");

    s = replaceLoose(s, "regular polygon", "מצולע משוכלל");
    s = replaceLoose(s, "regular pentagon", "מחומש משוכלל");
    s = replaceLoose(s, "apothem", "אפוטמה");
    s = replaceLoose(s, "approximate area", "שטח בקירוב");
    s = replaceLoose(s, "approximate", "בקירוב");

    // ==== Variables that often appear in geometry explanations ====
    s = replaceStrict(s, "Length", "אורך");
    s = replaceStrict(s, "Width", "רוחב");
    s = replaceStrict(s, "length", "אורך");
    s = replaceStrict(s, "width", "רוחב");

    // ==== Formulas wording ====
    s = replaceLoose(s, "use the following formulas", "נשתמש בנוסחאות הבאות");
    s = replaceLoose(s, "we can calculate", "נחשב כך");
    s = replaceLoose(s, "let's calculate", "נחשב");
    s = replaceLoose(s, "plugging in the values", "נציב את הערכים");
    s = replaceLoose(s, "rounded", "בעיגול");

    // ==== Units ====
    s = replaceLoose(s, "units of area", "יחידות שטח");
    s = replaceLoose(s, "square units", "יחידות שטח");
    s = replaceLoose(s, "units", "יחידות");

    // ==== Specific Word Cleanups (Fallbacks) ====
    // We handled specific "To add" cases earlier.
    s = replaceLoose(s, "To ", "כדי ");
    s = replaceLoose(s, "from", "מ");
    s = replaceLoose(s, "simply", "פשוט");
    s = replaceLoose(s, "perform", "בצע");
    s = replaceLoose(s, "by", "ב־");

    // ==== Symbols spacing (tiny cleanup) ====
    s = s.replace(/\s*×\s*/g, " × ");
    s = s.replace(/\s*÷\s*/g, " ÷ ");
    s = s.replace(/\s*=\s*/g, " = ");
    s = s.replace(/\s*\+\s*/g, " + ");
    s = s.replace(/\s*-\s*/g, " - ");

    // ==== Normalize and final scrub ====
    s = normalizeSpaces(s);
    s = finalScrubEnglish(s);
    s = normalizeSpaces(s);

    // Title for steps if the block starts with numbered lines but missing a heading
    if (/^1\)/m.test(s) && !/שלבי פתרון/i.test(s.split("\n")[0])) {
        s = `שלבי פתרון:\n\n${s}`;
    }

    return s;
};