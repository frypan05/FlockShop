// client/pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

export default function Dashboard() {
  const [wishlists, setWishlists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();

  const fetchWishlists = async () => {
    try {
      const res = await api.get("/wishlists");
      setWishlists(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlists", err);
    }
  };

  const createWishlist = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      await api.post("/wishlists", { title: newTitle });
      setNewTitle("");
      fetchWishlists();
    } catch (err) {
      console.error("Error creating wishlist", err);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlists</h1>

      {/* Create New Wishlist */}
      <form onSubmit={createWishlist} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="New wishlist title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
          Create
        </button>
      </form>

      {/* Wishlist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlists.map((wishlist) => (
          <div
            key={wishlist.id}
            onClick={() => router.push(`/wishlist/${wishlist.id}`)}
            className="cursor-pointer p-4 bg-gray-800 rounded hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold">{wishlist.title}</h2>
            <p className="text-sm text-gray-400 mt-1">
              Owner: {wishlist.owner_email}
            </p>
            <p className="text-xs text-gray-500">ID: {wishlist.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
