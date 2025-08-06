import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axios";
import { apiRoutes } from "@/routes/apiRoutes";

interface ReportParams {
  clientName?: string;
  model?: string;
  serviceDate?: string;
  technician?: string;
  complaint?: string;
  status?: string;
}

export const useGenerateReportPDF = () => {
  const queryClient = useQueryClient();

  const generatePDF = async (params: ReportParams) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.customerWise, {
        params, // ⬅️ will include only non-undefined fields
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // important to download PDF
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to generate report");
      }

      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank"); // Open PDF in new tab

      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to generate report",
        );
      } else {
        toast.error("Something went wrong while generating the report");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: generatePDF,
    onSuccess: () => {
      toast.success("PDF Report Generated");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
