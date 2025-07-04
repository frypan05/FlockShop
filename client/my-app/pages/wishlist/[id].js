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
    <div className="min-h-screen bg-gray-900 text-white p-6">
        <Link href="/dashboard">
  <button className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-white">
    ← Back to Wishlists
  </button>
</Link>
      <h1 className="text-3xl font-bold mb-4">{wishlist.title}</h1>
      <p className="text-gray-400 mb-6">Owner: {wishlist.owner_email}</p>

      {/* Add / Edit Product */}
      <form onSubmit={handleAddOrUpdateProduct} className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-xl mb-2">{editingId ? "Edit" : "Add"} Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            placeholder="Image URL"
            value={newProduct.image_url}
            onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
          {editingId ? "Update" : "Add"} Product
        </button>
      </form>

      {/* Invite user */}
      <form onSubmit={handleInvite} className="mb-6">
        <h2 className="text-xl mb-2">Invite Someone</h2>
        <div className="flex gap-4">
          <input
            placeholder="Their email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white flex-grow"
          />
          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Invite</button>
        </div>
      </form>

      {/* Product list */}
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 p-4 rounded">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-green-400 font-bold">₹{product.price}</p>
            <p className="text-sm text-gray-400">Added by: {product.added_by}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
