import axiosInstance from "../utils/axios";
import axios from "axios";
import type { HolidayDetails, HolidayPayload } from "../types/apiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../routes/apiRoutes";
import Cookies from "js-cookie";
/**
 * --------------------------------------
 * Holiday Service Hooks - CRUD Operations
 * --------------------------------------
 */

/**
 * 🔍 Fetch all Holidays
 */
export const useFetchHolidays = () => {
  const fetchAllHolidays = async (): Promise<HolidayDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.holidays, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Holidays");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch Holidays");
      } else {
        toast.error("Something went wrong while fetching Holidays");
      }
      throw new Error("Holiday fetch failed");
    }
  };

  return useQuery({
    queryKey: ["Holidays"],
    queryFn: fetchAllHolidays,
    staleTime: 0,
    retry: 1,
  });
};

/**
 * ➕ Create a new Holiday
 */
export const useCreateHoliday = () => {
  const queryClient = useQueryClient();

  const createHoliday = async (newHoliday: HolidayPayload) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    try {
      const res = await axiosInstance.post(apiRoutes.holidays, newHoliday, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (![200, 201].includes(res.status)) {
        throw new Error(res.data?.message || "Failed to create Holiday");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create Holiday");
      } else {
        toast.error("Something went wrong while creating Holiday");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createHoliday,
    onSuccess: () => {
      toast.success("Holiday created successfully");
      queryClient.invalidateQueries({ queryKey: ["Holidays"] });
      queryClient.invalidateQueries({ queryKey: ["FilteredHolidays"] }); // ✅ Added
    },
  });
};

/**
 * ✏️ Edit Holiday
 */
export const useEditHoliday = () => {
  const queryClient = useQueryClient();

  const editHoliday = async (updatedHoliday: HolidayPayload & { id: number }) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { id, ...payload } = updatedHoliday;

    try {
      const res = await axiosInstance.put(`${apiRoutes.holidays}/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to update Holiday");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update Holiday");
      } else {
        toast.error("Something went wrong while updating Holiday");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: editHoliday,
    onSuccess: () => {
      toast.success("Holiday updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Holidays"] });
      queryClient.invalidateQueries({ queryKey: ["FilteredHolidays"] }); // ✅ Added
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    },
  });
};

/**
 * ❌ Delete a Holiday
 */
export const useDeleteHoliday = () => {
  const queryClient = useQueryClient();

  const deleteHoliday = async (holiday: HolidayDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(`${apiRoutes.holidays}/${holiday.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete Holiday");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteHoliday,
    onSuccess: () => {
      toast.success("Holiday deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Holidays"] });
      queryClient.invalidateQueries({ queryKey: ["FilteredHolidays"] }); // ✅ Added
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};

/**
 * 📅 Fetch available months for Holidays
 */
export const useFetchHolidayMonths = () => {
  const fetchMonths = async (): Promise<{ id: number; label: string }[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.get(apiRoutes.holidaymonth, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch months");
    }

    return res.data.map((month: string, index: number) => ({
      id: index + 1,
      label: month,
    }));
  };

  return useQuery({
    queryKey: ["HolidayMonths"],
    queryFn: fetchMonths,
    staleTime: 0,
    retry: 1,
  });
};

/**
 * 📆 Fetch available years for Holidays
 */
export const useFetchHolidayYears = () => {
  const fetchYears = async (): Promise<{ id: number; label: string }[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.get(apiRoutes.holidayyears, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch years");
    }

    return res.data.map((year: string | number) => ({
      id: Number(year),
      label: String(year),
    }));
  };

  return useQuery({
    queryKey: ["HolidayYears"],
    queryFn: fetchYears,
    staleTime: 0,
    retry: 1,
  });
};

/**
 * 🎯 Filter Holidays by month & year
 */
export const useFilteredHolidays = (month: number, year: number) => {
  const fetchFilteredHolidays = async (): Promise<HolidayDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(
        `/api/admin/holiday/filter?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch filtered Holidays");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch Holidays");
      } else {
        toast.error("Something went wrong while fetching Holidays");
      }
      throw new Error("Filtered holiday fetch failed");
    }
  };

  return useQuery({
    queryKey: ["FilteredHolidays", month, year],
    queryFn: fetchFilteredHolidays,
    enabled: !!month && !!year,
    staleTime: 0,
    retry: 1,
  });
};
