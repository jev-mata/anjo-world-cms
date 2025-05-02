import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Create() {
    const {
        data: elementaryData,
        setData: setElementaryData,
        post: postElementary,
        processing: elementaryProcessing,
        errors: elementaryErrors,
        reset: resetElementary,
    } = useForm({
        title: '',
        description: '',
        video: '',
        image: null,
        questions: [
            {
                question: '',
                choices: [
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                ],
            },
        ],
    });

    const {
        data: highschoolData,
        setData: setHighschoolData,
        post: postHighschool,
        processing: highschoolProcessing,
        errors: highschoolErrors,
        reset: resetHighschool,
    } = useForm({
        title: '',
        description: '',
        video: '',
        image: null,
        questions: [
            {
                question: '',
                choices: [
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                ],
            },
        ],
    });

    const {
        data: data,
        setData: setData,
        post: post,
        processing: processing,
        errors: errors,
        reset: reset,
    } = useForm({
        group: [
            elementaryData,
            highschoolData
        ]
    });

    const addElementaryQuestion = () => {
        setElementaryData('questions', [
            ...elementaryData.questions,
            {
                question: '',
                choices: [
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                ],
            },
        ]);
    };


    const addHighSchoolQuestion = () => {
        setHighschoolData('questions', [
            ...highschoolData.questions,
            {
                question: '',
                choices: [
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                    { text: '', is_correct: false },
                ],
            },
        ]);
    };
    const handleElementaryQuestionChange = (index, field, value) => {
        const updated = [...elementaryData.questions];
        updated[index][field] = value;
        setElementaryData('questions', updated);
    };

    const handleElementaryChoiceChange = (qIndex, cIndex, value) => {
        const updated = [...elementaryData.questions];
        updated[qIndex].choices[cIndex].text = value;
        setElementaryData('questions', updated);
    };

    const handleElementaryCorrectAnswerChange = (qIndex, correctIndex) => {
        const updated = [...elementaryData.questions];
        updated[qIndex].choices = updated[qIndex].choices.map((choice, i) => ({
            ...choice,
            is_correct: i === correctIndex,
        }));
        setElementaryData('questions', updated);
    };
    const handleHighschoolQuestionChange = (index, field, value) => {
        const updated = [...highschoolData.questions];
        updated[index][field] = value;
        setHighschoolData('questions', updated);
    };

    const handleHighschoolChoiceChange = (qIndex, cIndex, value) => {
        const updated = [...highschoolData.questions];
        updated[qIndex].choices[cIndex].text = value;
        setHighschoolData('questions', updated);
    };

    const handleHighschoolCorrectAnswerChange = (qIndex, correctIndex) => {
        const updated = [...highschoolData.questions];
        updated[qIndex].choices = updated[qIndex].choices.map((choice, i) => ({
            ...choice,
            is_correct: i === correctIndex,
        }));
        setHighschoolData('questions', updated);
    };
    useEffect(() => {


        setData({
            group: [
                elementaryData,
                highschoolData
            ]
        })
    }, [highschoolData, elementaryData]);
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            group: [
                elementaryData,
                highschoolData
            ]
        });


    };



    const removeQuestion = (index) => {
        const updated = [...elementaryData.questions];
        updated.splice(index, 1);
        setElementaryData('questions', updated);
    };
    const removeQuestion2 = (index) => {
        const updated = [...highschoolData.questions];
        updated.splice(index, 1);
        setHighschoolData('questions', updated);
    };

    return (
        <div className=' p-6 bg-white dark:bg-gray-900 shadow rounded-lg mx-2'>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 w-full">Create New Content</h2>
            <form onSubmit={handleSubmit} className="  flex">
                <div className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-900 shadow rounded-lg mr-10" style={{

                }}>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 w-full">Elementary</h2>
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            value={elementaryData.title}
                            onChange={(e) => setElementaryData('title', e.target.value)}
                            required
                            className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            value={elementaryData.description}
                            onChange={(e) => setElementaryData('description', e.target.value)}
                            required
                            className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        ></textarea>
                    </div>

                    {/* Video */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video URL</label>
                        <input
                            type="url"
                            value={elementaryData.video}
                            onChange={(e) => setElementaryData('video', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setElementaryData('image', e.target.files[0])}
                            className="mt-1 block w-full text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {/* Questions Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Questions & Answers</h3>


                        {Array.isArray(elementaryData.questions) && elementaryData.questions.map((question, index) => (
                            <div key={index} className="relative  p-4 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md space-y-4 mb-2">
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(index)}
                                    className="absolute top-2 right-2 text-sm text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300">Question {index + 1}</label>
                                    <input
                                        type="text"
                                        value={question.question}
                                        onChange={(e) =>
                                            handleElementaryQuestionChange(index, 'question', e.target.value)
                                        }
                                        className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choices</p>
                                    {question.choices.map((choice, cIndex) => (
                                        <div key={cIndex} className="flex items-center space-x-2 ">
                                            <input
                                                type="text"
                                                value={choice.text}
                                                onChange={(e) => handleElementaryChoiceChange(index, cIndex, e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                placeholder={`Choice ${cIndex + 1}`}
                                                required
                                            />
                                            <input
                                                type="radio"
                                                name={`Elementary-correct-${index}`}
                                                value={choice}
                                                checked={choice.is_correct}
                                                onChange={() => handleElementaryCorrectAnswerChange(index, cIndex)}
                                                className="text-indigo-600"
                                            />
                                            <label className="text-sm text-gray-600 dark:text-gray-300">Correct</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addElementaryQuestion}
                            className="text-indigo-600 hover:underline"
                        >
                            + Add Question
                        </button>
                    </div>

                    {/* Submit */}


                </div>
                <div className="max-w-2xl relative w-full mx-auto bg-white dark:bg-gray-900 shadow rounded-lg ml-10" style={{

                }}>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 w-full">High School</h2>
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            value={highschoolData.title}
                            onChange={(e) => setHighschoolData('title', e.target.value)}
                            required
                            className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            value={highschoolData.description}
                            onChange={(e) => setHighschoolData('description', e.target.value)}
                            required
                            className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        ></textarea>
                    </div>

                    {/* Video */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video URL</label>
                        <input
                            type="url"
                            value={highschoolData.video}
                            onChange={(e) => setHighschoolData('video', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setHighschoolData('image', e.target.files[0])}
                            className="mt-1 block w-full text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {/* Questions Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Questions & Answers</h3>


                        {Array.isArray(highschoolData.questions) && highschoolData.questions.map((question, index) => (
                            <div key={index} className="relative  p-4 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md space-y-4 mb-2">
                                <button
                                    type="button"
                                    onClick={() => removeQuestion2(index)}
                                    className="absolute top-2 right-2 text-sm text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300">Question {index + 1}</label>
                                    <input
                                        type="text"
                                        value={question.question}
                                        onChange={(e) =>
                                            handleHighschoolQuestionChange(index, 'question', e.target.value)
                                        }
                                        className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choices</p>
                                    {question.choices.map((choice, cIndex) => (
                                        <div key={cIndex} className="flex items-center space-x-2 ">
                                            <input
                                                type="text"
                                                value={choice.text}
                                                onChange={(e) => handleHighschoolChoiceChange(index, cIndex, e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                placeholder={`Choice ${cIndex + 1}`}
                                                required
                                            />
                                            <input
                                                type="radio"
                                                name={`Highschool-correct-${index}`}
                                                value={choice}
                                                checked={choice.is_correct}
                                                onChange={() => handleHighschoolCorrectAnswerChange(index, cIndex)}
                                                className="text-indigo-600"
                                            />
                                            <label className="text-sm text-gray-600 dark:text-gray-300">Correct</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addHighSchoolQuestion}
                            className="text-indigo-600 hover:underline"
                        >
                            + Add Question
                        </button>
                    </div>

                    {/* Submit */}

                    <div className="pt-4 absolute -top-10 right-0">
                        <button
                            type="submit"
                            disabled={elementaryProcessing || highschoolProcessing}
                            className=" px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Create Content
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}
