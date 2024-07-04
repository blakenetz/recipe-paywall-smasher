import { build } from "esbuild";
import { copy } from "esbuild-plugin-copy";
import fs from "fs";

const buildDir = "build";

(async () => {
	if (fs.existsSync(buildDir)) {
		fs.rmSync(buildDir, { recursive: true });
	}

	const res = await build({
		entryPoints: ["./src/**/index.ts"],
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
