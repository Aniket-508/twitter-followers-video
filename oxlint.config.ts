import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react, next],
  ignorePatterns: core.ignorePatterns,
  rules: {
    // React Compiler bailout diagnostics for `import()`, try/finally and
    // throw-in-catch are not correctness issues; those patterns are required
    // for lazy-loading the web renderer and for cleanup on failure.
    "react/todo": "off",
  },
});
