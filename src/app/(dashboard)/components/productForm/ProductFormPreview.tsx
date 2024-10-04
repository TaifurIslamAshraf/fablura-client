"use client";

import Image from "next/image";
import { FC } from "react";
import { useSelector } from "react-redux";

type Props = {
  localImages: any[];
};

const ProductFormPreview: FC<Props> = ({ localImages }) => {
  const { productCreateData } = useSelector((state: any) => state.product);

  
  const parsedDescription = JSON.parse(productCreateData?.description || "{}");

  return (
    <div className="p-6 bg-white shadow-md rounded-md space-y-4">
      {/* Product Name */}
      <h1 className="text-2xl font-bold text-gray-800">{productCreateData?.name}</h1>

      {/* Price and Discount */}
      <div className="flex items-center space-x-4">
        <span className="text-xl font-semibold text-gray-800">${productCreateData?.discountPrice}</span>
        {productCreateData?.price && (
          <span className="text-xl font-semibold text-red-500 line-through">
            ${productCreateData?.price}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="border border-dashed">
        <h2 className="text-lg font-semibold text-gray-700">Description</h2>
        <div className="mt-2 text-gray-600 space-y-2">
          {parsedDescription.blocks?.map((block: any) => {
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
                    <tbody className="bg-primary-foreground">
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

      {/* Stock and Shipping */}
      <div className="flex items-center space-x-6">
        <span className="text-gray-700">Stock: {productCreateData?.stock}</span>
        <span className="text-gray-700">Shipping: ${productCreateData?.shipping}</span>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Available Colors</h3>
        <div className="flex space-x-4 mt-2">
          {productCreateData?.colors?.map((color: any, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-700"
            >
              {color.name} - {color.stock ? "In Stock" : "Out of Stock"}
            </span>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Available Sizes</h3>
        <div className="flex space-x-4 mt-2">
          {productCreateData?.size?.map((size: any, index: number) => (
            <span
              key={index}
              className="px-4 text-sm py-2 bg-gray-200 rounded-md text-gray-700"
            >
              {size.name} - {size.available ? "Available" : "Unavailable"}
            </span>
          ))}
        </div>
      </div>

      {/* Local Images */}
      {localImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Images</h3>
          <div className="flex space-x-4 mt-2">
            {localImages.map((image, index) => (
              <Image
                key={index}
                src={URL.createObjectURL(image)}
                alt="Product"
                height={128}
                width={128}
                className="w-32 h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFormPreview;
