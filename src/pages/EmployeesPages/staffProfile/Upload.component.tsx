import React from "react";
import type { FormState } from "@/types/appTypes";

import MultiFileUpload from "@/components/common/FileUploadBox";

interface UploadEmployeeDetailsProps {
  formState: FormState;
  staffId: string;
}

const UploadEmployeeDetails: React.FC<UploadEmployeeDetailsProps> = ({
  formState,
  staffId,
}) => {
  return (
    <form>
      <div className="mx-[-8px] flex flex-col gap-6">{<MultiFileUpload />}</div>
    </form>
  );
};

export default UploadEmployeeDetails;
