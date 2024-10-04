import { styles } from "@/app/styles";
import Cart from "@/components/Cart";
import ColorsAndSize from "@/components/ColorsAndSize";

import ProductCarousel from "@/components/ProductSlider";
import Ratings from "@/components/Ratings";
import RelatedProduct from "@/components/RelatedProduct";
import Reviews from "@/components/Reviews";
import { Separator } from "@/components/ui/separator";

import { singleProduct } from "@/lib/fetch/getProduct";
import { cn } from "@/lib/utils";
import { RefreshCcw, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Props = {
  params: { slug: string };
};

const page: FC<Props> = async ({ params }) => {
  const { slug } = params;
  const product = await singleProduct(slug);
  const productInfo = product?.product;
  const parsedDescription = JSON.parse(productInfo?.description || "{}");

  // lg:mt-[140px] mt-[70px]
  return (
    <div className={cn(styles.paddingX, "")}>
      <div className="fixed top-[90%] z-40 right-5 lg:hidden">
        <Cart />
      </div>
      <div className="flex lg:flex-row flex-col justify-between gap-6 lg:px-6 px-0">
        <div className="bg-primary-foreground w-full flex md:flex-row flex-col justify-center">
          <div className="flex-1 md:p-4 p-1">
            <ProductCarousel images={productInfo?.images} />
          </div>
          <div className="flex-1 md:p-4 p-1 space-y-2">
            <h1 className="font-[500] md:text-2xl text-xl">
              {productInfo?.name}
            </h1>
            <div className="">
              <Ratings
                numOfRating={Math.ceil(productInfo?.ratings)}
                size="20px"
                space="2px"
              />
              <span> | {productInfo?.numOfReviews} Reviews</span>
            </div>
            <h1 className="text-xl font-semibold space-x-2">
              <span className="line-through">TK. {productInfo?.price}</span>
              <span>TK. {productInfo?.discountPrice}</span>
            </h1>
            <h1>
              <span className="font-[500]">Category:</span>{" "}
              <Link
                className="text-blue-400"
                href={`/products/?subcategory=${productInfo?.subcategory?._id}`}
              >
                {productInfo?.subcategory?.name}
              </Link>
            </h1>

            <div className="space-y-2">
              {productInfo?.stock > 0 ? (
                <div className="flex items-center gap-2 font-[500] text-lg">
                  <Image
                    src={"/order-success.png"}
                    width={15}
                    height={15}
                    alt="in stock"
                  />
                  <span>In Stock</span>
                </div>
              ) : (
                <div className="flex items-center font-[500] text-lg text-red-500">
                  <X /> <span>Out Of Stock</span>
                </div>
              )}
            </div>
           <ColorsAndSize product={productInfo} />
         
            <div className="text-xs space-y-2 pt-3">
              <h2 className="flex items-center gap-2">
                <RefreshCcw /> <span>7 Days Replacement Policy</span>
              </h2>
              <h2 className=" flex items-center gap-2">
                <Image
                  src={"/cash-on-delivery.png"}
                  alt="cash on delivery"
                  width={20}
                  height={20}
                />{" "}
                <span>Cash on Delivery Available</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="bg-primary-foreground basis-1/3 md:p-4 p-1">
          <RelatedProduct product={product?.relatedProduct} />
        </div>
      </div>

      <div className="bg-primary-foreground my-4 lg:mx-6 mx-0 py-4">
       <h1 className="text-2xl font-semibold px-4">Description</h1>
       <Separator className="my-5" />
         {/* Description */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-700">Description</h2>
        <div className="mt-2 text-gray-600 space-y-2">
          {parsedDescription?.blocks?.map((block: any) => {
            switch (block.type) {
              case "paragraph":
                return <p key={block.id}>{block.data.text}</p>;
              case "header":
                return (
                  <h2
                    key={block.id}
                    className={`text-${block.data.level * 2}xl font-semibold`}
                  >
                    {block.data.text}
                  </h2>
                );
              case "list":
                return (
                  <ul
                    key={block.id}
                    className="list-disc ml-6 space-y-1"
                  >
                    {block.data.items.map((item: any, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                );
              case "linkTool":
                return (
                  <a
                    key={block.id}
                    href={block.data.link}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {block.data.link}
                  </a>
                );
              case "table":
                return (
                  <table key={block.id} className="table-auto w-full border-collapse border border-gray-300">
                    <tbody className="bg-neutral-100">
                      {block.data.content.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td
                              key={cellIndex}
                              className="border border-gray-300 p-2"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              case "marker":
                return (
                  <p key={block.id}>
                    <mark className="bg-yellow-300">{block.data.text}</mark>
                  </p>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
      </div>

      <div className="bg-primary-foreground my-4 lg:mx-6 mx-0 py-4">
        <Reviews
          name={productInfo?.name}
          image={productInfo?.images[0]}
          productId={productInfo?._id}
          productRatings={productInfo?.ratings}
          numOfReviews={productInfo?.numOfReviews}
        />
      </div>
    </div>
  );
};

export default page;
