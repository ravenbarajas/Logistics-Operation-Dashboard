import { OrderDetailsModal } from "./OrderDetailsModal";

// Define Order type inline since we don't have a centralized types folder
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

interface OrderDetailsWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onEditOrder?: (order: Order) => void;
}

export function OrderDetailsWrapper({ 
  isOpen, 
  onClose, 
  order,
  onUpdateStatus,
  onDeleteOrder,
  onEditOrder
}: OrderDetailsWrapperProps) {
  if (!order) return null;
  
  return (
    <OrderDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      order={order}
      onUpdateStatus={onUpdateStatus}
      onDeleteOrder={onDeleteOrder}
      onEditOrder={onEditOrder}
    />
  );
} 