import axiosInstance from "../../utils/axios";
import axios from "axios";
import type {
  MachineDetails,
  MachineResponse,
} from "../../types/transactionTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";

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

export const useCreateMachineQR = () => {
  const generateQR = async (ids: number[]) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const response = await axiosInstance.post(apiRoutes.machineQr, ids, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Important: treat response as binary
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // Open in a new tab and trigger print
      const newWindow = window.open(blobUrl);
      if (newWindow) {
        newWindow.addEventListener("load", () => {
          newWindow.print();
        });
      }

      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to generate QR PDF",
        );
      } else {
        toast.error("Something went wrong while generating the QR PDF");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: generateQR,
  });
};

export const useFetchMachine = (page: number, limit: number) => {
  const fetchAllMachine = async (): Promise<MachineResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.machineEntry, {
        params: {
          page: page - 1,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch machine");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch machine");
      } else {
        toast.error("Something went wrong while fetching machine");
      }
      throw new Error("Machine fetch failed");
    }
  };

  return useQuery({
    queryKey: ["machine", page, limit],
    queryFn: fetchAllMachine,
    staleTime: 0,
    retry: 1,
  });
};

export const useFetchMachineById = (machineId?: number) => {
  const fetchMachine = async (): Promise<MachineDetails> => {
    if (!machineId) throw new Error("Machine ID is required");

    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axios.get<MachineDetails>(
      `${apiRoutes.machineEntry}/${machineId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error("Failed to fetch machine details");
      toast.error("Failed to fetch machine details");
    }

    return res.data;
  };

  return useQuery({
    queryKey: ["machineById", machineId],
    queryFn: fetchMachine,
    enabled: !!machineId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useFetchMachineOptions = () => {
  const fetchAllMachine = async (): Promise<DropdownOption[]> => {
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

      return res.data.data.map((machine: MachineDetails) => ({
        id: machine.id,
        label: machine.machineType,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch machine");
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

  const createMachine = async (newMachine: MachineDetails) => {
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
          error.response?.data?.message || "Failed to create Machine",
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
      queryClient.invalidateQueries({ queryKey: ["machine"] });
    },
  });
};

/**
 * ✏️ Edit an existing Machine
 */
export const useEditMachine = () => {
  const queryClient = useQueryClient();

  const editMachine = async (updatedMachine: MachineDetails) => {
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
      },
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
 * ❌ Delete a Macjhine
 */
export const useDeleteMachineEntry = () => {
  const queryClient = useQueryClient();

  const deleteClient = async (client: MachineDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(
      `${apiRoutes.machineEntry}/${client.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete Client");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success("Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["machine"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};

// ----------------------------

type MachineDropdownParams = {
  level: "brands" | "models" | "serials";
  type: string;
  brand?: string;
  model?: string;
};

const getMachineDropdownOptions = async ({
  level,
  type,
  brand,
  model,
}: MachineDropdownParams): Promise<DropdownOption[]> => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized");

  const endpoint = `/api/admin/machine/${level}`;
  const params: Record<string, string> = { type };
  if (brand) params.brand = brand;
  if (model) params.model = model;

  const res = await axiosInstance.get(endpoint, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    throw new Error(res.data?.message || `Failed to fetch ${level}`);
  }

  const rawList = res.data.data;

  if (level === "serials") {
    return (rawList as { serialNumber: string; machineEntryId: number }[]).map(
      (item) => ({
        id: item.machineEntryId,
        label: item.serialNumber,
      }),
    );
  }

  // 🧙 Map into DropdownOption with index as ID
  return (rawList as string[]).map((item, idx) => ({
    id: idx + 1,
    label: item,
  }));
};

export const useFetchMachineDropdownOptions = (
  params: MachineDropdownParams,
) => {
  const { level, type, brand, model } = params;

  return useQuery({
    queryKey: ["machineDropdown", level, type, brand, model],
    queryFn: () => getMachineDropdownOptions(params),
    staleTime: 0,
    retry: 1,
    enabled:
      !!type &&
      !!level &&
      (level !== "models" || !!brand) &&
      (level !== "serials" || !!model),
  });
};
