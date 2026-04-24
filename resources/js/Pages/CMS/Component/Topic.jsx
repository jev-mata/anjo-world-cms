import { useEffect, useState } from "react";
import Question from "./Question";

export default function Topic({
    topic,
    colors,
    path = [],
    handleTopicChange,
    addSubTopic,
    removeTopic, 
    index,
    setRemovedQuestions,
    setRemovedAnswers,
}) {
    const [preview, setPreview] = useState(null);

    const learnMoreItems = Array.isArray(topic.learn_more_items) ? topic.learn_more_items : [];

    const addLearnMoreItem = () => {
        handleTopicChange(path, "learn_more_items", [
            ...learnMoreItems,
            {
                trigger: "",
                title: "",
                body: "",
            },
        ]);
    };

    const updateLearnMoreItem = (itemIndex, field, value) => {
        const updatedItems = [...learnMoreItems];
        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            [field]: value,
        };
        handleTopicChange(path, "learn_more_items", updatedItems);
    };

    const removeLearnMoreItem = (itemIndex) => {
        handleTopicChange(
            path,
            "learn_more_items",
            learnMoreItems.filter((_, index) => index !== itemIndex)
        );
    };

    // Add question to this topic
    const addQuestion = () => {
        const currentQuestions = topic.questions || [];
        const updatedQuestions = [
            ...currentQuestions,
            {
                id: null,
                title: "",
                answers: [
                    {
                        id: null,
                        text: "",
                        is_correct: false
                    }
                ]
            }
        ];
        handleTopicChange(path, "questions", updatedQuestions);
    };

    // Remove question from this topic
    const removeQuestion = (questionIndex) => {
        const currentQuestions = [...(topic.questions || [])];
        const removedQuestion = currentQuestions[questionIndex];
        
        if (removedQuestion?.id) {
            setRemovedQuestions((prev) => [...prev, removedQuestion.id]);
        }
        
        // Also track removed answers
        if (removedQuestion.answers) {
            removedQuestion.answers.forEach(answer => {
                if (answer.id) {
                    setRemovedAnswers((prev) => [...prev, answer.id]);
                }
            });
        }
        
        currentQuestions.splice(questionIndex, 1);
        handleTopicChange(path, "questions", currentQuestions);
    };

    // Add answer to a question in this topic
    const addAnswer = (questionIndex) => {
        const currentQuestions = [...(topic.questions || [])];
        if (!currentQuestions[questionIndex].answers) {
            currentQuestions[questionIndex].answers = [];
        }
        currentQuestions[questionIndex].answers.push({
            id: null,
            text: "",
            is_correct: false
        });
        handleTopicChange(path, "questions", currentQuestions);
    };

    // Remove answer from a question in this topic
    const removeAnswer = (questionIndex, answerIndex) => {
        const currentQuestions = [...(topic.questions || [])];
        const removedAnswer = currentQuestions[questionIndex].answers[answerIndex];
        
        if (removedAnswer?.id) {
            setRemovedAnswers((prev) => [...prev, removedAnswer.id]);
        }
        
        currentQuestions[questionIndex].answers.splice(answerIndex, 1);
        handleTopicChange(path, "questions", currentQuestions);
    };

    // Handle question or answer change in this topic
    const handleQuestionChange = (questionIndex, field, value, answerIndex = null) => {
        const currentQuestions = [...(topic.questions || [])];
        
        if (field === "answers" && answerIndex !== null) {
            // Update specific answer
            currentQuestions[questionIndex].answers[answerIndex] = value;
        } else {
            // Update question field
            currentQuestions[questionIndex][field] = value;
        }
        
        handleTopicChange(path, "questions", currentQuestions);
    };

    useEffect(() => {
        if (!topic.image) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(topic.image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [topic]);

    return (
        <div
            key={index} 
            style={{ backgroundColor: topic.color !== "#000000" ? topic.color : "#f9fafb" }}
            className="pl-4 py-1 pr-1 border rounded-xl dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md space-y-4 mb-2"
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

                <div className="border rounded-md p-3 space-y-3 dark:border-gray-600">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                Learn More
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Match text in the description and show the expansion after the questions.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={addLearnMoreItem}
                            className="shrink-0 text-sm text-indigo-600 hover:underline"
                        >
                            + Add
                        </button>
                    </div>

                    {learnMoreItems.map((item, itemIndex) => (
                        <div
                            key={itemIndex}
                            className="rounded-md border border-gray-200 p-3 space-y-2 dark:border-gray-700"
                        >
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => removeLearnMoreItem(itemIndex)}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-300">
                                    Clickable text in description
                                </label>
                                <input
                                    type="text"
                                    value={item.trigger || ""}
                                    onChange={(e) => updateLearnMoreItem(itemIndex, "trigger", e.target.value)}
                                    placeholder="Example: (mgh)"
                                    className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-300">
                                    Expansion title
                                </label>
                                <input
                                    type="text"
                                    value={item.title || ""}
                                    onChange={(e) => updateLearnMoreItem(itemIndex, "title", e.target.value)}
                                    placeholder="Example: What mgh means"
                                    className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-300">
                                    Expansion text
                                </label>
                                <textarea
                                    value={item.body || ""}
                                    onChange={(e) => updateLearnMoreItem(itemIndex, "body", e.target.value)}
                                    className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    rows={4}
                                ></textarea>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Video */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Video URL
                    </label>
                    <input
                        type="url"
                        value={topic.video || ""}
                        onChange={(e) => handleTopicChange(path, "video", e.target.value)}
                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Image
                    </label>
                    {preview ? <img src={preview} className="pt-4" alt="Preview" /> : topic.image_path &&
                        <img src={`storage/${topic.image_path}`} className="pt-4" alt="Current" />
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

                {/* Questions Section for this Topic */}
                <div className="mt-6 border-t pt-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
                        Questions in this Topic
                    </h4>

                    {Array.isArray(topic.questions) && topic.questions.map((question, qIndex) => (
                        <Question
                            key={qIndex}
                            question={question}
                            index={qIndex}
                            handleQuestionChange={handleQuestionChange}
                            addAnswer={addAnswer}
                            removeAnswer={removeAnswer}
                            removeQuestion={removeQuestion}
                        />
                    ))}
                    
                {/* Nested Topics (Recursive) */}
                {Array.isArray(topic.topics) &&
                    topic.topics.map((subtopic, subIndex) => (
                        <Topic 
                            key={subIndex}
                            index={subIndex}
                            addSubTopic={addSubTopic}
                            handleTopicChange={handleTopicChange}
                            path={[...path, subIndex]}
                            removeTopic={removeTopic}
                            topic={subtopic}
                            colors={colors}
                            setRemovedQuestions={setRemovedQuestions}
                            setRemovedAnswers={setRemovedAnswers}
                        />
                    ))}
                    <button 
                        type="button" 
                        onClick={addQuestion}
                        className="text-green-600 hover:underline"
                    >
                        + Add Question to this Topic
                    </button>
                </div>

                {/* Add SubTopic button */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => addSubTopic(path)}
                        className="text-indigo-600 hover:underline"
                    >
                        + Add SubTopic
                    </button>
                </div>

            </div>
        </div>
    );
}
