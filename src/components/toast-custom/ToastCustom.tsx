'use client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { mulish } from 'src/constant/font';
import useBreakpoint from 'src/hooks/useBreakpoint';

export default function ToastCustom() {
    const { isMobile } = useBreakpoint();
    return (
        <ToastContainer
            style={{ padding: '8px 0px' }}
            position={isMobile ? 'top-center' : 'top-right'}
            toastStyle={{ margin: '4px 0px', maxWidth: '90%', borderRadius: '8px', overflow: 'hidden', fontFamily: mulish.style.fontFamily }}
        />
    );
}
