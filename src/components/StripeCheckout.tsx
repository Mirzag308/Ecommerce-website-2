// import React, { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';

// // Apni Stripe ki "Publishable Key" yahan dalein
// const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY_HERE');

// const StripeCheckout = ({ cartItems }: { cartItems: any }) => {
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     setLoading(true);

//     try {
//       // 1. Backend se Payment Intent (Client Secret) mangwana
//       const response = await fetch('http://127.0.0.1:8000/api/create-payment-intent/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ items: cartItems }),
//       });

//       const data = await response.json();

//       if (data.clientSecret) {
//         alert("Success! Client Secret mil gaya: " + data.clientSecret);
//         // Agla step Stripe elements ka checkout dikhana hoga
//       } else {
//         alert("Error: Payment intent nahi ban saka");
//       }
//     } catch (error) {
//       console.error("Payment Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button 
//       onClick={handlePayment} 
//       disabled={loading}
//       className="bg-blue-600 text-white p-3 rounded"
//     >
//       {loading ? 'Processing...' : 'Pay with Stripe'}
//     </button>
//   );
// };

// export default StripeCheckout;