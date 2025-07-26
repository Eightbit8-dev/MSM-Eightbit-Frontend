import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";
import { apiRoutes } from "../../routes/apiRoutes";
import type { employeeTransfer } from "../../types/employeeApiTypes";

// 🔁 CREATE employee transfer
export const useCreateEmployeeTransfer = () => {
  const createTransfer = async (payload: employeeTransfer) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const response = await axiosInstance.post(apiRoutes.employeeTransfer, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Employee transferred successfully");
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Create failed";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return useMutation({ mutationFn: createTransfer });
};

// 🔍 GET all employee transfer records
export const useGetEmployeeRejoin = () => {
  return useQuery({
    queryKey: ["employee-transfer"],
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

// 🔍 GET specific employee's branch
export const useGetEmployeeBranch = (Code: string) => {
  return useQuery({
    queryKey: ["employee-branch", Code],
    queryFn: async () => {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.get(apiRoutes.employeeTransferBranch, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          employeeCode:Code,
        },
      });

      return response.data;
    },
    enabled: !!Code, // only run when code is provided
  });
};

// 🔍 GET specific employee's branch
export const useEmployeeSearch = (Code: string,prefix:string) => {
  return useQuery({
    queryKey: ["employee-search", Code],
    queryFn: async () => {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.get(`${apiRoutes.employeeSearch}/code?prefix=${prefix}&page=0&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return response.data;
    },
    enabled: !!Code, // only run when code is provided
  });
};



