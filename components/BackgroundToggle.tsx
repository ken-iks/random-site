"use client";

export default function BackgroundToggle({ mode } : { mode: { dark: boolean }}) {
    return (
        <button className="bg-blue-50 p-6 rounded-full" onClick={() => mode.dark = !mode.dark}>
            Toggle background
        </button>
    )
}