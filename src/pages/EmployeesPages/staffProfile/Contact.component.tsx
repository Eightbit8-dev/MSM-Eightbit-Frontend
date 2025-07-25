import ButtonSm from "@/components/common/Buttons";
import Input from "@/components/common/Input";
import type { FormState } from "@/types/appTypes";
import type { EmployeeContactProfile } from "@/types/employeeApiTypes";
import isEqual from "lodash.isequal";
import React, { useEffect, useState } from "react";
import StaffProfileSkeleton from "../PageSkeleton";
import {
  useCreateEmployeeContactProfile,
  useFetchEmployeeContactProfile,
  useUpdateEmployeeContactProfile,
} from "@/queries/employeeQueries/employeeContactQuery";
import { useNavigate } from "react-router-dom";
import TextArea from "@/components/common/Textarea";

interface StaffProfileContactProps {
  formState: FormState;
  staffId: string;
}

const StaffProfileContact: React.FC<StaffProfileContactProps> = ({
  formState,
  staffId,
}) => {
  //this is a local form state which doesnt affect the url

  const dummyContactData: EmployeeContactProfile = {
    id: 0,
    email: "",
    presentAddress: "",
    permanentAddress: "",
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
  const {
    data: contactData,
    isLoading: isContactDataLoading,
    error: isContactDataError,
  } = useFetchEmployeeContactProfile(staffId!); //Wont run if the staffId is new which means this is a create state

  useEffect(() => {
    console.log(contactData);
  }, [contactData]);

  useEffect(() => {
    if (formState === "create") {
      setOriginalData({} as EmployeeContactProfile);
      setDataCopy(dummyContactData);
      return;
    }
    if (contactData) {
      const cloned = JSON.parse(JSON.stringify(contactData));
      setOriginalData(cloned);
      setDataCopy(cloned);
    }
  }, [contactData]);

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

  if (isContactDataLoading) return <StaffProfileSkeleton />;
  if (isContactDataError) return <p>Error fetching employee data</p>;
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
              text="Create Contact"
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
          minLength={4}
          maxLength={26}
          required
          disabled={formState === "display"}
          title="Email"
          name="email"
          placeholder="Eg: m@example.com"
          inputValue={dataCopy?.email || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, email: value })}
        />

        <Input
          required
          minLength={3}
          maxLength={30}
          placeholder="Community"
          disabled={formState === "display"}
          title="Community"
          inputValue={dataCopy?.community || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, community: value })}
        />
        <Input
          minLength={3}
          maxLength={30}
          required
          placeholder="Caste"
          disabled={formState === "display"}
          title="Caste"
          inputValue={dataCopy?.caste || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, caste: value })}
        />
        <Input
          minLength={3}
          maxLength={30}
          required
          placeholder="Relegion"
          disabled={formState === "display"}
          title="Relegion"
          inputValue={dataCopy?.religion || ""}
          onChange={(value) => setDataCopy({ ...dataCopy, religion: value })}
        />

        <TextArea
          required
          minLength={4}
          maxLength={50}
          placeholder="Enter Present Address"
          disabled={formState === "display"}
          title="Present Address "
          inputValue={dataCopy?.presentAddress || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, presentAddress: value })
          }
        />
        <TextArea
          required
          minLength={4}
          maxLength={50}
          placeholder="Enter Permanent Address"
          disabled={formState === "display"}
          title="Permanent Address "
          inputValue={dataCopy?.permanentAddress || ""}
          onChange={(value) =>
            setDataCopy({ ...dataCopy, permanentAddress: value })
          }
        />
      </section>
    </form>
  );
};

export default StaffProfileContact;
