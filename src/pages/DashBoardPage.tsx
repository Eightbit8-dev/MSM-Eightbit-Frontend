import {
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  UserCheck,
} from "lucide-react";

import { useFetchDashboardCounts } from "../queries/dashboard";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/routes/appRoutes";

const DashBoardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchDashboardCounts();

  const stats = [
    {
      title: "Total Machine",
      value: data?.totalMachines ?? "0",
      textColor: "text-amber-500",
      borderColor: "border-amber-500",
      icon: Wrench,
      iconBg: "bg-amber-50",
      navigateUrl: appRoutes.transactionRoutes.children.machineEntry,
    },
    {
      title: "Breakdown Machine",
      value: data?.breakdownMachines ?? "0",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceRequest +
        "?status=Not Completed",
    },
    {
      title: "Service Completed",
      value: data?.serviceCompleted ?? "0",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      icon: CheckCircle,
      iconBg: "bg-blue-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceEntry + "?status=Completed",
    },
    {
      title: "Service Pending",
      value: data?.servicePending ?? "0",
      textColor: "text-gray-500",
      borderColor: "border-gray-500",
      icon: AlertTriangle,
      iconBg: "bg-gray-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceRequest + "?status=Pending",
    },
    {
      title: "Assigned Engineers",
      value: data?.assignedEngineers ?? "3",
      textColor: "text-green-500",
      borderColor: "border-green-500",
      icon: UserCheck,
      iconBg: "bg-green-50",
      navigateUrl: "",
    },
    {
      title: "Available Engineers",
      value: data?.availableEngineers ?? "4",
      textColor: "text-purple-500",
      borderColor: "border-purple-500",
      icon: Users,
      iconBg: "bg-purple-50",
      navigateUrl: "",
    },
  ];

  return (
    <div className="mx-auto max-w-[1390px] self-center rounded-[24px] bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <section className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {stats.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => item.navigateUrl && navigate(item.navigateUrl)}
                className={`group relative flex transform cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-6 transition-all duration-300 hover:scale-[1.02] active:scale-105`}
              >
                <div className="flex flex-col items-start justify-start gap-3">
                  <h3 className="text-lg leading-tight font-medium text-gray-700">
                    {item.title}
                  </h3>
                  <h4
                    className={`text-xl font-medium ${item.textColor} transition-all duration-300 ease-in-out group-hover:scale-105`}
                  >
                    {isLoading ? "..." : item.value}
                  </h4>
                </div>
                <div
                  className={`rounded-xl p-3 ${item.iconBg} ${item.borderColor} border-2 transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className={`h-6 w-6 ${item.textColor}`} />
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default DashBoardPage;
