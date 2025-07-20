// queries/employees/useFetchEmployeePrimaryProfile.ts
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import type { EmployeePrimaryProfile } from "../../types/employeeApiTypes";
import { apiRoutes } from "../../routes/apiRoutes";

import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import axios from "axios";

export const useFetchEmployeePrimaryProfile = (employeeCode: string) => {
  const fetchEmployeeProfile = async (): Promise<EmployeePrimaryProfile> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const res = await axiosInstance.get(
        `${apiRoutes.employeePrimary}?employeeCode=${employeeCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status !== 200) {
        throw new Error("Failed to fetch employee primary profile");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error fetching profile");
      } else {
        toast.error("Something went wrong while fetching profile");
      }
      throw new Error("Employee profile fetch failed");
    }
  };

  return useQuery({
    queryKey: ["employeePrimaryProfile", employeeCode],
    queryFn: fetchEmployeeProfile,
    enabled: !!employeeCode,
    staleTime: 60 * 1000,
    retry: 1,
  });
};
