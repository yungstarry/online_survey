import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../contexts/ContextProvider";

const QuestionEditor = ({
  index = 0,
  question,
  addQuestion,
  deleteQuestion,
  questionChange,
}) => {
  const [model, setModel] = useState({ ...question });
  const { questionTypes } = useStateContext();

  useEffect(() => {
    questionChange(model);
  }, [model]);

  function upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function shouldHaveOptions(type = null) {
    type = type || model.type;
    return ["select", "radio", "checkbox"].includes(type);
  }

  function onTypeChange(e) {
    const newModel = { ...model, type: e.target.value };
    if (!shouldHaveOptions(model.type) && shouldHaveOptions(e.target.value)) {
      if (!model.data.options) {
        newModel.data = { options: [{ uuid: crypto.randomUUID() }] };
      }
    }
    setModel(newModel);
  }

  const deleteOption = (op) => {
    model.data.options = model.data.options.filter(
      (options) => options.uuid !== op.uuid
    );
    setModel({...model})
  };
  const addOption = () => {
    model.data.options.push({
      uuid: crypto.randomUUID(),
      text: "",
    });
    setModel({ ...model });
  };
  return (
    <div>
      <div className="flex justify-between mb-3">
        <h4>
          {index + 1}. {model.question}
        </h4>
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center text-xs py-1 px-3 mr-2 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
            onClick={() => addQuestion()}
          >
            <PlusIcon className="w-4" />
            Add
          </button>
          <button
            type="button"
            className="flex items-center text-sm py-1 px-3 rounded-sm border border-transparent text-red-500 hover:text-red-600"
            onClick={() => deleteQuestion(question)}
          >
            <TrashIcon className="w-4" />
            Delete
          </button>
        </div>
      </div>
      <div className="flex justify-between mb-3">
        <div className="flex-1">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700"
          >
            Question
          </label>
          <input
            type="text"
            name="question"
            id="question"
            value={model.question}
            onChange={(e) => setModel({ ...model, question: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="questionType"
            className="block text-sm font-medium text-gray-700 w-40"
          >
            Question Type
          </label>
          <select
            name="questionType"
            id="questionType"
            value={model.type}
            onChange={onTypeChange}
            className="mt-1 block w-full rounded-md border border-r-gray-300 bg-white ml-2 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {questionTypes.map((type, ind) => (
              <option key={ind} value={type}>
                {upperCaseFirst(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="questionDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="questionDescription"
          id="questionDescription"
          value={model.description}
          onChange={(e) => setModel({ ...model, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      {/* Description */}
      <div>
      
      </div>
      <div>
        {shouldHaveOptions() && (
          <div>
            <h4 className="text-sm font-semibold mb-1 flex justify-between items-center">
              Options
              <button
                type="button"
                onClick={addOption}
                className=" flex items-center text-xs py-1 px-2 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
              >
                Add
              </button>
            </h4>

            {model.data.options.length === 0 && (
              <div className=" text-sm text-gray-600 text-center py-3">
                You don't have any options defined
              </div>
            )}
            {model.data.options.length > 0 && (
              <div>
                {model.data.options.map((op, ind) => (
                  <div className=" flex items-center mb-1" key={op.uuid}>
                    <span className="w-6 text-sm">{ind + 1}.</span>
                    <input
                      type="text"
                      value={op.text}
                      onInput={(e) => {
                        (op.text = e.target.value), setModel({ ...model });
                      }}
                      className=" w-full rounded-sm py-1 px-2 text-xs border border-r-gray-300 focus:border-indigo-500"
                    />
                    <button
                      onClick={() => deleteOption(op)}
                      type="button"
                      className=" h-6 w-6 rounded-full flex items-center border border-transparent transition-colors hover:border-red-100"
                    >
                      <TrashIcon className=" w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {model.type === "select" && <div></div>}
    </div>
  );
};

export default QuestionEditor;
