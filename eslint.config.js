import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),

    {
        files: ["**/*.{js,jsx}"],

        extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],

        languageOptions: {
            ecmaVersion: "latest",

            globals: {
                ...globals.browser,
                ...globals.node,

                // biblioteki ładowane przez <script>
                Quill: "readonly",
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        rules: {
            // wymaganie === zamiast ==
            eqeqeq: "error",

            // let -> const gdy zmienna nie jest nadpisywana
            "prefer-const": "warn",

            // niewykorzystane zmienne
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],

            // maksymalnie jedna pusta linia
            "no-multiple-empty-lines": [
                "error",
                {
                    max: 1,
                    maxEOF: 0,
                    maxBOF: 0,
                },
            ],
            // pusta linia pomiędzy funkcjami
            "padding-line-between-statements": [
                "error",

                {
                    blankLine: "always",
                    prev: "function",
                    next: "function",
                },
                {
                    blankLine: "always",
                    prev: "block-like",
                    next: "function",
                },
            ],
        },
    },
]);
