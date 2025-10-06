import type { Metadata } from 'next';
import './globals.css';
import { BugIcon } from 'lucide-react';
import Link from 'next/link';
import ProgressProvider from 'src/components/provider/ProgressProvider';
import ThemeProvider from 'src/components/provider/ThemeProvider';
import JotaiProvider from 'src/components/provider/JotaiProvider';
import LazorkitProvider from 'src/components/provider/LazorkitProvider';
import ReactQueryProvider from 'src/components/provider/ReactQueryProvider';
import { KEYWORDS, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, THUMBNAIL } from 'src/constant/metadata';
import Layout from 'src/components/layout/Layout';
import ToastCustom from 'src/components/toast-custom/ToastCustom';
import { geistMono, mulish } from 'src/constant/font';

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
            <body className={`${mulish.className} ${geistMono.variable} antialiased `}>
                <main className="w-full overflow-x-hidden">
                    <ProgressProvider>
                        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                            <JotaiProvider>
                                <LazorkitProvider>
                                    <ReactQueryProvider>
                                        <Layout>{children}</Layout>
                                    </ReactQueryProvider>
                                </LazorkitProvider>
                            </JotaiProvider>
                            {process.env.NODE_ENV === 'development' && (
                                <div style={{ position: 'fixed', bottom: 16, right: 16, cursor: 'pointer', zIndex: 1000 }}>
                                    <Link href="/ui-components" title="Typography Test Page">
                                        <BugIcon />
                                    </Link>
                                </div>
                            )}
                        </ThemeProvider>
                        <ToastCustom />
                    </ProgressProvider>
                </main>
            </body>
        </html>
    );
}
