import { z } from "zod";


export const ProductDescriptionSchema = z.object({
  description: z
    .string({
      required_error: "Product Description is required",
    })
  
});

export const ProductSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name is required"),
  price: z.string().optional(),
  discountPrice: z
    .string({ required_error: "Product price is required" })
    .min(1, "Product price is required"),
  stock: z
    .string({ required_error: "Product stock is required" })
    .min(1, "Product name is required"),

  shipping: z
    .string({ required_error: "Product shipping is required" })
    .min(1, "Product name is required"),
  subcategory: z
    .string({ required_error: "subcategory required" })
    .min(1, "Product name is required"),
  category: z
    .string({ required_error: "product category is required" })
    .min(1, "Product name is required"),
    colors: z.array(
      z.object({
        name: z.string({ required_error: "Color name is required" }),
        stock: z.boolean({ required_error: "Color stock is required" })
      })
    ),
    size: z.array(
      z.object({
        name: z.string({ required_error: "Size name is required" }),
        available: z.boolean({ required_error: "Size stock is required" })
      })
    ),
});
