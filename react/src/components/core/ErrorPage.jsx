import { useRouteError } from "react-router-dom";

import TButton from "./TButton";

function ErrorPage() {
  const error = useRouteError();
  console.log(error);

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message}</p>
      <div className="w-32">
        <TButton to="/" color="green"> &larr; Go back</TButton>
      </div>
    </div>
  );
}

export default ErrorPage;
