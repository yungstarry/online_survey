import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PageComponent from "../components/PageComponent";
import { LinkIcon, PhotoIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import axiosClient from "../axios";
import SurveyQuestions from "../components/SurveyQuestions";

const SurveyView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [survey, setSurvey] = useState({
    title: "",
    slug: "",
    status: false,
    description: "",
    image: null,
    image_url: null,
    expire_date: "",
    questions: [], // Ensure this is always initialized as an array
  });

  const createSurvey = async (survey) => {
    const payload = { ...survey };
    if (payload.image) {
      payload.image = payload.image_url;
    }
    delete payload.image_url;

    if (id) {
      const res = await axiosClient.put(`/survey/${id}`, payload);
      const { data } = res;
      navigate("/surveys");
    } else {
      const res = await axiosClient.post("/survey", payload);
      const { data } = res;
      console.log(data);
      navigate("/surveys");
    }
  };

  const mutation = useMutation({
    mutationFn: createSurvey,
    mutationKey: "survey",
    onSuccess: () => {
      toast.success(id? "Survey Updated Successfully":"New Survey successfully created");
      queryClient.invalidateQueries({
        queryKey: ["survey"],
      });
      resetForm();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMessage}`); // Handle validation errors from the server
    },
  });

  const resetForm = () => {
    setSurvey({
      title: "",
      slug: "",
      status: false,
      description: "",
      image: null,
      image_url: null,
      expire_date: "",
      questions: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onImageChoose = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setSurvey((prevSurvey) => ({
        ...prevSurvey,
        image: file,
        image_url: reader.result,
      }));
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    for (const question of survey.questions) {
      if (!question.question.trim()) {
        toast.error("Each question must have a question field filled.");
        return;
      }
    }
    mutation.mutate(survey);
  };

  const onQuestionUpdate = (questions) => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions,
    }));
  };

  const onDelete = () => {

  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/survey/${id}`).then(({ data }) => {
        setSurvey(data.data);
        setLoading(false);
      });
    }
  }, []);



  return (
    <PageComponent
      title={id ? "Update survey" : "Create new Survey"}
      buttons={
        <div className=" flex gap-2">
          <TButton color="green" href={`/survey/public/${survey.slug}`}>
            Public Link 
            <LinkIcon className=" w-4 h-4 ml-2" />
          </TButton>
          <TButton color="red" onClick={onDelete}>
            <TrashIcon className=" w-4 h-4 mr-2" />
            Delete
          </TButton>
        </div>
      }
    >
      {loading && (
        <p className=" bg-red-300 rounded-lg items-center justify-center flex p-3">
          Loading.....
        </p>
      )}
      {!loading && (
        <form method="post" onSubmit={onSubmit}>
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              {/* image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div className="mt-1 flex items-center">
                  {survey.image_url && (
                    <img
                      src={survey.image_url}
                      alt={survey.title}
                      className="w-32 h-32 object-cover"
                    />
                  )}
                  {!survey.image_url && (
                    <span className="flex justify-center items-center text-gray-400 h-12 w-12">
                      <PhotoIcon className="w-8 h-8" />
                    </span>
                  )}
                  <button
                    type="button"
                    className="relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <input
                      type="file"
                      className="absolute left-0 top-0 bottom-0 opacity-0"
                      onChange={onImageChoose}
                    />
                    Change
                  </button>
                </div>
              </div>
              {/* image */}
              {/* title */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={survey.title}
                  onChange={handleInputChange}
                  placeholder="Survey title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-50 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {/* title */}
              {/* description */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={survey.description}
                  onChange={handleInputChange}
                  placeholder="Survey description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-50 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {/* description */}
              {/* Expiry date */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="expire_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expire Date
                </label>
                <input
                  type="date"
                  name="expire_date"
                  value={survey.expire_date}
                  onChange={handleInputChange}
                  placeholder="Survey expire date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-50 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {/* Expiry date */}
              {/* Active */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={survey.status}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="status" className="font-medium text-gray-700">
                    Active
                  </label>
                  <p className="text-gray-500">
                    Set whether the survey is active or not
                  </p>
                </div>
              </div>
              {/* Active */}

              {/* Survey Questions */}
              <SurveyQuestions
                questions={survey.questions}
                onQuestionUpdate={onQuestionUpdate}
              />
              {/* Survey Questions */}
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <TButton>Save</TButton>
              </div>
            </div>
          </div>
        </form>
      )}
    </PageComponent>
  );
};

export default SurveyView;
