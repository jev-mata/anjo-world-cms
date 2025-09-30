import React, { useEffect, useState } from 'react'; 
import bg from '../../img/bg.png'
import TITLE from '../../img/TITLE.png' 
import mascott from '../../img/anjo-mascott.png' 
export default function NotFound404() { 
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer); // cleanup if component unmounts
    }, []);

    return (
        <div className='bg-white dark:bg-gray-900 min-h-screen w-full relative '
            style={{
                backgroundImage: 'url(' + bg + ')',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                height: 'auto',
                backgroundPosition: window.innerWidth < 768 ? "right top" : "right top",

            }}>
            {isLoading ?
                <>
                    <img src={mascott}

                        className="hidden md:block" // 👈 hide on mobile, show on md+
                        style={{
                            position: 'fixed',
                            height: '70vh',
                            bottom: -20,  zIndex: 1,
                            top: "50%", left: "40%",
                            transform: 'translate(-60%,-50%)',
                        }}></img>
                    <img src={TITLE} style={{
                        position: 'fixed',
                        height: '20vh',
                        bottom: -20, zIndex: 1,
                        top: "50%", left: "50%",
                        transform: 'translate(-50%,-50%)',
                    }}></img>
                </> :
                <>
                    <h1 className="text-6xl font-bold">404</h1>
                    <p className="mt-4 text-lg">Oops! Page not found.</p>
                    <a
                        href="/"
                        className="mt-6 inline-block px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Go Home
                    </a>
                </>

            }

        </div>
    )
}
