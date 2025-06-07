'use client'

import Image from "next/image"

export const About = (): React.ReactElement => {
    return (
        <div id="about" className="flex flex-col items-center justify-center p-10 bg-white">
            <h2 className="text-red-600 text-3xl font-bold mb-2">Tentang Kami</h2>
            <div className="flex flex-col md:flex-row justify-between gap-10 w-full max-w-4xl">
                <Image
                    src="/batik-person.png"
                    alt="Orang dengan batik"
                    width={300}
                    height={400}
                    className="mx-auto md:ml-auto md:mx-0"
                />
                <div className="text-black text-justify">
                    <h2 className="text-2xl font-semibold mb-2">Jelajahi Dunia Batik di Indonesia dengan BatiKnow</h2>
                    <p className="border-l-5 border-red-500 mb-4 pl-6 text-gray-700">
                        BatiKnow menyuguhkan penelusuran motif batik
                        yang ada di Indonesia menggunakan model
                        Machine Learning dengan mendeteksi pola batik
                        berdasarkan ribuan dataset.
                    </p>
                    <div className="grid grid-cols-2 list-disc list-inside space-y-1">
                        <div className="before:content-['✔'] before:border-1 before:px-1 before:mr-2">Pelestarian Budaya</div>
                        <div className="before:content-['✔'] before:border-1 before:px-1 before:mr-2">Edukasi</div>
                        <div className="before:content-['✔'] before:border-1 before:px-1 before:mr-2">Akses Informasi</div>
                        <div className="before:content-['✔'] before:border-1 before:px-1 before:mr-2">Keakuratan Informasi</div>
                    </div>
                </div>
            </div>
        </div>
    )
}