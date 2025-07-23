import React, { useState } from "react";
import TabButton, {
  DummyTabButton,
} from "../../../components/common/TabButton";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import { useParams, useSearchParams } from "react-router-dom";
import type { FormState } from "@/types/appTypes";
import StaffProfilePrimary from "./StaffProfilePrimary.component";

const StaffProfile: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [searchParams] = useSearchParams();
  const formState = searchParams.get("state") as FormState;
  const [activeIndex, setActiveIndex] = useState(0);

  //--------- tab index switcher ---------
  let content;
  switch (activeIndex) {
    case 0:
      content = (
        <StaffProfilePrimary formState={formState} staffId={staffId!} />
      );
      break;
    case 1:
      content = <h1>Not implemented</h1>;
      break;
    default:
      content = <h1>Something went wrong</h1>;
      break;
  }

  return (
    <main className="staff-profile-container mx-auto flex w-full max-w-[1390px] flex-col gap-0">
      <div className="my-4 flex flex-col items-start justify-between gap-6 rounded-xl bg-white p-3">
        <section className="flex flex-col items-start justify-start">
          <PageHeader title="Employee Profile" />
          <p className="w-max text-base font-medium text-slate-500">
            Manage your employees details
          </p>
        </section>

        {formState !== "create" && (
          <section className="flex w-full flex-row items-center justify-between gap-4">
            <div className="profile-details flex flex-row items-center gap-2">
              <img
                className="h-12 w-12 rounded-full"
                src="/images/profile.jpg"
                alt="profile"
              />
              <div className="dets flex flex-col gap-0">
                <h4 className="text-lg leading-tight font-medium text-slate-800">
                  "Employee Name"
                </h4>
                <p className="ml-1 text-base leading-tight font-normal text-slate-500">
                  {"Designation"}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      <header className="tabs flex flex-row items-center gap-6">
        <TabButton
          labelText="Primary"
          isActive={activeIndex === 0}
          onClick={() => setActiveIndex(0)}
        />
        <TabButton
          labelText="Contact"
          isActive={activeIndex === 1}
          onClick={() => setActiveIndex(1)}
        />
        <TabButton
          labelText="Personal"
          isActive={activeIndex === 2}
          onClick={() => setActiveIndex(2)}
        />
      </header>

      <section className="tabs flex flex-row items-center gap-6">
        <DummyTabButton
          labelText="Primary"
          isActive={activeIndex === 0}
          onClick={() => setActiveIndex(0)}
        />
        <DummyTabButton
          labelText="Contact"
          isActive={activeIndex === 1}
          onClick={() => setActiveIndex(1)}
        />
        <DummyTabButton
          labelText="Personal"
          isActive={activeIndex === 2}
          onClick={() => setActiveIndex(2)}
        />
      </section>

      <div className="relative z-99 mt-[-34px] flex w-full flex-col gap-4 rounded-xl border-2 border-blue-500/30 bg-white px-6 py-4 shadow-sm">
        {content}
      </div>
    </main>
  );
};

export default StaffProfile;
