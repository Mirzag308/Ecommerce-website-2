// PaymentSuccess.tsx 
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className=" rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="text-gray-500">Confirming your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
        
        {/* Success Header Section */}
        <div className="bg-gradient-primary p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 ">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Payment Success!</h1>
          <p className="text-green-100">Your order has been placed successfully.</p>
        </div>

        {/* Order Details Card */}
        <div className="p-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 font-medium">Order ID</span>
              <span className="text-gray-900 font-mono text-sm">#{order.id}</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500 font-medium">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                {order.is_paid ? "Paid" : "Pending"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-800 text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-black text-green-600">
                ${order.total_price}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 space-y-3">
            <Link 
              to="/" 
              className="block w-full text-center bg-gray-900 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </Link>
            <button 
              onClick={() => window.print()} 
              className="block w-full text-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Download Receipt
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-400">
            A confirmation email was sent to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;