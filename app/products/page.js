'use client';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // { [productId]: quantity }

  // Load products & cart, lalu adjust stock
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://dummyjson.com/products');
      const { products: fetched } = await res.json();

      const storedCart = JSON.parse(localStorage.getItem('cart') || '{}');
      // kurangi stock sesuai yang ada di cart
      const adjusted = fetched.map(p => {
        const qtyInCart = storedCart[p.id] || 0;
        return { ...p, stock: p.stock - qtyInCart };
      });

      setProducts(adjusted);
      setCart(storedCart);
    }
    fetchData();
  }, []);

  // Simpan cart ke localStorage
  const persist = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Tambah 1 ke cart & kurangi stock
  const handleAdd = (prod) => {
    if (prod.stock <= 0) return;
    setProducts(ps =>
      ps.map(p =>
        p.id === prod.id ? { ...p, stock: p.stock - 1 } : p
      )
    );
    const qty = (cart[prod.id] || 0) + 1;
    persist({ ...cart, [prod.id]: qty });
  };

  // Kurangi 1 dari cart & tambah stock
  const handleRemove = (prod) => {
    const current = cart[prod.id] || 0;
    if (current <= 0) return;
    setProducts(ps =>
      ps.map(p =>
        p.id === prod.id ? { ...p, stock: p.stock + 1 } : p
      )
    );
    const newQty = current - 1;
    const newCart = { ...cart };
    if (newQty > 0) newCart[prod.id] = newQty;
    else delete newCart[prod.id];
    persist(newCart);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
        Produk Kami
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 flex flex-col"
          >
            <img
              className="w-full h-64 object-cover rounded-t-lg"
              src={product.thumbnail || product.images[0]}
              alt={product.title}
            />
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                {product.title}
              </h2>
              <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                {product.description}
              </p>
              <p className="text-lg font-bold text-green-600 mb-2">
                Harga: ${product.price}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Stock tersisa: <span className="font-medium">{product.stock}</span>
              </p>

              {/* Kontrol add/remove & count */}
              <div className="mt-auto flex items-center justify-between">
                <button
                  onClick={() => handleRemove(product)}
                  disabled={!cart[product.id]}
                  className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                >
                  −
                </button>
                <span className="font-semibold">{cart[product.id] || 0}</span>
                <button
                  onClick={() => handleAdd(product)}
                  disabled={product.stock === 0}
                  className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  ＋
                </button>
              </div>

              {/* Fallback tombol Add bila hanya ingin satu aksi */}
              {
              <button
                onClick={() => handleAdd(product)}
                disabled={product.stock === 0}
                className={`mt-4 w-full py-2 rounded-full font-semibold text-white transition-colors
                  ${product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
