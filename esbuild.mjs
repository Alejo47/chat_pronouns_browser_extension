import { copy } from "esbuild-plugin-copy";
import esbuild from "esbuild";

const env = (process.env.NODE_ENV || "development").toLowerCase()

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
  define: {
    "process.env.NODE_ENV": JSON.stringify(env)
  }
};

esbuild
  .build(config)
  .then(() => {
    console.log(`⚡ Build complete! (${env}) ⚡`);
  })
  .catch(() => {
    process.exit(1);
  });
