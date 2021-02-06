const ISDEPLOYING = false;
const ALLRULESACTIVE = false;

const prettierConflictRules = { // Re-Enable These When Not Using Prettier 
    "array-element-newline": ["warn", "consistent",],
    "brace-style": ["warn", "1tbs", {"allowSingleLine": true,},],
    "comma-dangle": ["warn", "never",],
    "function-call-argument-newline": ["warn", "consistent",],
    "function-paren-newline": "warn",
    "indent": [
        "warn",
        4,
        {
            "ArrayExpression": "first",
            "CallExpression": {"arguments": "first",},
            "FunctionDeclaration": {"parameters": "first",
                                    "body": 1,},
            "FunctionExpression": {"parameters": "first",
                                   "body": 1,},
            "ImportDeclaration": "first",
            "MemberExpression": 1,
            "ObjectExpression": "first",
            "SwitchCase": 1,
            "VariableDeclarator": "first",
            "flatTernaryExpressions": true,
            "ignoreComments": true,
            "offsetTernaryExpressions": true,
            "outerIIFEBody": 1,
        },
    ],
    "linebreak-style": ["warn", "windows",],
    "multiline-ternary": ["warn", "always-multiline",],
    "no-confusing-arrow": ["warn", {"allowParens": true,},],
    "no-extra-parens": [
        "warn",
        "all",
        {
            "conditionalAssign": false,
            "enforceForArrowConditionals": false,
            "nestedBinaryExpressions": false,
        },
    ],
    "no-floating-decimal": "warn",
    "no-mixed-operators": "warn",   
    "no-mixed-spaces-and-tabs": ["warn", "smart-tabs",],
    "no-multi-spaces": "warn",
    "no-multi-str": "warn",
    "no-multiple-empty-lines": "warn",    
    "nonblock-statement-body-position": ["warn", "below",],
    "object-curly-spacing": ["warn", "never",],
    "operator-linebreak": ["warn", "before",],
    "padded-blocks": ["warn", "never",],
    "semi": ["warn", "always", {"omitLastInOneLineBlock": true,},],
    "space-before-function-paren": ["warn", {"anonymous": "never", "named": "never", "asyncArrow": "always",},],
};
const defaultRules = {
    "accessor-pairs": ["warn",],
    "array-callback-return": "warn",
    "block-scoped-var": "warn",
    "capitalized-comments": "off",
    "class-methods-use-this": 0,
    "consistent-return": ["warn", {"treatUndefinedAsUnspecified": true,},],
    "curly": "warn",
    "default-case": "warn",
    "dot-notation": ["warn",],
    "eol-last": 0,
    "eqeqeq": ["warn", "always",],
    "import/extensions": ["warn", {
        "js": "always",
        "scss": "never",
        "css": "never",
    },],
    "import/named": 0,
    "line-comment-position": "off",
    "lines-between-class-members": 0,
    "max-classes-per-file": 0,
    "max-len": "off",
    "max-lines-per-function": "off",
    "max-params": "off",
    "max-statements": "off",
    "multiline-comment-style": 0,
    "new-cap": ["error", {"capIsNewExceptionPattern": "[A-Z]+",},],
    "no-console": 0,
    "no-constant-condition": ["warn", {"checkLoops": false,},],
    "no-continue": 0,
    "no-else-return": 0,
    "no-empty-function": 0,
    "no-eq-null": "warn",
    "no-eval": "warn",
    "no-extend-native": 0,
    "no-extra-bind": "warn",
    "no-implicit-coercion": "warn",
    "no-implicit-globals": "warn",
    "no-implied-eval": "warn",
    "no-inline-comments": "off",
    "no-invalid-this": 0,
    "no-iterator": "warn",
    "no-labels": "warn",
    "no-lone-blocks": "warn",
    "no-lonely-if": 0,
    "no-loop-func": 0,
    "no-magic-numbers": "off", 
    "no-new": 0,
    "no-param-reassign": 0,
    "no-plusplus": 0,
    // "no-prototype-builtins": 0,
    "no-restricted-globals": 0,
    "no-restricted-syntax": 0,
    "no-tabs": ["warn", {"allowIndentationTabs": true,},],
    "no-template-curly-in-string": "warn",
    "no-ternary": "off",
    "no-trailing-spaces": 0,
    "no-underscore-dangle": 0,
    "no-unreachable": 0,
    "no-unused-vars": "off",
    "no-use-before-define": 0,
    "no-useless-computed-key": 0,
    "no-useless-constructor": "warn",
    "no-useless-escape": 0,
    "no-void": 0,
    "object-curly-newline": 0,
    "one-var": [
        "warn",
        {"var": "always",
         "let": "consecutive",
         "const": "never",},
    ],
    "one-var-declaration-per-line": 0,
    "prefer-arrow-callback": "warn",
    "prefer-const": ["warn", {"destructuring": "all",},],
    "prefer-destructuring": "warn",
    "prefer-object-spread": "warn",
    "quotes": ["warn", "double", {"avoidEscape": true, "allowTemplateLiterals": false,},], // Options necessary to work with Prettier.
    "radix": 0,
    "sort-keys": [
        "warn",
        "asc",
        {"caseSensitive": true,
         "natural": true,
         "minKeys": 20,},
    ],
};
const deploymentRules = {
    "multiline-comment-style": ["warn", "starred-block",],
    "no-console": "error",
    "no-debugger": "error",
    "no-empty-function": "error",
    "no-prototype-builtins": "error",
    "no-trailing-spaces": "error",
    "no-unused-vars": "error",
};

