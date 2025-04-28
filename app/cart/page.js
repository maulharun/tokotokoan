'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart & products, update stock based on cart
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://dummyjson.com/products');
      const { products: fetched } = await res.json();

      const storedCart = JSON.parse(localStorage.getItem('cart') || '{}');

      // Update products stock based on cart data
      const updatedProducts = fetched.map(p => {
        const qtyInCart = storedCart[p.id] || 0;
        return { ...p, stock: p.stock - qtyInCart };
      });

      setProducts(updatedProducts);
      setCart(storedCart);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Save cart to localStorage
  const persist = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Update cart and stock when adding item
  const handleAdd = (product) => {
    if (product.stock <= 0) return; // Cannot add more if stock is 0

    const newCart = { ...cart, [product.id]: (cart[product.id] || 0) + 1 };
    persist(newCart);
    updateStock(product.id, -1); // Reduce stock by 1
  };

  // Update cart and stock when removing item
  const handleRemove = (product) => {
    const currentQty = cart[product.id] || 0;
    if (currentQty <= 0) return; // Cannot remove if no items in cart

    const newCart = { ...cart };
    if (currentQty === 1) {
      delete newCart[product.id]; // Remove from cart if quantity is 1
    } else {
      newCart[product.id] = currentQty - 1;
    }
    persist(newCart);
    updateStock(product.id, 1); // Add stock back by 1
  };

  // Helper to update stock for a product
  const updateStock = (productId, change) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + change } : p
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold animate-pulse">Loading Cart...</p>
      </div>
    );
  }

  if (Object.keys(cart).length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-6">Your cart is empty.</p>
        <Link href="/products" className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
          Back to Products
        </Link>
      </div>
    );
  }

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce(
    (sum, product) => sum + (cart[product.id] || 0) * product.price,
    0
  );

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      <div className="space-y-6 mb-8">
        {products.map((product) => (
          cart[product.id] ? (
            <div key={product.id} className="flex items-center bg-white p-4 rounded-2xl shadow-lg">
              <img src={product.thumbnail || product.images[0]} alt={product.title} className="w-24 h-24 object-contain rounded-lg mr-4" />
              <div className="flex-grow">
                <h2 className="font-semibold text-lg text-gray-800 mb-1">{product.title}</h2>
                <p className="text-gray-600 mb-1">Price: ${product.price.toFixed(2)}</p>
                <p className="text-gray-600 mb-1">Stock left: {product.stock}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRemove(product)}
                  disabled={cart[product.id] <= 1}
                  className="px-3 py-1 bg-green-700 rounded-lg disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={cart[product.id]}
                  min={1}
                  max={product.stock}
                  onChange={(e) => handleAdd(product)}
                  className="w-12 text-center border rounded-lg text-red-800"
                />
                <button
                  onClick={() => handleAdd(product)}
                  disabled={cart[product.id] >= product.stock}
                  className="px-3 py-1 bg-green-700 rounded-lg disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(product)}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ) : null
        ))}
      </div>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg">
        <p className="text-lg text-gray-800">Total ({totalItems} items): <span className="font-bold">${totalPrice.toFixed(2)}</span></p>
        <button className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition flex items-center space-x-2">
          <span>Checkout</span>
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
      <Link href="/products" className="mt-8 inline-block text-indigo-600 hover:underline">
        Back to Products
      </Link>
    </main>
  );
}
