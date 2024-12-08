"use client";

import { AlertPopup } from "@/components/AlertPopup";
import { Button } from "@/components/ui/button";
import { customRevalidateTag } from "@/lib/actions/RevalidateTag";
import { useDeleteBannerMutation } from "@/redux/features/banners/bannerApi";
import { Trash2 } from "lucide-react";

import { FC, useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

const BannerDeleteBtn: FC<Props> = ({ id }) => {
  const [deleteBanner, { isLoading, isSuccess, error }] =
    useDeleteBannerMutation();

  const handleCustomerReviewDelete = async (bannerId: string) => {
    await deleteBanner({
      id: bannerId,
    });

    await customRevalidateTag("Banner");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Customer review delete success");
    } else if (error) {
      toast.error("Somthing is wrong");
    }
  }, [error, isSuccess]);

  return (
    <>
      <AlertPopup actionFunc={() => handleCustomerReviewDelete(id)}>
        <Button disabled={isLoading} size={"icon"} className="bg-red-400">
          <Trash2 />
        </Button>
      </AlertPopup>
    </>
  );
};

export default BannerDeleteBtn;
