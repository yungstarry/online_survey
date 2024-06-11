import React from "react";

const PublicQuestionView = ({ question, index, answerChanged }) => {
  return (
    <>
      <fieldset className="mb-4">
        <div>
          <legend className=" text-base font-medium text-gray-900">
            {index + 1}. {question.question}
          </legend>
          <p className="text-gray-500 text-sm">{question.description}</p>
        </div>
        <div className="mt-3">
          {question.type === "select" && (
            <div>
              <select
                onChange={(e) => answerChanged(e.target.value)}
                className=" mt-1 block w-full py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Please Select</option>
              </select>
            </div>
          )}
        </div>
        <div className="mt-3">{question.type === "radio" && ""}</div>
        <div className="mt-3">{question.type === "checkbox" && ""}</div>
        <div className="mt-3">{question.type === "text" && ""}</div>
        <div className="mt-3">{question.type === "textarea" && ""}</div>
      </fieldset>
    </>
  );
};

export default PublicQuestionView;
