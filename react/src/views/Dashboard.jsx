import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import DashboardCard from "../components/DashboardCard";
import TButton from "../components/core/TButton";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/dashboard")
      .then((res) => {
        setLoading(false);
        setData(res.data);
        return res;
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        return error;
      });
  }, []);

  return (
    <PageComponent title={"Dashboard"}>
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
          <DashboardCard
            title="Total Surveys"
            className="order-1 lg:order-2"
            style="animation-delay:0.1s"
          >
            <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
              {data.totalSurveys}
            </div>
          </DashboardCard>
          <DashboardCard
            title="Total Answers"
            className="order-1 lg:order-2"
            style="animation-delay:0.2s"
          >
            <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
              {data.totalAnswers}
            </div>
          </DashboardCard>
          <DashboardCard
            title="Latest Survey"
            className="order-1 lg:order-2"
            style="animation-delay:0.1s"
          >
            {data.latestSurvey && (
              <div>
                <img
                  src={data.latestSurvey.image_url}
                  alt=""
                  className="w-[240px] mx-auto"
                />
                <h3 className="font-bold text-xl mb-3">
                  {data.latestSurvey.title}
                </h3>
                <div className=" flex justify-between text-sm mb-1">
                  <div>Create Date: </div>
                  <div>{data.latestSurvey.created_at}</div>
                </div>
                <div className=" flex justify-between text-sm mb-1">
                  <div>Expire Date: </div>
                  <div>{data.latestSurvey.expire_date}</div>
                </div>
                {/* status */}
                <div className=" flex justify-between text-sm mb-1">
                  <div>Status: </div>
                  <div>{data.latestSurvey.status ? "Active" : "Draft"}</div>
                </div>
                {/* Question */}
                <div className=" flex justify-between text-sm mb-1">
                  <div>Question: </div>
                  <div>{data.latestSurvey.questions}</div>
                </div>
                {/* Answer */}
                <div className=" flex justify-between text-sm mb-1">
                  <div>Answers: </div>
                  <div>{data.latestSurvey.answers}</div>
                </div>
                <div className="flex justify-between">
                  <TButton to={`/surveys/${data.latestSurvey.id}`} link>
                    <PencilIcon className=" w-5 h-5 mr-2" />
                    Edit Survey
                  </TButton>
                  <TButton link>
                    <EyeIcon className=" w-5 h-5 mr-2" />
                    View Answes
                  </TButton>
                </div>
              </div>
            )}

            {!data.latestSurvey && (
              <div className="text-gray-600 text-center py-16">
                You don't have surveys yet
              </div>
            )}
          </DashboardCard>

          <DashboardCard
            title="Latest Answers"
            className="order-1 lg:order-2 row-span-2"
            style="animation-delay:0.3s"
          >
            {data.latestAnswer?.length && (
              <div className=" text-left">
                {data.latestAnswer.map((answer) => (
                  <a
                    href="#"
                    key={answer.id}
                    className=" block p-2 hover:bg-gray-100/90"
                  >
                    <div className=" font-semibold">{answer.survey.title}</div>
                    <small>
                      Answer Made at:
                      <i className=" font-semibold">{answer.survey.title}</i>
                    </small>
                  </a>
                ))}
              </div>
            )}
            {!data.latestAnswer?.length && (
              <div className="text-gray-600 text-center py-16">
                You don't have answers yet
              </div>
            )}
          </DashboardCard>
        </div>
      )}
    </PageComponent>
  );
};

export default Dashboard;
