// src/pages/Checkout.tsx
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/store/cart";
import { authAxios } from "@/lib/axios";
import { createOrder } from "@/lib/api";

// ⚠️ YEH KEY .env file wale STRIPE_PUBLISHABLE_KEY se MATCH karni chahiye
// Backend settings.py mein jo STRIPE_PUBLISHABLE_KEY hai wahi yahan daalo
const stripePromise = loadStripe("pk_test_51TSiyVRuu0Gtd2208CNo2iKCon3gxUqIztyNva5AnR6FZIimMMnTga99WopIvDRsYuAgrTc5FV6NQlHbtTFOi0Se002TSQMhex");

const CheckoutForm = ({ shippingData }: { shippingData: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { getTotalPrice, items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // Step 1: Create Payment Intent
      console.log("Creating payment intent for:", getTotalPrice());
      const { data } = await authAxios.post("/create-payment-intent/", {
        amount: getTotalPrice(),
      });

      if (!data.clientSecret) {
        throw new Error("No client secret received");
      }

      console.log("Client secret received, confirming payment...");

      // Step 2: Confirm Payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        // ✅ Incomplete card details check
        if (result.error.type === "validation_error") {
          const reason = encodeURIComponent("Incomplete or invalid card details");
          window.location.href = `/payment-cancelled?reason=${reason}`;
          return;
        }
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded! Creating order...");

        // Step 3: Create Order
        const orderData = {
          total_price: getTotalPrice(),
          is_paid: true,
          payment_method: "Stripe",
          shipping_address: shippingData,
          items: items.map((i) => ({
            product: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
        };

        const order = await createOrder(orderData);
        clearCart();
        window.location.href = `/payment-success?order_id=${order.id}`;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      // ✅ Expired or invalid Stripe secret key check
      const errorMsg = err.response?.data?.error || "";
      if (errorMsg.toLowerCase().includes("stripe") || errorMsg.toLowerCase().includes("api key") || err.response?.status === 502) {
        const reason = encodeURIComponent("Payment configuration error or expired keys");
        window.location.href = `/payment-cancelled?reason=${reason}`;
        return;
      }
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-4 rounded">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
            },
          }}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white"
      >
        {loading ? "Processing..." : `Pay $${getTotalPrice().toFixed(2)}`}
      </Button>
    </form>
  );
};

const CheckoutPage = () => {
  const { items, getTotalPrice } = useCart();
  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    zip_code: "",
    country: "Pakistan",
    phone: "",
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Form */}
        <div className="space-y-4">
          <h2 className="font-semibold">Shipping Address</h2>
          <Input
            placeholder="Address"
            value={shippingData.address}
            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
          />
          <Input
            placeholder="City"
            value={shippingData.city}
            onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
          />
          <Input
            placeholder="ZIP Code"
            value={shippingData.zip_code}
            onChange={(e) => setShippingData({ ...shippingData, zip_code: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={shippingData.phone}
            onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
          />
        </div>

        {/* Order Summary + Payment */}
        <div>
          <div className="border rounded p-4 mb-4">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 font-bold">
              Total: ${getTotalPrice().toFixed(2)}
            </div>
          </div>
          <Elements stripe={stripePromise}>
            <CheckoutForm shippingData={shippingData} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;