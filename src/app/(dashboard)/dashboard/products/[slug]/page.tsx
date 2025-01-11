import UpdateProductInfo from "@/app/(dashboard)/components/productForm/UpdateProductInfo";
import { Card, CardContent } from "@/components/ui/card";
import { singleProduct } from "@/lib/fetch/getProduct";

type Props = {
  params: Promise<{ slug: string }>;
};

const page = async ({ params }: Props) => {
  const slug = (await params).slug;
  const product = await singleProduct(slug);

  return (
    <div className="p-1 md:p-2 xl:p-4">
      <Card>
        <CardContent>
          <UpdateProductInfo product={product?.product} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
