import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";
import { apiRoutes } from "../../routes/apiRoutes";
import type { employeeTransfer } from "../../types/employeeApiTypes";

export const useCreateEmployeeTransfer = () => {
  const createRejoin = async (payload: employeeTransfer) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const response = await axiosInstance.post(apiRoutes.employeeTransfer, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Employee Transferd");
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Create failed";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return useMutation({ mutationFn: createRejoin });
};

export const useGetEmployeeRejoin = () => {
  return useQuery({
    queryKey: ["employee-Transfer"],
    queryFn: async () => {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.get(apiRoutes.employeeTransfer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
};