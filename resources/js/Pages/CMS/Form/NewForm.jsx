import React, { useEffect, useState } from "react";
import Topic from "../Component/Topic";

export default function NewForm({
    projectSelected,
    title,
    setTitle,
    color,
    setColor,
    description,
    setDescription,
    video,
    setVideo,
    image,
    image_path,
    setImage,
    topics,
    setTopics,
    tabTitle,
    setTabTitle,
    handleSaveAll,
    setRemovedTopics,
    removedTopics
}) {

    const [preview, setPreview] = useState(null);
    // Add new empty topic
    const addTopic = () => {
        setTopics([
            ...topics,
            {
                id: null,
                title: "",
                description: "",
                color: "#000000",
                topics: []
            },
        ]);
    };
    const colors = ["#A3CB3C", "#57C5CF", "#F6940D", "#EC008D", "#962495"];

    // Remove topic by index
    const removeTopic = (path) => {
        const updated = [...topics];

        const removeAtPath = (arr, p) => {
            if (!arr) return;
            if (p.length === 1) {
                const removed = arr[p[0]];
                if (removed !== undefined) {
                    if (removed?.id) {
                        // ✅ Track removed topic IDs
                        setRemovedTopics((prev) => [...prev, removed.id]);
                    }
                    arr.splice(p[0], 1);
                }
                return;
            }

            const [head, ...rest] = p;
            if (!arr[head] || !arr[head].topics) return;

            removeAtPath(arr[head].topics, rest);
        };

        removeAtPath(updated, path);
        setTopics(updated);
    };

    const addSubTopic = (path) => {
        const updated = [...topics];
        let current = updated;

        for (let i = 0; i < path.length; i++) {
            if (!current[path[i]].topics) {
                current[path[i]].topics = [];
            }
            current = current[path[i]].topics;
        }

        current.push({
            id: null,
            title: "",
            description: "",
            color: "#000000",
            topics: []
        });

        setTopics(updated);
    };

    // Update topic field
    const handleTopicChange = (path, field, value) => {
        const updated = [...topics]; // shallow copy root
        let current = updated;

        for (let i = 0; i < path.length - 1; i++) {
            // ensure topics exists
            if (!current[path[i]].topics) {
                current[path[i]].topics = [];
            }
            current = current[path[i]].topics;
        }

        // ensure final item exists
        if (!current[path[path.length - 1]]) {
            current[path[path.length - 1]] = { topics: [] };
        }

        current[path[path.length - 1]][field] = value;

        setTopics(updated);
    };
    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        // cleanup to avoid memory leaks
        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    return (
        <form onSubmit={handleSaveAll} className="space-y-6 " >
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">
                    Color
                </label>

                <div className="flex space-x-3">
                    {colors.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-black dark:border-white" : "border-transparent"
                                }`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
            {/* Tab Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tab Title
                </label>
                <input
                    type="text"
                    value={tabTitle}
                    onChange={(e) => setTabTitle(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
            </div>

            {/* Video */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Video URL
                </label>
                <input
                    type="url"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            {/* Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image
                </label>
                {preview ? <img src={preview} className="pt-4" /> : image_path &&
                    <img src={`storage/${image_path}`} className="pt-4" />
                }
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mt-1 block w-full text-gray-900 dark:text-gray-100"
                />
            </div>

            {/* Topics Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Topics
                </h3>

                {Array.isArray(topics) &&
                    topics.map((topic, index) => (
                        <Topic key={index}
                            index={index}
                            addSubTopic={addSubTopic}
                            handleTopicChange={handleTopicChange}
                            path={[index]}
                            removeTopic={removeTopic}
                            topic={topic}
                            colors={colors}></Topic>
                    ))}

                <button
                    type="button"
                    onClick={addTopic}
                    className="text-indigo-600 hover:underline"
                >
                    + Add Topic
                </button>
            </div>

            {/* Save */}
            <div>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Save Tab
                </button>
            </div>
        </form>
    );
}
