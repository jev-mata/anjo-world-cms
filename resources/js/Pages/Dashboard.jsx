import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Edit from './CMS/edit';
import Create from './CMS/create';

export default function Dashboard({ groupcontents }) {

    const [qrSelected, setQrSelected] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [projectSelected, setProjectSelected] = useState(null);
    const [openAdd, setopenAdd] = useState(false);

    useEffect(() => {
        // console.log(projectSelected);
    }, [projectSelected])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/newcontent", { title: newTitle });
            if (res.status === 201) {
                // Reload or update state
                window.location.reload();
                // OR better: update your state instead of full reload
                // setItems((prev) => prev.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (id == null) return;
        try {
            const res = await axios.delete("/newcontent", { data: { id: id } });
            if (res.status === 201) {
                // Reload or update state
                window.location.reload();
                // OR better: update your state instead of full reload
                // setItems((prev) => prev.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };

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

                    {openAdd &&
                        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg my-2 flex">
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }} >

                                <input type='text' placeholder='Topic Title' className='w-full' value={newTitle} onChange={(e) => setNewTitle(e.target.value)}></input>
                            </div>
                            <div className="p-6 text-gray-900 dark:text-gray-100" style={{ alignContent: 'center' }} >
                                <button onClick={handleSubmit} className='bg-gray-300 px-5 py-3 rounded-lg dark:text-white text-gray-800'>Add</button>
                            </div>
                        </div>
                    }
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
                    {Array.isArray(groupcontents) && groupcontents.map((groupcontent, index) => (
                        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg my-2 flex" key={index}>
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }} >
                                {groupcontent.title}
                            </div>
                            {/* <div className="p-6 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }}>
                                {project[0].description}
                            </div> */}
                            <div className="p-4 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }}>
                                <button className="p-2 text-gray-100 bg-green-800 rounded-md  hover:bg-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => setProjectSelected(groupcontent.id)}
                                >Edit</button>
                                <button onClick={(e) => handleDelete(e, groupcontent.id)} className="p-2 mx-1 text-gray-100 bg-red-700 rounded-md  hover:bg-gray-200 dark:hover:bg-gray-700">Delete</button>
                                <Link
                                    href={route('projects.show', groupcontent.id)}
                                    className="p-2 mx-1 bg-blue-800 text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    View
                                </Link>
                            </div>
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex-1"  >
                                <QRCodeSVG value={route('projects.show', groupcontent.id)} size={98} onClick={() => setQrSelected(route('projects.show', groupcontent.id))} style={{
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

                        width: '60%',
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        height: '80vh',
                        transform: 'translate(-50%,-50%)',
                        overflowY: 'auto'
                    }}>

                        <Edit projectSelected={projectSelected}></Edit>
                    </div>
                </div>
            }

            {/* {
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
                        height: '90vh',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                        overflowY: 'auto'
                    }}>

                        <Create></Create>
                    </div>
                </div>
            } */}
        </AuthenticatedLayout>
    );
}
