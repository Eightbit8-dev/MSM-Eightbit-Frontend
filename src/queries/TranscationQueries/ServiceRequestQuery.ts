import axiosInstance from "../../utils/axios";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { apiRoutes } from "../../routes/apiRoutes";
import type {
  ServiceRequest,
  ServiceRequestResponse,
} from "../../types/transactionTypes";

/**
 * 🔍 Fetch all Service Requests
 */
export const useFetchServiceRequests = (page: number, limit: number) => {
  const fetchAllRequests = async (): Promise<ServiceRequestResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.serviceRequest, {
        params: {
          page: page - 1,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(
          res.data?.message || "Failed to fetch service requests",
        );
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch service requests",
        );
      } else {
        toast.error("Something went wrong while fetching service requests");
      }
      throw error;
    }
  };

  return useQuery({
    queryKey: ["serviceRequest", page, limit],
    queryFn: fetchAllRequests,
    staleTime: 0,
    retry: 1,
  });
};  

/**
 * ➕ Create a new Service Request
 */
export const useCreateServiceRequest = () => {
  const queryClient = useQueryClient();

  const createRequest = async (requestData: ServiceRequest) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.post(
      apiRoutes.serviceRequest,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(res.data?.message || "Failed to create Service Request");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast.success("Service Request created successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create service request",
        );
      }
    },
  });
};

// --- erdit ----
export const useEditServiceRequest = () => {
  const queryClient = useQueryClient();

  const editServiceRequest = async (updatedRequest: ServiceRequest) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const { id, ...payload } = updatedRequest;

      const res = await axiosInstance.put(
        `${apiRoutes.serviceRequest}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status !== 200) {
        throw new Error(
          res.data?.message || "Failed to update Service Request",
        );
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      } else {
        toast.error("Something went wrong while updating the request");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: editServiceRequest,
    onSuccess: () => {
      toast.success("Service Request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["service-request"] });
    },
  });
};
