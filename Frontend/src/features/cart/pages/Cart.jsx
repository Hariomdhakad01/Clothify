import React from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../state/cart.slice";
import registerFashionModel from "../../../assets/register-fashion-model.png";

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);
  const currency = items[0]?.price?.currency || "INR";

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#10201d]">
      <header className="border-b border-[#d8e0dc] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-sm font-black uppercase tracking-[0.24em]">Clothify</Link>
          <Link to="/orders" className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Orders</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black">Shopping Cart</h1>

        {items.length === 0 ? (
          <section className="mt-8 rounded-[8px] border border-dashed border-[#a8bbb5] bg-white p-10 text-center">
            <h2 className="text-xl font-black">Your cart is empty</h2>
            <p className="mt-2 text-sm text-[#56706a]">Add a drop from the storefront to begin checkout.</p>
            <Link to="/" className="mt-6 inline-block rounded-[8px] bg-[#0f766e] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">Browse Products</Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              {items.map((item) => (
                <article key={item.productId} className="grid grid-cols-[92px_1fr] gap-4 rounded-[8px] border border-[#d8e0dc] bg-white p-4 sm:grid-cols-[120px_1fr_auto]">
                  <img src={item.image || registerFashionModel} alt={item.title} className="h-28 w-full rounded-[8px] object-cover" />
                  <div>
                    <h2 className="font-black">{item.title}</h2>
                    <p className="mt-1 text-sm font-bold text-[#0f766e]">{formatCurrency(item.price.amount, item.price.currency)}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))} className="h-9 w-9 rounded-[8px] border border-[#cbd8d3] font-black">-</button>
                      <span className="grid h-9 min-w-10 place-items-center rounded-[8px] bg-[#f5f7f4] text-sm font-black">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))} className="h-9 w-9 rounded-[8px] border border-[#cbd8d3] font-black">+</button>
                    </div>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.productId))} className="self-start rounded-[8px] border border-[#efc7c7] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#b42318] hover:bg-[#fff1f1]">Remove</button>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-[8px] border border-[#d8e0dc] bg-white p-5">
              <h2 className="text-lg font-black">Order Summary</h2>
              <div className="mt-5 space-y-3 text-sm text-[#56706a]">
                <div className="flex justify-between"><span>Subtotal</span><strong className="text-[#10201d]">{formatCurrency(total, currency)}</strong></div>
                <div className="flex justify-between"><span>Delivery</span><strong className="text-[#0f766e]">Free</strong></div>
              </div>
              <div className="mt-5 border-t border-[#d8e0dc] pt-5 text-xl font-black">{formatCurrency(total, currency)}</div>
              <button onClick={() => navigate("/checkout")} className="mt-5 w-full rounded-[8px] bg-[#10201d] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-[#0f766e]">Checkout</button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
