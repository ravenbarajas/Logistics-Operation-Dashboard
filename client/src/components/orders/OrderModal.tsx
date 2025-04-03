import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Order, OrderItem, Address, orderService } from "@/services/orderService";
import { customerService } from "@/services/customerService";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
  onSuccess: () => void;
}

interface OrderFormData {
  customerId: number;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes: string;
}

export function OrderModal({ isOpen, onClose, order, onSuccess }: OrderModalProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerId: 0,
    customerName: "",
    status: "pending",
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: "",
    totalAmount: 0,
    items: [],
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA"
    },
    paymentMethod: "Credit Card",
    paymentStatus: "pending",
    notes: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  // Add state for current item being added
  const [currentItem, setCurrentItem] = useState<Partial<OrderItem>>({
    productId: 0,
    productName: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  });

  useEffect(() => {
    // Fetch customers for dropdown
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const customersData = await customerService.getCustomers();
        setCustomers(customersData);
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (order) {
      setFormData({
        customerId: order.customerId,
        customerName: order.customerName,
        status: order.status,
        orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : "",
        totalAmount: order.totalAmount,
        items: [...order.items],
        shippingAddress: { ...order.shippingAddress },
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes
      });
    } else {
      // Reset form for new order
      setFormData({
        customerId: 0,
        customerName: "",
        status: "pending",
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: "",
        totalAmount: 0,
        items: [],
        shippingAddress: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "USA"
        },
        paymentMethod: "Credit Card",
        paymentStatus: "pending",
        notes: ""
      });
    }
  }, [order]);

  // Update customer name when customerId changes
  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c.id === formData.customerId);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: customer.name,
          shippingAddress: { ...customer.address }
        }));
      }
    }
  }, [formData.customerId, customers]);

  // Update total price when item unit price or quantity changes
  useEffect(() => {
    const totalPrice = currentItem.quantity && currentItem.unitPrice
      ? currentItem.quantity * currentItem.unitPrice
      : 0;
    
    setCurrentItem(prev => ({
      ...prev,
      totalPrice
    }));
  }, [currentItem.quantity, currentItem.unitPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert form data dates to Date objects
      const orderData = {
        ...formData,
        orderDate: new Date(formData.orderDate),
        deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : null,
      };

      if (order) {
        await orderService.updateOrder(order.id, orderData);
      } else {
        await orderService.createOrder(orderData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save order");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!currentItem.productName || !currentItem.quantity || !currentItem.unitPrice) {
      setError("Please fill in all item fields");
      return;
    }

    const newItem: OrderItem = {
      id: Math.max(0, ...formData.items.map(item => item.id), 0) + 1,
      productId: currentItem.productId || Date.now(),
      productName: currentItem.productName || "",
      quantity: currentItem.quantity || 0,
      unitPrice: currentItem.unitPrice || 0,
      totalPrice: currentItem.totalPrice || 0
    };

    const updatedItems = [...formData.items, newItem];
    const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotalAmount
    }));

    // Reset current item
    setCurrentItem({
      productId: 0,
      productName: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    });
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedItems = formData.items.filter(item => item.id !== itemId);
    const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotalAmount
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Create New Order"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select
                value={formData.customerId.toString() || "unassigned"}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  customerId: value === "unassigned" ? 0 : parseInt(value) 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCustomers ? "Loading customers..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Select a customer</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name} {customer.company ? `(${customer.company})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date</Label>
              <Input
                id="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Shipping Address</Label>
            <div className="grid grid-cols-1 gap-2">
              <Input
                placeholder="Street"
                value={formData.shippingAddress.street}
                onChange={(e) => setFormData({
                  ...formData,
                  shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                })}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="City"
                  value={formData.shippingAddress.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                  })}
                  required
                />
                <Input
                  placeholder="State"
                  value={formData.shippingAddress.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, state: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Postal Code"
                  value={formData.shippingAddress.postalCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, postalCode: e.target.value }
                  })}
                  required
                />
                <Input
                  placeholder="Country"
                  value={formData.shippingAddress.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, country: e.target.value }
                  })}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Order Items</Label>
            <div className="border rounded p-4">
              <div className="grid grid-cols-5 gap-2 mb-2">
                <Input
                  placeholder="Product Name"
                  value={currentItem.productName || ""}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    productName: e.target.value
                  })}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  value={currentItem.quantity || ""}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    quantity: parseInt(e.target.value) || 0
                  })}
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  step="0.01"
                  min="0"
                  value={currentItem.unitPrice || ""}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    unitPrice: parseFloat(e.target.value) || 0
                  })}
                />
                <Input
                  type="number"
                  placeholder="Total Price"
                  step="0.01"
                  min="0"
                  value={currentItem.totalPrice || ""}
                  disabled
                />
                <Button type="button" onClick={handleAddItem}>Add</Button>
              </div>
              
              {formData.items.length > 0 ? (
                <div className="space-y-2">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-2">Product</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Unit Price</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">{item.productName}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">${item.unitPrice.toFixed(2)}</td>
                          <td className="p-2">${item.totalPrice.toFixed(2)}</td>
                          <td className="p-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td className="p-2" colSpan={3}>Total</td>
                        <td className="p-2">${formData.totalAmount.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No items added to order yet</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value: any) => setFormData({ ...formData, paymentStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the order"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : order ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 