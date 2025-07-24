import ButtonSm from "@/components/common/Buttons";
import Input from "@/components/common/Input";
import type { FormState } from "@/types/appTypes";
import type {
  Employee,
  EmployeeContactProfile,
} from "@/types/employeeApiTypes";
import isEqual from "lodash.isequal";
import React, { useEffect, useState } from "react";
import StaffProfileSkeleton from "../PageSkeleton";
import {
  useCreateEmployeeContactProfile,
  useFetchEmployeeContactProfile,
  useUpdateEmployeeContactProfile,
} from "@/queries/employeeQueries/employeeContactQuery";
import { useNavigate } from "react-router-dom";

interface StaffProfileContactProps {
  formState: FormState;
  staffId: string;
  setStaffData: React.Dispatch<React.SetStateAction<Employee>>;
}

const StaffProfileContact: React.FC<StaffProfileContactProps> = ({
  formState,
  staffId,
  setStaffData,
}) => {
  const dummyContactData: EmployeeContactProfile = {
    id: 0,
  presentAddress: "",
  permanentAddress: "",
  email: "",
  community: "",
  caste: "",
  religion: "",
  };

  const navigate = useNavigate();
  const [dataCopy, setDataCopy] =
    useState<EmployeeContactProfile>(dummyContactData);
  const [originalData, setOriginalData] =
    useState<EmployeeContactProfile>(dummyContactData);

  //   ----------Main apis needed in this page ----------
  const { data, isLoading, error } = useFetchEmployeeContactProfile(staffId!); //Wont run if the staffId is new which means this is a create state

  useEffect(() => {
    if (formState === "create") {
      setOriginalData({} as EmployeeContactProfile);
      setDataCopy(dummyContactData);
      return;
    }
    if (data) {
      // setStaffData(data); // Removed because 'data' is EmployeeContactProfile, not Employee
      const cloned = JSON.parse(JSON.stringify(data));
      setOriginalData(cloned);
      setDataCopy(cloned);
    }
  }, [data]);



  const {
    mutate: updateProfile,
    isPending: updatePending,
    isSuccess: updateSuccess,
  } = useUpdateEmployeeContactProfile();

  const {
    mutate: createProfile,
    isPending: createPending,
    isSuccess: createSuccess,
  } = useCreateEmployeeContactProfile();

  const hanldeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState === "create") {
      createProfile({ employeeCode: staffId, payload: dataCopy });
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
              disabled={isEqual(dummyContactData, dataCopy)}
              onClick={() =>
                setDataCopy(JSON.parse(JSON.stringify(dummyContactData)))
              } // Reset to original
              className={`text-md bg-red-100 py-3 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500 disabled:hidden disabled:cursor-not-allowed`}
              text="Discard"
            />

            <ButtonSm
              type="submit"
              disabled={isEqual(dummyContactData, dataCopy) || createPending}
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
          minLength={5}
          type="str"
          maxLength={25}
          disabled={formState === "display"}
          title="Employee Code"
          placeholder="Enter employee code"
          inputValue={dataCopy?.presentAddress || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, presentAddress: value })}
        />
        <Input
          minLength={4}
          maxLength={26}
          required
          disabled={formState === "display"}
          title="Name"
          placeholder="Enter employee name"
          inputValue={dataCopy?.permanentAddress || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, permanentAddress: value })}
        />
      

      
        <Input
          required
          minLength={4}
          maxLength={26}
          placeholder="Enter Father/Guardian name"
          disabled={formState === "display"}
          title="Father/Guardian "
          inputValue={dataCopy?.email || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, email: value })
          }
        />
        <Input
          required
          minLength={3}
          maxLength={30}
          placeholder="Eg: 123 A, 4th Floor, XYZ Building"
          disabled={formState === "display"}
          title="Address Line 1"
          inputValue={dataCopy?.community || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, community: value })
          }
        />
        <Input
          required
          minLength={3}
          maxLength={30}
          placeholder="Eg: Area"
          disabled={formState === "display"}
          title="Address Line 2"
          inputValue={dataCopy?.caste || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, caste: value })
          }
        />
        <Input
          minLength={3}
          maxLength={30}
          required
          placeholder="Eg: Street"
          disabled={formState === "display"}
          title="Location"
          inputValue={dataCopy?.religion || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, religion: value })}
        />
       
      </section>
    </form>
  );
};

export default StaffProfileContact;
