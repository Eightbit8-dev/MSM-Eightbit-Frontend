import axiosInstance from "../../utils/axios";
import axios from "axios";
import type {
  ProductDetails,
  ProductResponse,
} from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";

/**
 * 🔍 Fetch all Products
 */
export const useFetchProducts = () => {
  const fetchAllProducts = async (): Promise<ProductDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.products, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Products");
      }

      return res.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch Products",
        );
      } else {
        toast.error("Something went wrong while fetching Products");
      }
      throw new Error("Product fetch failed");
    }
  };

  return useQuery({
    queryKey: ["Products"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

/**
 * 🔍 Fetch  Product Type
 */
export const useFetchProductsType = () => {
  const fetchOptions = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.products, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: client.machineType,
    }));
  };

  return useQuery({
    queryKey: ["productOptions"],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchBrandsOptions = () => {
  const fetchBrand = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.products, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: client.brand,
    }));
  };

  return useQuery({
    queryKey: ["productBrands"],
    queryFn: fetchBrand,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchModelsOptions = () => {
  const fetchModel = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.products, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: client.modelNumber,
    }));
  };

  return useQuery({
    queryKey: ["productModels"],
    queryFn: fetchModel,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchAllDetailsOptions = () => {
  const fetchAllDetail = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.products, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: `${client.modelNumber} ,${client.machineType}, ${client.brand}  `,
    }));
  };

  return useQuery({
    queryKey: ["productAllProducts"],
    queryFn: fetchAllDetail,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

//paginated response

export const useFetchProductsPaginated = (page: number, limit: number) => {
  const fetchAllProducts = async (): Promise<ProductResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.products, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Products");
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
          error.response?.data?.message || "Failed to fetch Products",
        );
      } else {
        toast.error("Something went wrong while fetching Products");
      }
      throw new Error("Product fetch failed");
    }
  };

  return useQuery({
    queryKey: ["productModels", page, limit],
    queryFn: fetchAllProducts,
    staleTime: 0,
    retry: 1,
  });
};

/**
 * ➕ Create a new Product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const createProduct = async (newProduct: ProductDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.post(apiRoutes.products, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create Product");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create Product",
        );
      } else {
        toast.error("Something went wrong while creating Product");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
};

/**
 * ✏️ Edit an existing Product
 */
export const useEditProduct = () => {
  const queryClient = useQueryClient();

  const editProduct = async (updatedProduct: ProductDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const { id, ...payload } = updatedProduct;

      const res = await axiosInstance.put(
        `${apiRoutes.products}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to update Product");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update Product",
        );
      } else {
        toast.error("Something went wrong while updating Product");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
};

/**
 * ❌ Delete a Product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const deleteProduct = async (product: ProductDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.delete(
        `${apiRoutes.products}/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to delete Product");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete Product",
        );
      } else {
        toast.error("Something went wrong while deleting Product");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
};
