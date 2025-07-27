import React, { useState, useEffect } from "react";
import { appRoutes } from "../../routes/appRoutes";
import { motion } from "motion/react";

const SideNav: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<string>("");

  useEffect(() => {
    // Get current pathname
    const currentPath = window.location.pathname;
    setActiveRoute(currentPath);

    // Auto-expand section based on current route (only one at a time)
    if (currentPath.startsWith("/master")) {
      setActiveRoute(appRoutes.masterRoutes.masterPage);
    } else if (currentPath.startsWith("/dashboard")) {
      setActiveRoute(appRoutes.dashboardPage);
    } else if (currentPath.startsWith("/loan")) {
      setActiveRoute(appRoutes.loanPage);
    }
  }, []);

  const isRouteActive = (route: string): boolean => {
    return activeRoute === route;
  };

  const navigateToRoute = (route: string) => {
    setActiveRoute(route);
    window.history.pushState({}, "", route);

    // Dispatch popstate event to notify other components of route change
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div
      className={`floating-container relative flex h-screen border-r-2 border-slate-300 transition-all duration-300`}
    >
      <motion.section
        className={`flex h-screen flex-col items-center justify-start gap-3 overflow-clip transition-all duration-300 select-none`}
        animate={{
          x: 0,
          opacity: 1,
        }}
      >
        {/* Header section */}
        <motion.div
          className="relative flex max-w-full flex-col items-center justify-center overflow-clip px-4 py-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* logo */}
          <motion.img
            src="/icons/logo-icon-side-nav.svg"
            alt="Logo"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          {/* Roles */}
          <motion.p
            className="orange-gradient absolute bottom-1.5 rounded px-1.5 py-1 text-[10px] font-normal text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.4, type: "tween", stiffness: 200 }}
          >
            MSM
          </motion.p>
        </motion.div>

        {/* Navigation items */}
        <motion.div
          className="main-navigation-items flex h-full flex-col justify-between px-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Top Navigation Items */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            <NavigationButton
              labelName="Dashboard"
              isActive={isRouteActive(appRoutes.dashboardPage)}
              iconSrc="/icons/sideNavIcons/dashboard-icon.svg"
              activeIconSrc="/icons/sideNavIcons/dashboard-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.dashboardPage)}
            />
                      <NavigationButton
              labelName="Master"
              isActive={isRouteActive(appRoutes.masterRoutes.masterPage)}
              iconSrc="/icons/sideNavIcons/master-icon.svg"
              activeIconSrc="/icons/sideNavIcons/master-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.masterRoutes.masterPage)}
            />

            <NavigationButton
              labelName="Transcation"
              isActive={isRouteActive(appRoutes.loanPage)}
              iconSrc="/icons/sideNavIcons/loan-icon.svg"
              activeIconSrc="/icons/sideNavIcons/loan-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.loanPage)}
            />
            <NavigationButton
              labelName="Users"
              isActive={isRouteActive(appRoutes.dashboardPage)}
              iconSrc="/icons/sideNavIcons/users-icon.svg"
              activeIconSrc="/icons/sideNavIcons/users-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.dashboardPage)}
            />

            <NavigationButton
              labelName="Reports"
              isActive={isRouteActive(appRoutes.homePage)}
              iconSrc="/icons/sideNavIcons/reports-icon.svg"
              activeIconSrc="/icons/sideNavIcons/reports-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.errorPage)}
            />
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default SideNav;

interface NavigationButtonProps {
  labelName: string;
  isActive: boolean;
  iconSrc: string;
  activeIconSrc?: string;
  onClick?: () => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  labelName,
  isActive,
  iconSrc,
  activeIconSrc,
  onClick,
}) => {
  return (
    <div
      className="Navigation-button-container flex scale-90 flex-col items-center justify-center"
      onClick={onClick}
    >
      <div
        className={`Navigation-button-container ${isActive ? "bg-blue-500 p-3" : "bg-white p-1.5 hover:bg-slate-100"} cursor-pointer rounded-[10px] transition-all duration-300 ease-in-out select-none active:bg-blue-600`}
      >
        <img src={isActive ? activeIconSrc : iconSrc} alt={labelName} />
      </div>
      <h4
        className={`scale-90 text-sm ${isActive ? "font-medium text-slate-500" : "font-normal text-slate-400"}`}
      >
        {labelName}
      </h4>
    </div>
  );
};
