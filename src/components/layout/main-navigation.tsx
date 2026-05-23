"use client"

import Link from "next/link"
import Logo from "./logo"
import { useAppDispatch, useAppSelector } from "@/src/store/hooks"
import { useSession, signOut } from "next-auth/react"
import NavLink from "../ui/NavLink"
import { selectGender } from "@/src/store/filter-slice";
import { useGenerationCount } from "@/src/hooks/useGenerationCount";

export default function MainNavigation() {
    const items = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch()
    const { data: session } = useSession();
    const { remaining, isAtLimit, isWarning, maxGenerations } = useGenerationCount();

    function handleSignOut() {
        signOut({ callbackUrl: "/" });
    }

    return (
        <header className="max-w-full bg-custom-bg-nav flex h-16 items-center justify-between px-4 md:px-50 shadow-md">
            {/* <header className="bg-custom-bg-nav h-16">       */}
            <Link href={"/"}>
                <Logo />
            </Link>
            <nav >
                <ul className="flex space-x-2 md:space-x-4">
                    <li><NavLink onClick={() => dispatch(selectGender("men"))} href="/men/top">Men</NavLink></li>
                    <li><NavLink onClick={() => dispatch(selectGender("women"))} href="/women/top">Women</NavLink></li>
                    {session ? (
                        <>
                            <li><button className="text-lg hover:underline hover:cursor-pointer" onClick={handleSignOut} >Logout</button></li>
                        </>
                    ) : (
                        <li><NavLink href="/auth">Log In</NavLink></li>
                    )}
                    <li className="relative"><Link href="/favorites">
                        <img src="/icons/icons8-heart-48-filled.png" alt="heart" height={28} width={28} />
                        {items.length > 0 && (
                            <div className="w-4 h-4 bg-green-200 rounded-full flex items-center justify-center absolute -top-1 -right-2">
                                <p className="text-black text-xs ">{items.length > 9 ? "9+" : items.length}</p>
                            </div>
                        )}
                    </Link></li>
                    {session && (
                        <li className="relative">
                            <div className={`flex items-center px-2 py-1 rounded-md text-sm font-medium ${isAtLimit
                                ? 'bg-red-100 text-red-700'
                                : isWarning
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                <span className="text-xs">⚡</span>
                                <span className="ml-1">{remaining}/{maxGenerations}</span>
                            </div>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}