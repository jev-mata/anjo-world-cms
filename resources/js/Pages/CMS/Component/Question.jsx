import { useEffect } from "react";

export default function Question({ question, index, handleQuestionChange, addAnswer, removeAnswer,removeQuestion }) {
    useEffect(()=>{
        console.log(question);
    },[question])
    function indexToLetter(index) {
        return String.fromCharCode(97 + (index % 26));
      }
    return (
        <div className="p-4 border relative rounded mb-4 bg-gray-50">

            <label className="block font-medium">Question {index + 1}</label>
            <input
                type="text"
                value={question.title}
                onChange={(e) => handleQuestionChange(index, "title", e.target.value)}
                className="w-full p-2 border rounded mb-3"
            />
            <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="absolute top-2 right-2 z-9 w-10 h-10 text-sm text-red-500 hover:underline"
            >
                ✕
            </button>

            <h4 className="font-semibold">Answers</h4>
            {question.answers.map((ans, i) => (
                <div key={i} className="flex items-center mb-2">
                    <span className="pr-2 capitalize">{indexToLetter(i)}</span>
                    <input
                        type="text"
                        value={ans.text}
                        onChange={(e) => handleQuestionChange(index, "answers", { ...ans, text: e.target.value }, i)}
                        className="flex-1 p-2 border rounded"
                    />
                    <input
                        type="checkbox"
                        checked={ans.is_correct}
                        onChange={(e) =>
                            handleQuestionChange(index, "answers", { ...ans, is_correct: e.target.checked }, i)
                        }
                        className="ml-2"
                    />
                    <span className="ml-1 text-sm">Correct</span>
                    <button onClick={() => removeAnswer(index, i)} className="ml-3 text-red-500">✕</button>
                </div>
            ))}

            <button type="button" onClick={() => addAnswer(index)} className="text-blue-600">
                + Add Answer
            </button>
        </div>
    );
}
