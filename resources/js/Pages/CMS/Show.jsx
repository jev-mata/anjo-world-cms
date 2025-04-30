import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Show({ project }) {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
            <Head title={project.title} />

            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{project.title}</h1>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{project.description}</p>

            {project.video && (
                <div className="mb-4">
                    <iframe
                        className="w-full h-64"
                        src={project.video}
                        title="Project Video"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {project.image_path && (
                <div className="mb-4">
                    <img
                        src={`/storage/${project.image_path}`}
                        alt="Project"
                        className="rounded-lg shadow"
                    />
                </div>
            )}

            <div className="space-y-6">
                {Array.isArray(project.questions) && project.questions.map((q, index) => (
                    <div key={q.id} className="p-4 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                            Q{index + 1}: {q.question}
                        </h3>
                        <ul className="mt-2 space-y-1">
                            {Array.isArray(q.answers) && q.answers.map((a, i) => (
                                <li
                                    key={i}
                                    className={`p-2 rounded ${a.is_correct
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                        }`}
                                >
                                    {a.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Link href={route('dashboard')} className="text-indigo-600 hover:underline">
                    ← Back to Projects
                </Link>
            </div>
        </div>
    );
}
