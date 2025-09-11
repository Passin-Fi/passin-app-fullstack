import React from 'react';

export default function BackgroundApp() {
    return (
        <div className="fixed top-0 left-0 w-full h-[100svh] overflow-hidden z-[-1]">
            <div className="container relative h-full">
                <div className="absolute" style={{ borderRadius: '50%', top: 0, left: 0, height: '80svh', aspectRatio: 1 / 1.01, background: '#343C91', transform: 'translate(-54%, -32%)' }}></div>
                <div className="absolute" style={{ borderRadius: '50%', top: 0, left: 0, height: '44svh', aspectRatio: 1 / 1.1, background: '#8461C3', transform: 'translate(-50%, -50%)' }}></div>
                <div
                    className="absolute"
                    style={{ borderRadius: '50%', top: '50%', left: 0, height: '38.5svh', aspectRatio: 1 / 1.11, background: 'rgba(15, 21, 46, 0.80)', transform: 'translate(-54%, -23%)' }}
                ></div>

                <div
                    className="absolute"
                    style={{ borderRadius: '50%', top: '50%', right: 0, height: '53svh', aspectRatio: 1 / 1.02, background: '#0B5C83', transform: 'rotate(45deg) translate(13%, -44%)' }}
                ></div>

                <div
                    className="absolute"
                    style={{ borderRadius: '50%', top: 0, right: 0, height: '45svh', aspectRatio: 1 / 1.05, background: 'rgba(19, 12, 55, 0.80)', transform: 'translate(70%, -15%)' }}
                ></div>

                <div
                    className="absolute"
                    style={{ borderRadius: '50%', top: '50%', right: 0, height: '29.5svh', aspectRatio: 1 / 1.1, background: 'rgba(0, 65, 74, 0.70)', transform: 'translate(57%, -77%)' }}
                ></div>
                <div className="absolute" style={{ borderRadius: '50%', top: '51%', right: 0, height: '24svh', aspectRatio: 1 / 1.01, background: '#0CFFEB', transform: 'translate(60%, -3%)' }}></div>

                <div className="absolute" style={{ borderRadius: '50%', bottom: '0', left: 0, height: '33svh', aspectRatio: 1 / 1.01, background: '#1B1645', transform: 'translate(-15%, 45%)' }}></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[75px]"></div>
        </div>
    );
}
