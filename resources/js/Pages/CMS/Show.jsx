import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import bg from '../../../img/bg.png'
import TITLE from '../../../img/TITLE.png'
import mascott from '../../../img/anjo-mascott.png'
import ShowTopics from './Component/ShowTopics';
import axios from 'axios';
export default function Show({ groupcontent }) {
    const [project, setproject] = useState(groupcontent.projects);
    const [currentproject, setcurrentproject] = useState(project[0]);
    const [selectLevel, setSelectLevel] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState(project.length != 0 ? project[0].id : 0);

    useEffect(() => {
        const getProj = project.find((prj) => prj.id === activeTab);
        if (getProj?.tab_title)
            onTabClick(getProj.tab_title);
        setcurrentproject(getProj);
    }, [activeTab])
    function onTabClick(tabName) {
        axios.post(`/analytics/tab`, {
            content_id: currentproject.id,
            tab_name: tabName
        });
    }
    const getYoutubeEmbedUrl = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    const [expandedProjectLearnMoreItems, setExpandedProjectLearnMoreItems] = useState([]);

    const getProjectLearnMoreItems = () => {
        if (!Array.isArray(currentproject?.topics)) {
            return [];
        }

        return currentproject.topics
            .flatMap((topic) => Array.isArray(topic.learn_more_items) ? topic.learn_more_items : [])
            .map((item, index) => ({
                ...item,
                index,
                trigger: (item.trigger || "").trim(),
                body: (item.body || "").trim(),
            }))
            .filter((item) => item.trigger && item.body);
    };

    const toggleProjectLearnMore = (itemIndex) => {
        setExpandedProjectLearnMoreItems((current) =>
            current.includes(itemIndex)
                ? current.filter((index) => index !== itemIndex)
                : [...current, itemIndex]
        );
    };

    const renderProjectDescription = () => {
        const description = currentproject?.description || "";
        const learnMoreItems = getProjectLearnMoreItems();

        if (learnMoreItems.length === 0) {
            return description;
        }

        const triggers = learnMoreItems
            .map((item) => item.trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .sort((a, b) => b.length - a.length);
        const pattern = new RegExp(`(${triggers.join("|")})`, "g");

        return description.split(pattern).map((part, index) => {
            const item = learnMoreItems.find((learnMoreItem) => learnMoreItem.trigger === part);

            if (!item) {
                return part;
            }

            return (
                <button
                    key={`${part}-${index}`}
                    type="button"
                    onClick={() => toggleProjectLearnMore(item.index)}
                    className="font-semibold text-black underline decoration-2 decoration-[#F6940D] underline-offset-2 dark:text-white"
                    aria-expanded={expandedProjectLearnMoreItems.includes(item.index)}
                >
                    {part}
                </button>
            );
        });
    };

    const visibleProjectLearnMoreItems = getProjectLearnMoreItems().filter((item) =>
        expandedProjectLearnMoreItems.includes(item.index)
    );

    useEffect(() => {
        console.log(project);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer); // cleanup if component unmounts
    }, [project]);

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
            {project.length != 0 ?
                isLoading ?
                    <>
                        <Head title='Loading'></Head>
                        <img src={mascott}

                            className="hidden md:block" // 👈 hide on mobile, show on md+
                            style={{
                                position: 'fixed',
                                height: '70vh',
                                bottom: -20, zIndex: 1,
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

                        <Head title={currentproject?.title}></Head>
                        <div
                            className="min-h-screen w-full lg:max-w-2xl mx-auto flex flex-col items-center md:p-6 sm:pt-6"
                        >
                            {/* Navbar */}
                            <div className="flex space-x-2 bg-white rounded-full px-4 py-2 mb-6 shadow-md">
                                {project.map((proj) => (
                                    <button
                                        key={proj.id}
                                        onClick={() => setActiveTab(proj.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold  border-2 border-gray-800 border transition ${activeTab === proj.id
                                            ? proj.color != null ? ` text-white  border-solid ` : ` text-gray-800  border-solid `
                                            : "text-gray-800 border-dashed  hover:bg-gray-200"
                                            }`}
                                        style={{
                                            backgroundColor: proj.color
                                        }}
                                    >
                                        {proj?.tab_title}
                                    </button>
                                ))}
                            </div>

                            {/* Ride Card */}
                            <div className={`bg-white  px-3  rounded-lg ${currentproject?.image_path && 'mt-40'} mb-5 pb-6`}>

                                {currentproject?.image_path &&
                                    <img
                                        src={`/storage/${currentproject.image_path}`}
                                        alt="roller coaster"
                                        className="w-full h-48 object-cover -mt-40 rounded-lg "
                                    />
                                }
                                <div className="rounded-lg shadow-xl  w-full overflow-hidden mt-6 "
                                    style={{ backgroundColor: currentproject?.color }}
                                >

                                    {/* Title */}
                                    <div className="text-center py-4 ">
                                        <h2 className="text-black dark:text-white font-extrabold text-lg uppercase">
                                            {currentproject?.title}
                                        </h2>
                                        <p className="text-black dark:text-white text-sm tracking-wide">
                                            {renderProjectDescription()}
                                        </p>
                                    </div>

                                    {/* Content */}
                                    {Array.isArray(currentproject?.topics) && currentproject.topics.map((topic, index) =>
                                        <ShowTopics topic={topic} key={index}></ShowTopics>
                                    )}

                                    {visibleProjectLearnMoreItems.length > 0 && (
                                        <div className="px-3 pb-4 space-y-3">
                                            {visibleProjectLearnMoreItems.map((item) => (
                                                <div
                                                    key={item.index}
                                                    className="rounded-lg border-l-4 border-[#F6940D] bg-orange-50 p-4 text-sm text-gray-700"
                                                >
                                                    {item.title && (
                                                        <h4 className="mb-2 font-bold text-[#3A3A3A]">
                                                            {item.title}
                                                        </h4>
                                                    )}
                                                    <p className="whitespace-pre-line">
                                                        {item.body}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </>
                :

                <div className='w-full h-screen relative'>
                    <h3
                        className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center text-white'
                    >This Page is Empty</h3>
                </div>


            }


        </div>
    )
}
