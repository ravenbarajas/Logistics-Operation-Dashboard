import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderDetailsModal } from "./OrderDetailsModal";

// Define the Order type
interface Order {
  id: string;
  customer: string;
  customerEmail?: string;
  items: number;
  total: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  payment: "completed" | "pending" | "failed";
  shipping: string;
  trackingNumber?: string;
  expectedDelivery?: string;
  products?: string[];
  address?: string;
  notes?: string;
}

// Sample order data
const initialOrder: Order = {
  id: "ORD-8761",
  customer: "Acme Inc.",
  customerEmail: "orders@acmeinc.com",
  items: 12,
  total: "$4,320.00",
  date: "Aug 18, 2023",
  status: "processing",
  payment: "completed",
  shipping: "fedex",
  trackingNumber: "FDX7891237894",
  expectedDelivery: "Aug 24, 2023",
  products: ["Heavy Duty Shelving", "Packing Materials", "Shipping Containers"],
  address: "123 Industrial Blvd, Chicago, IL 60007",
  notes: "Deliver to loading dock B"
};

export default function TestOrderDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState<Order>(initialOrder);
  
  // Handler for updating order status
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrder(prev => ({
      ...prev,
      status: newStatus as Order["status"]
    }));
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };
  
  // Handler for deleting an order
  const handleDeleteOrder = (orderId: string) => {
    console.log(`Order ${orderId} deleted`);
    setIsModalOpen(false);
    // In a real application, you would remove the order from the list
  };
  
  // Handler for editing an order
  const handleEditOrder = (updatedOrder: Order) => {
    console.log(`Editing order: ${updatedOrder.id}`);
    // In a real application, you would open an edit form
  };
  
  // Reset order to initial state
  const resetOrder = () => {
    setOrder(initialOrder);
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Order Details Modal</h1>
      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setIsModalOpen(true)}>
          Open Order Details
        </Button>
        <Button variant="outline" onClick={resetOrder}>
          Reset Order
        </Button>
      </div>
      
      <div className="mb-6 p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-2">Current Order Status</h2>
        <p>Order ID: {order.id}</p>
        <p>Status: <span className="font-bold">{order.status}</span></p>
        <p>Customer: {order.customer}</p>
      </div>
      
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={order}
        onUpdateStatus={handleUpdateStatus}
        onDeleteOrder={handleDeleteOrder}
        onEditOrder={handleEditOrder}
      />
    </div>
  );
} 