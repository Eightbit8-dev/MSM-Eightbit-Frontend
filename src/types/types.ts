import type { ProductDetails } from "./masterApiTypes";

export interface EntityTuple {
  0: number;
  1: string;
}

export interface ApiResponse {
  message: string;
  data: ProductDetails ;
}