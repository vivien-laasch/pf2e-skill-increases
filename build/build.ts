import * as fs from "fs";
import * as path from "path";
import archiver from "archiver";

export function copyStaticFiles() {
    const dest = path.resolve(__dirname, "../dist");
    const langSrc = path.resolve(__dirname, "../static/lang");
    const langDest = path.resolve(dest, "lang");
    const moduleSrc = path.resolve(__dirname, "../module.json");

    fs.mkdirSync(dest, { recursive: true });
    fs.mkdirSync(langDest, { recursive: true });

    fs.copyFileSync(moduleSrc, path.join(dest, "module.json"));
    console.log("Copied module.json to dist");

    const files = fs.readdirSync(langSrc);
    files.forEach((file) => {
        const srcPath = path.join(langSrc, file);
        const destPath = path.join(langDest, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to dist/lang`);
    });
}

export function prepareRelease() {
    prepareModuleJson();
    createModuleZip();
}

function prepareModuleJson() {
    const dest = path.resolve(__dirname, "../dist");
    const moduleJsonPath = path.resolve(dest, "module.json");

    if (!fs.existsSync(moduleJsonPath)) {
        console.error("module.json not found");
        return;
    }

    try {
        const refName = process.env.GITHUB_REF_NAME || "v0.0.0";
        const version = refName.startsWith("v") ? refName.slice(1) : refName;
        const repository = process.env.GITHUB_REPOSITORY || "vivien-laasch/pf2e-skill-increases";
        const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, "utf-8"));

        moduleData.version = version;
        moduleData.download = `https://github.com/${repository}/releases/download/${refName}/module.zip`;

        fs.writeFileSync(moduleJsonPath, JSON.stringify(moduleData, null, 2));
        console.log(`Updated module.json with version ${version} and download URL`);
    } catch (error) {
        console.error("Failed to update module.json for release build:", error);
    }
}

function createModuleZip() {
    const dest = path.resolve(__dirname, "../dist");
    const zipPath = path.join(__dirname +  "/.." , "module.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
        console.log(`Created module.zip (${archive.pointer()} total bytes)`);
    });

    archive.pipe(output);
    archive.directory(dest, false);
    archive.finalize();
}
