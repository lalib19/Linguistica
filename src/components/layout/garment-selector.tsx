"use client"

import styles from "./garment-selector.module.css"
import Button from "../ui/Button";
import ImageGeneration from "../ai/image-generation";
import GarmentSlot from "../ui/GarmentSlot";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useRef, useState } from "react";
import { setUserImage, setItem, initialCartItemTypeState, ModelState } from "@/src/store/model-slice";

export default function GarmentSelector() {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch()
    const model = useAppSelector((state) => state.model);
    const garments = Object.values(model).filter(item => item.id)

    async function uploadModelImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] as File;
        if (!file) {
            console.log("No file selected");
            return;
        }

        setIsUploading(true);
        try {
            const data = new FormData();
            data.append("file", file);

            const uploadRequest = await fetch("/api/cloudinary", {
                method: "POST",
                body: data,
            });
            const result = await uploadRequest.json();
            if (uploadRequest.ok) {
                console.log("Upload successful:", result);
                console.log("Image URL:", result.imageUrl);
                dispatch(setUserImage({ imageUrl: result.imageUrl }));
            } else {
                console.error("Upload failed:", result.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    async function deleteModelImage() {
        setIsDeleting(true);
        try {
            const deleteRequest = await fetch("/api/cloudinary", {
                method: "DELETE",
            });
            const result = await deleteRequest.json();
            if (deleteRequest.ok) {
                dispatch(setUserImage({ imageUrl: "" }));
                console.log("Delete successful:", result);
            } else {
                console.error("Delete failed:", result.message);
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setIsDeleting(false);
        }
    }

    function removeGarment(type: keyof Omit<ModelState, 'userImage'>) {
        dispatch(setItem({ type, item: { ...initialCartItemTypeState } }));
    }

    return (
        <div className="flex flex-col h-2/3 lg:h-4/5 w-30  lg:w-40 fixed top-42 lg:top-26 right-2  lg:right-5 justify-center items-center z-50">
            <div className="flex flex-col  border-custom-bg-nav border-2  lg:border-5 rounded-xl lg:rounded-2xl mt-20  mb-5 w-full" >
                <div className={`${styles.garmentItems} border-b-0! cursor-pointer relative group`} onClick={() => deleteModelImage()}>
                    {model.userImage.imageUrl ? (isUploading || isDeleting ? <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div> : (
                        <div className="relative">
                            <img className={`${styles.garmentImage} transition-opacity duration-300 group-hover:opacity-50`} src={model.userImage.imageUrl} alt="Model Image" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                                    <span className="text-white text-sm font-bold">×</span>
                                </div>
                            </div>
                        </div>
                    )) : <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isDeleting}
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Uploading...
                            </div>
                        ) : "Upload Your Photo"}
                    </Button>}
                </div>
            </div>
            <div className="flex flex-col  border-custom-bg-nav border-2 sm:border-3 lg:border-5 rounded-xl lg:rounded-2xl w-full" >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={e => uploadModelImage(e)}
                    accept="image/*"
                />
                <div className="flex flex-col items-center justify-evenly h-full w-full">
                    <GarmentSlot
                        item={model.top}
                        type="top"
                        placeholderIcon="icons/icons8-clothes-100.png"
                        alt="Top"
                        onRemove={removeGarment}
                    />
                    <GarmentSlot
                        item={model.bottom}
                        type="bottom"
                        placeholderIcon="icons/icons8-jeans-100.png"
                        alt="Bottom"
                        onRemove={removeGarment}
                    />
                    <GarmentSlot
                        item={model.shoes}
                        type="shoes"
                        placeholderIcon="icons/icons8-sneakers-100.png"
                        alt="Shoes"
                        onRemove={removeGarment}
                    />
                    <GarmentSlot
                        item={model.accessory}
                        type="accessory"
                        placeholderIcon="icons/icons8-handbag-100.png"
                        alt="Accessory"
                        onRemove={removeGarment}
                    />
                </div>
                <div className="flex items-center justify-center m-2">
                </div>
                <ImageGeneration modelImageUrl={model.userImage.imageUrl} garments={garments} />
            </div>
        </div >
    )
}