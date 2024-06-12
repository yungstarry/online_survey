import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import PublicQuestionView from "../components/PublicQuestionView";
import toast from "react-hot-toast";

const SurveyPublicView = () => {
  const answers = {};
  const [surveyfinished, setSurveyfinished] = useState(false);
  const [survey, setSurvey] = useState({ questions: [] });
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    axiosClient.get(`survey/get-by-slug/${slug}`).then(({ data }) => {
      setSurvey(data.data);
      setLoading(false);
    });
  }, []);

  function answerChanged(question, value) {
    answers[question.id] = value;
    console.log(question, value);
  }

  function onSubmit(e) {
    e.preventDefault();
    console.log(answers);
    axiosClient
      .post(`/survey/${survey.id}/answer`, { answers })
      .then((response) => {
        debugger;
        setSurveyfinished(true);
      });
  }

  return (
    <div>
      {loading && <div className="flex justify-center">Loading......</div>}
      {!loading && (
        <form onSubmit={(e) => onSubmit(e)} className="container mx-auto">
          <div className=" grid grid-cols-6">
            <div className=" mr-4">
              <img src={survey.image_url} alt="" />
            </div>
            <div className=" col-span-5 ">
              <h1 className=" text-3xl mb-3">{survey.title}</h1>
              <p className=" text-gray-500 text-sm">
                Expire Date: {survey.expire_date}
              </p>
              <p className=" text-gray-500 text-sm mb-3">
                {survey.description}
              </p>
            </div>
          </div>
          {surveyfinished &&
            toast.success("Thank You for participating in the Survey", {
              duration: Infinity,
              position: "bottom-center",
              style: {
                width: "50%",
                minWidth: "300px",
                maxWidth: "600px",
                margin: "0 auto",
                padding: "1.5rem",
                fontSize: "1.2rem",
              },
            })}
          {!surveyfinished && (
            <>
              <div>
                {survey.questions?.map((question, index) => (
                  <PublicQuestionView
                    key={question.id}
                    question={question}
                    index={index}
                    answerChanged={(val) => answerChanged(question, val)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className=" inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default SurveyPublicView;
