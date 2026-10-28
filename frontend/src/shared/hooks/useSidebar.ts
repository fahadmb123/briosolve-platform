import { useState, useEffect } from 'react';

// Global state to persist sidebar open status across different layouts (e.g. Home -> Dashboard)
// Default to open on desktop (>= 993px), closed on mobile/tablet (< 993px)
const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 993 : true;
let globalSidebarOpen = isDesktop;
const listeners = new Set<(isOpen: boolean) => void>();

export function useSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(globalSidebarOpen);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Sync local state with global state
    useEffect(() => {
        const handleStateChange = (isOpen: boolean) => {
            setIsSidebarOpen(isOpen);
        };
        listeners.add(handleStateChange);
        return () => {
            listeners.delete(handleStateChange);
        };
    }, []);

    // Custom setter that updates the global variable and notifies all layouts
    const setGlobalSidebarOpen = (isOpen: boolean) => {
        globalSidebarOpen = isOpen;
        listeners.forEach(listener => listener(isOpen));
    };

    // Prevent background scrolling on mobile only when sidebar drawer is open
    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 993) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    const handleSidebarToggle = () => {
        setGlobalSidebarOpen(!isSidebarOpen);
    };

    return {
        isSidebarOpen,
        setIsSidebarOpen: setGlobalSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        handleSidebarToggle
    };
}
