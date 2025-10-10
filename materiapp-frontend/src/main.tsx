import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './core/providers/themes.provider';
import './core/styles/index.css';
import HomePage from './modules/home/home.page';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <HomePage />
        </ThemeProvider>
    </StrictMode>
);
