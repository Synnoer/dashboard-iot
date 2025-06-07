'use client'

import { faCamera, faHome, faListUl, faMap, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

export const NavBar = (): React.ReactElement => {
    const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Bikin animasi muncul setelah mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
    const router = useRouter()

    return (
        <div id="navbar" className="sticky top-0 rounded-b-lg sm:rounded-none sm:pt-4 bg-red-800 z-50">
            <div className="border-1 rounded-b-lg sm:rounded-none p-2 bg-white shadow-md max-w-6xl mx-auto">
                <div className="flex justify-between items-center">
                    <Link href="/" className="font-bold text-2xl text-red-500">BatiKnow</Link>
                    <div className="flex gap-2">
                        <div className="hidden sm:flex gap-2 items-center text-black text-center">
                            <Link href="/" className="hover:text-red-500">Home</Link>
                            <Link href="/scan" className="hover:text-red-500">Scan</Link>
                            <Link href="/list" className="hover:text-red-500">List</Link>
                            <Link href="/region" className="hover:text-red-500">Region</Link>
                            <Link href="/" className="bg-red-500 text-white hover:bg-red-800 rounded-full p-1 w-9 h-9 flex items-center justify-center">
                                <FontAwesomeIcon icon={faSearch} />
                            </Link>
                        </div>
                        <button type="button" onClick={() => router.push('auth/login')} className="cursor-pointer rounded-2xl px-4 py-1 bg-red-500 text-white hover:bg-red-800">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <div
      className={`
        fixed bottom-0 w-full py-2 bg-red-900 text-xl rounded-t-lg sm:hidden flex justify-evenly
        transform transition-transform duration-500
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <Link href="/" className="flex hover:bg-white hover:text-red-500 hover:text-2xl rounded-full p-6 w-9 h-9 items-center justify-center"><FontAwesomeIcon icon={faHome} /></Link>
      <Link href="/list" className="flex hover:bg-white hover:text-red-500 hover:text-2xl rounded-full p-6 w-9 h-9 items-center justify-center"><FontAwesomeIcon icon={faListUl} /></Link>
      <Link href="/scan" className="flex hover:bg-white hover:text-red-500 hover:text-2xl rounded-full p-6 w-9 h-9 items-center justify-center"><FontAwesomeIcon icon={faCamera} /></Link>
      <Link href="/region" className="flex hover:bg-white hover:text-red-500 hover:text-2xl rounded-full p-6 w-9 h-9 items-center justify-center"><FontAwesomeIcon icon={faMap} /></Link>
      <Link href="/search" className="flex hover:bg-white hover:text-red-500 hover:text-2xl rounded-full p-6 w-9 h-9 items-center justify-center"><FontAwesomeIcon icon={faSearch} /></Link>
    </div>
        </div>
    )
}