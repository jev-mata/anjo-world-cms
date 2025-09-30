import '../css/app.css';
import './bootstrap';
import "@fontsource/inter/100.css"; // Inter with variable weights
import "@fontsource/inter/200.css"; // Inter with variable weights
import "@fontsource/inter/300.css"; // Inter with variable weights
import "@fontsource/inter/400.css"; // Inter with variable weights
import "@fontsource/inter/500.css"; // Inter with variable weights
import "@fontsource/inter/600.css"; // Inter with variable weights
import "@fontsource/inter/700.css"; // Inter with variable weights 
import "@fontsource/inter"; // Inter with variable weights
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ThemeProvider } from '@/Components/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {

        const Root = (
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, Root);
            return;
        } else {
            createRoot(el).render(Root);
        }

    },
    progress: {
        color: '#4B5563',
    },
});
