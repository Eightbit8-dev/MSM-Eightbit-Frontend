import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import type { EmployeeListResponse } from "../../types/employeeApiTypes";
import axiosInstance from "../../utils/axios";
import { apiRoutes } from "../../routes/apiRoutes";
import { toast } from "react-toastify";

// ------------------ Query Hook ------------------

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
    staleTime: 60 * 1000,
    retry: 1,
  });
};
