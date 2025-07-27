import axiosInstance from "../../utils/axios";
import axios from "axios";
import type { VendorDetails } from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
/**
 * -------------------------------------------
 * Branch Service Hooks - CRUD Operations
 * -------------------------------------------
 * This file contains React Query hooks to:
 *  - Fetch all branches
 *  - Create a new branch
 *  - Edit an existing branch
 *  - Delete a branch
 *
 * Handles authentication, API errors, and notifications
 */

/**
 * 🔍 Fetch all vendors
 */
export const useFetchVendors = () => {
  const fetchAllVendors = async (): Promise<VendorDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.vendors, {
        //All api routes are inside this file
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch vendors");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch vendors",
        );
      } else {
        toast.error("Something went wrong while fetching vendors");
      }
      throw new Error("Vendor fetch failed"); //Force throw the error so the react query handles it
    }
  };

  return useQuery({
    queryKey: ["vendors"], //cache key
    queryFn: fetchAllVendors,
    staleTime: 1000 * 60 * 0, //expoiy time
    retry: 1,
  });
};

/**
 * ➕ Create a new vendor
 */
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  const createVendor = async (newVendor: VendorDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");


      const res = await axiosInstance.post(apiRoutes.vendors, newVendor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create vendor");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create vendor");
      } else {
        toast.error("Something went wrong while creating vendor");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      toast.success("Vendor created successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};


