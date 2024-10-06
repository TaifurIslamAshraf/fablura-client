"use client";

import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { LoadingButton } from "@/components/LoaderButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customRevalidateTag } from "@/lib/actions/RevalidateTag";
import {
  useGetCartItemQuery,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import AddColorsSize from "./AddColorsSize";
import dynamic from "next/dynamic";

const UpdateDescForm = dynamic(() => import("./UpdateDescForm"), {
  ssr: false,
});

type Props = {
  product: any;
};

const UpdateProductInfo: FC<Props> = ({ product }) => {
  const [subcategory, setSubcategory] = useState<any[] | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const router = useRouter();

  //redux state
  const { refetch } = useGetCartItemQuery({});
  const { refetch: totalPriceRefetch } = useTotalPriceQuery({});
  const { data } = useGetAllCategoryQuery({});
  const dispatch = useDispatch();
  const [updateProduct, { isLoading, error, isSuccess }] =
    useUpdateProductMutation();

  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      price: product?.price?.toString() || "",
      discountPrice: product?.discountPrice?.toString() || "",
      shipping: product?.shipping === 0 ? "0" : product?.shipping?.toString(),
      stock: product?.stock === 0 ? "0" : product?.stock?.toString(),
      description: product?.description || "",
      category: product?.category?._id || "",
      subcategory: product?.subcategory?._id || "",
      colors: product?.colors || [],
      size: product?.size || [],
    },
  });

  const handleSubmit = async (value: any) => {
    try {
      const formData = new FormData();

      formData.append("id", product?._id);
      Object.keys(value).forEach((key) => {
        if (key === "colors" || key === "size") {
          formData.append(key, JSON.stringify(value[key]));
        } else {
          formData.append(key, value[key]);
        }
      });

      if (images?.length! > 0) {
        for (let i = 0; i < images?.length!; i++) {
          formData.append("images", images![i]);
        }
      }

      await updateProduct({ data: formData });

      await Promise.all([
        customRevalidateTag("getAllProducts"),
        refetch(),
        totalPriceRefetch(),
      ]);

      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    setImages(files);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product Updated Successfull");
      router.replace("/dashboard/products");
    } else if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [error, isSuccess, router]);

  useEffect(() => {
    const defaultSubcategory = data?.category?.find(
      (item: any) => item?._id === product?.category?._id
    );
    setSubcategory(defaultSubcategory?.subcategory);
  }, [data?.category, product?.category?._id]);

  return (
    <div className="">
      <h1 className="my-6 text-xl font-semibold">Product Inof</h1>
      <Form {...form}>
        <form
          encType="multipart/form-data"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <div className="space-y-5">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Product Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="discountPrice"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Product Discount Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="stock"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Product Stock"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="shipping"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Charge</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Shipping Charge"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedCategory = data?.category?.find(
                        (item: any) => item?._id === value
                      );
                      setSubcategory(selectedCategory?.subcategory || null);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.category?.map((item: any) => (
                        <SelectItem key={item?._id} value={item?._id}>
                          {item?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="subcategory"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategory &&
                        subcategory?.map((item: any) => (
                          <SelectItem key={item?._id} value={item?._id}>
                            {item?.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AddColorsSize form={form} />

            <div className="">
              <FormLabel>Product Images</FormLabel>
              <Input
                type="file"
                multiple
                onChange={handleChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                placeholder="Product Image(max 5)"
              />
            </div>
          </div>
          <div className="space-y-5">
            <h1 className="text-xl font-semibold"> Description</h1>
            <UpdateDescForm form={form} />
          </div>

          <div className="flex items-center justify-end">
            {isLoading ? (
              <LoadingButton />
            ) : (
              <Button type="submit">Update Product</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateProductInfo;
