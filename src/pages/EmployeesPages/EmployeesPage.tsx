import { useNavigate } from "react-router-dom";
import ConfigCard from "../../components/common/ConfigCard";
import { appRoutes } from "../../routes/appRoutes";
import ServicesSearchBar from "../../components/common/ServicesSearchBar";
import MetricCard from "../../components/common/MetricCard";

export interface ConfigCardtype {
  img: string;
  title: string;
  desc: string;
  label: string;
  labelColor: string;
  btnText: string;
  onAction: () => void;
}

export const MasterPage = () => {
  const navigate = useNavigate();

  const configCards: ConfigCardtype[] = [
    {
      img: "/icons/Configpage/staff-profile.png",
      title: "Staff Profile",
      desc: "Manage different office branches to streamline your organizational structure.",
      label: "HR Essentials",
      labelColor: "bg-yellow-500",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.employeesRoute.children.staffsProfile),
    },
    {
      img: "/icons/Configpage/staff-rejoin.png",
      title: "Staff Rejoin",
      desc: "Create and manage job titles to clarify employee roles and hierarchy.",
      label: "HR Essentials",
      labelColor: "bg-yellow-500",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.employeesRoute.children.staffRejoin),
    },
    {
      img: "/icons/Configpage/Resigination.png",
      title: "Resigination",
      desc: "Track and manage employee resignations efficiently with proper records.",
      label: "HR Essentials",
      labelColor: "bg-yellow-500",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.employeesRoute.children.resignation),
    },
    {
      img: "/icons/Configpage/branch-transfer.png",
      title: "Branch Transfer",
      desc: "Define departments to better organize teams and responsibilities.",
      label: "Organisation",
      labelColor: "bg-red-500",
      btnText: "Configure",
      onAction: () =>
        navigate(appRoutes.employeesRoute.children.branchTransfer),
    },
  ];
  return (
    <main className="mx-auto flex w-full max-w-[1390px] origin-top scale-90 flex-col gap-8">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-xl font-semibold text-slate-800">
            Employees Configuration
          </p>
          <p className="text-base font-medium text-slate-500">
            Configure your app and connect the tool your app will need
          </p>
        </div>
        <ServicesSearchBar />
      </header>
      <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          title="Total Employees"
          metric="1200"
          subMetric="+50 %"
          borderColor="border-[#2FE16C]"
          bgColor="bg-[#2FE16C]/10"
          icon="/icons/metricIcons/employees.svg"
          isUptrend
        />
        <MetricCard
          title="Resigned Employees"
          metric="1200"
          subMetric="+50 %"
          borderColor="border-[#FF0000]"
          bgColor="bg-[#FF0000]/10"
          icon="/icons/metricIcons/resign.svg"
        />
        <MetricCard
          title="On leave"
          metric="25"
          subMetric="+5 %"
          borderColor="border-[#9747FF]"
          bgColor="bg-[#9747FF]/10"
          icon="/icons/metricIcons/holiday.svg"
        />
      </section>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {configCards.map((card, index) => (
          <ConfigCard
            key={index}
            img={card.img}
            title={card.title}
            desc={card.desc}
            label={card.label}
            labelColor={card.labelColor}
            btnText={card.btnText}
            onAction={card.onAction}
          />
        ))}
      </section>
    </main>
  );
};

export default MasterPage;
