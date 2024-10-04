import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData, ToolConstructable } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import LinkTool from "@editorjs/link";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import "@/app/richTextEditor.css";

const UpdateDescForm = ({ form }: { form: any }) => {
  const editorRef = useRef<EditorJS | null>(null);

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
        data: form.getValues('description') ? JSON.parse(form.getValues('description')) : { blocks: [] } as OutputData,
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
            Provide a detailed description of your product. You can use headers, lists, tables, and paragraphs to structure your content.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UpdateDescForm;