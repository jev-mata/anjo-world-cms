import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import NewForm from "./Form/NewForm";
import toast from "react-hot-toast";

const Edit = forwardRef(({ projectSelected, onCloseConfirmed }, ref) => {

    const initialDataRef = useRef({ tabs: [], title: "" });
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
            topics: []
        }
    ]);
    const [removedTabID, setRemovedTabID] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [contentTitle, setContentTitle] = useState("");

    useImperativeHandle(ref, () => ({
        handleClose
    }));

    const [removedTopics, setRemovedTopics] = useState([]);
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
                topics: []
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
        return (
            JSON.stringify(tabs) !== initialDataRef.current.tabs ||
            contentTitle !== initialDataRef.current.title
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
        try {
            const res = await axios.get(`/projects/${id}`, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.projects.length != 0)
                setTabs(res.data.projects);
            initialDataRef.current = {
                tabs: JSON.stringify(res.data.projects),
                title: res.data.title,
            };
            setContentTitle(res.data.title);
        } catch (err) {
            console.error("Error:", err.response?.data || err);
        }
    };

    // Remove a tab
    const removeTab = (index, tabID) => {
        if (tabs.length === 1) return; // don’t allow removing last tab
        const updatedTabs = tabs.filter((_, i) => i !== index);
        setRemovedTabID((prev) => [...prev, tabID]);

        setTabs(updatedTabs);
        setActiveTab(Math.max(0, index - 1));
    };
    const appendTopicsToFormData = (formData, topics, prefix = "topics") => {
        topics.forEach((topic, i) => {
            const baseKey = `${prefix}[${i}]`;

            // append normal fields
            formData.append(`${baseKey}[id]`, topic.id ?? "");
            formData.append(`${baseKey}[title]`, topic.title ?? "");
            formData.append(`${baseKey}[description]`, topic.description ?? "");
            formData.append(`${baseKey}[color]`, topic.color ?? "");
            formData.append(`${baseKey}[video]`, topic.video ?? "");
            formData.append("removed_topics", JSON.stringify(removedTopics));
            // append image if it's a File
            if (topic.image instanceof File) {
                formData.append(`${baseKey}[image_path]`, topic.image);
            } else if (typeof topic.image_path === "string") {
                // keep existing string path if already saved
                formData.append(`${baseKey}[image_path]`, topic.image);
            }

            // recursive append for subtopics
            if (Array.isArray(topic.topics) && topic.topics.length > 0) {
                appendTopicsToFormData(formData, topic.topics, `${baseKey}[topics]`);
            }
        });
    };
    // Update a tab’s data when NewForm changes
    const updateTabData = (index, field, value) => {
        const updatedTabs = [...tabs];
        updatedTabs[index][field] = value;
        setTabs(updatedTabs);
    };
    const handleSaveAll = async (e) => {
        // e.preventDefault();
        try {
            // Send each tab
            for (const tab of tabs) {
                console.log(tab);
                const formData = new FormData();
                formData.append("title", tab.title);
                formData.append("id", tab.id);
                console.log("id", tab.id);
                formData.append("tab_title", tab.tab_title);
                formData.append("color", tab.color);
                formData.append("group_contents_id", projectSelected);
                formData.append("description", tab.description);
                formData.append("video", tab.video);
                if (tab.image) formData.append("image", tab.image);

                // recursive topics
                if (Array.isArray(tab.topics)) {
                    appendTopicsToFormData(formData, tab.topics);
                }
                await axios.post("/projects", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                console.log(removedTabID);
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
            console.error(err.response?.data || err);
            toast.error("❌ Failed to save some tabs!");
        }
    };
    return (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg  "
            onClick={(e) => e.stopPropagation()}
        >
            <div className=" sticky -top-1 dark:bg-gray-900 bg-gray-100 px-6 z-10">

                {/* Tabs Header */}
                <div
                    className=" w-full flex flex-col items-center  "
                >
                    <div>
                        <label className="text-gray-900 dark:text-gray-300 mt-4 block text-left">Main Title</label>
                        <input
                            type="text"
                            className="text-2xl font-semibold text-gray-800 dark:text-gray-800 p-2 mb-4 block mx-auto text-center"
                            value={contentTitle} onChange={(e) => setContentTitle(e.target.value)}></input>
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
                                    ? "bg-indigo-600 text-white border-white border-2 font-bold"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    }`}
                            >{tab.tab_title || `Tab ${index + 1}`}

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
                            className="px-3 py-2 bg-green-500 text-white rounded-full  hover:bg-green-600"
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
                    <div key={index} className={`${activeTab === index ? "block" : "hidden"} w-full bg-white dark:bg-gray-900 shadow   z-10  p-5`}

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

                                setRemovedTopics={setRemovedTopics}
                                removedTopics={removedTopics}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default Edit;