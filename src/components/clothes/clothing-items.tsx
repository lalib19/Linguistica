"use client"

import { CartItemType } from "@/src/store/cart-slice";
import ClothingCard from "./clothing-card";
import { SearchResultItem } from "@/src/types";

export default function ClothingItems({ items }: { items: SearchResultItem[] | CartItemType[] }) {
    return (
        items.map((item) => {
            return (
                <div key={item.id} className="flex w-full justify-center">
                    <ClothingCard key={item.id} item={item} />
                </div>
            )
        })
    )
}
