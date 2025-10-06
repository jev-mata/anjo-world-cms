import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import logo from '../../img/anjo-logo.png'

export default function GuestLayout({ children }) {

    const link = useRef(document.querySelector("link[rel*='icon']"));

    useEffect(() => {
        const current = link.current;
        if (current) {
            current.href = logo;
        }
    }, [logo]);
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-gray-300" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white dark:bg-gray-800 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
