export default function Search() {
    return (
        <div>
            <form className="flex gap-5 justify-center items-center min-h-screen">
                <input type="text" className="bg-gray-100 border w-1/2 rounded placeholder-gray-500 text-black p-3" placeholder="Enter the username you're looking for"/>
                <button type="submit" className="bg-blue-500 border rounded w-1/12 p-3">Search</button>
            </form>
        </div>
    )
}