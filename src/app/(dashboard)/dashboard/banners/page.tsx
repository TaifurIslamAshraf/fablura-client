import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getBanners } from "@/lib/fetch/banner.data";
import { serverUrl } from "@/lib/utils";
import { ImageIcon, ImagePlus, Layout, LayoutGrid } from "lucide-react";
import Image from "next/image";
import BannerDeleteBtn from "../../components/BannerDeleteBtn";
import CreateBanners from "../../components/CreateBanners";

type IBanners = {
  _id: string;
  bannerType: string;
  category?: {
    name: string;
  };
  image: string;
};

const Page = async () => {
  const banners = await getBanners();

  const getBannersByType = (type: string) => {
    return banners?.banner?.filter(
      (item: IBanners) => item.bannerType === type
    );
  };

  return (
    <div className="py-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
      </div>

      {/* Create Banner Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-blue-500" />
            Create New Banner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateBanners />
        </CardContent>
      </Card>

      {/* Main Banners Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-blue-500" />
            Main Banners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4">
              {getBannersByType("mainBanner").map((item: IBanners) => (
                <div
                  key={item._id}
                  className="relative group shrink-0 rounded-lg overflow-hidden"
                >
                  <div className="relative w-[1100px] h-[300px]">
                    <Image
                      src={`${serverUrl}/${item.image}`}
                      alt="Main banner"
                      fill
                      className="object-cover rounded-lg w-full"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute top-2 right-2">
                        <BannerDeleteBtn id={item._id} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Category Banners Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-blue-500" />
            Category Banners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getBannersByType("categoryBanner").map((item: IBanners) => (
              <div
                key={item._id}
                className="relative group rounded-lg overflow-hidden bg-gray-50"
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={`${serverUrl}/${item.image}`}
                    alt={`${item.category?.name} banner`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-3 flex items-center justify-between bg-white border-t">
                  <Badge variant="secondary" className="font-medium">
                    {item.category?.name}
                  </Badge>
                  <BannerDeleteBtn id={item._id} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Banners Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            Top Banners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getBannersByType("topBanner").map((item: IBanners) => (
              <div
                key={item._id}
                className="relative group rounded-lg overflow-hidden"
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={`${serverUrl}/${item.image}`}
                    alt="Top banner"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2">
                      <BannerDeleteBtn id={item._id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
