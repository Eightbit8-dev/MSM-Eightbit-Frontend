import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import axiosInstance from "../../utils/axios";
import { apiRoutes } from "../../routes/apiRoutes";
import type { EmployeeContactProfile } from "../../types/employeeApiTypes";

// ------------------ Create ------------------

export const useCreateEmployeeContactProfile = () => {
  const createProfile = async ({
    employeeCode,
    payload,
  }: {
    employeeCode: string;
    payload: EmployeeContactProfile;
  }) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const cleanedPayload = {
        presentAddress: payload.presentAddress,
        permanentAddress: payload.permanentAddress,
        email: payload.email,
        community: payload.community,
        caste: payload.caste,
        religion: payload.religion,
      };

      const response = await axiosInstance.post(
        apiRoutes.employeeContact,
        cleanedPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            employeeCode: employeeCode,
          },
        }
      );

      toast.success("Employee Contact Profile Created");
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Create failed";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return useMutation({ mutationFn: createProfile });
};

// ------------------ Fetch ------------------

export const useFetchEmployeeContactProfile = (employeeCode: string) => {
  const fetchEmployeeProfile = async (): Promise<EmployeeContactProfile> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const res = await axiosInstance.get(apiRoutes.employeeContact, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          employeeCode,
        },
      });

      if (res.status !== 200) {
        throw new Error("Failed to fetch employee contact profile");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error fetching profile");
      } else {
        toast.error("Something went wrong while fetching profile");
      }
      throw new Error("Employee contact profile fetch failed");
    }
  };

  return useQuery({
    queryKey: ["employeeContactProfile", employeeCode],
    queryFn: fetchEmployeeProfile,
    enabled: !!employeeCode && employeeCode !== "new",
    staleTime: 60 * 1000,
    retry: 1,
  });
};

// ------------------ Update ------------------

export const useUpdateEmployeeContactProfile = () => {
  const updateProfile = async ({
    employeeCode,
    payload,
  }: {
    employeeCode: string;
    payload: EmployeeContactProfile;
  }) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const cleanedPayload = {
        presentAddress: payload.presentAddress,
        permanentAddress: payload.permanentAddress,
        email: payload.email,
        community: payload.community,
        caste: payload.caste,
        religion: payload.religion,
      };

      const response = await axiosInstance.put(
        apiRoutes.employeeContact,
        cleanedPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            employeeCode: employeeCode,
          },
        }
      );

      toast.success("Employee profile updated successfully");
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Update failed";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return useMutation({ mutationFn: updateProfile });
};
