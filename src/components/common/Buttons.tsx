import React from "react";

type ButtonState = "default" | "outline";
interface ButtonSmProps {
  className?: string;
  state: ButtonState;
  text?: string;
  disabled?: boolean;
  imgUrl?: string;
  iconPosition?: "left" | "right"; // ✅ New prop
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ButtonSm: React.FC<ButtonSmProps> = ({
  state,
  text,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  imgUrl,
  iconPosition = "left", // default position
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn-sm flex cursor-pointer flex-row items-center gap-2 rounded-[9px] px-3 py-2 text-sm transition-all duration-200 ease-in-out select-none ${
        state === "default"
          ? "btn-primary bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
          : `btn-outline text-gray-800 outline-1 outline-slate-300 hover:bg-gray-100 active:bg-gray-200`
      } ${className}`}
      onClick={onClick}
    >
      {/* Render icon on left (default) */}
      {imgUrl && iconPosition === "left" && (
        <img src={imgUrl} alt="" className="nin-h-4 min-w-4" />
      )}
      {text && text}
      {/* Render icon on right */}
      {imgUrl && iconPosition === "right" && (
        <img src={imgUrl} alt="" className="min-h-4 min-w-4" />
      )}
    </button>
  );
};

interface ButtonLgProps {
  state: ButtonState;
  text: string;
  imgUrl?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const ButtonLg: React.FC<ButtonLgProps> = ({
  state,
  text,
  onClick,
  imgUrl,
  disabled,
  type = "button",
  className = "",
}) => {
  return (
    <button
      className={`btn-sm flex cursor-pointer flex-row items-center justify-center gap-2 rounded-[9px] px-4 py-3 text-center text-base font-medium transition-all duration-200 ease-in-out select-none ${state === "default" ? "btn-primary bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700" : "btn-outline bg-white text-blue-500 outline-2 -outline-offset-2 outline-blue-500 hover:bg-blue-50 active:bg-blue-200"} disabled:opacity-45 ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text}
      {imgUrl && <img src={imgUrl} alt="" className="h-5 w-5" />}
    </button>
  );
};

export default ButtonSm;
