import ModuleData from "./module.json" with { type: "json" };
import { defineConfig, TerserOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

const s_SOURCEMAPS = true;
const s_COMPRESS = false;

function terserOptions(): TerserOptions {
    if (!s_COMPRESS) return { compress: false };
    return {
        compress: {
            drop_console: true,
            drop_debugger: true,
            dead_code: true,
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    root: "src/",
    base: `/${ModuleData.id}/`,
    publicDir: false,
    cacheDir: "../.vite-cache",
    resolve: {
        conditions: ["import", "browser"],
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
    },
    esbuild: {
        target: ["es2022"],
    },
    define: {
        "process.env": {},
    },
    server: {
        port: 29999,
        open: "/game",
        proxy: {
            [`^(/${ModuleData.id}/(images|assets|lang|packs|style.css))`]: "http://localhost:30000",
            [`^(?!/${ModuleData.id}/)`]: "http://localhost:30000",
            "/socket.io": { target: "ws://localhost:30000", ws: true },
        },
    },
    build: {
        outDir: __dirname + "/dist",
        emptyOutDir: false,
        sourcemap: s_SOURCEMAPS,
        reportCompressedSize: true,
        minify: s_COMPRESS ? "terser" : false,
        target: ["es2022"],
        terserOptions: terserOptions(),
        lib: {
            entry: "./module/index.ts",
            formats: ["es"],
            fileName: "main",
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            target: "es2022",
        },
    },
    plugins: [vue()],
});
