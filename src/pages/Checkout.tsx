// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/store/cart";
// import { authAxios } from "@/lib/axios";

// const stripePromise = loadStripe("pk_test_51RjHOuQAymdmaVxci9mY3H3T1aST2fggTiu6MTBcAkytcn0lOdpAxSmQ91QaDE4Yb8UqmwdWsFqREvdhbeTMLTZ000QKa1lnxe"); // ✅ Your publishable key
// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const { getTotalPrice, items, clearCart } = useCart();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     setError("");

//     try {
//       // ✅ 1. Create Payment Intent
//       const { data } = await authAxios.post("/create-payment-intent/", {
//         amount: getTotalPrice(),
//       });
//       const clientSecret = data.clientSecret;

//       // ✅ 2. Confirm Payment
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement)!,
//         },
//       });

//       if (result.error) {
//         setError(result.error.message || "Payment failed");

//         // ✅ Redirect to cancel page with reason
//         const reason = encodeURIComponent(result.error.message || "Payment failed");
//         window.location.href = `/payment-cancelled?reason=${reason}`;
//       } else if (result.paymentIntent?.status === "succeeded") {
//         // ✅ 3. Create Order
//         const { data: order } = await authAxios.post("/orders/", {
//           total_price: getTotalPrice(),
//           is_paid: true,
//           payment_method: "Stripe",
//           items: items.map((i) => ({
//             product: i.id,
//             quantity: i.quantity,
//             price: i.price,
//           })),
//         });

//         clearCart();

//         // ✅ Redirect to Payment Success page with order_id
//         window.location.href = `/payment-success?order_id=${order.id}`;
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong, please try again.");

//       // ✅ Redirect to cancel page with generic error reason
//       const reason = encodeURIComponent("Server error during payment");
//       window.location.href = `/payment-cancelled?reason=${reason}`;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <CardElement
//         className="border p-4 rounded"
//         options={{
//           style: {
//             base: {
//               fontSize: "16px",
//               color: "#32325d",
//               "::placeholder": { color: "#aab7c4" },
//             },
//             invalid: { color: "#fa755a" },
//           },
//         }}
//       />
//       {error && <p className="text-red-500">{error}</p>}
//       <Button type="submit" disabled={!stripe || loading} className="w-full bg-blue-600 text-white">
//         {loading ? "Processing..." : `Pay $${getTotalPrice().toFixed(2)}`}
//       </Button>
//     </form>
//   );
// };


// const CheckoutPage = () => {
//   const { items, getTotalPrice } = useCart();

//   return (
//     <div className="max-w-lg mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>
//       <div className="border rounded p-4 mb-6">
//         {items.map((item) => (
//           <div key={item.id} className="flex justify-between mb-2">
//             <span>{item.name} x {item.quantity}</span>
//             <span>${(item.price * item.quantity).toFixed(2)}</span>
//           </div>
//         ))}
//         <div className="border-t pt-4 font-bold">Total: ${getTotalPrice().toFixed(2)}</div>
//       </div>
//       <Elements stripe={stripePromise}>
//         <CheckoutForm />
//       </Elements>
//     </div>
//   );
// };

// export default CheckoutPage;
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/store/cart";
import { authAxios } from "@/lib/axios";
import { createOrder } from "@/lib/api";

const stripePromise = loadStripe("pk_test_51RjHOuQAymdmaVxci9mY3H3T1aST2fggTiu6MTBcAkytcn0lOdpAxSmQ91QaDE4Yb8UqmwdWsFqREvdhbeTMLTZ000QKa1lnxe");

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
      const { data } = await authAxios.post("/create-payment-intent/", {
        amount: getTotalPrice(),
      });
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        const reason = encodeURIComponent(result.error.message || "Payment failed");
        window.location.href = `/payment-cancelled?reason=${reason}`;
      } else if (result.paymentIntent?.status === "succeeded") {
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
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
      const reason = encodeURIComponent("Server error during payment");
      window.location.href = `/payment-cancelled?reason=${reason}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-4 rounded" />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={!stripe || loading} className="w-full bg-blue-600 text-white">
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
          <Input placeholder="Address" onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })} />
          <Input placeholder="City" onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} />
          <Input placeholder="ZIP Code" onChange={(e) => setShippingData({ ...shippingData, zip_code: e.target.value })} />
          <Input placeholder="Phone" onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })} />
        </div>

        {/* Order Summary + Payment */}
        <div>
          <div className="border rounded p-4 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 font-bold">Total: ${getTotalPrice().toFixed(2)}</div>
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
