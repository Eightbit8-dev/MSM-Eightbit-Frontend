import React from "react";
import TabButton, { DummyTabButton } from "../../components/common/TabButton";
import Input from "../../components/common/Input";
import ButtonSm from "../../components/common/Buttons";
import PageHeader from "../../components/masterPage.components/PageHeader";
import type { FormState } from "../../types/appTypes";
import { useFetchEmployeePrimaryProfile } from "../../queries/employeeQueries/useFetchEmployeePrimary";
import { useParams } from "react-router-dom";

const StaffProfile: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [formState, setFormState] = React.useState<FormState>("display");

  const { data, isLoading, error } = useFetchEmployeePrimaryProfile(staffId!);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching employee data</p>;

  return (
    <main className="staff-profile-container mx-auto flex w-full max-w-[1390px] flex-col gap-0">
      <div className="my-4 flex flex-col items-start justify-between gap-6 rounded-xl bg-white p-3">
        <section className="flex flex-col items-start justify-start">
          <PageHeader title="Employee Profile" />
          <p className="w-max text-base font-medium text-slate-500">
            Manage your employees details
          </p>
        </section>

        <section className="flex w-full flex-row items-center justify-between gap-4">
          <div className="profile-details flex flex-row items-center gap-2">
            <img src="/images/profile.png" alt="profile" />
            <div className="dets flex flex-col gap-0">
              <h4 className="text-lg leading-tight font-medium text-slate-800">
                {data?.name}
              </h4>
              <p className="text-base leading-tight font-normal text-slate-500">
                {data?.designation?.[1] || "Designation"}
              </p>
            </div>
          </div>
          <div className="section flex flex-row gap-2">
            {formState === "display" && (
              <ButtonSm
                state="default"
                text="Edit Details"
                onClick={() => setFormState("edit")}
                className="text-md py-3 text-white"
              />
            )}
            {formState === "edit" && (
              <>
                <ButtonSm
                  state="default"
                  onClick={() => {
                    setFormState("display");
                  }}
                  className="text-md bg-red-100 py-3 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                  text="Discard changes"
                />
                <ButtonSm
                  state="default"
                  text="Save Changes"
                  onClick={() => setFormState("edit")}
                  className="text-md py-3 text-white"
                />
              </>
            )}

            {formState === "display" && (
              <>
                <ButtonSm
                  state="default"
                  onClick={() => {}}
                  className="text-md bg-red-100 py-3 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                  text="Delete Employee"
                />
                <ButtonSm
                  state="outline"
                  text="• • •"
                  className="text-md bg-white py-3"
                />
              </>
            )}
          </div>
        </section>
      </div>

      <header className="tabs flex flex-row items-center gap-6">
        <TabButton
          labelText="Primary"
          isActive={activeIndex === 0}
          onClick={() => {
            setActiveIndex(0);
          }}
        />
        <TabButton
          labelText="Contact"
          isActive={activeIndex === 1}
          onClick={() => {
            setActiveIndex(1);
          }}
          
        />
                <TabButton
          labelText="Personal"
          isActive={activeIndex === 2}
          onClick={() => {
            setActiveIndex(2);
          }}
          
        />
      </header>
      <section className="tabs flex flex-row items-center gap-6">
        <DummyTabButton
          labelText="Primary"
          isActive={activeIndex === 0}
          onClick={() => {
            setActiveIndex(0);
          }}
        />
        <DummyTabButton
          labelText="Contact"
          isActive={activeIndex === 1}
          onClick={() => {
            setActiveIndex(1);
          }}
        />
                <DummyTabButton
          labelText="personal"
          isActive={activeIndex === 2}
          onClick={() => {
            setActiveIndex(2);
          }}
        />
      </section>

      <div className="z-99 mt-[-34px] flex w-full flex-col gap-4 rounded-xl bg-white px-6 py-4 shadow-sm">
        <section className="details grid grid-cols-3 gap-4 text-base font-medium">
          <Input
            viewMode
            title="Employee Code"
            inputValue={data?.code || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Name"
            inputValue={data?.name || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="DOJ"
            inputValue={data?.doj || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Branch"
            inputValue={data?.branch?.[1] || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Department"
            inputValue={data?.department?.[1] || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Designation"
            inputValue={data?.designation?.[1] || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Shift"
            inputValue={data?.shift?.[1] || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Gender"
            inputValue={data?.gender || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="DOB"
            inputValue={data?.dob || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Age"
            inputValue={String(data?.age || "")}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Confirmation Date"
            inputValue={data?.confirmationDate || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Marital Status"
            inputValue={data?.maritalStatus || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Status"
            inputValue={data?.status || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Father/Guardian Name"
            inputValue={data?.guardianName || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Address Line 1"
            inputValue={data?.addressLine1 || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Address Line 2"
            inputValue={data?.addressLine2 || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Location"
            inputValue={data?.location || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="City"
            inputValue={data?.city || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Biometric No"
            inputValue={data?.biometricNo || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Salary Type"
            inputValue={data?.salaryType || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Aadhar No"
            inputValue={data?.aadharNo || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Mobile (Personal)"
            inputValue={data?.mobile1 || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Mobile (Official)"
            inputValue={data?.mobileOfficial || ""}
            onChange={() => {}}
          />
          <Input
            viewMode
            title="Blood Group"
            inputValue={data?.bloodGroup?.[1] || ""}
            onChange={() => {}}
          />
        </section>
      </div>
    </main>
  );
};

export default StaffProfile;
