import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

import type { ServiceEntryRequest } from "@/types/transactionTypes";
import axiosInstance from "@/utils/axios";

export const useCreateServiceEntry = () => {
  const queryClient = useQueryClient();

  const createEntry = async (payload: ServiceEntryRequest) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.post(
      "https://msm-eightbit.onrender.com/api/transaction/service-entries",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(res.data?.message || "Failed to create Service Entry");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      toast.success("Service Entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceEntry"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create service entry",
        );
      } else {
        toast.error("Unexpected error occurred!");
      }
    },
  });
};
