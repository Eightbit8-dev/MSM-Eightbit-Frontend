import { motion } from "framer-motion";
import React from "react";
import NotificationCenter from "../common/NotificationCenter";
import { useAuthStore } from "@/store/useAuthStore";

export const TopNav: React.FC = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatted = date.toLocaleDateString("en-GB", options);

  const { userName, role } = useAuthStore();
  console.log(userName, role);
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-zinc-200 bg-white px-3 py-3 shadow-sm lg:px-4"
    >
      <div className="flex items-center justify-between">
        {/* Welcome Section */}
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold text-zinc-800"
          >
            Welcome, {userName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-zinc-500"
          >
            {formatted}
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex scale-90 items-center gap-5"
        >
          <NotificationCenter notifications={3} />

          {/* Profile Image */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-full bg-slate-100 transition-all hover:bg-slate-200"
          >
            <img
              src="/images/profile.jpg  "
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/default-user.png";
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};
