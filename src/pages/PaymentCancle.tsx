import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { authAxios } from "@/lib/axios";

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const reason = searchParams.get("reason");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      authAxios.get(`/orders/${orderId}/`).then((res) => {
        setOrder(res.data);
      });
    }
  }, [orderId]);

  const getCancelMessage = () => {
    if (reason) return decodeURIComponent(reason);
    return "Your payment was cancelled.";
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Cancelled!</h1>
      <p className="text-lg mb-6">{getCancelMessage()}</p> {/* ✅ Show full reason */}
      
      {orderId && order ? (
        <div className="border rounded-lg p-6 shadow-lg inline-block text-left">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.is_paid ? "Paid" : "Pending"}</p>
          <p><strong>Total Amount:</strong> ${order.total_price}</p>
        </div>
      ) : (
        <div className="text-gray-500 mt-4">No order was created.</div>
      )}

      <a href="/" className="mt-6 inline-block text-blue-500 underline">Back to Home</a>
    </div>
  );
};

export default PaymentCancelled;
