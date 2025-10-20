import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useContext, useEffect, useRef, useState } from "react";
import QRCode from "react-qrcode-logo";
import AnjoLogo from "../../img/anjo-logo.png";
import toast from "react-hot-toast";
import Modal from "@/Components/Modal";
import Edit from "./CMS/edit";
import { ChartBarIcon, ChartPieIcon, MoonIcon, SunIcon, TrashIcon } from "@heroicons/react/24/solid";

import { ThemeContext } from '@/Components/ThemeContext';
import Dropdown from "@/Components/Dropdown";
import AnalyticsShowSidebar from "./Analytics/AnalyticsShowSidebar";
import { AutoGraph, WidthFull } from "@mui/icons-material";
import { Eye, Pencil } from "lucide-react";
export default function Dashboard({ groupcontents }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | today | none
    const [qrSelected, setQrSelected] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [groupcontentsthis, setGroupcontents] = useState(groupcontents);
    const qrRef = useRef(null);
    const editRef = useRef(null);
    const [projectSelected, setProjectSelected] = useState(null);
    const [projectSelectedAnalytics, setProjectSelectedAnalytics] = useState(null);
    const [openAnalytics, setOpenAnalytics] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        try {
            const res = await axios.post("/newcontent", { title: newTitle });
            if (res.status === 201) {
                setGroupcontents(res.data.groupcontents);
                toast.success("✅ New content added!");
                setNewTitle("");
                setOpenAdd(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to add content");
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete("/newcontent", { data: { id } });
            if (res.status === 201) {
                setGroupcontents(res.data.groupcontents);
                toast.success("🗑️ Deleted successfully");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete");
        }
    };


    const handleDownload = () => { 
        setLoading(true);
        if (!qrRef.current) return;
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
    const filtered = groupcontentsthis.filter((g) => {
        const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === "all" ||
            (filter === "today" && g.analytics_today > 0) ||
            (filter === "none" && g.analytics_today === 0);

        return matchesSearch && matchesFilter;
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex flex-1  gap-3">

                        <div className="hidden sm:ms-6 sm:flex sm:items-center bg-orange-500 text-white font-bold rounded-full p-3">
                            <div className="relative  ">
                                <Dropdown >
                                    <Dropdown.Trigger>
                                        <span className="  rounded-md">
                                            <button
                                                type="button"
                                                className=" "
                                            >
                                                {`${user.name.split(' ')[0].slice(0, 1)}${user.name.split(' ')[1].slice(0, 1)}`}

                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content >
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('register')}>
                                            Add User
                                        </Dropdown.Link>
                                        <Dropdown>

                                            <button
                                                onClick={toggleTheme}
                                                className="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                                                aria-label="Toggle Theme"
                                            >
                                                {theme === 'light' ? (
                                                    <MoonIcon className="h-6 w-6 text-gray-800" />
                                                ) : (
                                                    <SunIcon className="h-6 w-6 text-yellow-400" />
                                                )
                                                }
                                            </button>
                                        </Dropdown>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Dashboard
                            </p>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                Anjo World CMS
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpenAdd(true)}
                        className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                        + Add Content
                    </button> <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? (
                            <MoonIcon className="h-6 w-6 text-gray-800" />
                        ) : (
                            <SunIcon className="h-6 w-6 text-yellow-400" />
                        )
                        }
                    </button>

                </div>
            }
        >
            <Head title="Dashboard" />

            {/* 🔍 Search + Filter */}
            <div className="mx-auto max-w-[95%] mt-10">
                <div className="flex justify-between items-center flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title..."
                        className=" flex-1  p-2 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-white focus:ring focus:ring-indigo-400"
                    />
                    <div className="flex gap-3">
                        {["all", "today", "none"].map((key) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-5 py-2 rounded-full ${filter === key
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    }`}
                            >
                                {key === "all"
                                    ? "All"
                                    : key === "today"
                                        ? "Views Today"
                                        : "No Views Yet"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🧩 Card Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2  md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                    {filtered.map((item, idx) => (
                        <div
                            key={idx} className="bg-white space-x-5 flex dark:bg-gray-800 shadow-md rounded-2xl p-6 flex-row justify-between border border-gray-100 dark:border-gray-700"
                        >
                            <div
                                className="flex flex-1 flex-col"
                            >

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            {item.title}
                                        </h3>
                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">
                                            {item.created_at?.slice(0, 10) || "—"}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 grid grid-cols-3 space-x-3 text-center mb-1">
                                        <div className="rounded-lg bg-gray-50 my-1 dark:bg-gray-700 p-2 aspect-square">
                                            <p className="text-sm text-left text-gray-500">Views Today</p>
                                            <p className="font-semibold  text-2xl text-left text-gray-800 dark:text-gray-100">
                                                {item.analytics_today ?? 0}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 my-1 dark:bg-gray-700 p-2">
                                            <p className="text-sm  text-left text-gray-500">Total Views</p>
                                            <p className="font-semibold text-2xl  text-left text-gray-800 dark:text-gray-100">
                                                {item.analytics_total ?? 0}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 my-1 dark:bg-gray-700 p-2">
                                            <p className="text-sm text-left text-gray-500">Tab Count</p>
                                            <p className="font-semibold  text-2xl text-left text-gray-800 dark:text-gray-100">
                                                {item.tab_stats?.length ?? 0}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="  grid grid-cols-3 space-x-3 justify-between">
                                        <button
                                            onClick={() => setProjectSelected(item.id)}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                                        >
                                            <Pencil className="w-5 h-5" />
                                            Edit
                                        </button>

                                        <a
                                            href={route("projects.show", item.id)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                                        >
                                            <Eye className="w-5"></Eye> View
                                        </a>
                                        <button
                                            onClick={() => {

                                                setDeleteTargetId(item.id);
                                                setConfirmDelete(true);
                                            }}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                    <button onClick={() => {
                                        setProjectSelectedAnalytics(item.id);
                                        setOpenAnalytics(true);
                                    }}
                                        className="flex items-center justify-center gap-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                        </svg>
                                        Detailed Analytics
                                    </button >
                                </div>
                            </div>
                            {/* 🗑️ Delete Confirmation Modal */}{/* 🗑️ Delete Confirmation Modal */}
                            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg  mx-auto">
                                    <h2 className="text-xl font-bold mb-3 dark:text-white">Delete Content?</h2>

                                    {/* Get the selected title */}
                                    {(() => {
                                        const selected = groupcontentsthis.find((g) => g.id === deleteTargetId);
                                        if (!selected) return null;
                                        return (
                                            <>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                    This will permanently delete
                                                    <span className="font-semibold text-indigo-500"> “{selected.title}” </span>
                                                    and all related analytics.
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
                                                    To confirm, please type the title below:
                                                </p>

                                                <input
                                                    type="text"
                                                    value={deleteConfirmInput}
                                                    onChange={(e) => setDeleteConfirmInput(e.target.value)}
                                                    placeholder={`Type "${selected.title}" to confirm`}
                                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2 mb-6"
                                                />

                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setConfirmDelete(false);
                                                            setDeleteConfirmInput("");
                                                        }}
                                                        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={deleteConfirmInput !== selected.title}
                                                        onClick={async () => {
                                                            if (deleteTargetId && deleteConfirmInput === selected.title) {
                                                                await handleDelete(deleteTargetId);
                                                                setConfirmDelete(false);
                                                                setDeleteTargetId(null);
                                                                setDeleteConfirmInput("");
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-md text-white transition-colors ${deleteConfirmInput === selected.title
                                                            ? "bg-red-600 hover:bg-red-700"
                                                            : "bg-red-300 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        Yes, Delete
                                                    </button>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </Modal>


                            {/* QR */}
                            <div className="flex flex-col justify-center ">
                                <div className="flex justify-between items-center mb-10">
                                </div>
                                <div onClick={() => { setQrSelected(item) }}>

                                    <QRCode
                                        value={route("projects.show", item.id)}
                                        logoImage={"/anjo-logo.png"}
                                        ecLevel="H"
                                        qrStyle="dots"
                                        eyeRadius={[5, 5, 5]}
                                        size={120}
                                        logoWidth={50}
                                        logoHeight={50}
                                    />
                                </div>
                                <button
                                    onClick={() => { setQrSelected(item); handleDownload() }}
                                    className="flex items-center justify-center gap-2 text-indigo-600 dark:text-white hover:underline text-sm text-center mt-4"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Download QR
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add Content Card */}
                    <div
                        onClick={() => setOpenAdd(true)}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex justify-center items-center text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                    >
                        <div className="flex flex-col items-center gap-2 py-16">
                            <span className="text-4xl">＋</span>
                            <p className="font-medium">Add Content</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ➕ Modal for Add */}
            <Modal show={openAdd} onClose={() => setOpenAdd(false)}>
                <div className="bg-white dark:bg-gray-800 rounded p-6   mx-auto">
                    <h3 className="text-lg dark:text-white font-semibold mb-4">Add New Content</h3>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter title..."
                        className="w-full border p-2 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setOpenAdd(false)}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ✏️ Edit Modal */}
            <Modal
                show={projectSelected}
                onClose={() => {
                    if (editRef.current) editRef.current.handleClose();
                }}
            >
                <div className="relative bg-white h-[80vh] rounded-lg shadow-lg overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        <Edit
                            ref={editRef}
                            projectSelected={projectSelected}
                            onCloseConfirmed={() => setProjectSelected(null)}
                        />
                    </div>
                </div>
            </Modal>
            <div onClick={(e) => setQrSelected(null)} className={`${qrSelected ? 'block' : 'hidden'} z-10 flex-1  bg-gray-500/50 fixed  left-0 top-0 w-full h-full`}>
                <div onClick={(e) => {e.stopPropagation()}}  className="relative bg-white w-[50%] mx-auto top-[50%] -translate-y-[50%] py-10 rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col justify-center mx-auto">
                        <div className="flex justify-between items-center  pb-5 mx-auto">
                            <QRCode
                                ref={qrRef}
                                value={route("projects.show", qrSelected?.id || 0)}
                                logoImage={"/anjo-logo.png"}
                                ecLevel="H"
                                qrStyle="dots"
                                size={360}
                                eyeRadius={[5, 5, 5]}
                                logoWidth={150}
                                logoHeight={150}


                            />
                        </div>
                        <button
                            onClick={() => handleDownload()}
                            className="flex items-center justify-center gap-2 text-indigo-600   hover:underline text-sm text-center mt-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download QR
                        </button>
                    </div>
                </div>
            </div>
            <AnalyticsShowSidebar
                isOpen={openAnalytics}
                onClose={() => setOpenAnalytics(false)}
                projectID={projectSelectedAnalytics}

            />
        </AuthenticatedLayout>
    );
}
