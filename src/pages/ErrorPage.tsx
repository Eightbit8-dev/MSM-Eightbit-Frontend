import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <section className="self-center bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-blue-500 text-blue-600 lg:text-9xl dark:text-blue-500">
              404
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              Something's missing.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Sorry, we can't find that page. You'll find lots to explore on the
              home page.{" "}
            </p>
            <a
              onClick={() => navigate("/")}
              className="hover:bg-primary-800 my-4 inline-flex cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:underline focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-900"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
