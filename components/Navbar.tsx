import Link from "next/link";

export default function Navbar() {
    return (
        <ul className="flex gap-10 justify-center">
            <li>
            <Link href="/">Home</Link>
            </li>
            <li>
            <Link href="/search">Search</Link>
            </li>
            <li>
            <Link href="/profile">Profile</Link>
            </li>
      </ul>
    )
}
