import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appRoutes } from "../../routes/appRoutes";

interface NavItem {
  label: string;
  route: string;
  icon: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    route: appRoutes.dashboardPage,
    icon: "/icons/sideNavIcons/dashboard-icon.svg",
    activeIcon: "/icons/sideNavIcons/dashboard-icon-active-icon.svg",
  },
  {
    label: "Master",
    route: appRoutes.masterRoutes.masterPage,
    icon: "/icons/sideNavIcons/master-icon.svg",
    activeIcon: "/icons/sideNavIcons/master-icon-active-icon.svg",
  },
  {
    label: "Transaction",
    route: appRoutes.transactionRoutes.transcationPage,
    icon: "/icons/sideNavIcons/loan-icon.svg",
    activeIcon: "/icons/sideNavIcons/loan-icon-active-icon.svg",
  },
  {
    label: "Users",
    route: appRoutes.userRoutes?.userPage || "/users",
    icon: "/icons/sideNavIcons/users-icon.svg",
    activeIcon: "/icons/sideNavIcons/users-icon-active-icon.svg",
  },
  {
    label: "Reports",
    route: appRoutes.reportRoutes?.reportPage || "/reports",
    icon: "/icons/sideNavIcons/memo-icon.svg",
    activeIcon: "/icons/sideNavIcons/reports-icon-active-icon.svg",
  },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) => location.pathname.startsWith(route);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t bg-white px-2 py-2 shadow-md lg:hidden">
      <div className="flex flex-row gap-4 w-full justify-between max-w-[390px] px-3 ">
        {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.route)}
          className="flex flex-col items-center text-xs text-slate-500"
        >
          <div
            className={`rounded-md p-1.5 transition-all duration-300 `}
          >
            <img
              src={isActive(item.route) ? item.activeIcon : item.icon}
              alt={item.label}
              className="min-h-5 min-w-5"
            />
          </div>
          <span
            className={`mt-0.5 ${
              isActive(item.route) ? "text-blue-500 font-semibold" : "text-slate-500 font-semibold"
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
      </div>
    </nav>
  );
};

export default BottomNav;
