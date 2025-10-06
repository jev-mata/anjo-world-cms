import React, { useState } from "react";
import axios from "axios";

export default function ShowQna({ question, contentId }) {
  const [selected, setSelected] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // generate a simple device hash if needed
  const getDeviceHash = () => {
    let hash = localStorage.getItem("device_hash");
    if (!hash) {
      hash = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("device_hash", hash);
    }
    return hash;
  };

  const handleSubmit = async (answer) => {
    if (isSubmitted) return; // prevent double clicks

    setSelected(answer.id);
    setIsSubmitted(true);
    setIsCorrect(answer.is_correct);

    // Save to analytics
    try {
      await axios.post("/analytics/question", {
        question_id: question.id,
        answer_id: answer.id,
        is_correct: answer.is_correct,
        topic_id: contentId,
        device_hash: getDeviceHash(),
      });
    } catch (error) {
      console.error("Error saving question analytics:", error);
    }
  };

  function indexToLetter(index) {
    return String.fromCharCode(97 + (index % 26));
  }
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <h4 className="font-semibold text-gray-800 mb-2">{question.title}</h4>

      <div className="space-y-2">
        {question.answers.map((answer, i) => {
          const isChosen = selected === answer.id;
          const showCorrect = isSubmitted && answer.is_correct;
          const showWrong = isSubmitted && isChosen && !answer.is_correct;

          return (
            <span className="flex  ">
              <span className="pr-2 my-auto capitalize">{indexToLetter(i)}.</span>
            <button
              key={answer.id}
              onClick={() => handleSubmit(answer)}
              disabled={isSubmitted}
              className={`w-full text-left px-4 py-2 rounded-md border transition ${isChosen
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 bg-white hover:bg-gray-100"
                } ${showCorrect ? "border-green-500 bg-green-50" : ""
                } ${showWrong ? "border-red-500 bg-red-50" : ""}`}
            >
              {answer.text}
            </button>
            </span>
          );
        })}
      </div>

      {isSubmitted && (
        <div className={`mt-3 text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-600"
          }`}>
          {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
        </div>
      )}
    </div>
  );
}
