import React, { useEffect, useState } from "react";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/Textarea";
import ButtonSm from "@/components/common/Buttons";
import type { FormState } from "@/types/appTypes";
import type { EmployeeExperience } from "@/types/employeeApiTypes";

interface StaffProfileExperienceProps {
  formState: FormState;
  staffId: string;
}

const defaultExperienceEntry: EmployeeExperience = {
  id: Date.now(),
  organization: "",
  designation: "",
  numberOfYears: 0,
  place: "",
  additionalNotes: "",
};

const StaffProfileExperience: React.FC<StaffProfileExperienceProps> = ({
  formState,
  staffId,
}) => {
  const [experienceData, setExperienceData] = useState<EmployeeExperience[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Simulated dummy data
  useEffect(() => {
    setTimeout(() => {
      try {
        setExperienceData([
          {
            id: 1,
            organization: "Tech Solutions Pvt Ltd",
            designation: "Software Developer",
            numberOfYears: 2.5,
            place: "Bangalore",
            additionalNotes: "Worked on Java Spring Boot and Microservices",
          },
        ]);
        setIsLoading(false);
      } catch {
        setIsError(true);
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const [experienceList, setExperienceList] = useState<EmployeeExperience[]>(
    [],
  );

  useEffect(() => {
    if (experienceData?.length) {
      setExperienceList(JSON.parse(JSON.stringify(experienceData)));
    }
  }, [experienceData]);

  const updateEntry = (index: number, updated: Partial<EmployeeExperience>) => {
    setExperienceList((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, ...updated } : entry)),
    );
  };

  const removeEntry = (index: number) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) return <p>Loading experience data...</p>;
  if (isError) return <p>Error fetching experience data</p>;

  return (
    <form>
      <div className="mx-[-8px] flex flex-col gap-6">
        {experienceList.map((exp, i) => (
          <div
            key={exp.id ?? i}
            className="flex flex-row gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
          >
            <Input
              required
              title="Organization"
              disabled={formState === "display"}
              inputValue={exp.organization}
              onChange={(val) => updateEntry(i, { organization: val })}
            />
            <Input
              required
              title="Designation"
              disabled={formState === "display"}
              inputValue={exp.designation}
              onChange={(val) => updateEntry(i, { designation: val })}
            />
            <Input
              required
              title="Years of Experience"
              type="num"
              disabled={formState === "display"}
              inputValue={String(exp.numberOfYears)}
              onChange={(val) =>
                updateEntry(i, { numberOfYears: parseFloat(val) })
              }
            />
            <Input
              required
              title="Location / Place"
              disabled={formState === "display"}
              inputValue={exp.place}
              onChange={(val) => updateEntry(i, { place: val })}
            />

            {formState !== "display" && (
              <ButtonSm
                state="default"
                text=""
                imgUrl="/icons/delete-icon.svg"
                className="my-0.5 aspect-square h-[80%] self-end bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300"
                onClick={() => removeEntry(i)}
              />
            )}
          </div>
        ))}

        {formState !== "display" && (
          <ButtonSm
            state="default"
            text="Add Experience"
            className="self-start bg-blue-600 text-white"
            onClick={() =>
              setExperienceList((prev) => [
                ...prev,
                { ...defaultExperienceEntry, id: Date.now() },
              ])
            }
          />
        )}
      </div>
    </form>
  );
};

export default StaffProfileExperience;
