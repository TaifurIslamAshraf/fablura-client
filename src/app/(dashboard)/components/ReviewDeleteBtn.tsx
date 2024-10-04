"use client";

import { AlertPopup } from "@/components/AlertPopup";
import { Button } from "@/components/ui/button";
import { customRevalidateTag } from "@/lib/actions/RevalidateTag";
import { deleteCustomerReview } from "@/lib/fetch/customerReview";
import { Trash2 } from "lucide-react";
import { FC } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

const ReviewDeleteBtn: FC<Props> = ({ id }) => {
  const handleCustomerReviewDelete = async (reviewId: string) => {
    const data = await deleteCustomerReview(reviewId);

    if (data?.success) {
      toast.success("Customer review delete success");
      customRevalidateTag("customerReview");
    } else if (!data?.success) {
      toast.error("Somthing is wrong");
    }
  };

  return (
   <>
   <AlertPopup actionFunc={() => handleCustomerReviewDelete(id)}>
   <Button
      size={"icon"}
      className="bg-red-400"
    >
      <Trash2 />
    </Button>
   </AlertPopup>
   </>
  );
};

export default ReviewDeleteBtn;
