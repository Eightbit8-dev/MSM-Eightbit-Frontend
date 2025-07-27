import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import type { SpareDetails } from "../../../types/masterApiTypes";
import {  motion } from "framer-motion";
import isEqual from "lodash.isequal";
import {
  useCreateSpare,
  useEditSpare,
} from "../../../queries/masterQueries/SpareQuery";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SpareEdit = ({
  spareDetails,
  formState,
  setFormState,
}: {
  spareDetails: SpareDetails | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}) => {
  const [spareData, setSpareData] = useState<SpareDetails | null>(null);
  const [newSpareData, setNewSpareData] = useState<SpareDetails | null>(null);

  const { mutate: createSpare, isPending, isSuccess } = useCreateSpare();
  const {
    mutate: updateSpare,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditSpare();

  const emptySpare: SpareDetails = {
    id: 0,
    spareName: "",
    partNumber: "",
  };

  // Setup initial data
  useEffect(() => {
    if (spareDetails) {
      setSpareData(spareDetails);
      setNewSpareData(spareDetails);
    }
  }, [spareDetails]);

  // Reset after successful create
  useEffect(() => {
    if (isSuccess && formState === "create") {
      setNewSpareData(emptySpare);
      setSpareData(null);
      setFormState("create");
    }
  }, [isSuccess]);

  // Reset after successful update
  useEffect(() => {
    if (isUpdatingSuccess && formState === "edit") {
      setNewSpareData(emptySpare);
      setSpareData(null);
      setFormState("create");
    }
  }, [isUpdatingSuccess]);

  if (!newSpareData && formState !== "create") {
    return (
      <p className="text-md my-1 self-center-safe text-center text-gray-600">
        Select a spare to view its details.
      </p>
    );
  }

  // Check if the form is dirty (modified)
  const isDirty =
    formState === "create"
      ? !isEqual(newSpareData, emptySpare)
      : !isEqual(newSpareData, spareData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpareData) return;

    console.log("Submitting spare data:", newSpareData);

    if (formState === "create") {
      createSpare(newSpareData);
    } else {
      updateSpare(newSpareData);
    }
  };

const handleCancel = () => {
  if (formState === "edit" && spareData) {
    setNewSpareData(emptySpare);
    setSpareData(null);
    setFormState("create"); // 👈 switch back to create mode
  } else {
    setNewSpareData(emptySpare);
  }
};


  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex max-h-full w-full max-w-[870px] flex-col gap-2"
    >
      <motion.div
        variants={containerVariants}
        className="spare-config-container flex flex-col gap-3 rounded-[20px]"
      >
        <form onSubmit={handleSubmit}>
          <header className="flex w-full flex-row items-center justify-between">
            <h1 className="my-1 text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Create Spare"
                : `${spareData?.spareName ?? "Spare"} Configuration`}
            </h1>

            <section className="ml-auto flex flex-row items-center gap-3">
{(formState === "edit" || isDirty) && (
  <ButtonSm
    className="font-medium"
    text="Cancel"
    state="outline"
    onClick={handleCancel}
  />
)}


              {formState === "create" && (
                <ButtonSm
                  type="submit"
                  className="font-semibold text-white"
                  state="default"
                  text={isPending ? "Creating..." : "Create"}
                  disabled={!isDirty}
                />
              )}

              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-50"
                  text={isUpdatePending ? "Updating..." : "Save Changes"}
                  state="default"
                  type="submit"
                  disabled={!isDirty}
                />
              )}
            </section>
          </header>

          <section className="spare-details-section flex max-h-full w-full flex-col gap-2 overflow-clip px-3">
            <Input
              required
              disabled={formState === "display"}
              title="Spare Name"
              type="str"
              inputValue={newSpareData?.spareName ?? ""}
              name="spareName"
              placeholder="Enter spare name"
              maxLength={50}
              onChange={(value: string) => {
                if (!newSpareData) return;
                setNewSpareData({ ...newSpareData, spareName: value });
              }}
            />

            <Input
              required
              disabled={formState === "display"}
              title="Part Number"
              type="str"
              inputValue={newSpareData?.partNumber ?? ""}
              name="partNumber"
              placeholder="Enter part number"
              maxLength={50}
              onChange={(value: string) => {
                if (!newSpareData) return;
                setNewSpareData({ ...newSpareData, partNumber: value });
              }}
            />
          </section>
        </form>
      </motion.div>
    </motion.main>
  );
};

export default SpareEdit;
