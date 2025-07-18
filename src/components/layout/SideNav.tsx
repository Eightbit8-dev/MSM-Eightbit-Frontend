import React, { useState, useEffect } from "react";
import { appRoutes } from "../../routes/appRoutes";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AnimatePresence, motion } from "motion/react";

/**
 * @state - isSideNavExpanded: boolean
 * @state - activeRoute: string
 * @state - expandedSection: string | null
 * **/
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
    } else {
      // setExpandedSection(null);
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
          className="flex max-w-full scale-110 flex-col items-center justify-center overflow-clip px-6 py-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* logo */}
          <motion.div
            onClick={() => window.location.reload()}
            className="flex cursor-pointer items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "tween", stiffness: 300 }}
          >
            <motion.img
              src="/icons/logo-icon-side-nav.svg"
              alt="Logo"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Roles */}
          <AnimatePresence>
            <motion.p
              className="orange-gradient absolute top-15.5 rounded px-1.5 py-1 text-[10px] font-normal text-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.4, type: "tween", stiffness: 200 }}
            >
              Master
            </motion.p>
          </AnimatePresence>

        </motion.div>

        {/* Navigation items */}
        <motion.div
          className="main-navigation-items flex h-full flex-col justify-between px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Top Navigation Items */}
          <div className="flex flex-col overflow-y-auto">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <NavigationButton
                labelName="Dashboard"
                iconSrc="/icons/dashboard-icon.svg"
                activeIconSrc="/icons/dashboard-icon-active.svg"
                onClick={() => navigateToRoute(appRoutes.dashboardPage)}
                isActive={isRouteActive(appRoutes.dashboardPage)}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <NavigationButton
                labelName="Master"
                iconSrc="/icons/company-icon.svg"
                onClick={() =>
                  navigateToRoute(appRoutes.masterRoutes.masterPage)
                }
                activeIconSrc="/icons/company-icon-active.svg"
                isActive={isRouteActive(appRoutes.masterRoutes.masterPage)}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <NavigationButton
                labelName="Loan"
                iconSrc="/icons/funds-icon.svg"
                onClick={() => navigateToRoute(appRoutes.loanPage)}
                activeIconSrc="/icons/funds-icon-active.svg"
                isActive={isRouteActive(appRoutes.loanPage)}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <NavigationButton
                labelName="Attendance"
                iconSrc="/icons/attendance-icon.svg"
                onClick={() => navigateToRoute(appRoutes.attendancePage)}
                activeIconSrc="/icons/attendance-icon-active.svg"
                isActive={isRouteActive(appRoutes.attendancePage)}
              />
            </motion.div>

            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.3 }}
            >
              <NavigationButton
                labelName="Users"
                iconSrc="/icons/users-icon.svg"
                onClick={() => navigateToRoute(appRoutes.usersPage)}
                isActive={isRouteActive(appRoutes.usersPage)}
                activeIconSrc="/icons/users-icon-active.svg"
              />
            </motion.div>

            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              <NavigationButton
                labelName="Employees"
                iconSrc="/icons/employees-icon.svg"
                activeIconSrc="/icons/employees-icon-active.svg"
                onClick={() => navigateToRoute(appRoutes.employeesPage)}
                isActive={isRouteActive(appRoutes.employeesPage)}
              />
            </motion.div>
          </div>

          {/* Bottom Logout Button */}
          <div className="pt-4">
            <motion.div
              className={`dropdown-navigation-div flex w-full cursor-pointer flex-col items-center justify-end gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-500 transition-colors duration-150 ease-in-out hover:bg-gray-100 active:bg-blue-500 active:text-white`}
              onClick={() => console.log("Logout clicked")}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(156, 163, 175, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "tween", stiffness: 300 }}
            >
              <motion.img
                src="/icons/logout-icon.svg"
                className="h-5 w-5 flex-shrink-0"
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Logout
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default SideNav;

/**
    @param labelName - The name of the navigation button to be displayed.
    @param iconSrc - The source URL of the icon to be displayed when in-active.
    @param breadCrumbCount - Optional count to display as a badge .
    @param isDropdown - Boolean to indicate if the button has a dropdown.
    @param children - The dropdown content to be displayed when the button is clicked
    @param onClick - The function to be called when the button is clicked.
    @param onDropDownClick - The function to be called when the dropdown arrow is clicked.
    @param isActive - Boolean to indicate if the button is active.
    @param className - Additional CSS classes to apply to the button.
    @param isNestedchild - Boolean to indicate if the button is a nested child.
    @param isExpanded - Boolean to indicate if the dropdown is expanded.
 **/

interface NavigationButtonProps {
  labelName: string;
  iconSrc: string;
  activeIconSrc?: string;
  breadCrumbCount?: number;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  isSideNavExpanded?: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  labelName,
  iconSrc,
  activeIconSrc = iconSrc,
  onClick,
  isActive = false,
  className = "",
  isSideNavExpanded = true,
}) => {
  const handleClick = () => onClick?.();

  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        {!isSideNavExpanded && (
          <TooltipContent
            side="right"
            sideOffset={10}
            className="bg-slate-200 text-zinc-800"
          >
            <h2 className="text-sm font-medium">{labelName}</h2>
          </TooltipContent>
        )}

        <motion.div
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-colors duration-300 ease-in-out ${className}`}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Icon Container */}
          <motion.div
            onClick={handleClick}
            className={`rounded-md ${isActive ? "p-3" : "p-2"}`}
            animate={{
              backgroundColor: isActive ? "#3b82f6" : "transparent",
              padding: isActive ? "12px" : "8px",
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: isActive
                ? "#3b82f6"
                : "rgba(156, 163, 175, 0.1)",
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <motion.img
              src={isActive ? activeIconSrc : iconSrc}
              alt={labelName.toLowerCase()}
              className="h-6 w-6"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.div>

          {/* Label */}
          {isSideNavExpanded && (
            <motion.h6
              className="text-center text-xs font-medium text-[#141718]/50"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {labelName}
            </motion.h6>
          )}
        </motion.div>
      </TooltipTrigger>
    </Tooltip>
  );
};
