"use client";

import AddToModel from "../ui/AddToModel";
import useBrowserLanguage from "@/src/hooks/useBrowserLanguage";
import { useFavoriteActions } from "@/src/hooks/useFavoriteActions";
import { useAppSelector } from "@/src/store/hooks";
import { CartItemType } from "@/src/store/cart-slice";
import { SearchResultItem } from "@/src/types";
import Image from "next/image";

export default function ClothingCard({ item, isFavorite = false }: { item: CartItemType | SearchResultItem, isFavorite?: boolean }) {
    const imageUrlPath = `https://${item.imageUrl}`;
    const secondaryImageUrlPath = item.additionalImageUrls && item.additionalImageUrls.length > 0 ? `https://${item.additionalImageUrls[0]}` : imageUrlPath;
    const cart = useAppSelector((state) => state.cart);
    const iconPath = `${cart.some(i => i.id === item.id) ? "/icons/icons8-heart-48-filled.png" : "/icons/icons8-heart-48.png"}`
    const browserLanguage = useBrowserLanguage()
    const { toggleFavorite } = useFavoriteActions();

    const handleSelectItem = (item: CartItemType) => {
        toggleFavorite(item, cart);
    }

    return (
        <li key={item.id} className="w-full bg-background-secondary shadow-xl max-w-full md:max-w-70 hover:scale-101 transition-transform">
            <a href={`https://asos.com/${browserLanguage}/${item.url} `} target="_blank" rel="noopener noreferrer" >
                <div className="relative group">
                    <Image
                        src={imageUrlPath}
                        alt={item.name || "Product image"}
                        loading="lazy"
                        className=" w-full h-auto object-cover"
                        width={300}
                        height={400}
                    />
                    <Image
                        src={secondaryImageUrlPath}
                        alt={item.name || "Product image"}
                        loading="lazy"
                        className="absolute inset-0 w-full h-auto object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        width={300}
                        height={400}
                    />
                    {isFavorite && <AddToModel item={item as CartItemType} customCategoryName={item.customCategoryName} />}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const CartItemType: CartItemType = {
                                id: item.id,
                                name: item.name,
                                url: item.url,
                                imageUrl: item.imageUrl,
                                price: isFavorite ? (item as CartItemType).price : (item as SearchResultItem).price.current.text,
                                categoryName: item.categoryName,
                                customCategoryName: item.customCategoryName
                            };
                            handleSelectItem(CartItemType);
                        }}
                        className="absolute bottom-2 right-2 p-1 bg-white/80 shadow-lg rounded-full hover:bg-blue/90 transition-colors"
                    >
                        <img src={iconPath} className="hover:scale-105 transition-transform " alt="heart" height={30} width={30} />
                    </button>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 text-xs sm:p-4 sm:text-sm">
                    {/* <p className="flex-1 overflow-hidden leading-tight [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">{item.name}</p> */}
                    <p className="flex-1 line-clamp-2">{item.name}</p>
                    <p className="ml-1 shrink-0 whitespace-nowrap sm:ml-3">{isFavorite ? (item as CartItemType).price : (item as SearchResultItem).price.current.text}</p>
                </div>
            </a>
        </li>)
}
