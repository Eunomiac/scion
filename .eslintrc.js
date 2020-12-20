module.exports = {
    // #region BASIC SETTINGS
    parser: "babel-eslint",
    env: {
        es6: true,
        es2020: true,
        browser: true,
        commonjs: true,
        jest: true,
        jquery: true
    },
    plugins: [], // ["babel"] // plugins: ["babel", "prettier"]
    extends: [
        "eslint:recommended"
        // "plugin:react/recommended",
        // "eslint-config-prettier",
        // "airbnb",
        // "prettier",
        // "plugin:prettier/recommended",
        // "prettier/@typescript-eslint",
        // "prettier/babel",
        // "prettier/flowtype",
        // "prettier/react",
        // "prettier/standard",
        // "prettier/unicorn",
        // "prettier/vue"
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        allowImportExportEverywhere: false,
        codeFrame: false,
        ecmaFeatures: {
            jsx: false,
            impliedStrict: true
        }
    },
    // #endregion
    // #region LINTING RULES
    reportUnusedDisableDirectives: true,
    rules: {
        "accessor-pairs": ["warn"],
        "array-callback-return": "warn",
        /*
        "babel/no-unused-expressions": 1,
        // "babel/object-curly-spacing": 1,
        "babel/no-invalid-this": "off",
        "babel/quotes": ["warn", "double", {avoidEscape: true, allowTemplateLiterals: false}],
        */
        "block-scoped-var": "warn",
        "class-methods-use-this": 0,
        "consistent-return": ["warn", {treatUndefinedAsUnspecified: true}],
        "comma-dangle": ["warn", "never"],
        curly: ["warn", "multi", "consistent"],
        "default-case": "warn",
        // "dot-location": ["warn", "object"],
        "doctype-first": 0,
        // "dot-notation": ["warn", {allowKeywords: false}],
        eqeqeq: ["warn", "always"],
        "function-paren-newline": "warn",
        "import/extensions": 0,
        indent: [
            "warn",
            4,
            {
                SwitchCase: 1,
                // "VariableDeclarator": 1,
                // "outerIIFEBody": 1,
                // "MemberExpression": 1,
                FunctionDeclaration: {
                    parameters: "first"
                    // body: 1
                },
                FunctionExpression: {
                    parameters: "first"
                    // body: 1
                },
                CallExpression: {
                    arguments: "first"
                },
                ArrayExpression: "first",
                ObjectExpression: "first",
                ImportDeclaration: "first",
                flatTernaryExpressions: true,
                ignoreComments: true
            }
        ],
        "linebreak-style": ["warn", "windows"],
        "lines-between-class-members": 0,
        "max-classes-per-file": 0,
        "max-len": 0,
        "no-console": 0,
        "no-constant-condition": ["warn", {checkLoops: false}],
        "no-continue": 0,
        "no-debugger": "warn",
        "no-else-return": "off",
        "no-empty-function": "warn",
        "no-eq-null": "warn",
        "no-eval": "warn",
        "no-extra-bind": "warn",
        // "no-extra-parens": ["warn", "all", { "conditionalAssign": false }],
        "no-extend-native": "off",
        // "no-floating-decimal": "warn",
        "no-implicit-coercion": "warn",
        "no-implicit-globals": "warn",
        "no-implied-eval": "warn",
        "no-invalid-this": "off",
        "no-iterator": "warn",
        "no-labels": "warn",
        "no-lone-blocks": "warn",
        "no-lonely-if": 0,
        "no-loop-func": "off", // "warn",
        // "no-mixed-spaces-and-tabs": [
        // "warn",
        // "smart-tabs"
        // ],
        // "no-multi-spaces": "warn",
        "no-multi-str": "warn",
        "no-multiple-empty-lines": "warn",
        "no-new": "warn",
        "no-param-reassign": 0,
        "no-plusplus": 0,
        "no-restricted-syntax": 0,
        "no-restricted-globals": 0,
        "no-tabs": ["warn", {allowIndentationTabs: true}],
        "no-template-curly-in-string": "warn",
        "no-trailing-spaces": "warn",
        "no-underscore-dangle": 0,
        "no-unreachable": 0,
        "no-unused-vars": 0, // "warn",
        "no-use-before-define": 0,
        "no-useless-computed-key": 0,
        "no-useless-constructor": "warn",
        "no-useless-escape": 0,
        // "no-magic-numbers": ["warn", { "ignoreArrayIndexes": true, "ignore": [0, 1], "enforceConst": true } ],
        "no-void": 0,
        "nonblock-statement-body-position": ["warn", "below"],
        "object-curly-newline": 0,
        "object-curly-spacing": ["warn", "never"],
        "one-var": ["warn", {var: "always", let: "consecutive", const: "never"}],
        "one-var-declaration-per-line": 0,
        "operator-linebreak": ["warn", "before"],
        "padded-blocks": 0,
        "prefer-arrow-callback": "warn",
        "prefer-const": ["warn", {destructuring: "all"}],
        "import/prefer-default-export": 0,
        "prefer-destructuring": 0,
        "prefer-object-spread": 0,
        // "prettier/prettier": 0,
        // "prettier/prettier": "warn",
        quotes: ["warn", "double"],
        radix: 0,
        semi: ["warn", "always", {omitLastInOneLineBlock: true}]
    },
    // #endregion
    // #region GLOBALS
    globals: {
        $: "readonly",
        dragula: "readonly",
        innerHeight: "readonly",
        innerWidth: "readonly",
        PIXI: "readonly",
        CONFIG: "readonly",
        DEFAULT_TOKEN: "readonly",
        game: "readonly",
        Actor: "readonly",
        ActorDirectory: "readonly",
        Actors: "readonly",
        ActorSheet: "readonly",
        ChatMessage: "readonly",
        Dialog: "readonly",
        DragDrop: "readonly",
        Draggable: "readonly",
        Handlebars: "readonly",
        Hooks: "readonly",
        Item: "readonly",
        ItemDirectory: "readonly",
        Items: "readonly",
        ItemSheet: "readonly",
        Macro: "readonly",
        Roll: "readonly",
        Sidebar: "readonly",
        TextEditor: "readonly",
        duplicate: "readonly",
        diffObject: "readonly",
        hasProperty: "readonly",
        isObjectEmpty: "readonly",
        getProperty: "readonly",
        setProperty: "readonly",
        expandObject: "readonly",
        flattenObject: "readonly",
        loadTemplates: "readonly",
        mergeObject: "readonly",
        ui: "readonly"
    }
    // #endregion
};
