import React, { useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useOrders } from "../hook/useOrders";
import registerFashionModel from "../../../assets/register-fashion-model.png";

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const Orders = () => {
  const { handleGetMyOrders } = useOrders();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    handleGetMyOrders().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#10201d]">
      <header className="border-b border-[#d8e0dc] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-sm font-black uppercase tracking-[0.24em]">Clothify</Link>
          <Link to="/cart" className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Cart</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Account</p>
        <h1 className="mt-2 text-3xl font-black">Your Orders</h1>

        {loading && <p className="mt-8 text-sm text-[#56706a]">Loading orders...</p>}
        {error && <p className="mt-8 rounded-[8px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#be123c]">{error}</p>}

        {!loading && orders.length === 0 && (
          <section className="mt-8 rounded-[8px] border border-dashed border-[#a8bbb5] bg-white p-10 text-center">
            <h2 className="text-xl font-black">No orders yet</h2>
            <p className="mt-2 text-sm text-[#56706a]">Your completed checkouts will appear here.</p>
            <Link to="/" className="mt-6 inline-block rounded-[8px] bg-[#0f766e] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">Start Shopping</Link>
          </section>
        )}

        <section className="mt-8 space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="rounded-[8px] border border-[#d8e0dc] bg-white p-5">
              <div className="flex flex-col gap-3 border-b border-[#d8e0dc] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-black">Order #{order._id.slice(-8).toUpperCase()}</h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#56706a]">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em]">
                  <span className="rounded-[8px] bg-[#ecfdf5] px-3 py-2 text-[#0f766e]">{order.orderStatus}</span>
                  <span className="rounded-[8px] bg-[#eef2ff] px-3 py-2 text-[#3730a3]">{order.payment?.provider || "none"}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.product}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-3">
                    <img src={item.image || registerFashionModel} alt={item.title} className="h-16 w-16 rounded-[8px] object-cover" />
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-[#56706a]">Qty {item.quantity}</p>
                    </div>
                    <strong>{formatCurrency(item.price.amount * item.quantity, item.price.currency)}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-[#d8e0dc] pt-4 text-lg font-black">
                <span>Total</span>
                <span>{formatCurrency(order.total.amount, order.total.currency)}</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Orders;
