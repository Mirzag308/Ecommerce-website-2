// PaymentCancel.tsx 
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authAxios } from "@/lib/axios";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const reason = searchParams.get("reason"); // ✅ Reason get kar rahe hain
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!!orderId); // ✅ Sirf tab load karo jab order_id ho

  useEffect(() => {
    if (orderId) {
      authAxios.get(`/orders/${orderId}/`).then((res) => {
        setOrder(res.data);
      }).catch((err) => {
        console.error("Error fetching order:", err);
      }).finally(() => {
        setLoading(false); // ✅ Loading band karo chahe success ho ya fail
      });
    }
  }, [orderId]);

  // ✅ Agar loading hai toh spinner dikhao
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-gray-500 animate-pulse">Checking order status...</p>
      </div>
    );
  }

  // ✅ Helper function to decode reason safely
  const getCancelReason = () => {
    if (reason) return decodeURIComponent(reason);
    return "Your transaction was not completed.";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
        
        {/* Cancel/Failure Header Section */}
        <div className="bg-red-500 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 animate-pulse">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Payment Cancelled</h1>
          {/* ✅ Actual Reason dikhao */}
          <p className="text-red-100 text-sm font-medium bg-red-600 bg-opacity-40 inline-block px-4 py-1 rounded-full mt-2">
            {getCancelReason()}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-8">
          {/* ✅ Agar order data hai toh details dikhao, warna mat dikhao */}
          {order ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-medium">Order ID</span>
                <span className="text-gray-900 font-mono text-sm">#{order.id}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-medium">Status</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">
                  Unpaid
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-800 text-lg font-bold">Amount Due</span>
                <span className="text-2xl font-black text-red-600">
                  ${order.total_price}
                </span>
              </div>
            </div>
          ) : (
            // ✅ Agar order nahi bana toh ye message dikhao
            <div className="text-center py-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No order was created.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-10 space-y-3">
            <Link 
              to="/checkout" 
              className="block w-full text-center bg-red-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors"
            >
              Try Paying Again
            </Link>
            <Link 
              to="/" 
              className="block w-full text-center bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            No funds were withdrawn from your account. Need help? Contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;