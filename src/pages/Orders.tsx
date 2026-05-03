// src/pages/Orders.tsx
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
