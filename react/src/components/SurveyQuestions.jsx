import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import QuestionEditor from "./QuestionEditor";

const SurveyQuestions = ({ questions, onQuestionUpdate }) => {
  const [myQuestions, setMyQuestions] = useState([]);

  useEffect(() => {
    setMyQuestions(questions);
  }, [questions]);

  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type: "text",
      question: "",
      description: "",
      data: {},
    };

    const updatedQuestions = [...myQuestions, newQuestion];
    setMyQuestions(updatedQuestions);
    onQuestionUpdate(updatedQuestions);
  };

  const questionChange = (updatedQuestion) => {
    if (!updatedQuestion) return;
    const updatedQuestions = myQuestions.map((q) =>
      q.id === updatedQuestion.id ? { ...updatedQuestion } : q
    );
    setMyQuestions(updatedQuestions);
    onQuestionUpdate(updatedQuestions);
  };

  const deleteQuestion = (questionToDelete) => {
    const updatedQuestions = myQuestions.filter(
      (q) => q.id !== questionToDelete.id
    );
    setMyQuestions(updatedQuestions);
    onQuestionUpdate(updatedQuestions);
  };

  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Questions</h3>
        <button
          type="button"
          className="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
          onClick={addQuestion}
        >
          <PlusIcon className="w-4 mr-2" />
          Add Question
        </button>
      </div>
      {!myQuestions.length ? (
        <div className="text-gray-400 text-center py-4">
          You don't have any question created
        </div>
      ) : (
        myQuestions.map((q, ind) => (
          <QuestionEditor
            key={q.id}
            index={ind}
            question={q}
            questionChange={questionChange}
            addQuestion={addQuestion}
            deleteQuestion={deleteQuestion}
          />
        ))
      )}
    </>
  );
};

export default SurveyQuestions;
