import type { Metadata } from 'next';
import { Geist_Mono, Mulish } from 'next/font/google';
import './globals.css';
import { BugIcon } from 'lucide-react';
import Link from 'next/link';
import { ThemeProvider } from 'src/components/theme-provider/ThemeProvider';
import JotaiProvider from 'src/components/jotai-provider/JotaiProvider';
import { ToastContainer } from 'react-toastify';
import { KEYWORDS, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, THUMBNAIL } from 'src/constant/metadata';
import Layout from 'src/components/layout/Layout';

const mulish = Mulish({
    subsets: ['latin'],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    keywords: KEYWORDS,
    publisher: 'Ezsol',
    robots: {
        follow: true,
        index: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        url: SITE_URL,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        siteName: SITE_TITLE,
        countryName: 'Vietnam',
        images: {
            url: SITE_URL + THUMBNAIL.src,
            secureUrl: THUMBNAIL.src,
            type: 'image/png',
            width: THUMBNAIL.width,
            height: THUMBNAIL.height,
        },
    },
    twitter: {
        card: 'summary_large_image',
        site: '@site',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: {
            url: SITE_URL + THUMBNAIL.src,
            secureUrl: THUMBNAIL.src,
            type: 'image/png',
            width: THUMBNAIL.width,
            height: THUMBNAIL.height,
        },
    },
    appleWebApp: {
        capable: true,
        title: SITE_TITLE,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${mulish.className} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <JotaiProvider>
                        <Layout>{children}</Layout>
                    </JotaiProvider>
                    {process.env.NODE_ENV === 'development' && (
                        <div style={{ position: 'fixed', bottom: 16, right: 16, cursor: 'pointer', zIndex: 1000 }}>
                            <Link href="/assets/typography" title="Typography Test Page">
                                <BugIcon />
                            </Link>
                        </div>
                    )}
                </ThemeProvider>
                <ToastContainer />
            </body>
        </html>
    );
}
