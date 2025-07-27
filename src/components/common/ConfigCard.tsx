import React from "react";

type ConfigCardtype = {
  img: string;
  title: string;
  desc: string;
  btnText: string;
  onAction: () => void;
};

const ConfigCard: React.FC<ConfigCardtype> = ({
  img,
  title,
  desc,
  btnText,
  onAction,
}) => {
  return (
    <div className="w-full cursor-default rounded-2xl border-[1.5px] border-slate-300 bg-white/80 px-4 py-5 backdrop-blur-2xl">
      <div className="flex flex-col gap-3">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* Placeholder Icon */}

            <img src={img} alt="icon" className="h-8 w-8" />

            <h2 className="text-xl font-medium text-zinc-800">{title}</h2>
          </div>
        </div>
        <p className="mb-4 text-base font-medium text-slate-500">{desc}</p>
        <div>
          <button
            onClick={onAction}
            className="active:bg-[#2a5bb0 mt-auto flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#3A74D3] px-3 py-2 text-base font-medium text-white transition-colors duration-200 hover:bg-[#2a5bb0]"
          >
            {btnText}
            <span className="">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigCard;
