import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import NewForm from "./Form/NewForm";
import toast from "react-hot-toast";

const Edit = forwardRef(({ projectSelected, onCloseConfirmed }, ref) => {

    const initialDataRef = useRef({ tabs: [], title: "" });

    const [tabsInit, setTabsInit] = useState([
        {
            id: null,
            tab_title: "Tab 1",
            title: "",
            description: "",
            video: "",
            color: "",
            image: null,
            image_path: null,
            topics: [], // Questions are within topics, not at tab level
        }
    ]);
    const [loading, setLoading] = useState(true);
    const [tabs, setTabs] = useState([
        {
            id: null,
            tab_title: "Tab 1",
            title: "",
            description: "",
            video: "",
            color: "",
            image: null,
            image_path: null,
            topics: [], // Questions are within topics, not at tab level
        }
    ]);
    const [removedTabID, setRemovedTabID] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [contentTitle, setContentTitle] = useState("");

    useImperativeHandle(ref, () => ({
        handleClose
    }));

    const [removedTopics, setRemovedTopics] = useState([]);
    const [removedQuestions, setRemovedQuestions] = useState([]);
    const [removedAnswers, setRemovedAnswers] = useState([]);

    // Add new tab
    const addTab = () => {
        setTabs([
            ...tabs,
            {
                id: null,
                tab_title: "Tab " + (tabs.length + 1),
                title: "",
                description: "",
                video: "",
                color: "",
                image: null,
                topics: [], // No questions at tab level
            }
        ]);
        setActiveTab(tabs.length);
    };

    useEffect(() => {
        if (projectSelected)
            fetchData(projectSelected);
    }, [projectSelected])

    useEffect(() => {
        console.log(tabs);
    }, [tabs])

    const hasUnsavedChanges = () => {
        return !loading && (tabsInit !== tabs
        );
    };

    const handleClose = () => {
        if (hasUnsavedChanges()) {
            if (window.confirm("You have unsaved changes. Save before closing?")) {
                handleSaveAll();
            } else {
                onCloseConfirmed(); // discard changes
            }
        } else {
            onCloseConfirmed(); // no changes → just close
        }
    };

    const fetchData = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`/projects/${id}`, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.projects.length != 0) {

                setTabs(res.data.projects);
                setTabsInit(res.data.projects);
            }
            initialDataRef.current = {
                tabs: JSON.stringify(res.data.projects),
                title: res.data.title,
            };
            setContentTitle(res.data.title);
            setLoading(false);
        } catch (err) {
            console.error("Error:", err.response?.data || err);
            setLoading(false);
        }
    };

    // Remove a tab
    const removeTab = (index, tabID) => {
        if (tabs.length === 1) return; // don't allow removing last tab
        const updatedTabs = tabs.filter((_, i) => i !== index);
        setRemovedTabID((prev) => [...prev, tabID]);

        setTabs(updatedTabs);
        setActiveTab(Math.max(0, index - 1));
    };

    const handleSaveAll = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            
            // Remove async from forEach - we need synchronous execution
            tabs.forEach((tab, i) => {
                const baseKey = `tabs[${i}]`; // Changed from `tab[${i}]` to `tabs[${i}]` for consistency
                
                // Append basic tab data
                formData.append(`${baseKey}[title]`, tab.title);
                formData.append(`${baseKey}[id]`, tab.id);
                formData.append(`${baseKey}[tab_title]`, tab.tab_title);
                formData.append(`${baseKey}[color]`, tab.color);
                formData.append(`${baseKey}[group_contents_id]`, projectSelected);
                formData.append(`${baseKey}[description]`, tab.description);
                formData.append(`${baseKey}[video]`, tab.video || '');
                
                // Use unique key for each image
                if (tab.image) {
                    formData.append(`${baseKey}[image]`, tab.image);
                }
    
                // Add removed tracking arrays
                formData.append(`${baseKey}[removed_topics]`, JSON.stringify(removedTopics));
                formData.append(`${baseKey}[removed_questions]`, JSON.stringify(removedQuestions));
                formData.append(`${baseKey}[removed_answers]`, JSON.stringify(removedAnswers));
    
                // Recursive topics
                if (Array.isArray(tab.topics)) {
                    appendTopicsToFormData(formData, tab.topics, `${baseKey}[topics]`);
                }
            });
    
            // Debug: Check what's in formData
            console.log('=== FORM DATA CONTENTS ===');
            for (const [key, value] of formData.entries()) {
                console.log(key, value instanceof File ? `File: ${value.name}` : value);
            }
    
            // Send request
            const response = await axios.post("/projects", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            // Delete removed tabs if any
            if (removedTabID.length > 0) {
                await axios.delete("/projects", {
                    data: { ids: removedTabID },
                    headers: { "Content-Type": "application/json" },
                });
            }
    
            initialDataRef.current = {
                tabs: JSON.stringify(tabs),
                title: contentTitle,
            };
            toast.success("✅ All tabs saved successfully!");
            onCloseConfirmed();
        } catch (err) {
            console.error('Error details:', err.response?.data || err);
            toast.error("❌ Failed to save some tabs!");
        }
    };
    
    const appendTopicsToFormData = (formData, topics, prefix = "topics") => {
        topics.forEach((topic, i) => {
            const baseKey = `${prefix}[${i}]`;
    
            // Append normal fields
            formData.append(`${baseKey}[id]`, topic.id ?? "");
            formData.append(`${baseKey}[title]`, topic.title ?? "");
            formData.append(`${baseKey}[description]`, topic.description ?? "");
            formData.append(`${baseKey}[color]`, topic.color ?? "");
            formData.append(`${baseKey}[video]`, topic.video ?? "");
    
            // Handle image - use the correct field name that matches your backend
            if (topic.image instanceof File) {
                formData.append(`${baseKey}[image]`, topic.image); // Changed from image_path to image
            } else if (typeof topic.image_path === "string") {
                formData.append(`${baseKey}[image_path]`, topic.image_path);
            }
    
            // Append questions for this topic
            if (Array.isArray(topic.questions)) {
                topic.questions.forEach((question, qIndex) => {
                    const questionKey = `${baseKey}[questions][${qIndex}]`;
                    formData.append(`${questionKey}[id]`, question.id ?? "");
                    formData.append(`${questionKey}[title]`, question.title ?? "");
    
                    // Append answers for this question
                    if (Array.isArray(question.answers)) {
                        question.answers.forEach((answer, aIndex) => {
                            const answerKey = `${questionKey}[answers][${aIndex}]`;
                            formData.append(`${answerKey}[id]`, answer.id ?? "");
                            formData.append(`${answerKey}[text]`, answer.text ?? "");
                            formData.append(`${answerKey}[is_correct]`, answer.is_correct ? 1 : 0);
                        });
                    }
                });
            }
    
            // Recursive append for subtopics
            if (Array.isArray(topic.topics) && topic.topics.length > 0) {
                appendTopicsToFormData(formData, topic.topics, `${baseKey}[topics]`);
            }
        });
    };

    // Update a tab's data when NewForm changes
    const updateTabData = (index, field, value) => {
        const updatedTabs = [...tabs];
        updatedTabs[index][field] = value;
        setTabs(updatedTabs);
    }; 
    return loading ? (
        <div
            className={`bg-white dark:bg-gray-900   h-full  mx-auto rounded-lg p-5`}
        >
            <div
                className={`block w-full  mt-20 my-auto  bg-white dark:bg-gray-900 shadow z-10 p-5`}

            >
                <div
                    className={`bg-white h-full flex flex-col dark:bg-gray-900 rounded-lg p-5`}
                >
                    {/* Mascot image */}
                    <img
                        src={'/anjo-mascott.png'}
                        alt="Mascot"
                        className="w-52 md:w-64 animate-bounce  mx-auto drop-shadow-lg"
                        style={{
                            filter: 'drop-shadow(0 0 12px rgba(124, 255, 255, 0.3))'
                        }}
                    />


                    {/* Loading Text */}
                    <div className="mt-8 text-center">
                        <div className="text-lg font-semibold  mx-auto tracking-wide uppercase animate-pulse">
                            Loading magic ✨
                        </div>

                        {/* Cool bar animation */}
                        <div className="w-48 h-1 mt-3  mx-auto bg-purple-300 rounded-full overflow-hidden">
                            <div className="h-full bg-white animate-slide-x"></div>
                        </div>
                    </div>

                    {/* Animations */}
                    <style>
                        {`
            @keyframes slide-x {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0%); }
              100% { transform: translateX(100%); }
            }
            .animate-slide-x {
              animation: slide-x 4s ease-in-out infinite;
            }
      
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
              animation: fade-in 1.2s ease-out forwards;
            }
          `}
                    </style>
                </div>
            </div>
        </div>
    ) : (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="sticky -top-1 dark:bg-gray-900 bg-gray-100 px-6 z-10">
                {/* Tabs Header */}
                <div className="w-full flex flex-col items-center">
                    <div>
                        <label className="text-gray-900 dark:text-gray-300 mt-4 block text-left">Main Title</label>
                        <input
                            type="text"
                            className="text-2xl font-semibold text-gray-800 dark:text-gray-800 p-2 mb-4 block mx-auto text-center"
                            value={contentTitle}
                            onChange={(e) => setContentTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-2 bg-white dark:bg-gray-700 rounded-full px-4 py-2 mb-6 shadow-md">
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                onClick={() => setActiveTab(index)}
                                style={{
                                    backgroundColor: tab.color
                                }}
                                className={`px-4 py-2 rounded-full cursor-pointer border  ${activeTab === index
                                    ? "bg-indigo-600 text-white dark:border-white border-[#000000] border-2 font-bold"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    }`}
                            >
                                {tab.tab_title || `Tab ${index + 1}`}

                                {tabs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTab(index, tab.id);
                                        }}
                                        className="ml-2 text-sm text-red-400 hover:text-red-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* Add Tab Button */}
                        <button
                            type="button"
                            onClick={addTab}
                            className="px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                        >
                            + Add Tab
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {tabs.map((tab, index) => (
                <div
                    key={tab.id}
                    className={`bg-white dark:bg-gray-900 max-w-2xl mx-auto rounded-lg p-5`}
                >
                    <div
                        key={index}
                        className={`${activeTab === index ? "block" : "hidden"} w-full bg-white dark:bg-gray-900 shadow z-10 p-5`}
                        style={{ backgroundColor: tabs[activeTab].color }}
                    >
                        <div
                            key={tab.id}
                            className={`bg-white dark:bg-gray-900 max-w-2xl mx-auto rounded-lg p-5`}
                        >
                            <NewForm
                                handleSaveAll={handleSaveAll}
                                projectSelected={projectSelected}
                                tabTitle={tab.tab_title}
                                color={tab.color}
                                setColor={(val) => updateTabData(index, "color", val)}
                                setTabTitle={(val) => updateTabData(index, "tab_title", val)}
                                title={tab.title}
                                setTitle={(val) => updateTabData(index, "title", val)}
                                description={tab.description}
                                setDescription={(val) => updateTabData(index, "description", val)}
                                video={tab.video}
                                setVideo={(val) => updateTabData(index, "video", val)}
                                image_path={tab.image_path}
                                image={tab.image}
                                setImage={(file) => updateTabData(index, "image", file)}
                                topics={tab.topics}
                                setTopics={(val) => updateTabData(index, "topics", val)}
                                // Remove questions props since they're within topics
                                setRemovedTopics={setRemovedTopics}
                                removedTopics={removedTopics}
                                setRemovedAnswers={setRemovedAnswers}
                                setRemovedQuestions={setRemovedQuestions}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default Edit;