"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductDescriptionSchema } from "@/lib/formSchema/productSchema";
import { creactProductData } from "@/redux/features/product/productSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import EditorJS, { OutputData, ToolConstructable } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import LinkTool from "@editorjs/link";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import "@/app/richTextEditor.css"


interface Props {
  formStep: number;
  setFormStep: Dispatch<SetStateAction<number>>;
}

const ProductDescForm: FC<Props> = ({ formStep, setFormStep }) => {
  const dispatch = useDispatch();
  const editorRef = useRef<EditorJS | null>(null);

  const form = useForm<z.infer<typeof ProductDescriptionSchema>>({
    resolver: zodResolver(ProductDescriptionSchema),
    defaultValues: {
      description: "",
    },
  });


  const handleSubmit = async (value: z.infer<typeof ProductDescriptionSchema>) => {
    if (editorRef.current) {
      const editorData = await editorRef.current.save();
      const description = JSON.stringify(editorData);
      
      dispatch(
        creactProductData({
          ...value,
          description,
        })
      );
      form.reset();
      setFormStep(formStep >= 1 ? 2 : 2);
    }
  };

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: {
            class: Header as unknown as ToolConstructable,
            inlineToolbar: ['link'],
            config: {
              placeholder: 'Enter a header',
            },
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true
          },
          linkTool: {
            class: LinkTool as unknown as ToolConstructable,
          },
          table: {
            class: Table as unknown as ToolConstructable,
            inlineToolbar: true,
          },
          marker: {
            class: Marker as unknown as ToolConstructable,
            shortcut: 'CMD+SHIFT+M',
          },
        },
        data: {
          blocks: []
        } as OutputData,
        placeholder: 'Enter Product Description',
        onChange: async () => {
          const content = await editor.save();
          form.setValue('description', JSON.stringify(content));
        }
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [form]);

  return (
    <div>
      <Form {...form}>
        <form
          encType="multipart/form-data"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <div id="editorjs" className="min-h-[200px] border rounded-md" />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of your product. You can use headers, lists, table, and paragraphs to structure your content.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductDescForm;