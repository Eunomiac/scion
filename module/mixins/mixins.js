export const UCase = (str) => `${str ?? ""}`.toUpperCase();
export const LCase = (str) => `${str ?? ""}`.toLowerCase();
export const SCase = (str) => `${UCase(str).slice(0, 1)}${LCase(str).slice(1)}`;
export const TCase = (str) => {
    const noCap = ["above", "after", "at", "below", "by", "down", "for", "from", "in", "onto", "of", "off", "on", "out", "to", "under", "up", "with", "for", "and", "nor", "but", "or", "yet", "so", "the", "an", "a"]
    const isUCase = (s) => /^[^a-z]*$/u.test(s);
    const isAlreadyCased = (w) => isUCase(w) && !isUCase(str);
    return `${str ?? ""}`.split(/\s/u)
                                     .map((word, i) => isAlreadyCased(word) && word
                                                       || i > 0 && noCap.includes(LCase(word)) && LCase(word)
                                                       || SCase(word) )
                                     .join(" ")
                                     .replace(/\s+/gu, " ")
                                     .trim();
};
export const Loc = (locRef, formatDict = {}) => {
    for (const [key, val] of Object.entries(formatDict))
        formatDict[key] = Loc(val) || val;
    return game.i18n.format(locRef, formatDict) || "";
};
export const ParseArticles = (str) => `${str ?? ""}`.replace(/\b(a|A)\s([aeiouAEIOU])/gu, "$1n $2");
export const Pluralize = (str, num, customPlural) => num == 1 ? str : (customPlural ?? `${`${str}`.replace(/(y|Y)$/u, "ie")}s`);


const NUMBERWORDS = {
    low: [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
        "twenty"
    ],
    tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    tiers: [
        "hundred",
        "thousand",
        "million",
        "billion",
        "trillion",
        "quadrillion",
        "quintillion",
        "sextillion",
        "septillion",
        "octillion",
        "nonillion",
        "decillion",
        "undecillion",
        "duodecillion",
        "tredecillion",
        "quattuordecillion",
        "quindecillion",
        "sexdecillion",
        "septendecillion",
        "octodecillion",
        "novemdecillion",
        "vigintillion",
        "unvigintillion",
        "duovigintillion",
        "trevigintillion",
        "quattuorvigintillion",
        "quinvigintillion",
        "sexvigintillion",
        "septenvigintillion",
        "octovigintillion",
        "novemvigintillion",
        "trigintillion",
        "untrigintillion",
        "duotrigintillion",
        "tretrigintillion",
        "quattuortrigintillion"
    ]
};
const ORDINALSUFFIX = {
    zero: "zeroeth",
    one: "first",
    two: "second",
    three: "third",
    four: "fourth",
    five: "fifth",
    eight: "eighth",
    nine: "ninth",
    twelve: "twelfth",
    twenty: "twentieth",
    thirty: "thirtieth",
    forty: "fortieth",
    fifty: "fiftieth",
    sixty: "sixtieth",
    seventy: "seventieth",
    eighty: "eightieth",
    ninety: "ninetieth"
};



const pInt = (strRef, isRounding = false) => parseInt(isRounding ? Math.round(parseFloat(strRef) || 0) : strRef) || 0;
const pFloat = (strRef, sigDigits = false) => (VAL({number: sigDigits}) ? roundSig(parseFloat(strRef) || 0, sigDigits) : parseFloat(strRef))
                                              || 0;
