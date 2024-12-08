"use client";

import "@/app/richTextEditor.css";
import { JSX, useEffect, useState } from "react";

// We'll use a type assertion for DOMPurify
let DOMPurify: {
  sanitize: (html: string) => string;
} | null = null;

function ProductDesc({ productDesc }: { productDesc: string }) {
  const [parsedDescription, setParsedDescription] = useState<any>(null);

  useEffect(() => {
    // Import DOMPurify dynamically
    import("dompurify").then((module) => {
      DOMPurify = module.default;
    });

    setParsedDescription(JSON.parse(productDesc || "{}"));
  }, [productDesc]);

  const sanitize = (html: string) => {
    if (typeof window !== "undefined" && DOMPurify) {
      return { __html: DOMPurify.sanitize(html) };
    }
    return { __html: html };
  };

  const renderEditorJsContent = (blocks: any[]) => {
    return blocks.map((block: any) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p
              key={block.id}
              dangerouslySetInnerHTML={sanitize(block.data.text)}
            />
          );
        case "header":
          const HeaderTag =
            `h${block.data.level}` as keyof JSX.IntrinsicElements;
          return (
            <HeaderTag
              key={block.id}
              className={`text-${block.data.level * 2}xl font-semibold`}
              dangerouslySetInnerHTML={sanitize(block.data.text)}
            />
          );
        case "list":
          return (
            <ul key={block.id} className="list-disc ml-6 space-y-1">
              {block.data.items.map((item: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={sanitize(item)} />
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
            <table
              key={block.id}
              className="table-auto w-full border-collapse border border-gray-300"
            >
              <tbody className="bg-primary-foreground">
                {block.data.content.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 p-2"
                        dangerouslySetInnerHTML={sanitize(cell)}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        default:
          return null;
      }
    });
  };

  if (!parsedDescription) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <div className="mt-2 text-gray-600 space-y-2">
        {renderEditorJsContent(parsedDescription.blocks)}
      </div>
    </div>
  );
}

export default ProductDesc;
