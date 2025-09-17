import { useEffect, useState } from "react";

export default function Topic({
    topic,
    colors,
    path = [],
    handleTopicChange,
    addSubTopic,
    removeTopic,
    index,
}) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        console.log(topic);
    }, [topic])
    useEffect(() => {
        if (!topic.image) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(topic.image);
        setPreview(objectUrl);

        // cleanup to avoid memory leaks
        return () => URL.revokeObjectURL(objectUrl);
    }, [topic]);
    return (
        <div
            key={index} style={{ backgroundColor: topic.color != "#000000" ? topic.color : "#f9fafb" }} // fallback gray
            className={` pl-4 py-1 pr-1 border rounded-xl dark:border-gray-600 bg-gray-50  dark:bg-gray-700 rounded-md space-y-4 mb-2`}
        >
            <div className="bg-white dark:bg-gray-900 p-5 rounded-r-xl relative">

                <button
                    type="button"
                    onClick={() => removeTopic(path)}
                    className="absolute top-2 right-2 z-9 w-10 h-10 text-sm text-red-500 hover:underline"
                >
                    ✕
                </button>
                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300">
                        Topic Title
                    </label>
                    <input
                        type="text"
                        value={topic.title}
                        onChange={(e) =>
                            handleTopicChange(path, "title", e.target.value)
                        }
                        className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300">
                        Description
                    </label>
                    <textarea
                        value={topic.description}
                        onChange={(e) =>
                            handleTopicChange(path, "description", e.target.value)
                        }
                        className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    ></textarea>
                </div>

                {/* Video */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Video URL
                    </label>
                    <input
                        type="url"
                        value={topic.video}
                        onChange={(e) => handleTopicChange(path,"video",e.target.value)}
                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Image
                    </label>
                    {preview ? <img src={preview} className="pt-4" /> : topic.image_path &&
                        <img src={`storage/${topic.image_path}`} className="pt-4" />
                    }
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleTopicChange(path, "image", e.target.files[0])}
                        className="mt-1 block w-full text-gray-900 dark:text-gray-100"
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
                                onClick={() => handleTopicChange(path, "color", c)}
                                className={`w-8 h-8 rounded-full border-2 ${topic.color === c ? "border-black dark:border-white" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                {Array.isArray(topic.topics) &&
                    topic.topics.map((subtopic, subIndex) => (

                        <Topic key={subIndex}
                            index={index}
                            addSubTopic={addSubTopic}
                            handleTopicChange={handleTopicChange}
                            path={[...path, subIndex]}
                            removeTopic={removeTopic}
                            topic={subtopic}
                            colors={colors}></Topic>
                    ))}

                <button
                    type="button"
                    onClick={() => addSubTopic(path)}
                    className="text-indigo-600 hover:underline"
                >
                    + Add Topic
                </button>
            </div>
        </div>
    )
}