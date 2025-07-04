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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-wide text-white mb-2">Wishlists</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-white to-transparent"></div>
        </div>
        
        {/* Create New Wishlist */}
        <form onSubmit={createWishlist} className="mb-16">
          <div className="max-w-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Create a new wishlist..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 p-4 bg-transparent text-white placeholder-gray-400 border-b border-gray-700 focus:outline-none focus:border-white transition-all duration-300"
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
              >
                Create
              </button>
            </div>
          </div>
        </form>

        {/* Wishlist Cards */}
        <div className="grid gap-4">
          {wishlists.map((wishlist, index) => (
            <div
              key={wishlist.id}
              onClick={() => router.push(`/wishlist/${wishlist.id}`)}
              className="group cursor-pointer bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:bg-gray-800/50 hover:border-gray-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light text-white group-hover:text-gray-100 transition-colors">
                    {wishlist.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">
                    {wishlist.owner_email}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}