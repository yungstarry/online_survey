import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import QuestionEditor from "./QuestionEditor";

const SurveyQuestions = ({ questions, onQuestionUpdate }) => {
  const [myQuestion, setmyQuestion] = useState([...questions]);

  const addQuestion = (index) => {
    index = index !== undefined ? index : myQuestion.length;
    const newQuestion = {
      id: crypto.randomUUID(),
      type: "text",
      question: "",
      description: "",
      data: {},
    };
    const newQuestions = [...myQuestion];
    newQuestions.splice(index, 0, newQuestion);
    setmyQuestion(newQuestions); // Update state with newQuestions

    onQuestionUpdate(newQuestions); // Pass newQuestions to callback
  };

  const questionChange = (question) => {
    if (!question) return;
    const newQuestion = myQuestion.map((q) => {
      if (q.id === question.id) {
        return { ...question };
      }
      return q;
    });
    setmyQuestion(newQuestion);
    onQuestionUpdate(newQuestion);
  };

  const deleteQuestion = (question) => {
    const newQuestions = myQuestion.filter((q) => q.id !== question.id);
    setmyQuestion(newQuestions);
    onQuestionUpdate(newQuestions);
  };

  useEffect(() => {
    setmyQuestion(questions)
  
  }, [questions])
  

  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Questions</h3>
        <button
          type="button"
          className="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
          onClick={() => addQuestion()}
        >
          <PlusIcon className="w-4 mr-2" />
          Add Question
        </button>
      </div>
      {!myQuestion.length ? ( // Check if myQuestion is empty
        <div className="text-gray-400 text-center py-4">
          You don't have any question created
        </div>
      ) : (
        myQuestion.map((q, ind) => (
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
