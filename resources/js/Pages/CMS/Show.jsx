import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import bg from '../../../img/bg.png'
import logo from '../../../img/anjo-logo.png'
import mascott from '../../../img/anjo-mascott.png'
import welcome from '../../../img/welcome-text.png'
import level from '../../../img/text-level.png'
import elem from '../../../img/button-elem.png'
import highschool from '../../../img/button-highschool.png'
import { Scale } from '@mui/icons-material';

export default function Show({ groupcontent }) {
    const [project, setproject] = useState(groupcontent.projects);
    const [selectLevel, setSelectLevel] = useState(-1);
    const getYoutubeEmbedUrl = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };


    return (
        selectLevel == -1 ?
            <div className='bg-white dark:bg-gray-900 min-h-screen w-full relative'
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundBlendMode: 'screen',
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    height: 'auto',

                }}>
                <img src={logo} style={{
                    position: 'absolute',
                    top: 10, right: 10,
                    width: '30%',
                    maxWidth: '250px',
                    height: 'auto',
                    aspectRatio: '1/1',
                }}></img>

                <img src={mascott} style={{
                    position: 'fixed',
                    height: '100vh',
                    bottom: -20, left: 0, zIndex: 1
                }}></img>
                <div style={{
                    width: '50%',
                    position: 'fixed',
                    top: "40%", left: "50%",
                    transform: 'translate(-50%,-50%)',
                    zIndex: 1
                }}>

                    <img src={welcome} style={{
                        width: '100%',
                        ':hover': {
                            Scale: 1.2
                        }
                    }}></img>
                    <img src={level} className=' ' style={{
                        width: '100%',
                        marginTop: 100,
                        ':hover': {
                            Scale: 1.2
                        }
                    }}></img>
                </div>

                <div className="container mx-auto p-4 md:p-10 flex items-center justify-center min-h-[calc(100vh-2rem)]"
                    style={{
                        zIndex: 9,
                        position: 'fixed',
                        left: '50%',
                        top: '70%',
                        transform: 'translate(-50%,-40%)',
                    }}>

                    <div className="w-full max-w-xl flex flex-col md:flex-row gap-4 md:gap-8 justify-center">

                        <img src={elem} onClick={() => setSelectLevel(0)} style={{
                        }}></img>
                        <img src={highschool} onClick={() => setSelectLevel(1)} style={{
                        }}></img>
                    </div>
                </div>
            </div>
            : <div
                className="mx-auto p-6 rounded shadow relative"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundBlendMode: 'screen',
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    height: 'auto',
                }}
            >
                <div className='max-w-4xl bg-white dark:bg-gray-900 min-h-screen p-6 rounded-lg' style={{
                    position: 'relative',
                    left: '50%',
                    top: '100%',
                    transform: 'translate(-50%,-0%)',

                }}>
                <span className='text-5xl font-bold mb-4 text-gray-900 dark:text-white mb-5'>{selectLevel == 0 ? 'Elementary' : 'Highschool'}</span>

                    <Head title={project[selectLevel].title} />

                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white mt-10">{project[selectLevel].title}</h1>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">{project[selectLevel].description}</p>


                    {project[selectLevel].image_path && (
                        <div className="mb-4">
                            <img
                                src={`/storage/${project[selectLevel].image_path}`}
                                alt="Project"
                                className="rounded-lg shadow"
                            />
                        </div>
                    )}

                    {project[selectLevel].video && (
                        <div className="mb-4">
                            <iframe className='w-full' width="1296" height="500" src={getYoutubeEmbedUrl(project[selectLevel].video)} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                    )}
                    <div className="space-y-6">
                        {Array.isArray(project[selectLevel].questions) && project[selectLevel].questions.map((q, index) => (
                            <div key={q.id} className="p-4 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                                    Q{index + 1}: {q.question}
                                </h3>
                                <ul className="mt-2 space-y-1">
                                    {Array.isArray(q.answers) && q.answers.map((a, i) => (
                                        <li
                                            key={i}
                                            className={`p-2 rounded ${a.is_correct
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                                }`}
                                        >
                                            {a.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Link href={route('dashboard')} className="text-indigo-600 hover:underline">
                            ← Back to Projects
                        </Link>
                    </div>
                </div>
            </div>
    );
}
