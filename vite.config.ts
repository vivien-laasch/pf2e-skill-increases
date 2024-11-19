import ModuleData from "./module.json" with { type: "json" };
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const s_SOURCEMAPS = true;
const s_COMPRESS = false;

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
    server: {
        port: 29999,
        open: "/game",
        proxy: {
            [`^(/${ModuleData.id}/(images|assets|style.css))`]: "http://localhost:30000",
            [`^(?!/${ModuleData.id}/)`]: "http://localhost:30000",
            "/socket.io": { target: "ws://localhost:30000", ws: true },
        },
    },
    build: {
        outDir: __dirname + "/dist",
        emptyOutDir: false,
        sourcemap: s_SOURCEMAPS,
        minify: s_COMPRESS ? "terser" : false,
        target: ["es2022"],
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
    plugins: [
        vue(),
        ...viteStaticCopy({
            targets: [
                //      { src: 'module.json', dest: '.' },
            ],
        }),
    ],
});
