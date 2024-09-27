import { build } from "esbuild";
import { copy } from "esbuild-plugin-copy";
import fs from "fs";
import path from "path";

const buildDir = "build";

/**
 * @param file relative to __dirname
 */
function getJsonFromFile(file: string) {
  const data = fs.readFileSync(path.resolve(__dirname, file), "utf-8");

  return JSON.parse(data);
}

function syncVersions() {
  const { version } = getJsonFromFile("package.json");
  const manifest = getJsonFromFile("manifest.json");

  manifest.version = version;

  fs.writeFileSync(
    path.resolve(__dirname, "manifest.json"),
    JSON.stringify(manifest)
  );
}

(async () => {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }

  try {
    syncVersions();
  } catch (error) {
    console.log(
      "unable to sync `version` value of package.json and manifest.json"
    );
  }

  const res = await build({
    entryPoints: ["./src/projects/**/index.ts"],
    outdir: buildDir,
    bundle: true,
    minify: true,
    sourcemap: true,
    plugins: [
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: ["./manifest.json"],
            to: ["./build/manifest.json"],
          },
          {
            from: ["./icons/*.png"],
            to: ["./build/icons"],
          },
        ],
      }),
    ],
  });

  console.log(res);
})();
