"use client";

import { FC, useEffect } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { customRevalidateTag } from "@/lib/actions/RevalidateTag";
import { useDeleteProductMutation } from "@/redux/features/product/productApi";
import { FilePenLine, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IProduct } from "../../../../types/product";
import { AlertPopup } from "@/components/AlertPopup";

type Props = {
  product: IProduct;
};

const ProductAction: FC<Props> = ({ product }) => {
  const router = useRouter();

  const [deleteProduct, { isLoading, isSuccess, error }] =
    useDeleteProductMutation();

    const handleDeleteProduct = async () => {
      
        const productId = product?._id;
    
        try {
          await deleteProduct({productId});
          await customRevalidateTag("getAllProducts");
          router.refresh();
        } catch (err) {
          console.error("Failed to delete product:", err);
          toast.error("Failed to delete product. Please try again.");
        }
    };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product deleted successfull");
    } else if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [error, isSuccess]);

  return (
    <div className="flex items-center gap-5">
      <div className="">
        <Link href={`/dashboard/products/${product?.slug}`}>
          <Button size={"icon"}>
            <FilePenLine />
          </Button>
        </Link>
      </div>
      <div className="">
        <AlertPopup actionFunc={handleDeleteProduct}>
        <Button
          disabled={isLoading}
          size={"icon"}
          className="bg-red-400"
        >
          <Trash className="" />
        </Button>
        </AlertPopup>
      </div>
    </div>
  );
};

export default ProductAction;
