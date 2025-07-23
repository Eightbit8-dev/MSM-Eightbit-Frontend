import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import type { EmployeeContactProfile } from "../../types/employeeApiTypes";
import axiosInstance from "../../utils/axios";
import { apiRoutes } from "../../routes/apiRoutes";
import { toast } from "react-toastify";

// ------------------ Create ------------------

export const useCreateEmployeeContactProfile = () => {
  const createProfile = async (payload: EmployeeContactProfile) => {
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

      const response = await axiosInstance.post(apiRoutes.employeePrimary, cleanedPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Employee profile created");
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

      const res = await axiosInstance.get(
        `${apiRoutes.employeePrimary}?employeeCode=${employeeCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) throw new Error("Failed to fetch employee profile");

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
    enabled: !!employeeCode && employeeCode !== "new",
    staleTime: 60 * 1000,
    retry: 1,
  });
};

// ------------ Update ----------------

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

      const response = await axiosInstance.put(apiRoutes.employeePrimary, cleanedPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { employeeCode },
      });

      toast.success("Employee profile updated");
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Update failed";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return useMutation({ mutationFn: updateProfile });
};
