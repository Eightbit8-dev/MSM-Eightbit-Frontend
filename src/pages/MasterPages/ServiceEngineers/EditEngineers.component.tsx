import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import type { ServiceEngineerDetails } from "../../../types/masterApiTypes";
import {
  useCreateServiceEngineer,
  useEditServiceEngineer,
} from "../../../queries/masterQueries/ServiceEngineersQuery";
import TextArea from "../../../components/common/Textarea";
import isEqual from "lodash.isequal";

const emptyServiceEngineer: ServiceEngineerDetails = {
  id: 0,
  engineerName: "",
  engineerMobile: 0,
};
const ServiceEngineerEdit = ({
  serviceEngineerDetails,
  formState,
  setFormState,
  setServiceEngineerData,
}: {
  serviceEngineerDetails: ServiceEngineerDetails | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setServiceEngineerData: React.Dispatch<React.SetStateAction<ServiceEngineerDetails | null>>;
}) => {
  const [newServiceEngineerData, setNewServiceEngineerData] = useState<ServiceEngineerDetails>(emptyServiceEngineer);

  const { mutate: createServiceEngineer, isPending, isSuccess } = useCreateServiceEngineer();
  const {
    mutate: editServiceEngineer,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditServiceEngineer();

  useEffect(() => {
    if (formState === "create") {
      setNewServiceEngineerData(emptyServiceEngineer);
    } else if (serviceEngineerDetails) {
      setNewServiceEngineerData(serviceEngineerDetails); // Ensures ID is preserved
    }
  }, [formState, serviceEngineerDetails]);

  useEffect(() => {
    if (isSuccess || isUpdatingSuccess) {
      setFormState("create");
      setServiceEngineerData(null);
      setNewServiceEngineerData(emptyServiceEngineer);
    }
  }, [isSuccess, isUpdatingSuccess, setFormState, setServiceEngineerData]);

  const handleCancel = () => {
    setFormState("create");
    setServiceEngineerData(null);
    setNewServiceEngineerData(emptyServiceEngineer);
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validate required fields
  if (!newServiceEngineerData.engineerName || !newServiceEngineerData.engineerMobile) {
    console.log("Missing required fields");
    return;
  }

  console.log("Form submitted with state:", formState);
  console.log("Service Engineer data:", newServiceEngineerData);

  if (formState === "create") {
    createServiceEngineer(newServiceEngineerData);
  } else if (formState === "edit") {
    editServiceEngineer(newServiceEngineerData);
  }
};

const hasData =
  newServiceEngineerData.engineerName.trim() !== "" ||
  newServiceEngineerData.engineerMobile !== 0;


  if (!newServiceEngineerData) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a service engineer to view details.
      </p>
    );
  }

  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="loan-config-container flex flex-col gap-3 rounded-[20px] bg-white/80">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <header className="header flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Service Engineer Configuration"
                : `${serviceEngineerDetails?.engineerName || "Service Engineer"} Configuration`}
            </h1>
            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === "edit" ||
                (formState === "create" && hasData)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}
              {formState === "display" && newServiceEngineerData.id !== 0 && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}
              {formState === "create" && (
                <ButtonSm
                  className="font-medium text-white"
                  text={isPending ? "Creating..." : "Create New"}
                  state="default"
                  type="submit"
                  disabled={isPending}
                />
              )}
              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-50"
                  text={isUpdatePending ? "Updating..." : "Save Changes"}
                  state="default"
                  type="submit"
                  disabled={
                    isUpdatePending || isEqual(newServiceEngineerData, serviceEngineerDetails)
                  }
                />
              )}
            </section>
          </header>

          <section className="loan-details-section flex w-full flex-col gap-2 overflow-clip px-3">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
              <Input
                required
                disabled={formState === "display"}
                title="Engineer Name"
                type="str"
                inputValue={newServiceEngineerData.engineerName}
                name="engineerName"
                placeholder="Enter engineer name"
                maxLength={50}
                onChange={(value) =>
                  setNewServiceEngineerData({ ...newServiceEngineerData, engineerName: value })
                }
              />
            </div>

            <Input
              disabled={formState === "display"}
              title="Mobile Number"
              type="num"
  inputValue={
    newServiceEngineerData.engineerMobile === 0
      ? ""
      : newServiceEngineerData.engineerMobile
  }
              name="engineerMobile"
              placeholder="Enter mobile number"
              maxLength={200}
              onChange={(value) =>
                setNewServiceEngineerData({ ...newServiceEngineerData, engineerMobile: value === "" ? 0 : value })
              }
            />
          </section>
        </form>
      </div>
    </main>
  );
};

export default ServiceEngineerEdit;
