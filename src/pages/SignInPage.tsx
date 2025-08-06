// File: src/pages/AuthPage.tsx

import { useEffect, useState } from "react";
import Input from "../components/common/Input";
import { useSignInMutation } from "../queries/signInQuery";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../routes/appRoutes";
import { toast } from "react-toastify";
import { motion } from "motion/react";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess } = useSignInMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate(appRoutes.dashboardPage, { replace: true });
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return toast.error("Username and password are required");
    }
    
    mutate({ username, password });
  };

  return (
    <div className="flex h-screen w-full justify-center">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 md:w-1/2 md:px-8">
        <div className="flex w-full flex-col gap-2 md:w-[400px]">
          <div className="mb-3 flex w-full flex-col text-center">
            <motion.div
              className="relative mb-4 flex max-w-full flex-col items-start justify-center py-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="container flex w-max flex-col items-center">
                <motion.img
                  src="/icons/logo-icon-side-nav.svg"
                  alt="Logo"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.p
                  className="orange-gradient absolute bottom-1.5 rounded px-1.5 py-1 text-[10px] font-normal text-white"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.4, type: "tween", stiffness: 200 }}
                >
                  MSM
                </motion.p>
              </div>
            </motion.div>
            <p className="text-md text-start font-medium text-gray-500">
              Please sign in!
            </p>
            <h2 className="head mt-1 text-start text-2xl font-medium">
              Welcome to MSM
            </h2>
          </div>

          <div>
            <form
              className="flex max-w-sm min-w-full flex-col gap-3"
              onSubmit={handleSubmit}
            >
              <Input
                type="str"
                name="email"
                placeholder="Enter your username or email"
                title="Email"
                inputValue={username}
                onChange={setUsername}
              />

              <div className="relative w-full min-w-[180px] self-stretch">
                <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
                  Password
                </h3>
                <div className="parent-input-wrapper flex cursor-text items-center justify-between overflow-clip rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 transition-all autofill:bg-blue-500 focus-within:border-slate-500">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 cursor-pointer text-slate-500 transition-transform hover:text-blue-600 focus:outline-none active:scale-95"
                  >
                    <img
                      src={
                        showPassword
                          ? "/icons/eye-icon.svg"
                          : "/icons/eye-off-icon.svg"
                      }
                      alt={showPassword ? "Hide Password" : "Show Password"}
                      className="h-6 w-6"
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-[16px] bg-blue-500 px-3.5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-40"
                disabled={isPending || !username || !password}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="bg-primary relative hidden w-1/2 items-center justify-center lg:flex">
        <div className="texts absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-[80px] leading-[80px] font-medium text-[#00b3fa] mix-blend-difference">
          Reliable <br /> Fast <br /> Smart.
        </div>
        <img
          src="./images/sign-in-image.webp"
          alt="Login art"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
      </div>
    </div>
  );
};

export default AuthPage;
