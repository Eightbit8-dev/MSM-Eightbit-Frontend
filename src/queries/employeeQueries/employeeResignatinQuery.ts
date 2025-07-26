import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import axiosInstance from "@/utils/axios";
import { apiRoutes } from "@/routes/apiRoutes";
import type { EmployeeResignation } from "@/types/employeeApiTypes"; // You must define this type
import { handleApiError } from "@/utils/handleApiError";

const baseUrl = apiRoutes.employeeResignation;

// ------------------ Create ------------------

export const useCreateEmployeeResignation = () => {
  const queryClient = useQueryClient();
  const createResignation = async (payload: EmployeeResignation) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.post(baseUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Resignation created successfully");
      return response.data;
    } catch (error) {
      handleApiError(error, "Resignation");
    }
  };

  return useMutation({
    mutationFn: createResignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EmployeeResignations"] });
    },
  });
};

// ------------------ Update ------------------

export const useUpdateEmployeeResignation = () => {
  const queryClient = useQueryClient();
  const updateResignation = async ({
    refId,
    payload,
  }: {
    refId: number;
    payload: EmployeeResignation;
  }) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.put(`${baseUrl}/${refId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Resignation updated successfully");
      return response.data;
    } catch (error) {
      handleApiError(error, "Resignation");
    }
  };

  return useMutation({
    mutationFn: updateResignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EmployeeResignations"] });
    },
  });
};

// ------------------ Fetch All ------------------

export const useFetchAllEmployeeResignations = () => {
  const fetchAll = async (): Promise<EmployeeResignation[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      handleApiError(error, "Resignation");
    }
  };

  return useQuery({
    queryKey: ["EmployeeResignations"],
    queryFn: fetchAll,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ------------------ Fetch By ID ------------------

export const useFetchEmployeeResignationById = (refId: number) => {
  const fetchById = async (): Promise<EmployeeResignation> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.get(`${baseUrl}/${refId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      handleApiError(error, "Resignation");
    }
  };

  return useQuery({
    queryKey: ["EmployeeResignations", refId],
    queryFn: fetchById,
    enabled: !!refId,
    staleTime: 60 * 1000,
    retry: 1,
  });
};

// ------------------ Delete ------------------

export const useDeleteEmployeeResignation = () => {
  const queryClient = useQueryClient();

  const deleteResignation = async (refId: number) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axiosInstance.delete(`${baseUrl}/${refId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Resignation deleted");
      return response.data;
    } catch (error) {
      handleApiError(error, "Resignation");
    }
  };

  return useMutation({
    mutationFn: deleteResignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EmployeeResignations"] });
    },
  });
};
