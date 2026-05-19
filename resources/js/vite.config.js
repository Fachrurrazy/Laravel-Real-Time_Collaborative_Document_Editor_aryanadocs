import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/editor.css', 'resources/js/editor.js'],
            refresh: true,
        }),
    ],
});