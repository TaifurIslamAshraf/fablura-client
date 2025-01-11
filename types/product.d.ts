// types.ts
import { z } from "zod";

export interface IElectronicsDescription {
  colors: string;
  brand: string;
  warrantyPeriod?: string;
  countryOrigin?: string;
  batteryCapacity?: string;
  features?: string;
  dimensions?: string;
  model?: string;
  waterproof?: string;
  powerSupply?: string;
  bodyMaterials?: string;
  chargingTime?: string;
}

export interface IFoodsDescription {
  ingredients: string;
  foodDesc: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  descriptionType: "electronics" | "foods";
  price: number;
  discountPrice?: string;
  stock: number;
  sold: number;
  soldAt: Date;
  shipping: number;
  images: [string];
  numOfReviews: number;
  ratings?: number;
  description: IElectronicsDescription | IFoodsDescription;
  category: mongoose.Schema.Types.ObjectId;
  subcategory?: string;
}

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  price: z.string().min(1, "Price is required"),
  discountPrice: z.string(),
  stock: z.string().min(1, "Stock quantity is required"),
  shipping: z.string().min(1, "Shipping charge is required"),
  colors: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
});

export const ProductDescriptionSchema = z.object({
  description: z.string().min(1, "Product description is required"),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
export type Category = {
  _id: string;
  name: string;
  subcategory: Array<{ _id: string; name: string }>;
};
