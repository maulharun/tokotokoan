'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Ambil data cart (bisa array atau object)
    const raw = localStorage.getItem('cart') || '[]';
    let count = 0;

    try {
      const cartData = JSON.parse(raw);

      if (Array.isArray(cartData)) {
        // Format array: [{ id, quantity }, …]
        count = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
      } else if (cartData && typeof cartData === 'object') {
        // Format object: { [id]: quantity, … }
        count = Object.values(cartData).reduce((sum, qty) => sum + (qty || 0), 0);
      }
    } catch {
      count = 0;
    }

    setCartCount(count);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-70 backdrop-blur p-4 shadow z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-800">
            MyStore
          </Link>
          <Link href="/cart" className="relative text-indigo-800">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <section className="flex flex-col items-center justify-center text-center h-[calc(100vh-96px)] px-4 bg-gradient-to-br from-indigo-50 to-purple-100">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-6">
            Welcome to MyStore
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
            Discover the best products at unbeatable prices. Shop now and get exclusive deals!
          </p>
          <Link
            href="/products"
            className="px-8 py-4 bg-purple-600 text-white rounded-2xl shadow-lg hover:bg-purple-700 transition"
          >
            Shop Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 bg-white bg-opacity-70 backdrop-blur">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} MyStore. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
