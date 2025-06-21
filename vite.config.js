import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
    base: '/empacadora/',
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
                },
            },
        },
    },
    server: {
        port: 3000,
    },
});
