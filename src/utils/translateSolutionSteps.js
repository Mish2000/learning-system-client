export function translateSolutionSteps(text, t) {
    const replacements = [
        //General:
        {eng: "and", key: "and"},
        {eng: "take", key: "take"},
        {eng: "from", key: "from"},
        // {eng: "it", key: "it"},
        {eng: "to", key: "to"},
        {eng: "make", key: "make"},
        {eng: "then", key: "then"},
        {eng: "remaining", key: "remaining"},
        {eng: "get", key: "get"},

        //Addition:
        { eng: "To add", key: "toAdd" },
        {eng: "add", key: "add"},
        {eng: "subtract", key: "subtract"},
        {eng: "ones", key: "ones"},
        {eng: "tens", key: "tens"},
        {eng: "hundreds", key: "hundreds"},
        {eng: "write", key: "write"},
        {eng: "simply", key: "simply"},
        {eng: "directly", key: "directly"},
        {eng: "numbers", key: "numbers"},
        {eng: "parts", key: "parts"},
        {eng: "all the", key: "allThe"},
        {eng: "current result", key: "result"},

        {eng: "now", key: "now"},
        {eng: "the", key: "the"},
        {eng: "by", key: "by"},

        //todo
        { eng: "simply add", key: "simplyAdd" },
        { eng: "Step 1:", key: "step1" },
        { eng: "Step 2:", key: "step2" },
        { eng: "Step 3:", key: "step3" },
        { eng: "Divide", key: "divide" },
        { eng: "apply the sign", key: "applySign" },
        { eng: "Multiply", key: "multiply" },
        { eng: "Area", key: "area" },
        { eng: "Perimeter", key: "perimeter" },
        { eng: "Circumference", key: "circumference" },
        { eng: "Hypotenuse", key: "hypotenuse" },
        { eng: "Combine the parts", key: "combineParts" },
        { eng: "Combine the ones", key: "combineOnes" },
        { eng: "Combine the tens", key: "combineTens" },
        { eng: "Combine the hundreds", key: "combineHundreds" },
        { eng: "which simplifies to", key: "simplifiesTo" }
    ];
    let translated = text;
    replacements.forEach(({ eng, key }) => {
        const regex = new RegExp(eng, "gi");
        translated = translated.replace(regex, t(key));
    });
    return translated;
}