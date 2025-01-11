"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { LoadingButton } from "@/components/LoaderButton";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { customRevalidateTag } from "@/lib/actions/RevalidateTag";
import {
  useGetCartItemQuery,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";
import { InfoIcon, PackageIcon, TagIcon } from "lucide-react";

const UpdateDescForm = dynamic(() => import("./UpdateDescForm"), {
  ssr: false,
});
const AddColorsSize = dynamic(() => import("./AddColorsSize"), {
  ssr: false,
});

type Props = {
  product: any;
};

const UpdateProductInfo: FC<Props> = ({ product }) => {
  const [subcategory, setSubcategory] = useState<any[] | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { refetch } = useGetCartItemQuery({});
  const { refetch: totalPriceRefetch } = useTotalPriceQuery({});
  const { data } = useGetAllCategoryQuery({});
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
    setImages(e.target.files);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product Updated Successfully");
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
    <div className="w-full">
      <CardHeader>
        <CardTitle>Update Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Basic Info</span>
                  <span className="md:hidden">Basic</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex items-center gap-2"
                >
                  <TagIcon className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Pricing & Stock</span>
                  <span className="md:hidden">Pricing</span>
                </TabsTrigger>
                <TabsTrigger
                  value="attributes"
                  className="flex items-center gap-2"
                >
                  <PackageIcon className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Attributes</span>
                  <span className="md:hidden">Attrs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                            setSubcategory(
                              selectedCategory?.subcategory || null
                            );
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
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
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategory?.map((item: any) => (
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
                </div>

                <div className="space-y-2">
                  <FormLabel>Product Images</FormLabel>
                  <Input
                    type="file"
                    multiple
                    onChange={handleChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="cursor-pointer"
                  />
                  <FormDescription>
                    Uploading new images will replace existing ones
                  </FormDescription>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regular Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
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
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="stock"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
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
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="attributes" className="space-y-4 mt-4">
                <AddColorsSize form={form} />
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Product Description</h2>
                  <UpdateDescForm form={form} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button type="submit" className="w-32">
                  Update Product
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default UpdateProductInfo;
