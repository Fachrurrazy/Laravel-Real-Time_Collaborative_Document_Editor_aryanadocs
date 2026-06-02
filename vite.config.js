import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/editor.js'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5174,
        strictPort: true,
        origin: 'http://192.168.1.59:5174',
        cors: true,
        hmr: {
            host: '192.168.1.59',
            protocol: 'ws',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
