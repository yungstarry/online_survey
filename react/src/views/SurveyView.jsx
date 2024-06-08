import PageComponent from "../components/PageComponent";
import { PhotoIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import axiosClient from "../axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SurveyQuestions from "../components/SurveyQuestions";
import { useEffect } from "react";

const SurveyView = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      status: false,
      description: "",
      image: null,
      image_url: null,
      expire_date: "",
      questions: [],
    },
  });
  const queryClient = useQueryClient();
  const survey = watch();

  const createSurvey = async (survey) => {
    const payload = { ...survey };
    if (payload.image) {
      payload.image = payload.image_url;
    }
    delete payload.image_url;
    const res = await axiosClient.post("/survey", payload);
    const { data } = res;
    console.log(data);
    navigate("/surveys");
  };

  const mutatation = useMutation({
    mutationFn: createSurvey,
    mutationKey: "survey",
    onSuccess: () => {
      toast.success("New Survey sucessfully created");
      queryClient.invalidateQueries({
        queryKey: ["survey"],
      });
      reset();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMessage}`);

      // Handle validation errors from the server
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          setError(key, { type: "server", message: value });
        });
      }
    },
  });

  const onImageChoose = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setValue("image", file);
      setValue("image_url", reader.result);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    mutatation.mutate(data);
  };

  const onSurveyUpdate = (updatedSurvey) => {
    setValue("questions", updatedSurvey.questions);
  };

  useEffect(() => {
    setValue("questions", survey.questions);
  }, [survey, setValue]);

  return (
    <PageComponent title={"Create new Survey"}>
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
            {/* image */}
            <div>
              <label className=" block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-1 flex items-center">
                {survey.image_url && (
                  <img
                    src={survey.image_url}
                    alt=""
                    className=" w-32 h-32 object-cover"
                  />
                )}
                {!survey.image_url && (
                  <span className="flex justify-center items-center text-gray-400 h-12 w-12">
                    <PhotoIcon className="w-8 h-8" />
                  </span>
                )}
                <button
                  type="button"
                  className=" relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <input
                    type="file"
                    className=" absolute left-0 top-0 bottom-0 opacity-0"
                    onChange={onImageChoose}
                  />
                  Change
                </button>
              </div>
            </div>
            {/* image */}
            {/* title */}
            <div className=" col-span-6 sm:col-span-3">
              <label className=" block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters long",
                  },
                })}
                placeholder="Survey title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-50 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>
            {/* title */}
            {/* description */}
            <div className=" col-span-6 sm:col-span-3">
              <label className=" block text-sm font-medium text-gray-700">
                description
              </label>
              <textarea
                type="text"
                {...register("description")}
                placeholder="Survey description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-50 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {/* description */}
            {/* Expiry date */}
            <div className=" col-span-6 sm:col-span-3">
              <label
                htmlFor="expire_date"
                className=" block text-sm font-medium text-gray-700"
              >
                Expire Date
              </label>
              <input
                type="date"
                {...register("expire_date")}
                placeholder="Survey description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-50 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.expire_date && (
                <p className="text-red-500">{errors.expire_date.message}</p>
              )}
            </div>
            {/* Expiry date */}

            {/* Active */}
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  {...register("status")}
                  className=" h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="comments" className="font-medium text-gray-700">
                  Active
                </label>
                <p className="text-gray-500">
                  Where to make survey publicly available
                </p>
              </div>
            </div>
            {/* Active */}

            {/* survey Questions */}
            <SurveyQuestions survey={survey} onSurveyUpdate={onSurveyUpdate} />
            {/* survey Questions */}
            <div className=" bg-gray-50 px-4 py-3 text-right sm:px-6">
              <TButton>Save</TButton>
            </div>
          </div>
        </div>
      </form>
    </PageComponent>
  );
};

export default SurveyView;
