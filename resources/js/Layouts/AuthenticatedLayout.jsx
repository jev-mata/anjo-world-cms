import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { ThemeContext } from '@/Components/ThemeContext';
import { Toaster } from 'react-hot-toast';
import logo from '../../img/anjo-logo.png'
export default function AuthenticatedLayout({ header, children }) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const link = useRef(document.querySelector("link[rel*='icon']"));

    useEffect(() => {
        const current = link.current;
        if (current) {
            current.href = logo;
        }
    }, [logo]);
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-5">
            <nav className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">

            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="mx-auto   px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}
