import React from 'react';
import BackgroundApp from './BackgroundApp';
import Header from './Header';
import Content from './Content';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* <BackgroundApp /> */}
            <Header />
            <Content>{children}</Content>
        </>
    );
}
