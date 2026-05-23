import { CartItemType } from "@/src/store/cart-slice";
import { ModelState } from "@/src/store/model-slice";
import styles from "../layout/garment-selector.module.css";

interface GarmentSlotProps {
    item: CartItemType;
    type: keyof Omit<ModelState, 'userImage'>;
    placeholderIcon: string;
    alt: string;
    onRemove: (type: keyof Omit<ModelState, 'userImage'>) => void;
}

export default function GarmentSlot({ item, type, placeholderIcon, alt, onRemove }: GarmentSlotProps) {
    return (
        <div
            className={`${styles.garmentItems} cursor-pointer relative group`}
            onClick={() => item.imageUrl ? onRemove(type) : undefined}
        >
            {item.imageUrl ? (
                <div className="relative flex items-center justify-center ">
                    <img
                        className={`${styles.garmentImage} transition-opacity duration-300 group-hover:opacity-50`}
                        src={item.imageUrl}
                        alt={alt}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm font-bold">×</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="justify-center items-center flex">
                    <img className={styles.garmentPlaceholder} src={placeholderIcon} alt={alt} />
                </div>
            )}
        </div>
    );
}