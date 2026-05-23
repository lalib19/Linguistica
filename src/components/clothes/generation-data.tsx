import useBrowserLanguage from "@/src/hooks/useBrowserLanguage"
import { CartState } from "@/src/store/cart-slice"

export default function ModelClothingDetail({ garments }: { garments: CartState }) {
    const browserLanguage = useBrowserLanguage()
    return (
        <div className="flex flex-col ml-5">
            {garments.map((garment, index) => (
                <a key={index} href={`https://asos.com/${browserLanguage}/${garment.url} `}>
                    <img src={garment.imageUrl} alt={garment.name || `Garment ${index + 1}`} className="rounded mb-2 max-h-18 sm:max-h-23 md:max-h-36 lg:max-h-41" />
                </a>
            ))}
        </div>
    )
}
