"use client";

import { AlertPopup } from "@/components/AlertPopup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
  useGetAllCategoryQuery,
} from "@/redux/features/category/categoryApi";
import { FolderTree, Layers, Plus, Tags, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ICategory, ISubcategory } from "../../../../../types/category";
import CreateCategory from "../../components/CreateCategory";
import CreateSubategory from "../../components/CreateSubcategory";

const CategorySubcategory = () => {
  const [subcategory, setSubcategory] = useState<ISubcategory | undefined>();
  const [categoryId, setCategoryId] = useState("");
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateSubcategory, setShowCreateSubcategory] = useState(false);

  const { data, refetch } = useGetAllCategoryQuery({});
  const [
    deleteCategory,
    {
      isSuccess: categoryIsSuccess,
      error: categoryError,
      isLoading: categoryIsLoading,
    },
  ] = useDeleteCategoryMutation();
  const [
    deletesubCategory,
    { isSuccess: subCategoryIsSuccess, error: subCategoryError },
  ] = useDeleteSubcategoryMutation();

  const category = data?.category as ICategory;

  const handleCategory = (
    categoryId: string,
    subcategory: ISubcategory | undefined
  ) => {
    setSubcategory(subcategory);
    setCategoryId(categoryId);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory({ id });
    await refetch();
  };

  const handleDeletesubCategory = async (id: string) => {
    await deletesubCategory({ id });
    await refetch();
  };

  useEffect(() => {
    if (categoryIsSuccess) {
      toast.success("Category deleted successfully");
    } else if (categoryError) {
      const errorData = categoryError as any;
      toast.error(errorData?.data?.message);
    }
  }, [categoryError, categoryIsSuccess]);

  useEffect(() => {
    if (subCategoryIsSuccess) {
      toast.success("Subcategory deleted successfully");
    } else if (subCategoryError) {
      const errorData = subCategoryError as any;
      toast.error(errorData?.data?.message);
    }
  }, [subCategoryError, subCategoryIsSuccess]);

  return (
    <div className="py-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Category Management
        </h1>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateCategory(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Category
          </Button>
          <Button
            onClick={() => setShowCreateSubcategory(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Subcategory
          </Button>
        </div>
      </div>

      {/* Create Forms */}
      {showCreateCategory && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-blue-500" />
              Create New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCategory onSuccess={() => setShowCreateCategory(false)} />
          </CardContent>
        </Card>
      )}

      {showCreateSubcategory && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Create New Subcategory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateSubategory
              onSuccess={() => setShowCreateSubcategory(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Categories and Subcategories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories List */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-blue-500" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {category?.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleCategory(item._id, item.subcategory)}
                    className={cn(
                      "relative group rounded-lg transition-all duration-200",
                      "hover:bg-blue-50 cursor-pointer",
                      categoryId === item._id && "bg-blue-100"
                    )}
                  >
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tags
                          className={cn(
                            "h-4 w-4 transition-colors",
                            categoryId === item._id
                              ? "text-blue-500"
                              : "text-gray-500"
                          )}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="opacity-60">
                          {item.subcategory?.length || 0} subcategories
                        </Badge>
                        <AlertPopup
                          actionFunc={() => handleDeleteCategory(item._id)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={categoryIsLoading}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertPopup>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Subcategories List */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Subcategories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {subcategory?.length! > 0 ? (
                <div className="space-y-2">
                  {subcategory?.map((subItem) => (
                    <div
                      key={subItem._id}
                      className="relative group rounded-lg hover:bg-green-50 transition-all duration-200"
                    >
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layers className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{subItem.name}</span>
                        </div>
                        <AlertPopup
                          actionFunc={() =>
                            handleDeletesubCategory(subItem._id)
                          }
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertPopup>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                  <FolderTree className="h-12 w-12 mb-2" />
                  <p className="text-lg">
                    Select a category to view subcategories
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategorySubcategory;
