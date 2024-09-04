import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthContextProvider from './providers/authProvider';
import { ThemeProvider } from './providers/themeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Threads',
    description: 'A forum for discussing IT, software and security.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='en'
            suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange>
                        <AuthContextProvider>
                            <>
                                <Toaster />
                                {children}
                            </>
                        </AuthContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
