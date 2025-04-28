'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Update cart count from localStorage (supports both array and object formats)
  const updateCount = () => {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const cartData = JSON.parse(raw);
      let count = 0;
      if (Array.isArray(cartData)) {
        // array of items with quantity
        count = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
      } else if (cartData && typeof cartData === 'object') {
        // object map of id->quantity
        count = Object.values(cartData).reduce((sum, qty) => sum + (qty || 0), 0);
      }
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    const handleStorage = e => {
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
    <nav className="bg-indigo-600 p-4 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div onClick={() => router.push('/')} className="text-2xl font-extrabold text-white cursor-pointer">
          TokoKami
        </div>
        <div className="flex space-x-6 items-center">
          <Link href="/products" className="text-white hover:text-indigo-300">
            Produk
          </Link>
          <Link href="/cart" className="relative text-white hover:text-indigo-300">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}