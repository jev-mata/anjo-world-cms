import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Edit from './CMS/edit';
import Create from './CMS/create';

export default function Dashboard({ projects }) {

    useEffect(() => {
        console.log(projects);
    }, [])
    const [qrSelected, setQrSelected] = useState('');
    const [projectSelected, setProjectSelected] = useState(null);
    const [openAdd, setopenAdd] = useState(false);

    useEffect(() => {
        // console.log(projectSelected);
    }, [projectSelected])
    return (
        <AuthenticatedLayout
            header={<div className="flex">

                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100 flex-1">
                    Dashboard
                </h2>
                <button className="p-2 text-white bg-green-900 rounded-md  hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setopenAdd(true)}
                >Add Content</button>
            </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg mb-5 flex">
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex-1">
                            Title
                        </div>
                        {/* <div className="p-6 text-gray-900 dark:text-gray-100 flex-1">
                            Description
                        </div> */}
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex-1">
                            Actions
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex-1">
                            QR
                        </div>

                    </div>
                    {Array.isArray(projects) && projects.map((project, index) => (
                        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg my-2 flex" key={index}>
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }} >
                                {project.title}
                            </div>
                            {/* <div className="p-6 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }}>
                                {project.description}
                            </div> */}
                            <div className="p-4 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }}>
                                <button className="p-2  bg-green-900 rounded-md  hover:bg-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => setProjectSelected(project)}
                                >Edit</button>
                                <button className="p-2 mx-1 bg-red-800 rounded-md  hover:bg-gray-200 dark:hover:bg-gray-700">Delete</button>
                                <Link
                                    href={route('projects.show', project.id)}
                                    className="p-2 mx-1 bg-blue-800 text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    View
                                </Link>
                            </div>
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex-1"  >
                                <QRCodeSVG value={route('projects.show', project.id)} size={98} onClick={() => setQrSelected(route('projects.show', project.id))} style={{
                                    borderColor: 'white',
                                    borderWidth: 5,
                                    borderStyle: 'solid'
                                }} />

                            </div>
                        </div>
                    ))}
                </div>
                {qrSelected &&
                    <div style={{
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        height: '100vh'
                    }} onClick={() => setQrSelected(null)}>

                        <QRCodeSVG value={qrSelected} style={{
                            borderColor: 'white',
                            borderWidth: 5,
                            borderStyle: 'solid',
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%,-50%)',
                            width: 'calc((50vh + 50vw)/2)',
                            height: 'auto',
                            aspectRatio: '1/1'
                        }} />
                    </div>
                }
            </div>
            {
                projectSelected != null &&
                <div className='' onClick={() => setProjectSelected(null)} style={{

                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    height: '100vh'
                }}>
                    <div style={{

                        width: '40%',
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                    }}>

                        <Edit projectSelected={projectSelected}></Edit>
                    </div>
                </div>
            } {
                openAdd &&
                <div className='' onClick={() => setopenAdd(false)} style={{

                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    height: '100vh'
                }}>
                    <div onClick={(e) => e.stopPropagation()} style={{

                        width: '70%',
                        position: 'fixed',
                        height:'90vh',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                        overflowY: 'scroll'
                    }}>

                        <Create></Create>
                    </div>
                </div>
            }
        </AuthenticatedLayout>
    );
}
