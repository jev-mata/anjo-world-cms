import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Edit({ projectSelected }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: projectSelected?.title || '',
        description: projectSelected?.description || '',
        video: projectSelected?.video || '',
        image: '', // Keep empty to allow uploading new image
        questions: projectSelected?.questions || [], // if you plan to map questions
    });

    useEffect(() => {
        console.log(projectSelected);
    }, [projectSelected]);

    const addQuestion = () => {
        setData('questions', [
            ...data.questions,
            { question: '', choices: ['', '', '', ''], answer: '' },
        ]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...data.questions];
        updated[index][field] = value;
        setData('questions', updated);
    };

    const handleChoiceChange = (qIndex, cIndex, value) => {
        const updated = [...data.questions];
        updated[qIndex].choices[cIndex].text = value;
        setData('questions', updated);
    };
    const handleCorrectAnswerChange = (qIndex, correctIndex) => {
        const updated = [...data.questions];
        updated[qIndex].choices = updated[qIndex].choices.map((choice, i) => ({
            ...choice,
            is_correct: i === correctIndex,
        }));
        setData('questions', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send to backend
        const transformedQuestions = data.questions.map((q) => ({
            question: q.question,
            answers: q.choices.map(choice => ({
                text: choice.text,
                is_correct: choice.is_correct,
            })),
        }));

        // Send to backend
        post(route('projects.store'), {
            title: data.title,
            description: data.description,
            video: data.video,
            image: data.image,
            questions: transformedQuestions,
        });

    };


    const removeQuestion = (index) => {
        const updated = [...data.questions];
        updated.splice(index, 1);
        setData('questions', updated);
    };

    return (
        <div className="w-full mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Edit Content</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    ></textarea>
                </div>

                {/* Video */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video URL</label>
                    <input
                        type="url"
                        value={data.video}
                        onChange={(e) => setData('video', e.target.value)}
                        className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('image', e.target.files[0])}
                        className="mt-1 block w-full text-gray-900 dark:text-gray-100"
                    />
                </div>

                {/* Questions Section */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">E-Learning</h3>


                    {Array.isArray(data.questions) && data.questions.map((question, index) => (
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
                                        handleQuestionChange(index, 'question', e.target.value)
                                    }
                                    className="w-full mt-1 px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choices</p>
                                {Array.isArray(question.choices) && question.choices.map((choice, cIndex) => (
                                    <div key={cIndex} className="flex items-center space-x-2 ">
                                        <input
                                            type="text"
                                            value={choice.text}
                                            onChange={(e) => handleChoiceChange(index, cIndex, e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            placeholder={`Choice ${cIndex + 1}`}
                                            required
                                        />
                                        <input
                                            type="radio"
                                            name={`correct-${index}`}
                                            value={choice}
                                            checked={choice.is_correct}
                                            onChange={() => handleCorrectAnswerChange(index, cIndex)}
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
                        onClick={addQuestion}
                        className="text-indigo-600 hover:underline"
                    >
                        + Add Question
                    </button>
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Submit Project
                    </button>
                </div>
            </form>
        </div>
    );
}
