import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { addToCart } from "../../cart/state/cart.slice";
import registerFashionModel from "../../../assets/register-fashion-model.png";

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.selectedProduct);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const { handleGetProductById } = useProduct();

  useEffect(() => {
    handleGetProductById(id).catch(() => {});
  }, [id]);

  if (loading || !product) {
    return <div className="min-h-screen bg-[#f5f7f4] px-6 py-10 text-[#10201d]">Loading product...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#f5f7f4] px-6 py-10 text-[#9f1239]">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#10201d]">
      <header className="border-b border-[#d8e0dc] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-sm font-black uppercase tracking-[0.24em]">Clothify</Link>
          <Link to="/cart" className="rounded-[8px] bg-[#10201d] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">Cart {cartCount}</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2">
          {(product.images?.length ? product.images : [{ url: registerFashionModel }]).map((image, index) => (
            <div key={`${image.url}-${index}`} className="aspect-[3/4] overflow-hidden rounded-[8px] border border-[#d8e0dc] bg-[#e7eeeb]">
              <img src={image.url} alt={`${product.title} ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <button onClick={() => navigate(-1)} className="mb-5 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Back</button>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Snitch Drop</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">{product.title}</h1>
          <p className="mt-4 text-2xl font-black text-[#0f766e]">{formatCurrency(product.price?.amount, product.price?.currency)}</p>
          <p className="mt-5 text-base leading-8 text-[#56706a]">{product.description}</p>

          <div className="mt-8 grid gap-3 border-y border-[#d8e0dc] py-6 text-sm text-[#56706a]">
            <div className="flex justify-between"><span>Seller</span><strong className="text-[#10201d]">{product.seller?.username || "Verified seller"}</strong></div>
            <div className="flex justify-between"><span>Currency</span><strong className="text-[#10201d]">{product.price?.currency || "INR"}</strong></div>
            <div className="flex justify-between"><span>Status</span><strong className="text-[#0f766e]">Ready to ship</strong></div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button onClick={() => dispatch(addToCart(product))} className="rounded-[8px] bg-[#10201d] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-[#0f766e]">Add to Cart</button>
            <button onClick={() => { dispatch(addToCart(product)); navigate("/checkout"); }} className="rounded-[8px] border border-[#9bb2ab] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#10201d] hover:bg-white">Buy Now</button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ProductDetail;
