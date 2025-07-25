import React, { useEffect, useState } from "react";
import Input from "@/components/common/Input";
import ButtonSm from "@/components/common/Buttons";
import type { FormState } from "@/types/appTypes";
import type { EmployeeEducationProfile } from "@/types/employeeApiTypes";

interface StaffProfileEducationProps {
  formState: FormState;
  staffId: string;
}

const defaultEducationEntry: EmployeeEducationProfile = {
  id: Date.now(),
  degreeOrDiplomaObtained: "",
  specialization: "",
  institutionOrUniversity: "",
  yearOfPassing: new Date().getFullYear(),
  percentageOfMarks: 0,
  additionalNotes: "",
};

const StaffProfileEducation: React.FC<StaffProfileEducationProps> = ({
  formState,
  staffId,
}) => {
  const [educationData, setEducationData] = useState<
    EmployeeEducationProfile[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 🧪 Simulate API response
  useEffect(() => {
    setTimeout(() => {
      try {
        setEducationData([
          {
            id: 1,
            degreeOrDiplomaObtained: "Bachelor of Engineering",
            specialization: "Computer Science",
            institutionOrUniversity: "ABC University",
            yearOfPassing: 2022,
            percentageOfMarks: 78.5,
            additionalNotes: "Graduated with distinction",
          },
          {
            id: 2,
            degreeOrDiplomaObtained: "Higher Secondary",
            specialization: "Maths Biology",
            institutionOrUniversity: "Govt Hr Sec School",
            yearOfPassing: 2018,
            percentageOfMarks: 91.2,
            additionalNotes: "School Topper",
          },
        ]);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
      }
    }, 500); // Simulate delay
  }, []);

  const [educationList, setEducationList] = useState<
    EmployeeEducationProfile[]
  >([]);

  useEffect(() => {
    if (educationData?.length) {
      setEducationList(JSON.parse(JSON.stringify(educationData)));
    }
  }, [educationData]);

  const updateEntry = (
    index: number,
    updated: Partial<EmployeeEducationProfile>,
  ) => {
    setEducationList((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, ...updated } : entry)),
    );
  };

  const removeEntry = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) return <p>Loading education data...</p>;
  if (isError) return <p>Error fetching education data</p>;

  return (
    <form>
      <div className="mx-[-8px] flex flex-col gap-6">
        {educationList.map((edu, i) => (
          <div
            key={edu.id ?? i}
            className="flex flex-row gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
          >
            <Input
              required
              title="Degree or Diploma"
              disabled={formState === "display"}
              inputValue={edu.degreeOrDiplomaObtained}
              onChange={(val) =>
                updateEntry(i, { degreeOrDiplomaObtained: val })
              }
            />
            <Input
              required
              title="Specialization"
              disabled={formState === "display"}
              inputValue={edu.specialization}
              onChange={(val) => updateEntry(i, { specialization: val })}
            />
            <Input
              required
              title="Institution / University"
              disabled={formState === "display"}
              inputValue={edu.institutionOrUniversity}
              onChange={(val) =>
                updateEntry(i, { institutionOrUniversity: val })
              }
            />
            <Input
              required
              type="num"
              title="Year of Passing"
              disabled={formState === "display"}
              inputValue={String(edu.yearOfPassing)}
              onChange={(val) => updateEntry(i, { yearOfPassing: Number(val) })}
            />
            <Input
              required
              type="num"
              title="Percentage of Marks"
              disabled={formState === "display"}
              inputValue={String(edu.percentageOfMarks)}
              onChange={(val) =>
                updateEntry(i, { percentageOfMarks: parseFloat(val) })
              }
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
            text="Add New Entry"
            className="self-start bg-blue-600 text-white"
            onClick={() =>
              setEducationList((prev) => [...prev, defaultEducationEntry])
            }
          />
        )}
      </div>
    </form>
  );
};

export default StaffProfileEducation;
