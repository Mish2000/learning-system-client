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

    // ==== Headings / structure ====
    s = replaceLoose(s, "Step", "שלב");
    s = replaceLoose(s, "Steps", "שלבים");
    s = replaceLoose(s, "Solution steps", "שלבי פתרון");
    s = replaceLoose(s, "Solution", "פתרון");
    s = replaceLoose(s, "Alternative solution", "פתרון חלופי");

    // ==== Generic actions ====
    s = replaceLoose(s, "Write the numbers", "כתוב/כתבי את המספרים");
    s = replaceLoose(s, "Combine the parts", "אחד/י את החלקים");
    s = replaceLoose(s, "Now combine all the parts", "כעת אחד/י את כל החלקים");
    s = replaceLoose(s, "Combine the tens", "שלב/י את העשרות");
    s = replaceLoose(s, "Combine the ones", "שלב/י את האחדות");
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

export default translateSolutionSteps;