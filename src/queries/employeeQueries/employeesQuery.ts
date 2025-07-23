// queries/employees/useFetchEmployeePrimaryProfile.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import type { EmployeeListResponse } from "../../types/employeeApiTypes";
import { apiRoutes } from "../../routes/apiRoutes";

import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import axios from "axios";

export const useFetchEmployeesPaginated = (
  page = 0,
  limit = 10,
  search = "",
) => {
  const fetchEmployees = async (): Promise<EmployeeListResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.employeeProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
          search,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch employees");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Something went wrong while fetching employees");
      }
      throw new Error("Employees fetch failed");
    }
  };

  return useQuery({
    queryKey: ["Employees", page, limit, search],
    queryFn: fetchEmployees,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ---------------- Delete emp -------------------
export const useDeleteEmployeeProfile = () => {
  const queryClient = useQueryClient();

  const deleteEmployee = async (employeeCode: string): Promise<void> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.delete(apiRoutes.employeePrimary, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          employeeCode,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to delete employee");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Deletion failed");
      } else {
        toast.error("Something went wrong while deleting the employee");
      }
      throw new Error("Delete employee failed");
    }
  };

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast.success("Employee  deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Employees"] });
    },
  });
};
