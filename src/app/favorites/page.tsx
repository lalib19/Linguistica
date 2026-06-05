"use client"

import React, { JSX, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { asosCategories } from "@/src/lib/asos-categories";
import GarmentSelector from "@/src/components/layout/garment-selector";
import ClothingCard from "@/src/components/clothes/clothing-card";
import Link from "next/link";
import Image from "next/image";
import { GenerationDataType, setNewGenerations } from "@/src/store/generations-slice";
import ModelClothingDetail from "@/src/components/clothes/generation-data";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "framer-motion";



export default function FavoritesPage() {
    const [displayedSection, setDisplayedSection] = useState<"favorites" | "generations">("favorites");
    const [direction, setDirection] = useState(0);
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const generations = useAppSelector((state) => state.generations.generations);
    const newGenerations = useAppSelector((state) => state.generations.newGenerations);
    const favoriteItems = useAppSelector((state) => state.cart);
    const customCategories = Object.keys(asosCategories.women)

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center mt-8 w-3/4">
                <p>Loading...</p>
            </div>
        );
    }

    const favoritesContent: JSX.Element | null = <ul>
        {favoriteItems.length > 0 ? customCategories.map(cat => {
            const categoryItems = favoriteItems.filter(item =>
                item.customCategoryName.toLowerCase() === cat.toLowerCase()
            );

            if (categoryItems.length === 0) return null;

            return (
                <div key={cat} className="flex flex-col w-full ">
                    <h2 className="text-xl font-bold mb-4 ml-4 capitalize">{cat}</h2>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-10 mx-3 md:mx-0 md:ml-3 md:grid-cols-[repeat(auto-fit,minmax(250px,250px))] md:gap-x-4 md:gap-y-4">
                        {categoryItems.map((item) => {
                            return (
                                <ClothingCard key={item.id} item={item} isFavorite={true} />
                            )
                        })}
                    </div>
                </div>
            )
        }) : <p className="mt-8 ml-5">No favorites yet. Add some items to your favorites!</p>}
    </ul>

    const generationsContent: JSX.Element | null = generations.length > 0 ? (
        <div className="mt-8 w-3/4 flex justify-center">
            <ul className="">{generations.map((generation: GenerationDataType) => (
                <li className="flex mb-10 max-h-80 sm:max-h-100 md:max-h-150 lg:max-h-200" key={generation.id}>
                    {generation.generatedImageUrl && (
                        <img src={generation.generatedImageUrl} alt="Original" className="aspect-9/16 max-h-45 sm:max-h-100 md:max-h-150 lg:max-h-200 rounded ml-5 " />
                    )}
                    <ModelClothingDetail key={generation.id} garments={generation.garments} />
                </li>
            ))}</ul>
        </div >
    ) : <p className="mt-8 ml-5">No generations yet. Create your first style!</p>;

    const handleTabSwitch = (newSection: "favorites" | "generations") => {
        if (newSection === displayedSection) return;

        if (newSection === "generations" && newGenerations) {
            dispatch(setNewGenerations(false));
        }

        const newDirection = newSection === "generations" ? 1 : -1;
        setDirection(newDirection);
        setDisplayedSection(newSection);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };
    const swipeTransition: Transition = {
        duration: 0.2,
        type: "tween" as const,
        ease: "easeInOut"
    };

    return (
        <div className=" flex flex-col items-center mt-8 ">
            {!session ? (
                <p className="mb-3"><Link href="/auth" className="underline">Sign In</Link> to register your favorites!</p>
            ) : null}

            <div className="flex space-x-3 sm:space-x-10 mb-8">
                <button
                    onClick={() => handleTabSwitch("favorites")}
                    className={`relative px-10 py-1 text-lg font-semibold rounded-4xl transition-all duration-300 ease-in-out ${displayedSection === "favorites"
                        ? "bg-sky-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-102"
                        }`}
                >
                    Favorites
                    {displayedSection === "favorites" && (
                        <motion.div
                        />
                    )}
                </button>
                <button
                    onClick={() => handleTabSwitch("generations")}
                    className={`relative px-8 py-1 text-lg font-semibold rounded-4xl transition-all duration-300 ease-in-out ${displayedSection === "generations"
                        ? "bg-sky-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-102"
                        }`}
                >
                    Generations
                    {newGenerations && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                    {displayedSection === "generations" && (
                        <motion.div
                        />
                    )}
                </button>
            </div>

            <GarmentSelector />

            <div className="relative w-full min-h-96 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={displayedSection}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={swipeTransition}
                        className="w-full pr-32 sm:pr-44 lg:pr-48"
                    >
                        {displayedSection === "favorites" ? favoritesContent : generationsContent}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

    )
}
