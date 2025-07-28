import axiosInstance from "../../utils/axios";
import axios from "axios";
import type { TransactionDetails } from "../../types/transactionTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";

/**
 * -------------------------------------------
 * Client Service Hooks - CRUD Operations
 * -------------------------------------------
 * This file contains React Query hooks to:
 *  - Fetch all Clients
 *  - Create a new Client
 *  - Edit an existing Client
 *  - Delete a Client
 *
 * Handles authentication, API errors, and notifications
 */

/**
 * 🔍 Fetch all Clients
 */
export const useFetchMachine = () => {
  const fetchAllMachine = async (): Promise<TransactionDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.machineEntry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch machine");
      }

      return res.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch machine"
        );
      } else {
        toast.error("Something went wrong while fetching machine");
      }
      throw new Error("Machine fetch failed");
    }
  };

  return useQuery({
    queryKey: ["machine"],
    queryFn: fetchAllMachine,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

/**
 * ➕ Create a new Machine
 */
export const useCreateMachine = () => {
  const queryClient = useQueryClient();

  const createMachine = async (newMachine: TransactionDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.post(apiRoutes.machineEntry, newMachine, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create Machine");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create Machine"
        );
      } else {
        toast.error("Something went wrong while creating Machine");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createMachine,
    onSuccess: () => {
      toast.success("Machine created successfully");
      queryClient.invalidateQueries({ queryKey: ["Machine"] });
    },
  });
};

/**
 * ✏️ Edit an existing Machine
 */
export const useEditMachine = () => {
  const queryClient = useQueryClient();

  const editMachine = async (updatedMachine: TransactionDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { id: machineId, ...payload } = updatedMachine;

    const res = await axiosInstance.put(
      `${apiRoutes.machineEntry}/${machineId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update Machine");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: editMachine,
    onSuccess: () => {
      toast.success("Machine updated successfully");
      queryClient.invalidateQueries({ queryKey: ["machine"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    },
  });
};

/**
 * ❌ Delete a Client
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  const deleteClient = async (client: TransactionDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(`${apiRoutes.machineEntry}/${client.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete Client");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success("Client deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};
