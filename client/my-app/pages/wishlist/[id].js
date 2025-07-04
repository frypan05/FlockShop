// client/pages/wishlist/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Link from "next/link";

export default function WishlistPage() {
  const router = useRouter();
  const { id } = router.query;

  const [wishlist, setWishlist] = useState({});
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", image_url: "", price: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    if (!id) return;
    const res = await api.get("/wishlists");
    const current = res.data.find((w) => w.id == id);
    setWishlist(current || {});
    const productsRes = await api.get(`/wishlists/${id}/products`);
    setProducts(productsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, newProduct);
      } else {
        await api.post(`/wishlists/${id}/products`, newProduct);
      }
      setNewProduct({ name: "", image_url: "", price: "" });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Product save error", err);
    }
  };

  const handleDelete = async (pid) => {
    await api.delete(`/products/${pid}`);
    fetchData();
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      image_url: product.image_url,
      price: product.price,
    });
    setEditingId(product.id);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.includes("@")) return;
    await api.post(`/wishlists/${id}/invite`, { email: inviteEmail });
    setInviteEmail("");
    alert("User invited!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <button className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Wishlists
            </button>
          </Link>
          
          <div className="mb-6">
            <h1 className="text-4xl font-light tracking-wide text-white mb-3">{wishlist.title}</h1>
            <div className="flex items-center gap-4">
              <div className="w-24 h-0.5 bg-gradient-to-r from-white to-transparent"></div>
              <p className="text-gray-400 text-sm">Owner: {wishlist.owner_email}</p>
            </div>
          </div>
        </div>

        {/* Add / Edit Product */}
        <form onSubmit={handleAddOrUpdateProduct} className="mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-light text-white mb-6">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="p-4 bg-transparent border-b border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300"
              />
              <input
                placeholder="Image URL"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                className="p-4 bg-transparent border-b border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="p-4 bg-transparent border-b border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300"
              />
            </div>
            <button className="mt-8 px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

        {/* Invite user */}
        <form onSubmit={handleInvite} className="mb-16">
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-light text-white mb-6">Invite Someone</h2>
            <div className="flex gap-4 max-w-lg">
              <input
                placeholder="Enter their email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 p-4 bg-transparent border-b border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300"
              />
              <button className="px-6 py-4 bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-all duration-300">
                Invite
              </button>
            </div>
          </div>
        </form>

        {/* Product list */}
        <div className="mb-8">
          <h2 className="text-3xl font-light text-white mb-8">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:bg-gray-800/50 hover:border-gray-700 transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {product.image_url && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-light text-white mb-2">{product.name}</h3>
                  <p className="text-2xl font-light text-white mb-2">₹{product.price}</p>
                  <p className="text-sm text-gray-400">Added by: {product.added_by}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-2 px-4 bg-transparent border border-gray-700 text-white text-sm rounded hover:bg-gray-800 hover:border-gray-600 transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 py-2 px-4 bg-transparent border border-red-800 text-red-400 text-sm rounded hover:bg-red-900/30 hover:border-red-700 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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