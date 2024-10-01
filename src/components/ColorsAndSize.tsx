'use client'

import { useState } from "react"

import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"
import BuyNow from "./BuyNow"
import { CartDialog } from "./CartDialog"


const ColorsAndSize = ({ product }: { product: any }) => {

    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColors, setSelectedColors] = useState("")

    const availableColors = product?.colors?.filter((color: any) => color?.stock === true)
    const availableSize = product?.size?.filter((item: any) => item?.available === true)
    console.log("colors", availableColors, "size", availableSize)

    return (
      <div className="">
          <div className="border border-dashed p-4 space-y-4">
            <div className="">
                <h1 className="pb-2 text-sm font-semibold font-sans">Select Colors : </h1>
                <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-5">

                    {
                      availableColors &&  availableColors?.map((color: any, i: number) => (

                                <Button onClick={()=> setSelectedColors(color?.name?.toString())} variant={"outline"} size={"sm"} className={cn(selectedColors == color?.name ? "bg-green-300": "")} key={color?._id}>{color?.name}</Button>

                        ))
                    }
                </div>
            </div>
<Separator />
            <div className="">
                <h1 className="pb-2 text-sm font-semibold font-sans">Select Size : </h1>
                <div className="flex items-center gap-2 md:gap-3 mb-5">

                    {
                      availableSize &&  availableSize?.map((size :any, i: number) => (

                                <Button onClick={()=> setSelectedSize(size.name?.toString())} variant={"outline"} size={"sm"} className={cn(selectedSize == size?.name ? "bg-green-300": "")} key={size?._id}>{size?.name}</Button>

                        ))
                    }
                </div>
            </div>
        </div>
        <div className="gap-4 flex flex-col pt-5">
               <CartDialog product={product} btnFull="w-full" />
       
              <BuyNow colors={selectedColors} size={selectedSize} product={product} />
            </div>
      </div>

    )
}

export default ColorsAndSize