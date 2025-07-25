import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import type { EmployeePrimaryProfile } from "../../types/employeeApiTypes";
import axiosInstance from "../../utils/axios";
import { apiRoutes } from "../../routes/apiRoutes";
import { toast } from "react-toastify";
import { convertToBackendDate } from "@/utils/commonUtils";

// ------------------ Create ------------------

export const useCreateEmployeePrimaryProfile = () => {
  const queryClient = useQueryClient();
  const createProfile = async (payload: EmployeePrimaryProfile) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const cleanedPayload = {
        code: payload.code,
        name: payload.name,
        doj: convertToBackendDate(payload.doj),
        branchId: payload.branch[0],
        departmentId: payload.department[0],
        designationId: payload.designation[0],
        shiftId: payload.shift[0],
        gender: payload.gender,
        dob: convertToBackendDate(payload.dob),
        age: payload.age,
        confirmationDate: convertToBackendDate(payload.confirmationDate),
        maritalStatus: payload.maritalStatus,
        status: payload.status,
        guardianName: payload.guardianName,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        location: payload.location,
        city: payload.city,
        biometricNo: payload.biometricNo,
        salaryType: payload.salaryType,
        aadharNo: payload.aadharNo,
        mobile1: payload.mobile1,
        mobileOfficial: payload.mobileOfficial,
        bloodGroupId: payload.bloodGroup[0],
      };

      const response = await axiosInstance.post(
        apiRoutes.employeePrimary,
        cleanedPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Employee profile Created");
      if (response.status === 201 || response.status === 200)
        queryClient.invalidateQueries({ queryKey: ["Employees"] });
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
    enabled: !!employeeCode && employeeCode !== "new",
    staleTime: 60 * 1000,
    retry: 1,
  });
};

// ------------Update ----------------
export const useUpdateEmployeePrimaryProfile = () => {
  const queryClient = useQueryClient();
  const updateProfile = async ({
    employeeCode,
    payload,
  }: {
    employeeCode: string;
    payload: EmployeePrimaryProfile;
  }) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      // ------------Cleaning this because backend expects only id not dropDown optinos and dd:mm:yyyyy date format but html5 uses other
      const cleanedPayload = {
        ...payload,
        code: payload.code,
        doj: convertToBackendDate(payload.doj),
        dob: convertToBackendDate(payload.dob),
        confirmationDate: convertToBackendDate(payload.confirmationDate),
        branchId: payload.branch[0],
        departmentId: payload.department[0],
        designationId: payload.designation[0],
        shiftId: payload.shift[0],
        bloodGroupId: payload.bloodGroup[0],
      };

      const response = await axiosInstance.put(
        apiRoutes.employeePrimary,
        cleanedPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { employeeCode },
        },
      );

      toast.success("Employee profile updated successfully");
      if (response.status === 201 || response.status === 200)
        queryClient.invalidateQueries({
          queryKey: ["employeePrimaryProfile", employeeCode],
        });
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Update failed";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return useMutation({ mutationFn: updateProfile });
};
