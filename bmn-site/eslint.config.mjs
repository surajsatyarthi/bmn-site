import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Dev-only CLI scripts — not shipped, looser rules
    "scripts/**",
    // Leftover diagnostic scripts from import debugging
    "test-db-insert.ts",
    "test-db-batch.ts",
    "check-db.ts",
  ]),
]);

export default eslintConfig;
