import { build, emptyDir } from "https://deno.land/x/dnt@0.28.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  importMap: "./import_map.json",
  shims: {
    deno: true,
  },
  package: {
    name: "tree-fns",
    version: Deno.args[0],
    description: "Simple utility functions for tree structure",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/qmotas/tree-fns.git",
    },
    bugs: {
      url: "https://github.com/qmotas/tree-fns/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
