import ButtonSm from "@/components/common/Buttons";
import DropdownSelect from "@/components/common/DropDown";
import Input, { DateInput } from "@/components/common/Input";

import { useFetchBranchOptions } from "@/queries/masterQueries/BranchQuery";
import { useFetchDepartmentOptions } from "@/queries/masterQueries/DepartmentQuery";
import type { FormState } from "@/types/appTypes";
import type {
  Employee,
  EmployeePrimaryProfile,
} from "@/types/employeeApiTypes";
import isEqual from "lodash.isequal";
import React, { useEffect, useState } from "react";
import StaffProfileSkeleton from "../PageSkeleton";
import { useFetchDesignationOptions } from "@/queries/masterQueries/DesiginationQuery";
import { useFetchShiftOptions } from "@/queries/masterQueries/ShiftQuery";

import { useFetchBloodOptions } from "@/queries/masterQueries/BloodQuery";
import {
  useCreateEmployeePrimaryProfile,
  useFetchEmployeePrimaryProfile,
  useUpdateEmployeePrimaryProfile,
} from "@/queries/employeeQueries/employeePrimaryQuery";
import { useNavigate } from "react-router-dom";
import calculateAge, { formatAadhar, get18YearsAgo } from "@/utils/commonUtils";

interface StaffProfilePrimaryProps {
  formState: FormState;
  staffId: string;
  setStaffData: React.Dispatch<React.SetStateAction<Employee>>;
}

