"use client";

import {
  useAddToCartMutation,
  useGetCartItemQuery,
  useTotalPriceQuery,
} from "@/redux/features/cart/cartApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { LoadingButton } from "./LoaderButton";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CartFormSchema } from "@/lib/formSchema/cartFormSchema";
import Image from "next/image";
import { serverUrl } from "@/lib/utils";

export function CartDialog({ product, btnFull }: { product: any; btnFull: string }) {

  const dispatch = useDispatch();
  const { refetch, data } = useGetCartItemQuery({});
  const { refetch: totalPriceRefetch } = useTotalPriceQuery({});


  const availableColors = product?.colors?.filter((color: any) => color?.stock === true)
  const availableSize = product?.size?.filter((item: any) => item?.available === true)
  const productImg = `${serverUrl}/${product?.images[0]}`;


  const [addToCart, { isLoading, isSuccess, error, isError }] =
    useAddToCartMutation();



  const handleSubmit = async (value: z.infer<typeof CartFormSchema>) => {
    if (product?.stock > 0) {
      await addToCart({ productId: product._id, size: value?.size, colors: value?.colors });
      await refetch();
      await totalPriceRefetch();
    } else {
      toast.error("Product Out of stock");
    }
  };

  const form = useForm<z.infer<typeof CartFormSchema>>({
    resolver: zodResolver(CartFormSchema),
    defaultValues: {
      colors: "",
      size: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product Add To Cart");
    } else if (isError) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [error, isError, isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={product?.stock <= 0} className="hover:bg-[#000000a2] transition-all">Add To Cart</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center border-b pb-2">Size & Colors</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-3 text-primary 
          ">
              <Image src={productImg} alt={product?.name} width={60} height={60} />
              <h1>{product?.name}</h1>
            </div>
          </DialogDescription>
        </DialogHeader>


        <div className="max-w-[700px] w-full mx-auto">
          <Form {...form}>
            <form
              encType="multipart/form-data"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3"
            >


              <FormField
                name="colors"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Colors" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableColors?.map((item: any) => (
                          <SelectItem key={item?._id} value={item?.name}>
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
                name="size"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSize &&
                          availableSize?.map((item: any) => (
                            <SelectItem key={item?._id} value={item?.name}>
                              {item?.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full pt-3">
                {isLoading ? (
                  <LoadingButton className={btnFull} />
                ) : (<Button size={"sm"} className="w-full" type="submit">Add To Cart</Button>)}

              </div>
            </form>
          </Form>
        </div>

      </DialogContent>
    </Dialog>
  )
}
