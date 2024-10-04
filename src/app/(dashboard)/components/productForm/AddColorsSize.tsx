'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";

const AddColorsSize = (form: any) => {
    const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
        control: form.control,
        name: "colors",
    });
    
    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
        control: form.control,
        name: "size",
    });

    return (
        <div>
            <Dialog>
                <DialogTrigger className="w-full border border-dashed hover:bg-primary-foreground font-semibold text-sm p-3 rounded-md">Add Sizes & Colors</DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Sizes and Colors</DialogTitle>
                    </DialogHeader>

                    {/* Colors */}
                    <div>
                        <FormLabel>Colors</FormLabel>
                        {colorFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-2 mt-2">
                                <FormField
                                    name={`colors.${index}.name`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Color name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={`colors.${index}.stock`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => field.onChange(value === "true")}
                                                    value={field.value ? "true" : "false"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Stock" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">In Stock</SelectItem>
                                                        <SelectItem value="false">Out of Stock</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button size={"sm"} type="button" onClick={() => removeColor(index)}>Remove</Button>
                            </div>
                        ))}
                        <Button variant={"outline"} className="w-full mt-4" type="button" onClick={() => appendColor({ name: "", stock: true })}>
                            Add Color
                        </Button>
                    </div>

                    {/* Sizes */}
                    <div>
                        <FormLabel>Sizes</FormLabel>
                        {sizeFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-2 mt-2">
                                <FormField
                                    name={`size.${index}.name`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Size name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={`size.${index}.available`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => field.onChange(value === "true")}
                                                    value={field.value ? "true" : "false"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Stock" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">In Stock</SelectItem>
                                                        <SelectItem value="false">Out of Stock</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button size={"sm"} type="button" onClick={() => removeSize(index)}>Remove</Button>
                            </div>
                        ))}
                        <Button variant={"outline"} className="w-full mt-4" type="button" onClick={() => appendSize({ name: "", available: true })}>
                            Add Size
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddColorsSize