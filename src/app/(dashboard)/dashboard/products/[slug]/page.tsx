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
    <div className="ml-[230px] mt-[70px] p-4">
      <h1>Update Products</h1>
      <Card>
        <CardContent>
          <UpdateProductInfo product={product?.product} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
