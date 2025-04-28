'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function CartComponent() {
  const [cartCount, setCartCount] = useState(0);

  // Menghitung total kuantitas dari objek cart di localStorage
  const updateCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '{}');
      const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    // Sync count saat storage berubah atau window focus
    const handleStorage = (e) => {
      if (e.key === 'cart') updateCount();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', updateCount);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', updateCount);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110 z-50"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6 text-indigo-600" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
            {cartCount}
          </span>
        )}
      </div>
    </Link>
  );
}
