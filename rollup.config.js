import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import sveld from "sveld";

export default ["es", "umd"].map((format) => {
  const UMD = format === "umd";

  return {
    input: "src",
    inlineDynamicImports: true,
    output: {
      format,
      file: UMD ? pkg.main : pkg.module,
      name: UMD ? "carbon-components-svelte" : undefined,
      globals: { flatpickr: "flatpickr" },
    },
    external: Object.keys(pkg.dependencies),
    plugins: [
      svelte({ emitCss: false }),
      resolve(),
      commonjs(),
      UMD && terser(),
      UMD &&
        sveld({
          glob: true,
          markdown: true,
          markdownOptions: {
            onAppend: (type, document, components) => {
              if (type === "h1")
                document.append(
                  "quote",
                  `${components.size} components exported from ${pkg.name}@${pkg.version}.`
                );
            },
          },
          json: true,
          jsonOptions: {
            outFile: "docs/src/COMPONENT_API.json",
          },
        }),
    ],
  };
});
