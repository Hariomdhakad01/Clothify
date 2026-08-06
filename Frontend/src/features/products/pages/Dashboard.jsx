import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from "../hook/useProduct"
import { useSelector } from 'react-redux';


const Dashboard = () => {

  const {handleGetSellerProduct} = useProduct()
  const sellerProducts = useSelector(state => state.product.sellerProducts)
  const navigate = useNavigate();

 
  useEffect(()=>{
    handleGetSellerProduct()
  },[]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState(null);


  // Format currency helper
  const formatCurrency = (amount, currency) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Perform filtering & sorting locally
  const filteredProducts = sellerProducts
    .filter(product => {
      const titleMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || descMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price.amount - b.price.amount;
      }
      if (sortBy === 'price-high') {
        return b.price.amount - a.price.amount;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Calculate metrics
  const totalListings = sellerProducts.length;
  const totalValue = sellerProducts.reduce((acc, curr) => acc + curr.price.amount, 0);

  return (
    
  
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a1612] font-sans antialiased selection:bg-[#c5a880]/20 selection:text-[#1a1612]">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e9e4dc] bg-[#ffffff]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#c5a880]/60 bg-[#c5a880]/5 text-xs font-semibold tracking-[0.15em] text-[#b39567]">
                  CF
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#1a1612]">
                    CLOTHIFY
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8d8175]">
                    Seller Hub
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1 ml-10 border-l border-[#e9e4dc] pl-8">
                <button
                  onClick={() => navigate('/seller/dashboard')}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b39567] bg-[#c5a880]/5 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/seller/create-product')}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d8175] hover:text-[#b39567] hover:bg-white transition-all rounded-lg"
                >
                  Add Product
                </button>
              </nav>
            </div>

            {/* Right Side Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#c5a880]/30 bg-[#c5a880]/5 px-3.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b39567] animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#b39567]">
                  Gold Partner
                </span>
              </div>

              <div className="flex items-center gap-3 border-l border-[#e9e4dc] pl-4 sm:pl-6">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#1a1612]">Boutique Seller</span>
                  <span className="text-[10px] text-[#8d8175]">partner@clothify.com</span>
                </div>
                
                <button
                  onClick={() => navigate('/')}
                  className="rounded-lg border border-[#e9e4dc] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#8d8175] hover:border-[#1a1612] hover:text-[#1a1612] hover:bg-[#1a1612]/5 transition-all"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b border-[#e9e4dc] bg-white flex justify-around py-3">
        <button
          onClick={() => navigate('/seller/dashboard')}
          className="px-6 py-1.5 text-xs font-bold uppercase tracking-[0.15em] rounded-full text-[#b39567] bg-[#c5a880]/10"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/seller/create-product')}
          className="px-6 py-1.5 text-xs font-bold uppercase tracking-[0.15em] rounded-full text-[#8d8175]"
        >
          Add Product
        </button>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Upper Metrics Section */}
        <section className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Listings Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(26,22,18,0.03)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d8175]">
                Active Listings
              </span>
              <span className="rounded-full bg-[#f3f0ea] p-2 text-[#b39567] transition-colors group-hover:bg-[#c5a880]/10">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#1a1612]">{totalListings}</span>
              <span className="text-xs text-[#8d8175] font-medium">Drops</span>
            </div>
            <div className="mt-4 border-t border-[#fcfbf9] pt-3 text-[10px] text-[#8d8175]">
              <span className="font-semibold text-[#6f7f58]">100% Active</span> status on all channels
            </div>
          </div>

          {/* Value Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(26,22,18,0.03)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d8175]">
                Catalog Value
              </span>
              <span className="rounded-full bg-[#f3f0ea] p-2 text-[#b39567] transition-colors group-hover:bg-[#c5a880]/10">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 6h4" />
                </svg>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#1a1612]">
                {formatCurrency(totalValue, "INR")}
              </span>
              <span className="text-xs text-[#8d8175] font-medium">Estimated</span>
            </div>
            <div className="mt-4 border-t border-[#fcfbf9] pt-3 text-[10px] text-[#8d8175]">
              Based on active currency allocations
            </div>
          </div>

          {/* Boutique Level Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(26,22,18,0.03)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d8175]">
                Boutique Level
              </span>
              <span className="rounded-full bg-[#f3f0ea] p-2 text-[#b39567] transition-colors group-hover:bg-[#c5a880]/10">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[#1a1612]">Level II</span>
              <span className="text-xs text-[#8d8175] font-medium">Premium</span>
            </div>
            <div className="mt-4 border-t border-[#fcfbf9] pt-3 text-[10px] text-[#8d8175]">
              Unlocks customized storefront branding
            </div>
          </div>
        </section>

        {/* Catalog Control Card */}
        <section className="mb-8 bg-white border border-[#e9e4dc] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1a1612]">
                Storefront Catalog
              </h1>
              <p className="mt-1 text-sm text-[#8d8175]">
                Create, review, and curate your premium brand's apparel drops.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/seller/create-product')}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1a1612] px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-sm transition-all hover:bg-[#b39567] cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {/* Search & Sort Panels */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-[#f3f0ea] pt-6">
            <div className="relative sm:col-span-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8d8175]">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search catalog by title, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-lg border border-[#e9e4dc] bg-[#fcfbf9]/60 pl-10 pr-4 text-xs text-[#1a1612] outline-none transition focus:border-[#c5a880] focus:bg-white focus:ring-4 focus:ring-[#c5a880]/5"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-[#8d8175] hover:text-[#1a1612]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#e9e4dc] bg-[#fcfbf9]/60 px-4 pr-10 text-xs font-medium text-[#4a443e] outline-none transition focus:border-[#c5a880] focus:bg-white focus:ring-4 focus:ring-[#c5a880]/5"
              >
                <option value="newest">Sort by: Newest Listed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8d8175]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e9e4dc] bg-white py-16 px-4 text-center">
            <div className="rounded-full bg-[#fcfbf9] p-4 text-[#8d8175] border border-[#e9e4dc]">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V11M4 11v10l8 4" />
              </svg>
            </div>
            <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-[#1a1612]">
              No Items Found
            </h3>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-6 h-10 rounded-lg border border-[#e9e4dc] px-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#b39567] hover:border-[#b39567] transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(26,22,18,0.04)]"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#fbfaf7] border-b border-[#e9e4dc]/60">
                  <img
                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {product.images?.length > 1 && (
                    <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1 rounded bg-[#1a1612]/75 px-2 py-1 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>1 / {product.images.length}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#1a1612]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center pb-6">
                    <span className="rounded-lg bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1612] shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Product Metadata Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b39567]">
                      Streetwear Drop
                    </span>
                    <span className="text-[9px] text-[#8d8175]">
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-[#1a1612] line-clamp-1 group-hover:text-[#b39567] transition-colors">
                    {product.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#8d8175] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#fcfbf9] pt-3">
                    <span className="text-sm font-bold text-[#1a1612]">
                      {formatCurrency(product.price.amount, product.price.currency)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#6f7f58] tracking-wider">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Product Detail Preview Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div
            className="absolute inset-0 bg-[#1a1612]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative z-10 w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white border border-[#e9e4dc] shadow-2xl transition-all duration-500 max-h-[90vh] flex flex-col md:flex-row animate-[fadeIn_0.3s_ease-out]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4.5 top-4.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-[#e9e4dc] text-[#1a1612] hover:bg-white hover:border-[#1a1612] transition-all cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full md:w-1/2 bg-[#fbfaf7] relative aspect-[4/5] md:aspect-auto">
              <img
                src={selectedProduct.images?.[0]?.url}
                alt={selectedProduct.title}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/30 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="inline-block rounded bg-[#c5a880]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b39567]">
                    Boutique Drop
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#8d8175]">
                    ID: {selectedProduct._id.substring(selectedProduct._id.length - 8)}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1a1612]">
                  {selectedProduct.title}
                </h2>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#b39567]">
                    {formatCurrency(selectedProduct.price.amount, selectedProduct.price.currency)}
                  </span>
                  <span className="text-xs text-[#8d8175] font-semibold uppercase tracking-[0.1em]">
                    (Tax Included)
                  </span>
                </div>

                <div className="mt-6 border-t border-[#e9e4dc]/70 pt-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1a1612]">
                    Description
                  </h4>
                  <p className="mt-3 text-xs leading-relaxed text-[#4a443e]">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="mt-6 space-y-3.5 border-t border-[#e9e4dc]/70 pt-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8d8175]">Seller Signature:</span>
                    <span className="font-semibold text-[#1a1612] tracking-wider select-all">
                      {selectedProduct.seller}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8d8175]">Listing Created:</span>
                    <span className="text-[#4a443e]">
                      {new Date(selectedProduct.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8d8175]">API Schema Version:</span>
                    <span className="font-bold text-[#6f7f58]">__v: {selectedProduct.__v}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e9e4dc]/70 flex items-center gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 h-11 rounded-lg border border-[#e9e4dc] text-xs font-semibold uppercase tracking-[0.15em] text-[#8d8175] hover:border-[#1a1612] hover:text-[#1a1612] transition-all cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e9e4dc] bg-[#ffffff] py-8 text-center text-xs tracking-[0.15em] text-[#8d8175] uppercase">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Clothify Partner Network. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
//   <>
//             {/* Google Fonts */}
//             <link
//                 href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
//                 rel="stylesheet"
//             />

//             <div
//                 className="min-h-screen selection:bg-[#C9A96E]/30"
//                 style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
//             >
//                 <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">

//                     {/* ── Top Bar ── */}
//                     <div className="pt-10 pb-0 flex items-center gap-5">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="text-lg transition-colors duration-200 leading-none"
//                             style={{ color: '#B5ADA3' }}
//                             aria-label="Go back"
//                             onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
//                             onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
//                         >
//                             ←
//                         </button>
//                         <span
//                             className="text-xs font-medium tracking-[0.32em] uppercase"
//                             style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
//                         >
//                             Snitch.
//                         </span>
//                     </div>

//                     {/* ── Page Header ── */}
//                     <div className="pt-10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
//                         <div>
//                             <h1
//                                 className="text-4xl lg:text-5xl font-light leading-tight"
//                                 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
//                             >
//                                 Your Vault
//                             </h1>
//                             {/* Gold rule separator */}
//                             <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
//                         </div>

//                         <button
//                             onClick={() => navigate('/seller/create-product')}
//                             className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 w-full md:w-auto text-center"
//                             style={{
//                                 backgroundColor: '#1b1c1a',
//                                 color: '#fbf9f6',
//                                 fontFamily: "'Inter', sans-serif"
//                             }}
//                             onMouseEnter={e => {
//                                 e.currentTarget.style.backgroundColor = '#C9A96E';
//                                 e.currentTarget.style.color = '#1b1c1a';
//                             }}
//                             onMouseLeave={e => {
//                                 e.currentTarget.style.backgroundColor = '#1b1c1a';
//                                 e.currentTarget.style.color = '#fbf9f6';
//                             }}
//                         >
//                             New Listing
//                         </button>
//                     </div>

//                     {/* ── Product Grid ── */}
//                     {sellerProducts && sellerProducts.length > 0 ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 pb-24">
//                             {sellerProducts.map(product => {
//                                 const imageUrl = product.images && product.images.length > 0
//                                     ? product.images[ 0 ].url
//                                     : '/snitch_editorial_warm.png'; // Fallback to our warm editorial

//                                 return (
//                                     <div
//                                         // onClick={() => { navigate(`/seller/product/${product._id}`) }}
//                                         key={product._id} className="group cursor-pointer flex flex-col">
//                                         {/* Image Container */}
//                                         <div className="aspect-[4/5] overflow-hidden mb-6" style={{ backgroundColor: '#f5f3f0' }}>
//                                             <img
//                                                 src={imageUrl}
//                                                 alt={product.title}
//                                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                                             />
//                                         </div>

//                                         {/* Product Details */}
//                                         <div className="flex flex-col gap-2">
//                                             <div className="flex items-start justify-between gap-4">
//                                                 <h3
//                                                     className="text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E]"
//                                                     style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
//                                                 >
//                                                     {product.title}
//                                                 </h3>
//                                             </div>

//                                             <p
//                                                 className="text-[12px] line-clamp-2 leading-relaxed"
//                                                 style={{ color: '#7A6E63' }}
//                                             >
//                                                 {product.description}
//                                             </p>

//                                             <div className="mt-2">
//                                                 <span
//                                                     className="text-[10px] uppercase tracking-[0.2em] font-medium"
//                                                     style={{ color: '#1b1c1a' }}
//                                                 >
//                                                     {product.price?.currency} {product.price?.amount?.toLocaleString()}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ) : (
//                         <div className="py-24 text-center flex flex-col items-center">
//                             <span className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#C9A96E' }}>Empty Vault</span>
//                             <p className="max-w-md mx-auto text-lg leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }}>
//                                 You haven't added any curated pieces to your archive yet. Begin by creating a new listing.
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>

};

export default Dashboard;