const StaffProfilePrimary: React.FC<StaffProfilePrimaryProps> = ({
  formState,
  staffId,
  setStaffData,
}) => {
  const dummyPrimaryData: EmployeePrimaryProfile = {
    id: 0,
    branch: [0, "Select Branch"],
    code: "",
    name: "",
    doj: "",
    designation: [0, "Select Designation"],
    department: [0, "Select Department"],
    shift: [0, "Select Shift"],
    gender: "Select Gender",
    dob: "",
    age: 0,
    confirmationDate: "",
    maritalStatus: "Select Maritial Status",
    status: "Select Status",
    guardianName: "",
    addressLine1: "",
    addressLine2: "",
    location: "",
    city: "",
    biometricNo: "",
    salaryType: "Select Salary Type",
    aadharNo: "",
    mobile1: "",
    mobileOfficial: "",
    bloodGroup: [0, "Select Blood Group"],
  };

  const navigate = useNavigate();
  const [dataCopy, setDataCopy] =
    useState<EmployeePrimaryProfile>(dummyPrimaryData);
  const [originalData, setOriginalData] =
    useState<EmployeePrimaryProfile>(dummyPrimaryData);

  //   ----------Main apis needed in this page ----------
  const { data, isLoading, error } = useFetchEmployeePrimaryProfile(staffId!); //Wont run if the staffId is new which means this is a create state

  useEffect(() => {
    if (formState === "create") {
      setOriginalData({} as EmployeePrimaryProfile);
      setDataCopy(dummyPrimaryData);
      return;
    }
    if (data) {
      setStaffData(data);
      const cloned = JSON.parse(JSON.stringify(data));
      setOriginalData(cloned);
      setDataCopy(cloned);
    }
  }, [data]);

  useEffect(() => {
    if (dataCopy?.dob) {
      const newAge = calculateAge(dataCopy.dob);
      setDataCopy((prev) => ({ ...prev, age: newAge }));
    }
  }, [dataCopy.dob]);

  //   ----------Utility Apis needed in this page -----------
  const { data: departmentOptions } = useFetchDepartmentOptions();
  const { data: branchOptions } = useFetchBranchOptions();
  const { data: designationOptions } = useFetchDesignationOptions();
  const { data: shiftOptions } = useFetchShiftOptions();
  const { data: bloodOptions } = useFetchBloodOptions();

  const {
    mutate: updateProfile,
    isPending: updatePending,
    isSuccess: updateSuccess,
  } = useUpdateEmployeePrimaryProfile();

  const {
    mutate: createProfile,
    isPending: createPending,
    isSuccess: createSuccess,
  } = useCreateEmployeePrimaryProfile();

  const hanldeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState === "create") {
      createProfile(dataCopy);
    } else if (formState === "edit") {
      updateProfile({ employeeCode: staffId, payload: dataCopy });
    }
  };

  useEffect(() => {
    if (createSuccess) {
      navigate(-1);
    }
  }, [createSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      setOriginalData(dataCopy);
    }
  }, [updateSuccess]);

  if (isLoading) return <StaffProfileSkeleton />;
  if (error) return <p>Error fetching employee data</p>;
  return (
    <form onSubmit={hanldeSubmit}>
      <div className="section relative flex flex-row items-center justify-end gap-2">
        {formState === "create" && (
          <>
            <ButtonSm
              state="default"
              disabled={isEqual(dummyPrimaryData, dataCopy)}
              onClick={() =>
                setDataCopy(JSON.parse(JSON.stringify(dummyPrimaryData)))
              } // Reset to original
              className={`text-md bg-red-100 py-3 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500 disabled:hidden disabled:cursor-not-allowed`}
              text="Discard"
            />

            <ButtonSm
              type="submit"
              disabled={isEqual(dummyPrimaryData, dataCopy) || createPending}
              state="default"
              text="Create Employee"
              className="text-md py-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
            />
          </>
        )}
        {formState === "edit" && (
          <>
            <ButtonSm
              state="default"
              disabled={isEqual(originalData, dataCopy)}
              onClick={() =>
                setDataCopy(JSON.parse(JSON.stringify(originalData)))
              } // Reset to original
              className={`text-md bg-red-100 py-3 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500 disabled:hidden disabled:cursor-not-allowed`}
              text="Cancel"
            />

            <ButtonSm
              type="submit"
              disabled={isEqual(originalData, dataCopy) || updatePending}
              state="default"
              text="Save Changes"
              className="text-md py-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
            />
          </>
        )}
      </div>
      <section className="details grid grid-cols-3 gap-4 text-base font-medium">
        <Input
          required
          minLength={3}
          type="str"
          maxLength={10}
          disabled={formState === "display"}
          title="Employee Code"
          placeholder="Enter employee code"
          inputValue={dataCopy?.code || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, code: value })}
        />
        <Input
          minLength={4}
          maxLength={26}
          required
          disabled={formState === "display"}
          title="Name"
          placeholder="Enter employee name"
          inputValue={dataCopy?.name || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, name: value })}
        />
        <DateInput
          required
          disabled={formState === "display"}
          title="DOJ"
          value={dataCopy?.doj || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, doj: value })}
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Branch"
          options={branchOptions ?? []}
          selected={
            branchOptions?.find((opt) => opt.label === dataCopy.branch[1]) ?? {
              id: 0,
              label: "Select Branch",
            }
          }
          onChange={(value) =>
            setDataCopy({ ...dataCopy, branch: [value.id, value.label] })
          }
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Department"
          options={departmentOptions ?? []}
          selected={
            departmentOptions?.find(
              (opt) => opt.label === dataCopy.department[1],
            ) ?? {
              id: 0,
              label: "Select Department",
            }
          }
          onChange={(value) =>
            setDataCopy({ ...dataCopy, department: [value.id, value.label] })
          }
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Designations"
          options={designationOptions ?? []}
          selected={
            designationOptions?.find(
              (opt) => opt.label === dataCopy.designation[1],
            ) ?? {
              id: 0,
              label: "Select Designation",
            }
          }
          onChange={(value) =>
            setDataCopy({ ...dataCopy, designation: [value.id, value.label] })
          }
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Shift"
          options={shiftOptions ?? []}
          selected={
            shiftOptions?.find((opt) => opt.label === dataCopy.shift[1]) ?? {
              id: 0,
              label: "Select Shift",
            }
          }
          onChange={(value) =>
            setDataCopy({ ...dataCopy, shift: [value.id, value.label] })
          }
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Gender"
          options={[
            { id: 1, label: "Male" },
            { id: 2, label: "Female" },
            { id: 3, label: "Transgender" },
            { id: 4, label: "Rather not say" },
          ]}
          selected={{
            id: 404,
            label: dataCopy.gender,
          }}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, gender: value.label })
          }
        />
        <DateInput
          required
          maxDate={get18YearsAgo()}
          disabled={formState === "display"}
          title="DOB"
          value={dataCopy?.dob || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, dob: value })}
        />

        <Input
          placeholder="Enter employee age"
          disabled
          title="Age until today"
          inputValue={String(dataCopy?.age || "")}
          onChange={() => {}}
        />
        <DateInput
          required
          disabled={formState === "display"}
          title="Confirmation Date"
          value={dataCopy?.confirmationDate || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, confirmationDate: value })
          }
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Marital Status"
          options={[
            { id: 1, label: "Single" },
            { id: 2, label: "Married" },
            { id: 3, label: "Rather not say" },
          ]}
          selected={{
            id: 404,
            label: dataCopy.maritalStatus,
          }}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, maritalStatus: value.label })
          }
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Status"
          options={[
            { id: 1, label: "Confirmed" },
            { id: 2, label: "Waiting" },
            { id: 3, label: "Probation" },
          ]}
          selected={{
            id: 404,
            label: dataCopy.status,
          }}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, status: value.label })
          }
        />
        <Input
          required
          minLength={4}
          maxLength={26}
          placeholder="Enter Father/Guardian name"
          disabled={formState === "display"}
          title="Father/Guardian "
          inputValue={dataCopy?.guardianName || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, guardianName: value })
          }
        />
        <Input
          required
          minLength={3}
          maxLength={30}
          placeholder="Eg: 123 A, 4th Floor, XYZ Building"
          disabled={formState === "display"}
          title="Address Line 1"
          inputValue={dataCopy?.addressLine1 || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, addressLine1: value })
          }
        />
        <Input
          required
          minLength={3}
          maxLength={30}
          placeholder="Eg: Area"
          disabled={formState === "display"}
          title="Address Line 2"
          inputValue={dataCopy?.addressLine2 || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, addressLine2: value })
          }
        />
        <Input
          minLength={3}
          maxLength={30}
          required
          placeholder="Eg: Street"
          disabled={formState === "display"}
          title="Location"
          inputValue={dataCopy?.location || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, location: value })}
        />
        <Input
          minLength={3}
          maxLength={30}
          required
          placeholder="Eg: Coimbatore"
          disabled={formState === "display"}
          title="City"
          inputValue={dataCopy?.city || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, city: value })}
        />
        <Input
          required
          minLength={3}
          maxLength={9}
          placeholder="Eg: 123456"
          disabled={formState === "display"}
          title="Biometric No"
          inputValue={dataCopy?.biometricNo || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, biometricNo: value })}
        />
        <DropdownSelect
          required
          disabled={formState === "display"}
          title="Salary Type"
          options={[
            { id: 1, label: "Monthly" },
            { id: 2, label: "Daily" },
            { id: 3, label: "Hourly" },
          ]}
          selected={{
            id: 404,
            label: dataCopy.salaryType,
          }}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, salaryType: value.label })
          }
        />
        <Input
          required
          minLength={14}
          maxLength={14}
          placeholder="Eg: 1234 5678 9012"
          disabled={formState === "display"}
          title="Aadhar No"
          inputValue={formatAadhar(dataCopy?.aadharNo || "")}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, aadharNo: value.replace(/\s/g, "") })
          }
        />
        <Input
          required
          minLength={10}
          maxLength={10}
          placeholder="Enter 10 digit mobile number"
          disabled={formState === "display"}
          title="Mobile (Personal)"
          inputValue={dataCopy?.mobile1 || ""}
          prefixText="+91"
          onChange={(value) => setDataCopy({ ...dataCopy, mobile1: value })}
        />
        <Input
          required
          minLength={10}
          maxLength={10}
          placeholder="Enter 10 digit mobile number"
          disabled={formState === "display"}
          title="Mobile (Official)"
          prefixText="+91"
          inputValue={dataCopy?.mobileOfficial || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, mobileOfficial: value })
          }
        />
        <DropdownSelect
          required
          direction="up"
          disabled={formState === "display"}
          title="Blood group"
          options={bloodOptions ?? []}
          selected={
            bloodOptions?.find(
              (opt) => opt.label === dataCopy.bloodGroup[1],
            ) ?? {
              id: 0,
              label: "Select Blood Group",
            }
          }
          onChange={(value) =>
            setDataCopy({ ...dataCopy, bloodGroup: [value.id, value.label] })
          }
        />
      </section>
    </form>
  );
};

export default StaffProfilePrimary;
