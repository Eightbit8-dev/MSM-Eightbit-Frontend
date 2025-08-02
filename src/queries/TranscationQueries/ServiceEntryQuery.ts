import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import type { ServiceEntryRequest } from "@/types/transactionTypes";
import axiosInstance from "@/utils/axios";
import { useNavigate } from "react-router-dom";

export const useCreateServiceEntry = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createEntry = async (payload: ServiceEntryRequest) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.post(
      "https://msm-eightbit.onrender.com/api/transaction/service-entry",
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
      navigate(-1);
      toast.success("Service Entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceEntry"] });
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] }); //temporarary as we use same table in both page
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
