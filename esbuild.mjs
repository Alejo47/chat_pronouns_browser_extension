import { copy } from "esbuild-plugin-copy";
import esbuild from "esbuild";

/** @type {esbuild.BuildOptions} */
const config = {
  entryPoints: ["src/ts/index.ts"],
  outfile: "dist/bundle.js",
  sourcemap: "both",
  bundle: true,
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./src/public/*"],
        to: ["./dist/"],
      },
    }),
  ],
};

esbuild
  .build(config)
  .then(() => {
    console.log("⚡ Build complete! ⚡");
  })
  .catch(() => {
    process.exit(1);
  });
