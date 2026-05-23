"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/src/store/hooks";
import { selectGender } from "@/src/store/filter-slice";
import { useGenerationCount } from "@/src/hooks/useGenerationCount";

export default function Hero() {
    const dispatch = useAppDispatch();
    const { maxGenerations } = useGenerationCount();

    return (
        <main className="flex flex-col items-center h-screen">
            <h1 className="text-4xl font-bold">Welcome to StyleMe</h1>
            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center flex flex-col gap-4 font-medium">
                <p>Begin browsing clothing items and favorite them to add to your cart.</p>
                <p> Then from your favorites select which ones you would like to try on you !</p>
                <p>Some items have been discontinued by the brands and will show as not found.</p>
                <p className="text-sm text-blue-700">
                    ⚡ Try AI-powered virtual try-on! Get <strong>{maxGenerations} free generations</strong> when you sign in.
                </p>
            </div>

            <div className="flex gap-8 items-center justify-center mt-10">
                <Link href="/men/top" className="group" onClick={() => dispatch(selectGender("men"))} >
                    <Image
                        src="/images/mannequin-homme.jpg"
                        alt="Men"
                        width={400}
                        height={300}
                        style={{ width: "auto", height: "auto" }}
                        className="rounded-lg shadow-lg transition-transform group-hover:scale-105"
                        priority
                    />
                </Link>

                <Link href="/women/top" className="group" onClick={() => dispatch(selectGender("women"))} >
                    <Image
                        src="/images/mannequin-femme.jpg"
                        alt="Women"
                        width={400}
                        height={300}
                        style={{ width: "auto", height: "auto" }}
                        className="rounded-lg shadow-lg transition-transform group-hover:scale-105"
                        priority
                    />
                </Link>
            </div>
        </main >
    );
}
