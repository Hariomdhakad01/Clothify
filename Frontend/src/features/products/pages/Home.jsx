import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { addToCart } from "../../cart/state/cart.slice";
import registerFashionModel from "../../../assets/register-fashion-model.png";
import { useAuth } from "../../auth/hook/useAuth";
import { fallbackProducts } from "../utils/fallbackProducts";

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const { user, handleLogout } = useAuth();
  const { handleGetAllProducts } = useProduct();
  const [query, setQuery] = useState("");

  useEffect(() => {
    handleGetAllProducts().catch(() => {});
  }, []);

  const displayProducts = products.length > 0 ? products : fallbackProducts;
  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      const search = `${product.title} ${product.description}`.toLowerCase();
      return search.includes(query.toLowerCase());
    });
  }, [displayProducts, query]);

  function handleAddToCart(product) {
    if (product._id.startsWith("sample-")) {
      return;
    }
    dispatch(addToCart(product));
  }

  async function onLogout() {
    await handleLogout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1612] font-sans selection:bg-[#c5a880]/30 selection:text-[#1a1612]">
      
      {/* ── Luxury Top Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#2a2a2a]/10 bg-[#121212]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#c5a880]/40 bg-[#c5a880]/10 text-xs font-bold tracking-[0.1em] text-[#e6c697] group-hover:border-[#c5a880] transition-colors">
              CF
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#fdfbf7] group-hover:text-[#c5a880] transition-colors">
                Clothify
              </span>
              <span className="text-[9px] font-medium tracking-[0.2em] text-[#c5a880] uppercase">
                Clothify
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em]">
            {user?.role === "seller" && (
              <Link 
                className="rounded-full px-4 py-2 border border-[#c5a880]/30 text-[#e6c697] hover:border-[#c5a880] hover:bg-white/5 transition-all" 
                to="/seller/dashboard"
              >
                Seller Hub
              </Link>
            )}
            <Link className="rounded-full px-4 py-2 text-[#8c8c8c] hover:text-white transition-colors" to="/orders">
              Orders
            </Link>
            <Link className="rounded-full bg-[#c5a880] px-4 py-2 text-[#121212] hover:bg-[#e6c697] transition-all shadow-[0_4px_12px_rgba(197,168,128,0.2)]" to="/cart">
              Cart ({cartCount})
            </Link>
            {user ? (
              <button 
                onClick={onLogout} 
                className="rounded-full border border-white/10 px-4 py-2 text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link 
                className="rounded-full border border-[#c5a880]/40 px-4 py-2 text-[#e6c697] hover:border-[#c5a880] transition-all" 
                to="/login"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ── Search Bar Section (Placed Prominently at the Top) ── */}
      <div className="bg-[#121212] border-b border-[#2a2a2a] py-6 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-center">
            <span className="absolute left-5 text-[#c5a880]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collections (resort shirts, travel chinos, knit polos...)"
              className="w-full pl-14 pr-12 py-4 bg-[#1a1a1a] text-[#fdfbf7] border border-[#2a2a2a] rounded-full text-xs font-medium tracking-wider outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all placeholder:text-[#666] shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 text-[#c5a880] hover:text-white text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <main>
        {/* ── Editorial Hero Section ── */}
        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20 items-center">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b39567]">
              New Urban Essentials
            </p>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-light leading-tight font-serif text-[#121212]">
              Sharp streetwear, <br />
              <span className="italic font-normal text-[#b39567]">crafted for motion.</span>
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#5a554e] font-normal">
              Curating premium essentials with an elegant architectural silhouette. Discover camp collar shirts, structured travel trousers, and breathable summer layers.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a 
                href="#shop" 
                className="rounded-full bg-[#121212] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-[#c5a880] hover:text-[#121212] transition-all shadow-[0_4px_20px_rgba(18,18,18,0.15)]"
              >
                Shop Collection
              </a>
              {user?.role === "seller" ? (
                <Link 
                  to="/seller/create-product" 
                  className="rounded-full border border-[#cbd2ce] bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#121212] hover:border-[#121212] transition-all"
                >
                  Create Listing
                </Link>
              ) : (
                <Link 
                  to="/register" 
                  className="rounded-full border border-[#c5a880]/60 bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#b39567] hover:border-[#b39567] transition-all"
                >
                  Join Studio
                </Link>
              )}
            </div>
          </div>
          
          {/* Mannequin Hero Frame */}
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[#c5a880]/20 bg-[#e3dfd5] p-3 shadow-xl group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,168,128,0.15),transparent_40%)]" />
            <img 
              src={registerFashionModel} 
              alt="Snitch editorial outfit" 
              className="h-full w-full object-cover rounded-xl transition-transform duration-[1.2s] ease-out group-hover:scale-105" 
            />
          </div>
        </section>

        {/* ── Catalog Section ── */}
        <section id="shop" className="border-t border-[#e9e4dc] bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b39567]">
                Catalog
              </p>
              <h2 className="mt-2 text-3xl font-light font-serif text-[#121212]">
                Latest Drops
              </h2>
              <div className="mt-4 w-12 h-[2px] bg-[#c5a880] mx-auto sm:mx-0" />
            </div>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <p className="text-sm font-semibold tracking-widest uppercase text-[#b39567] animate-pulse">
                  Unveiling products...
                </p>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <article 
                  key={product._id} 
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(26,22,18,0.06)]"
                >
                  {/* Card Image Link */}
                  <Link 
                    to={`/products/${product._id}`} 
                    className="block aspect-[3/4] overflow-hidden bg-[#faf9f6] border-b border-[#e9e4dc]/60 relative"
                  >
                    <img 
                      src={product.images?.[0]?.url || registerFashionModel} 
                      alt={product.title} 
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  {/* Card Information */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#b39567]">
                        <span>Apparel Drop</span>
                        {product._id.startsWith("sample-") && (
                          <span className="px-2 py-0.5 rounded-full bg-[#c5a880]/15 text-[#b39567] font-extrabold">
                            Sample
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-base font-bold text-[#121212] line-clamp-1 group-hover:text-[#b39567] transition-colors">
                        {product.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-relaxed text-[#7c756c]">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-[#faf9f6] pt-4">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-sm font-bold text-[#1a1612]">
                          {formatCurrency(product.price?.amount, product.price?.currency)}
                        </span>
                        <span className="text-[10px] font-semibold text-[#8c8c8c] uppercase tracking-widest">
                          IN STOCK
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link 
                          to={`/products/${product._id}`} 
                          className="rounded-full border border-[#c5a880]/60 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#b39567] hover:border-[#b39567] hover:bg-[#c5a880]/5 transition-all"
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)} 
                          disabled={product._id.startsWith("sample-")} 
                          className="rounded-full bg-[#121212] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:bg-[#c5a880] hover:text-[#121212] disabled:cursor-not-allowed disabled:bg-[#cbd2ce] disabled:text-[#8c8c8c] transition-all cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Luxury Footer ── */}
      <footer className="border-t border-[#e9e4dc] bg-[#121212] py-12 text-center text-xs tracking-[0.2em] text-[#8c8c8c] uppercase">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-6 mb-6">
            <span className="text-[#c5a880] font-bold">Clothify</span>
            <span className="text-[#444]">|</span>
            <span>PRIVACY</span>
            <span className="text-[#444]">|</span>
            <span>TERMS OF ACCESS</span>
          </div>
          <p className="text-[10px] text-[#555]">
            © {new Date().getFullYear()} Clothify Studio, Inc. All editorial assets registered.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