const allRulesActive = {};
for (const [rule, value,] of Object.entries(defaultRules,)) {
    allRulesActive[rule] = value === 0 ? "warn" : value;
}

const rules = Object.assign(Object.assign(ALLRULESACTIVE ? allRulesActive : defaultRules,), Object.assign(ISDEPLOYING ? deploymentRules : {},),);

module.exports = {
    // #region BASIC SETTINGS
    "env": {
        "es6": true,
        "es2020": true,
        "browser": true,
        "commonjs": true,
        "jest": true,
        "jquery": true,
    },
    "plugins": [],
    "extends": [
        ALLRULESACTIVE ? "eslint:all" : "eslint:recommended",
        "airbnb-base",
        
        "prettier", // must go at the bottom
    ],
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module",
        "allowImportExportEverywhere": false,
        "codeFrame": false,
        "ecmaFeatures": {
            "jsx": false,
            "impliedStrict": true,
        },
    },

    /*
     * #endregion
     * #region LINTING RULES
     */
    "reportUnusedDisableDirectives": true,
    rules,

    /*
     * #endregion
     * #region GLOBALS
     */
    "globals": {
        "$": "readonly",
        "$clamp": "readonly",
        "Actor": "readonly",
        "ActorDirectory": "readonly",
        "ActorSheet": "readonly",
        "Actors": "readonly",
        "CONFIG": "readonly",
        "ChatMessage": "readonly",
        "DEFAULT_TOKEN": "readonly",
        "Dialog": "readonly",
        "DragDrop": "readonly",
        "Draggable": "readonly",
        "Handlebars": "readonly",
        "Hooks": "readonly",
        "Item": "readonly",
        "ItemDirectory": "readonly",
        "ItemSheet": "readonly",
        "Items": "readonly",
        "Macro": "readonly",
        "PIXI": "readonly",
        "Roll": "readonly",
        "Sidebar": "readonly",
        "TextEditor": "readonly",
        "debounce": "readonly",
        "diffObject": "readonly",
        "dragula": "readonly",
        "duplicate": "readonly",
        "expandObject": "readonly",
        "flattenObject": "readonly",
        "game": "readonly",
        "getProperty": "readonly",
        "getType": "readonly",
        "hasProperty": "readonly",
        "innerHeight": "readonly",
        "innerWidth": "readonly",
        "isObjectEmpty": "readonly",
        "loadTemplates": "readonly",
        "mergeObject": "readonly",
        "randomID": "readonly",
        "setProperty": "readonly",
        "ui": "readonly",
    },
    // #endregion
};
