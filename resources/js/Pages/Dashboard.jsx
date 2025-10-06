import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react'; 
import Edit from './CMS/edit';
import Create from './CMS/create';
import QRCode from 'react-qrcode-logo';
import AnjoLogo from '../../img/anjo-logo.png'
import Modal from '@/Components/Modal';
import ProjectItem from './CMS/Component/ProjectItem';

export default function Dashboard({ groupcontents }) {

    const [qrSelected, setQrSelected] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [projectSelected, setProjectSelected] = useState(null);
    const [openAdd, setopenAdd] = useState(false);

    const editRef = useRef();
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
    const qrRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const handleDownload = (val) => {
        setQrSelected(val);
        setLoading(true);
        if (!qrRef.current?.canvasRef?.current) return;

        const delay = () => {

            const canvas = qrRef.current.canvasRef.current;
            console.log(canvas);
            try {
                const borderSize = 50; // thickness in px
                const newCanvas = document.createElement("canvas");
                newCanvas.width = canvas.width + borderSize * 2;
                newCanvas.height = canvas.height + borderSize * 2;

                const ctx = newCanvas.getContext("2d");

                // Fill with white border
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

                // Draw original QR in center
                ctx.drawImage(canvas, borderSize, borderSize);

                const link = document.createElement("a");
                link.href = newCanvas.toDataURL("image/png");
                link.download = "qr-code.png";
                link.click();

                setLoading(false);
                setQrSelected(null);
            } catch (err) {
                console.error("⚠️ Failed to export QR code:", err);
                alert("Could not download QR. Ensure logo image supports CORS or use a local asset.");
            }
        }
        const resT = setTimeout(() => delay(), 1000);

        return () => clearTimeout(resT);
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
                <div className="mx-auto max-w-[90%] sm:px-6 lg:px-8">

                    {openAdd &&
                        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg my-2 flex">
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }} >

                                <input type='text' placeholder='Topic Title' className='w-full dark:text-gray-800' value={newTitle} onChange={(e) => setNewTitle(e.target.value)}></input>
                            </div>
                            <div className="p-6 text-gray-900 dark:text-gray-100" style={{ alignContent: 'center' }} >
                                <button onClick={handleSubmit} className='bg-gray-300 dark:bg-gray-700 px-5 py-3 rounded-lg dark:text-white text-gray-800'>Add</button>
                            </div>
                        </div>
                    }
                    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg mb-5 grid grid-cols-9">
                        <div className="p-6 text-gray-900 dark:text-gray-100 ">
                            Title
                        </div>
                        {/* <div className="p-6 text-gray-900 dark:text-gray-100 flex-1">
                            Description
                        </div> */}
                        <div className="p-6 text-gray-900 dark:text-gray-100  text-center col-span-3">
                            Actions
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100  text-center  col-span-3">
                            Analytics
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100  text-center  ">
                            QR
                        </div>
                        <div className="py-6 pl-6 text-gray-900 dark:text-gray-100 text-right pr-5 ">
                            Action
                        </div>

                    </div>
                    {Array.isArray(groupcontents) && groupcontents.map((groupcontent, index) => (
                        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg my-2 grid grid-cols-9" key={index}>
                            <div className="p-6 text-gray-900  my-auto dark:text-gray-100 flex-1" style={{ alignContent: 'center' }} >
                                {groupcontent.title}
                            </div>
                            {/* <div className="p-6 text-gray-900 dark:text-gray-100 flex-1" style={{ alignContent: 'center' }}>
                                {project[0].description}
                            </div> */}
                            <div className="p-4  col-span-3 my-auto mx-auto text-gray-900 dark:text-gray-100 flex-1 grid-cols-3 grid" style={{ alignContent: 'center' }}>
                                <button className="p-2 text-gray-100 bg-green-800 rounded-md  hover:bg-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => setProjectSelected(groupcontent.id)}
                                >Edit</button>
                                <ProjectItem groupcontent={groupcontent} handleDelete={handleDelete}></ProjectItem>
                                <a

                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={route('projects.show', groupcontent.id)}
                                    className="p-2 mx-1 bg-blue-800 text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    View
                                </a>
                            </div>

                            <div className="p-4 col-span-3 grid grid-cols-3 my-auto mx-auto text-gray-900 dark:text-gray-100 flex-1 " style={{ alignContent: 'center' }}>
                                <div className='grid '>
                                    <strong>Views Today: {groupcontent.analytics_today}</strong>

                                    <strong>Total Views: {groupcontent.analytics_total}</strong>
                                </div>
                                {groupcontent.tab_stats?.length > 0 && (
                                    <div className="mt-2 grid">
                                        <strong>Tabs Accessed:</strong>
                                        <ul className="list-disc list-inside text-sm">
                                            <li >{groupcontent.tab_stats[0].tab_name}: {groupcontent.tab_stats[0].total}</li>
                                            <li>...</li>
                                        </ul>
                                    </div>
                                )}
                                <a
                                    href={route('analytics.show', groupcontent.id)}
                                    className="p-2 text-center my-auto mx-1 bg-purple-600 text-white rounded-md hover:bg-purple-800"
                                >
                                   Detailed Analytics
                                </a>
                            </div>
                            <div className="p-2 text-gray-900 dark:text-gray-100   flex-1"  >
                                <span className='flex   my-auto mx-auto' onClick={() => setQrSelected(route('projects.show', groupcontent.id))}>

                                    <QRCode ecLevel="H"
                                        logoImage={AnjoLogo}
                                        logoHeight={580}
                                        eyeRadius={[100, 100, 100]}
                                        logoWidth={580}
                                        qrStyle="dots"
                                        size={1700}
                                        value={route('projects.show', groupcontent.id)}
                                        style={{
                                            width: 70, height: 70,
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                            borderColor: 'white',
                                            borderWidth: 5,
                                            borderStyle: 'solid',
                                            borderRadius: 7
                                        }} />
                                </span>
                            </div>
                            <div className='flex  mr-5'>

                                <button onClick={() => handleDownload(route('projects.show', groupcontent.id))} className='dark:bg-gray-600 bg-gray-200 p-5 rounded-lg my-auto ml-auto'>
                                    Download QR
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{
                    display: qrSelected ? 'block' : 'none',
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    height: '100vh'
                }} onClick={() => !loading && setQrSelected(null)}>

                    {/* <QRCodeSVG value={qrSelected}

                            size={300} // pixel size
                            bgColor="#ffffff"
                            fgColor="#000000"
                            imageSettings={{
                                src: "/logo.png",     // path to your logo image
                                x: undefined,         // auto center
                                y: undefined,         // auto center
                                height: 80,           // size of logo
                                width: 80,
                                excavate: true        // makes a white "hole" behind the logo
                            }}
                            level="H" // high error correction so QR still works with logo
                            style={{
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
                            }} /> */}
                    <QRCode value={qrSelected || ""}
                        ref={qrRef}
                        ecLevel="H" size={1700}
                        logoImage={"anjo-logo.png"}
                        logoHeight={580}
                        logoWidth={580}
                        qrStyle="dots"
                        eyeRadius={[100, 100, 100]}
                        logoImageOptions={{ crossOrigin: "anonymous" }}
                        style={{
                            borderColor: 'white',
                            borderWidth: 25,
                            borderStyle: 'solid',
                            position: 'fixed',
                            borderRadius: "20px",  // optional: rounded border
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%,-50%)',
                            width: 'calc((50vh + 50vw)/2)',
                            height: 'auto',
                            aspectRatio: '1/1'
                        }} />;
                </div>
            </div>
            <Modal show={projectSelected}
                onClose={() => {
                    // 👈 intercept backdrop click
                    if (editRef.current) {
                        editRef.current.handleClose(); // call Edit’s close logic
                    }
                }}>
                <div
                    className="relative bg-white h-[80vh] rounded-lg shadow-lg overflow-hidden"
                >
                    <div className="h-full overflow-y-auto ">
                        <Edit

                            ref={editRef} // 👈 expose handleClose via forwardRef
                            projectSelected={projectSelected}
                            onCloseConfirmed={() => setProjectSelected(null)}
                        />
                    </div>
                </div>

            </Modal>



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