const roundSig = (num, digits, isReturningPaddedString = false) => {
    if (VAL({number: digits}) && D.Int(digits) > 0) {
        const returnNum = Math.round(num * 10 ** D.Int(digits) + Number.EPSILON) / 10 ** D.Int(digits);
        if (isReturningPaddedString)
            if (!`${returnNum}`.includes(".")) {
                return `${returnNum}.${"0".repeat(digits)}`;
            } else {
                const decSide = `${returnNum}`.split(".").pop();
                return `${Math.floor(returnNum)}.${decSide}${"0".repeat(digits - `${decSide}`.length)}`;
            }
        return returnNum;
    }
    return D.Int(num, true);
};
const clampNum = (num, minVal, maxVal) => Math.max(Math.min(num, maxVal), minVal);
const cycleNum = (num, minVal, maxVal) => {
    while (num > maxVal)
        num -= maxVal - minVal;
    while (num < minVal)
        num += maxVal - minVal;
    return num;
};
const padNum = (num, numDigitsLeft, numDigitsRight) => {
    let [leftDigits, rightDigits] = `${num}`.split(".");
    leftDigits = `${"0".repeat(Math.max(0, numDigitsLeft - leftDigits.length))}${leftDigits}`;
    rightDigits = VAL({number: rightDigits}) ? rightDigits : "";
    if (VAL({number: numDigitsRight}))
        rightDigits = `.${rightDigits}${"0".repeat(Math.max(0, numDigitsRight - rightDigits.length))}`;
    return `${leftDigits}${rightDigits}`;
};
const signNum = (num, delim = "") => `${D.Float(num) < 0 ? "-" : "+"}${delim}${Math.abs(D.Float(num))}`;
const pLowerCase = (ref) => (VAL({array: ref}) ? ref.map((x) => `${x || ""}`.toLowerCase()) : `${ref || ""}`.toLowerCase());
const pUpperCase = (ref) => (VAL({array: ref}) ? ref.map((x) => `${x || ""}`.toUpperCase()) : `${ref || ""}`.toUpperCase());
const numToText = (num, isTitleCase = false) => {
    const numString = `${num}`;
    const parseThreeDigits = (v) => {
        const digits = _.map(v.toString().split(""), (vv) => parseInt(vv));
        let result = "";
        if (digits.length === 3) {
            const hundreds = digits.shift();
            result += hundreds > 0 ? `${C.NUMBERWORDS.low[hundreds]} hundred` : "";
            if (digits[0] + digits[1] > 0)
                result += " and ";
            else
                return result.toLowerCase();
        }
        if (parseInt(digits.join("")) <= C.NUMBERWORDS.low.length)
            result += C.NUMBERWORDS.low[parseInt(digits.join(""))];
        else
            result += C.NUMBERWORDS.tens[parseInt(digits.shift())] + (parseInt(digits[0]) > 0 ? `-${C.NUMBERWORDS.low[parseInt(digits[0])]}` : "");
        return result.toLowerCase();
    };
    const isNegative = numString.charAt(0) === "-";
    const [integers, decimals] = numString.replace(/[,|\s|-]/gu, "").split(".");
    const intArray = _.map(
        integers
            .split("")
            .reverse()
            .join("")
            .match(/.{1,3}/g),
        (v) => v
            .split("")
            .reverse()
            .join("")
    ).reverse();
    const [intStrings, decStrings] = [[], []];
    while (intArray.length)
        intStrings.push(`${parseThreeDigits(intArray.shift())} ${C.NUMBERWORDS.tiers[intArray.length]}`.toLowerCase().trim());
    if (VAL({number: decimals})) {
        decStrings.push(" point");
        for (const digit of decimals.split(""))
            decStrings.push(C.NUMBERWORDS.low[parseInt(digit)]);
    }
    return capitalize((isNegative ? "negative " : "") + intStrings.join(", ") + decStrings.join(" "), isTitleCase);
};
const textToNum = (num) => {
    const [tenText, oneText] = num.split("-");
    if (VAL({string: tenText}, "textToNum"))
        return Math.max(
            0,
            _.indexOf(
                _.map(C.NUMBERWORDS.tens, (v) => v.toLowerCase()),
                tenText.toLowerCase()
            ) * 10,
            _.indexOf(
                _.map(C.NUMBERWORDS.low, (v) => v.toLowerCase()),
                tenText.toLowerCase()
            )
        ) + VAL({string: oneText})
            ? Math.max(
                0,
                _.indexOf(
                    _.map(C.NUMBERWORDS.low, (v) => v.toLowerCase()),
                    oneText.toLowerCase()
                )
            )
            : 0;
    return 0;
};
const ellipsisText = (text, maxLength) => {
    if (`${text}`.length > maxLength)
        return `${text.slice(0, maxLength - 3)}…`;
    return text;
};
const numToRomanNum = (num, isGroupingSymbols = true) => {
    if (isNaN(num))
        return NaN;
    const digits = String(D.Int(num)).split("");
    const key = (isGroupingSymbols && [
        // Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ Ⅺ Ⅻ Ⅼ Ⅽ Ⅾ Ⅿ
        "",
        "Ⅽ",
        "ⅭⅭ",
        "ⅭⅭⅭ",
        "ⅭⅮ",
        "Ⅾ",
        "ⅮⅭ",
        "ⅮⅭⅭ",
        "ⅮⅭⅭⅭ",
        "ⅭⅯ",
        "",
        "Ⅹ",
        "ⅩⅩ",
        "ⅩⅩⅩ",
        "ⅩⅬ",
        "Ⅼ",
        "ⅬⅩ",
        "ⅬⅩⅩ",
        "ⅬⅩⅩⅩ",
        "ⅩⅭ",
        "",
        "Ⅰ",
        "Ⅱ",
        "Ⅲ",
        "Ⅳ",
        "Ⅴ",
        "Ⅵ",
        "Ⅶ",
        "Ⅷ",
        "Ⅸ"
    ]) || [
        // Ⅰ Ⅴ Ⅹ Ⅼ Ⅽ Ⅾ Ⅿ
        "",
        "Ⅽ",
        "ⅭⅭ",
        "ⅭⅭⅭ",
        "ⅭⅮ",
        "Ⅾ",
        "ⅮⅭ",
        "ⅮⅭⅭ",
        "ⅮⅭⅭⅭ",
        "ⅭⅯ",
        "",
        "Ⅹ",
        "ⅩⅩ",
        "ⅩⅩⅩ",
        "ⅩⅬ",
        "Ⅼ",
        "ⅬⅩ",
        "ⅬⅩⅩ",
        "ⅬⅩⅩⅩ",
        "ⅩⅭ",
        "",
        "Ⅰ",
        "ⅠⅠ",
        "ⅠⅠⅠ",
        "ⅠⅤ",
        "Ⅴ",
        "ⅤⅠ",
        "ⅤⅠⅠ",
        "ⅤⅠⅠⅠ",
        "ⅠⅩ"
    ];
    let roman = "",
        i = 3;
    while (i--)
        roman = (key[D.Int(digits.pop()) + i * 10] || "") + roman;
    return isGroupingSymbols
        ? (Array(D.Int(digits.join("")) + 1).join("M") + roman).replace(/ⅩⅠ/gu, "Ⅺ").replace(/ⅩⅡ/gu, "Ⅻ")
        : Array(D.Int(digits.join("")) + 1).join("M") + roman;
};
const ordinal = (num, isFullText = false) => {
    /* Converts any number by adding its appropriate ordinal ("2nd", "3rd", etc.) */
    if (isFullText) {
        const [numText, suffix] = numToText(num).match(/.*?[-|\s](\w*?)$/u);
        return numText.replace(new RegExp(`${suffix}$`, "u"), "") + C.ORDINALSUFFIX[suffix] || `${suffix}th`;
    }
    const tNum = parseInt(num) - 100 * Math.floor(parseInt(num) / 100);
    if ([11, 12, 13].includes(tNum))
        return `${num}th`;

    return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][num % 10]}`;
};

// #region OBJECT MANIPULATION: Manipulating arrays, mapping objects
const kvpMap = (obj, kFunc, vFunc) => {
    const newObj = {};
    _.each(obj, (v, k) => {
        newObj[kFunc ? kFunc(k, v) : k] = vFunc ? vFunc(v, k) : v;
    });
    return newObj;
};
const removeFirst = (array, element) => array.splice(array.findIndex((v) => v === element));
const pullElement = (
    array,
    checkFunc = (_v = true, _i = 0, _a = []) => {
        checkFunc(_v, _i, _a);
    }
) => {
    const index = array.findIndex((v, i, a) => checkFunc(v, i, a));
    return index !== -1 && array.splice(index, 1).pop();
};
const pullIndex = (array, index) => pullElement(array, (v, i) => i === index);
const parseToObj = (val, delim = ",", keyValDelim = ":") => {
    /* Converts an array or comma-delimited string of parameters ("key:val, key:val, key:val") into an object. */
    const [obj, args] = [{}, []];
    if (VAL({string: val}))
        args.push(...val.split(delim));
    else if (VAL({array: val}))
        args.push(...val);
    else
        return THROW(`Cannot parse value '${jStrC(val)}' to object.`, "parseToObj");
    for (const kvp of _.map(args, (v) => v.split(new RegExp(`\\s*${keyValDelim}\\s*(?!\\/)`, "u"))))
        obj[kvp[0].toString().trim()] = parseInt(kvp[1]) || kvp[1];
    return obj;
};
const getLast = (array) => (array.length ? array[array.length - 1] : null);
// #endregion


const isInExact = (needle, haystack = ALLSTATS) => {
    // D.Alert(JSON.stringify(haystack))
    // Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack.
    try {
        // STEP ZERO: VALIDATE NEEDLE & HAYSTACK
        // NEEDLE --> Must be STRING
        // HAYSTACK --> Can be ARRAY, LIST or STRING
        if (VAL({string: needle}) || VAL({number: needle})) {
            // STEP ONE: BUILD HAYSTACK.
            // HAYSTACK = ARRAY? --> HAY = ARRAY
            // HAYSTACK = LIST? ---> HAY = ARRAY (Object.keys(H))
            // HAYSTACK = STRING? -> HAY = H

            if (haystack && haystack.gramSizeLower)
                return isIn(needle, haystack);
            const hayType = (VAL({array: haystack}) && "array") || (VAL({list: haystack}) && "list") || (VAL({string: haystack}) && "string");
            let ndl = needle.toString(),
                hay,
                match;
            switch (hayType) {
                case "array":
                    hay = [...haystack];
                    break;
                case "list":
                    hay = Object.keys(haystack);
                    break;
                case "string":
                    hay = haystack;
                    break;
                default:
                    return THROW(`Haystack must be a string, a list or an array (${typeof haystack}): ${JSON.stringify(haystack)}`, "IsIn");
            }
            // STEP TWO: SEARCH HAY FOR NEEDLE USING PROGRESSIVELY MORE FUZZY MATCHING. SKIP "*" STEPS IF ISFUZZYMATCHING IS FALSE.
            // STRICT: Search for exact match, case sensitive.
            // LOOSE: Search for exact match, case insensitive.
            // *START: Search for match with start of haystack strings, case insensitive.
            // *END: Search for match with end of haystack strings, case insensitive.
            // *INCLUDE: Search for match of needle anywhere in haystack strings, case insensitive.
            // *REVERSE INCLUDE: Search for match of HAYSTACK strings inside needle, case insensitive.
            // FUZZY: Start again after stripping all non-word characters.
            if (hayType === "array" || hayType === "list") {
                for (let i = 0; i <= 1; i++) {
                    let thisNeedle = ndl,
                        thisHay = hay;
                    match = _.findIndex(thisHay, (v) => thisNeedle === v) + 1; // Adding 1 means "!match" passes on failure return of -1.
                    if (match)
                        break;
                    thisHay = _.map(
                        thisHay,
                        (v) => ((v || v === 0) && (VAL({string: v}) || VAL({number: v}) ? v.toString().toLowerCase() : v)) || "§¥£"
                    );
                    thisNeedle = thisNeedle.toString().toLowerCase();
                    match = _.findIndex(thisHay, (v) => thisNeedle === v) + 1;
                    if (match)
                        break;
                    // Now strip all non-word characters and try again from the top.
                    ndl = ndl.replace(/\W+/gu, "");
                    hay = _.map(hay, (v) => (VAL({string: v}) || VAL({number: v}) ? v.toString().replace(/\W+/gu, "") : v));
                }
                return match && hayType === "array" ? haystack[match - 1] : haystack[Object.keys(haystack)[match - 1]];
            } else {
                for (let i = 0; i <= 1; i++) {
                    match = hay === ndl && ["", hay];
                    if (match)
                        break;
                    const thisNeedleRegExp = new RegExp(`^(${ndl})$`, "iu");
                    match = hay.match(thisNeedleRegExp);
                    if (match)
                        break;
                    // Now strip all non-word characters and try again from the top.
                    ndl = ndl.replace(/\W+/gu, "");
                    hay = hay.replace(/\W+/gu, "");
                }
                return match && match[1];
            }
        }
        return THROW(`Needle must be a string: ${D.JSL(needle)}`, "isIn");
    } catch (errObj) {
        return THROW(`Error locating '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "isIn", errObj);
    }
};
const isIn = (needle, haystack, isExact = false) => {
    let dict;
    if (isExact)
        return isInExact(needle, haystack);
    if (!haystack) {
        dict = STATE.REF.STATSDICT;
    } else if (haystack.add) {
        dict = haystack;
    } else {
        dict = Fuzzy.Fix();
        for (const str of haystack)
            dict.add(str);
    }
    const result = dict.get(needle);
    return result && result[0][1];
};