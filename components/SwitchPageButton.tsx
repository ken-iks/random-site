'use client'
import { useRouter } from "next/navigation";

export default function SwitchPageButton({ link }: { link: string }) {
    const router = useRouter();

    return (
        <div>
            <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(link)}>
                Lets see if you can switch page
            </button>
        </div>
    )
}