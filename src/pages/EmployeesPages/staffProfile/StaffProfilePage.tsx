import React, { useState } from "react";
import TabButton, {
  DummyTabButton,
} from "../../../components/common/TabButton";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import { useParams, useSearchParams } from "react-router-dom";
import type { FormState } from "@/types/appTypes";
import StaffProfilePrimary from "./Primary.component";
import type { Employee } from "@/types/employeeApiTypes";
import { StaffProfileSkeleton2, TabButtonSkeleton } from "../PageSkeleton";
import StaffProfileContact from "./Contact.component";
import StaffProfileEducation from "./Education.component";
import UploadEmployeeDetails from "./Upload.component";
import StaffProfileExperience from "./Experience.component";

const StaffProfile: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [searchParams] = useSearchParams();
  const formState = searchParams.get("state") as FormState;
  const [activeIndex, setActiveIndex] = useState(1);
  const [staffData, setStaffData] = useState<Employee>({} as Employee);

  //--------- tab index switcher ---------
  let content;
  switch (activeIndex) {
    case 1:
      content = (
        <StaffProfilePrimary
          formState={formState}
          staffId={staffId!}
          setStaffData={setStaffData}
        />
      );
      break;
    case 2:
      content = (
        <StaffProfileContact formState={formState} staffId={staffId!} />
      );
      break;
    case 3:
      content = <StaffProfileEducation staffId="1" formState={formState} />;
      break;
    case 4:
      content = <StaffProfileExperience staffId="1" formState={formState} />;
      break;

    case 7:
      content = <UploadEmployeeDetails staffId="1" formState={formState} />;
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

        {formState === "display" || formState === "edit" ? (
          staffData.designation ? (
            <section className="flex w-full flex-row items-center justify-between gap-4">
              <div className="profile-details flex flex-row items-center gap-2">
                <img
                  className="h-12 w-12 rounded-full"
                  src="/images/profile.jpg"
                  alt="profile"
                />
                <div className="dets flex flex-col gap-0">
                  <h4 className="text-lg leading-tight font-medium text-slate-800">
                    {staffData.name}
                  </h4>
                  <p className="text-base leading-tight font-normal text-slate-500">
                    {staffData.designation[1]}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            StaffProfileSkeleton2()
          )
        ) : (
          <></>
        )}
      </div>

      {formState === "display" || formState === "edit" ? (
        staffData.designation ? (
          <header className="tabs flex flex-row items-center gap-6">
            <TabButton
              labelText="Primary"
              isActive={activeIndex === 1}
              onClick={() => setActiveIndex(1)}
            />
            <TabButton
              labelText="Contact"
              isActive={activeIndex === 2}
              onClick={() => setActiveIndex(2)}
            />
            <TabButton
              labelText="Qualification"
              isActive={activeIndex === 3}
              onClick={() => setActiveIndex(3)}
            />
            <TabButton
              labelText="Experience"
              isActive={activeIndex === 4}
              onClick={() => setActiveIndex(4)}
            />
            <TabButton
              labelText="Upload"
              isActive={activeIndex === 7}
              onClick={() => setActiveIndex(7)}
            />
          </header>
        ) : (
          <TabButtonSkeleton />
        )
      ) : (
        <></>
      )}

      {formState === "display" || formState === "edit" ? (
        staffData.designation ? (
          <section className="tabs flex flex-row items-center gap-6">
            <DummyTabButton
              labelText="Primary"
              isActive={activeIndex === 1}
              onClick={() => setActiveIndex(1)}
            />
            <DummyTabButton
              labelText="Contact"
              isActive={activeIndex === 2}
              onClick={() => setActiveIndex(2)}
            />
            <DummyTabButton
              labelText="Qualification"
              isActive={activeIndex === 3}
              onClick={() => setActiveIndex(3)}
            />
            <DummyTabButton
              labelText="Experience"
              isActive={activeIndex === 4}
              onClick={() => setActiveIndex(4)}
            />
            <DummyTabButton
              labelText="Upload"
              isActive={activeIndex === 7}
              onClick={() => setActiveIndex(7)}
            />
          </section>
        ) : (
          <TabButtonSkeleton />
        )
      ) : (
        <></>
      )}

      <div className="relative z-99 mt-[-34px] flex w-full flex-col gap-4 rounded-xl bg-slate-50 px-6 py-4 shadow-sm">
        {content}
      </div>
    </main>
  );
};

export default StaffProfile;
