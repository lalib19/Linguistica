"use client"

import { useAppSelector } from '@/src/store/hooks'
import NavLink from '../ui/NavLink'
import { useParams } from 'next/navigation'

export default function FilterNavigation() {
    const gender = useAppSelector((state) => state.filters.gender)
    const params = useParams()


    return (
        <>
            {gender && params.gender && (
                <header className="flex h-10 items-center px-10 md:px-50 bg-custom-bg-nav shadow-md border-t-black border-solid border-t space-x-4">
                    <>
                        <NavLink href={`/${gender}/top`}>Top</NavLink>
                        <NavLink href={`/${gender}/pants`}>Pants</NavLink>
                        <NavLink href={`/${gender}/shoes`}>Shoes</NavLink>
                        <NavLink href={`/${gender}/accessory`}>Accessories</NavLink>
                    </>
                </header>
            )}
        </>
    )
}
