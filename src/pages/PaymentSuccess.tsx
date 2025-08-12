// PaymentSuccess.tsx 
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { authAxios } from "@/lib/axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      authAxios.get(`/orders/${orderId}/`).then((res) => {
        setOrder(res.data);
      });
    }
  }, [orderId]);

  if (!order) {
    return <div className="p-8 text-center">Loading your order...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your purchase.</p>
      <div className="border rounded-lg p-6 shadow-lg inline-block text-left">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.is_paid ? "Paid" : "Pending"}</p>
        <p><strong>Total Amount:</strong> ${order.total_price}</p>
      </div>
      <a href="/" className="mt-6 inline-block text-blue-500 underline">Back to Home</a>
    </div>
  );
};

export default PaymentSuccess;
