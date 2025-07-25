import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";
import { apiRoutes } from "../../routes/apiRoutes";
import type { EmployeeRejoin } from "../../types/employeeApiTypes";

export const useCreateEmployeeRejoin = () => {
  const createRejoin = async (payload: EmployeeRejoin) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const response = await axiosInstance.post(apiRoutes.employeeRejoin, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Employee rejoin record created");
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Create failed";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return useMutation({ mutationFn: createRejoin });
};

export const useGetEmployeeRejoin = (employeeCode: string) => {
  return useQuery({
    queryKey: ["rejoin", employeeCode],
    queryFn: async () => {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.get(apiRoutes.employeeRejoin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { employeeCode },
      });

      return response.data;
    },
    enabled: !!employeeCode && employeeCode !== "new",
    staleTime: 60 * 1000,
    retry: 1,
  });
};
