import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../cart/state/cart.slice";
import { useOrders } from "../hook/useOrders";
import { getPaymentConfig } from "../../payments/service/payment.api";
import { startRazorpayCheckout } from "../../payments/razorpayCheckout";

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.cart.items);
  const { loading, error } = useSelector((state) => state.orders);
  const { handleCreateOrder, handleVerifyPayment } = useOrders();
  const [paymentConfig, setPaymentConfig] = useState({ razorpay: { enabled: false } });
  const [paymentProvider, setPaymentProvider] = useState("none");
  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    phone: user?.contact || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const currency = items[0]?.price?.currency || "INR";
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0), [items]);

  useEffect(() => {
    getPaymentConfig().then((data) => setPaymentConfig(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (paymentConfig.razorpay?.enabled) {
      setPaymentProvider("razorpay");
    }
  }, [paymentConfig.razorpay?.enabled]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      shippingAddress: formData,
      paymentProvider,
    };

    const data = await handleCreateOrder(payload);

    // RAZORPAY CODE START - checkout popup stays in this removable block.
    if (data.payment?.provider === "razorpay") {
      const paymentResponse = await startRazorpayCheckout({
        payment: data.payment,
        user,
        shippingAddress: formData,
      });

      await handleVerifyPayment({
        orderId: data.order._id,
        paymentResponse,
      });
    }
    // RAZORPAY CODE END

    dispatch(clearCart());
    navigate("/orders");
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f7f4] px-6 py-12 text-center text-[#10201d]">
        <h1 className="text-3xl font-black">Checkout needs a cart</h1>
        <Link to="/" className="mt-6 inline-block rounded-[8px] bg-[#0f766e] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">Shop Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#10201d]">
      <header className="border-b border-[#d8e0dc] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-sm font-black uppercase tracking-[0.24em]">Clothify</Link>
          <Link to="/cart" className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Back to Cart</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <form onSubmit={handleSubmit} className="rounded-[8px] border border-[#d8e0dc] bg-white p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Delivery</p>
          <h1 className="mt-2 text-3xl font-black">Shipping Details</h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "10 digit phone"],
              ["line1", "Address line 1"],
              ["line2", "Address line 2"],
              ["city", "City"],
              ["state", "State"],
              ["postalCode", "Postal code"],
              ["country", "Country"],
            ].map(([name, label]) => (
              <label key={name} className={name === "line1" || name === "line2" ? "sm:col-span-2" : ""}>
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#37524d]">{label}</span>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "line2"}
                  className="h-11 w-full rounded-[8px] border border-[#cbd8d3] bg-[#f5f7f4] px-4 text-sm outline-none focus:border-[#0f766e]"
                />
              </label>
            ))}
          </div>

          <section className="mt-7 border-t border-[#d8e0dc] pt-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Payment</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentConfig.razorpay?.enabled && (
                <label className="cursor-pointer rounded-[8px] border border-[#cbd8d3] p-4 has-[:checked]:border-[#0f766e] has-[:checked]:bg-[#ecfdf5]">
                  <input type="radio" name="paymentProvider" value="razorpay" checked={paymentProvider === "razorpay"} onChange={() => setPaymentProvider("razorpay")} />
                  <span className="ml-2 text-sm font-black">Razorpay Online</span>
                </label>
              )}
              <label className="cursor-pointer rounded-[8px] border border-[#cbd8d3] p-4 has-[:checked]:border-[#0f766e] has-[:checked]:bg-[#ecfdf5]">
                <input type="radio" name="paymentProvider" value="none" checked={paymentProvider === "none"} onChange={() => setPaymentProvider("none")} />
                <span className="ml-2 text-sm font-black">Pay Later</span>
              </label>
            </div>
          </section>

          {error && <p className="mt-5 rounded-[8px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#be123c]">{error}</p>}

          <button disabled={loading} className="mt-7 w-full rounded-[8px] bg-[#10201d] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:bg-[#91a39e]">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <aside className="h-fit rounded-[8px] border border-[#d8e0dc] bg-white p-5">
          <h2 className="text-lg font-black">Summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4 text-sm">
                <span className="text-[#56706a]">{item.title} x {item.quantity}</span>
                <strong>{formatCurrency(item.price.amount * item.quantity, item.price.currency)}</strong>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-[#d8e0dc] pt-5 text-2xl font-black">{formatCurrency(total, currency)}</div>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;
