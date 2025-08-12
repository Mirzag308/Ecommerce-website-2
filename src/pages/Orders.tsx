// // Orders.tsx 
// // import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { authAxios } from "@/lib/axios";
// import { useCart } from "@/store/cart";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import { getOrders } from "@/lib/api";

// const stripePromise = loadStripe("pk_test_51RjHOuQAymdmaVxchRV1yIQONrnU9DUjeH2cc6jL8S8R5HvHQ27Cmif5TVLcaWgjzLSE96sEGH6BOW9SSUhoKJJU00K97id4uM"); // ✅ tumhara publishable key
// const OrdersPage = () => {
//   const [orders, setOrders] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const data = await getOrders();
//       setOrders(data);
//     };
//     fetchOrders();
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">My Orders</h1>
//       <div className="space-y-4">
//         {orders.length === 0 ? (
//           <p>No paid orders yet.</p>
//         ) : (
//           orders.map((order) => (
//             <Card key={order.id} className="p-4">
//               <CardHeader>
//                 <CardTitle>Order #{order.id}</CardTitle>
//                 <p>Status: {order.status}</p>
//                 <p>Total: ${order.total_price}</p>
//                 <p>Payment Method: {order.payment_method}</p>
//                 <p>Paid: {order.is_paid ? "Yes" : "No"}</p>
//                 <p>Paid At: {order.paid_at ? new Date(order.paid_at).toLocaleString() : "Not Paid"}</p>
//                 <p>Delivered: {order.is_delivered ? "Yes" : "No"}</p>
//                 <p>Delivered At: {order.delivered_at ? new Date(order.delivered_at).toLocaleString() : "Pending"}</p>
//                 <p>Created: {new Date(order.created_at).toLocaleString()}</p>
//                 <p>Updated: {new Date(order.updated_at).toLocaleString()}</p>
//               </CardHeader>
//               <CardContent>
//                 <h3 className="font-bold mb-2">Items:</h3>
//                 {order.items.map((item: any) => (
//                   <div key={item.id} className="flex justify-between border-b py-2">
//                     <span>{item.product} x {item.quantity}</span>
//                     <span>${item.price}</span>
//                   </div>
//                 ))}
//                 <div className="mt-4">
//                   <h4 className="font-semibold">Shipping:</h4>
//                   <p>{order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.zip_code}, {order.shipping_address.country}</p>
//                   <p>Phone: {order.shipping_address.phone}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };


// // const OrdersPage = () => {
// //   const [orders, setOrders] = useState<any[]>([]);

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       const data = await getOrders();
// //       setOrders(data);
// //     };
// //     fetchOrders();
// //   }, []);

// //   return (
// //     <div className="max-w-4xl mx-auto p-6">
// //       <h1 className="text-2xl font-bold mb-6">My Orders</h1>
// //       <div className="space-y-4">
// //         {orders.map((order) => (
// //           <Card key={order.id}>
// //             <CardHeader>
// //               <CardTitle>Order #{order.id} - {order.status}</CardTitle>
// //               <p>Total: ${order.total_price}</p>
// //               <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
// //             </CardHeader>
// //             <CardContent>
// //               {order.items.map((item: any) => (
// //                 <div key={item.id} className="flex justify-between border-b py-2">
// //                   <span>{item.product} x {item.quantity}</span>
// //                   <span>${item.price}</span>
// //                 </div>
// //               ))}
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const { getTotalPrice } = useCart();
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage("");

//     try {
//       // ✅ Backend se clientSecret lo
//       const { data } = await authAxios.post("/create-payment-intent/", {
//         amount: getTotalPrice(),
//       });

//       const clientSecret = data.clientSecret;

//       // ✅ Stripe pe payment confirm karo
//       const result = await stripe!.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements!.getElement(CardElement)!,
//         },
//       });

//       if (result.error) {
//         setErrorMessage(result.error.message || "Payment failed");
//       } else if (result.paymentIntent?.status === "succeeded") {
//         console.log("✅ Payment successful");

//         // ✅ Backend pe order update karo
//         await authAxios.post("/orders/", {
//           total_price: getTotalPrice(),
//           is_paid: true,
//           payment_method: "Stripe",
//         });

//         alert("Payment successful & order placed!");
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//       setErrorMessage("Something went wrong, please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <CardElement className="border p-3 rounded" />
//       {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//       <Button type="submit" disabled={!stripe || loading} className="w-full bg-gradient-primary">
//         {loading ? "Processing..." : "Pay Now"}
//       </Button>
//     </form>
//   );
// };

// const CheckoutPage = () => {
//   const { items, getTotalPrice } = useCart();
//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     city: "",
//     zipCode: "",
//   });

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* ✅ Shipping Info */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Shipping Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Input placeholder="Email" />
//             <div className="grid grid-cols-2 gap-4">
//               <Input placeholder="First Name" />
//               <Input placeholder="Last Name" />
//             </div>
//             <Input placeholder="Address" />
//             <div className="grid grid-cols-2 gap-4">
//               <Input placeholder="City" />
//               <Input placeholder="ZIP Code" />
//             </div>
//           </CardContent>
//         </Card>

//         {/* ✅ Order Summary + Payment */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Order Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {items.map((item) => (
//                 <div key={item.id} className="flex justify-between">
//                   <span>
//                     {item.name} x{item.quantity}
//                   </span>
//                   <span>${(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//               <div className="border-t pt-4 font-bold">
//                 Total: ${getTotalPrice().toFixed(2)}
//               </div>
//             </div>
//             <div className="mt-6">
//               <Elements stripe={stripePromise}>
//                 <CheckoutForm />
//               </Elements>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/lib/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading your orders...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-4">
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
                <p>Status: {order.status}</p>
                <p>Total: ${order.total_price}</p>
                <p>Payment Method: {order.payment_method}</p>
                <p>Paid: {order.is_paid ? "Yes" : "No"}</p>
                <p>
                  Paid At:{" "}
                  {order.paid_at
                    ? new Date(order.paid_at).toLocaleString()
                    : "Not Paid"}
                </p>
                <p>
                  Delivered: {order.is_delivered ? "Yes" : "No"}
                </p>
                <p>
                  Delivered At:{" "}
                  {order.delivered_at
                    ? new Date(order.delivered_at).toLocaleString()
                    : "Pending"}
                </p>
                <p>Created: {new Date(order.created_at).toLocaleString()}</p>
                <p>
                  Updated:{" "}
                  {order.updated_at
                    ? new Date(order.updated_at).toLocaleString()
                    : "-"}
                </p>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold mb-2">Items:</h3>
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b py-2"
                  >
                    <span>
                      Product #{item.product} x {item.quantity}
                    </span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="mt-4">
                  <h4 className="font-semibold">Shipping:</h4>
                  {order.shipping_address ? (
                    <>
                      <p>
                        {order.shipping_address.address},{" "}
                        {order.shipping_address.city},{" "}
                        {order.shipping_address.zip_code},{" "}
                        {order.shipping_address.country}
                      </p>
                      <p>Phone: {order.shipping_address.phone}</p>
                    </>
                  ) : (
                    <p>No shipping details available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
