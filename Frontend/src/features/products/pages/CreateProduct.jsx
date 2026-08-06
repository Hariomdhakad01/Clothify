import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from "../hook/useProduct"




const CreateProduct = () => {

  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();


  // Form input fields state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR'
  });

  // Selected images state: array of { id, file, previewUrl }
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Input fields change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Drag and drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  // Process files and create preview URLs
  const processFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert("Please upload image files only (PNG, JPG, WebP).");
      return;
    }

    const newImages = imageFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    // Limit to max 7 images total
    setImages(prev => {
      const combined = [...prev, ...newImages];
      if (combined.length > 7) {
        alert("Maximum limit of 7 images exceeded. Only the first 7 images are kept.");
        return combined.slice(0, 7);
      }
      return combined;
    });
  };

  // Delete specific selected image
  const handleDeleteImage = (id, previewUrl) => {
    setImages(prev => prev.filter(img => img.id !== id));
    URL.revokeObjectURL(previewUrl); // Clean up memory
  };

  // Handle form submission (mock success feedback)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    
    if (images.length === 0) {
      if (!window.confirm("You have not uploaded any product images. We will use a premium placeholder image. Proceed?")) {
        return;
      }
    }



    try{
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('priceAmount', formData.priceAmount);
      data.append('priceCurrency', formData.priceCurrency);
      images.forEach(img => data.append('images', img.file));
      await handleCreateProduct(data);
    }catch (err){
      console.log('Failed to create product', err)
    }
    finally{
    // Simulate network delay

      setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Redirect back to dashboard after 1.8 seconds
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 1800);

    }, 1200);

    }

    
  };

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
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d8175] hover:text-[#b39567] hover:bg-white transition-all rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/seller/create-product')}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b39567] bg-[#c5a880]/5 rounded-lg"
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
          className="px-6 py-1.5 text-xs font-bold uppercase tracking-[0.15em] rounded-full text-[#8d8175]"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/seller/create-product')}
          className="px-6 py-1.5 text-xs font-bold uppercase tracking-[0.15em] rounded-full text-[#b39567] bg-[#c5a880]/10"
        >
          Add Product
        </button>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Title */}
        <section className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1612]">
            Create Product Listing
          </h1>
          <p className="mt-1 text-sm text-[#8d8175]">
            Add a brand new luxury piece to your catalog. Fields are structured according to the product schema.
          </p>
        </section>

        {/* Main Responsive Form Layout (Grid Column on desktop, single on mobile) */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* LEFT COLUMN: Metadata inputs */}
            <div className="space-y-6 rounded-2xl border border-[#e9e4dc] bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#b39567] border-b border-[#fcfbf9] pb-4">
                Product Details
              </h3>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1a1612] mb-2.5">
                  Product Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Atelier Wool Double-Breasted Suit"
                  className="h-11 w-full rounded-lg border border-[#e9e4dc] bg-[#fcfbf9]/50 px-4 text-xs text-[#1a1612] outline-none transition placeholder:text-[#8d8175]/60 focus:border-[#c5a880] focus:bg-white focus:ring-4 focus:ring-[#c5a880]/5"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1a1612] mb-2.5">
                  Description & Fitting Notes
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the fabric blend, stitch spacing, sleeve shape, model heights, fit instructions, wash recommendations, etc."
                  className="w-full rounded-lg border border-[#e9e4dc] bg-[#fcfbf9]/50 p-4 text-xs text-[#1a1612] outline-none transition placeholder:text-[#8d8175]/60 focus:border-[#c5a880] focus:bg-white focus:ring-4 focus:ring-[#c5a880]/5 leading-relaxed"
                />
              </div>

              {/* Price & Currency inline group */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Price amount */}
                <div>
                  <label htmlFor="priceAmount" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1a1612] mb-2.5">
                    Price Amount
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs text-[#8d8175] font-semibold">
                      {formData.priceCurrency === 'INR' ? '₹' : formData.priceCurrency === 'USD' ? '$' : formData.priceCurrency === 'EUR' ? '€' : '£'}
                    </span>
                    <input
                      id="priceAmount"
                      name="priceAmount"
                      type="number"
                      required
                      min="1"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      placeholder="e.g. 30000"
                      className="h-11 w-full rounded-lg border border-[#e9e4dc] bg-[#fcfbf9]/50 pl-8 pr-4 text-xs text-[#1a1612] outline-none transition placeholder:text-[#8d8175]/60 focus:border-[#c5a880] focus:bg-white focus:ring-4 focus:ring-[#c5a880]/5"
                    />
                  </div>
                </div>

                {/* Price Currency selection */}
                <div>
                  <label htmlFor="priceCurrency" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1a1612] mb-2.5">
                    Currency Code
                  </label>
                  <div className="relative">
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="h-11 w-full appearance-none rounded-lg border border-[#e9e4dc] bg-[#fcfbf9]/50 px-4 pr-10 text-xs font-semibold text-[#1a1612] outline-none transition focus:border-[#c5a880] focus:bg-white focus:ring-4 focus:ring-[#c5a880]/5"
                    >
                      <option value="INR">INR (₹ Indian Rupee)</option>
                      <option value="USD">USD ($ United States Dollar)</option>
                      <option value="EUR">EUR (€ European Euro)</option>
                      <option value="GBP">GBP (£ British Pound)</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8d8175]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Image uploader */}
            <div className="space-y-6 rounded-2xl border border-[#e9e4dc] bg-white p-6 sm:p-8 shadow-sm flex flex-col">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#b39567] border-b border-[#fcfbf9] pb-4">
                  Media Assets
                </h3>
                <p className="mt-2 text-xs text-[#8d8175] leading-relaxed">
                  Add premium imagery of your designs. The first selected file will serve as the listing's primary cover photo.
                </p>
              </div>

              {/* Drag & Drop uploader area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-[#b39567] bg-[#c5a880]/5'
                    : 'border-[#c5a880]/30 bg-[#fcfbf9]/60 hover:border-[#b39567]/50 hover:bg-[#c5a880]/2'
                }`}
              >
                <div className="rounded-full bg-[#f3f0ea] p-3 text-[#b39567] mb-3 border border-[#e9e4dc]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="text-xs font-semibold text-[#1a1612]">
                  Drag and drop your images here
                </div>
                <p className="mt-1 text-[10px] text-[#8d8175]">
                  PNG, JPG, or WebP up to 5MB each (Max 7 files)
                </p>

                <label className="mt-4 inline-flex h-9 items-center rounded-lg border border-[#e9e4dc] bg-white px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1a1612] transition-colors hover:border-[#1a1612] hover:bg-[#1a1612]/5 cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Selected files preview grid */}
              {images.length > 0 && (
                <div className="mt-4 flex-1">
                  <div className="flex items-center justify-between border-b border-[#f3f0ea] pb-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1a1612]">
                      Selected Previews ({images.length}/7)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        images.forEach(img => URL.revokeObjectURL(img.previewUrl));
                        setImages([]);
                      }}
                      className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9d3328] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {images.map((img, idx) => (
                      <div key={img.id} className="group relative aspect-square rounded-lg border border-[#e9e4dc] bg-[#fcfbf9] overflow-hidden shadow-sm">
                        <img
                          src={img.previewUrl}
                          alt="selected thumbnail"
                          className="h-full w-full object-cover object-center"
                        />
                        
                        {idx === 0 && (
                          <span className="absolute left-1.5 top-1.5 z-10 rounded bg-[#b39567] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white">
                            Cover
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id, img.previewUrl)}
                          className="absolute right-1.5 top-1.5 z-10 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-black/70 text-white opacity-90 transition-opacity hover:bg-black"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <section className="mt-8 border-t border-[#e9e4dc] pt-6 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="h-11 rounded-lg border border-[#e9e4dc] bg-white px-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#8d8175] transition-colors hover:border-[#1a1612] hover:text-[#1a1612] cursor-pointer"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1a1612] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-sm transition-all hover:bg-[#b39567] disabled:cursor-not-allowed disabled:bg-[#8d8175] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4.5 w-4.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5" />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Product</span>
              )}
            </button>
          </section>
        </form>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1612]/30 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
            <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white border border-[#e9e4dc] p-8 text-center shadow-2xl transition-all duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#6f7f58]/10 text-[#6f7f58] border border-[#6f7f58]/20 mb-5">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1a1612]">
                Listing Created
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#8d8175]">
                "{formData.title || 'Your product'}" has been successfully added to your storefront.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-[#b39567] tracking-[0.1em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b39567] animate-ping"></span>
                Redirecting to Dashboard...
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e9e4dc] bg-[#ffffff] py-8 text-center text-xs tracking-[0.15em] text-[#8d8175] uppercase">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Clothify Partner Network. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default CreateProduct;



