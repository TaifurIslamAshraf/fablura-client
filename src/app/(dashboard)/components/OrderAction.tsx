"use client";

import { AlertPopup } from "@/components/AlertPopup";
import { Button } from "@/components/ui/button";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderStatusQuery,
} from "@/redux/features/orders/orderApi";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { FC, useCallback } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

const OrderAction: FC<Props> = ({ id }) => {
  const [deleteOrder, { isLoading }] = useDeleteOrderMutation();
  const { refetch: refetchAllOrders } = useGetAllOrdersQuery({});
  const { refetch: refetchOrderStatus } = useGetOrderStatusQuery({});

  const handleDeleteOrder = useCallback(async () => {
    try {
      await deleteOrder({ id }).unwrap();
      toast.success("Order deleted successfully");
      await refetchAllOrders();
      await refetchOrderStatus();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete order");
    }
  }, [deleteOrder, id, refetchAllOrders, refetchOrderStatus]);

  return (
    <div className="flex items-center gap-6">
      <Link href={`/dashboard/orders/${id}`}>
        <Button size="icon" variant="outline">
          <Edit size={20} />
        </Button>
      </Link>
      <AlertPopup actionFunc={handleDeleteOrder}>
        <Button disabled={isLoading} size="icon" variant="outline">
          <Trash2 className="text-red-500" size={20} />
        </Button>
      </AlertPopup>
    </div>
  );
};

export default OrderAction;
