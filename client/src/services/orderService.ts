export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerId: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate: Date | null;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Mock data for orders
let mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2023-1001',
    customerName: 'John Doe',
    customerId: 1,
    status: 'delivered',
    orderDate: new Date('2023-11-10'),
    deliveryDate: new Date('2023-11-15'),
    totalAmount: 1250.99,
    items: [
      {
        id: 1,
        productId: 101,
        productName: 'Laptop',
        quantity: 1,
        unitPrice: 899.99,
        totalPrice: 899.99
      },
      {
        id: 2,
        productId: 102,
        productName: 'External Monitor',
        quantity: 1,
        unitPrice: 349.99,
        totalPrice: 349.99
      }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    notes: 'Deliver to front desk'
  },
  {
    id: 2,
    orderNumber: 'ORD-2023-1002',
    customerName: 'Jane Smith',
    customerId: 2,
    status: 'shipped',
    orderDate: new Date('2023-11-12'),
    deliveryDate: null,
    totalAmount: 2340.50,
    items: [
      {
        id: 3,
        productId: 103,
        productName: 'Smartphone',
        quantity: 2,
        unitPrice: 699.99,
        totalPrice: 1399.98
      },
      {
        id: 4,
        productId: 104,
        productName: 'Wireless Earbuds',
        quantity: 3,
        unitPrice: 159.99,
        totalPrice: 479.97
      },
      {
        id: 5,
        productId: 105,
        productName: 'Phone Case',
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98
      }
    ],
    shippingAddress: {
      street: '456 Market St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    notes: 'Fragile items'
  },
  {
    id: 3,
    orderNumber: 'ORD-2023-1003',
    customerName: 'Robert Johnson',
    customerId: 3,
    status: 'processing',
    orderDate: new Date('2023-11-18'),
    deliveryDate: null,
    totalAmount: 850.75,
    items: [
      {
        id: 6,
        productId: 106,
        productName: 'Office Chair',
        quantity: 1,
        unitPrice: 249.99,
        totalPrice: 249.99
      },
      {
        id: 7,
        productId: 107,
        productName: 'Desk Lamp',
        quantity: 2,
        unitPrice: 59.99,
        totalPrice: 119.98
      },
      {
        id: 8,
        productId: 108,
        productName: 'Keyboard',
        quantity: 1,
        unitPrice: 129.99,
        totalPrice: 129.99
      },
      {
        id: 9,
        productId: 109,
        productName: 'Mouse',
        quantity: 1,
        unitPrice: 49.99,
        totalPrice: 49.99
      }
    ],
    shippingAddress: {
      street: '789 Oak Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60007',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    notes: ''
  },
  {
    id: 4,
    orderNumber: 'ORD-2023-1004',
    customerName: 'Mary Williams',
    customerId: 4,
    status: 'pending',
    orderDate: new Date('2023-11-20'),
    deliveryDate: null,
    totalAmount: 1599.99,
    items: [
      {
        id: 10,
        productId: 110,
        productName: 'Gaming Console',
        quantity: 1,
        unitPrice: 499.99,
        totalPrice: 499.99
      },
      {
        id: 11,
        productId: 111,
        productName: 'Game Controller',
        quantity: 2,
        unitPrice: 69.99,
        totalPrice: 139.98
      },
      {
        id: 12,
        productId: 112,
        productName: 'Video Game',
        quantity: 3,
        unitPrice: 59.99,
        totalPrice: 179.97
      }
    ],
    shippingAddress: {
      street: '101 Pine St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'pending',
    notes: 'Call before delivery'
  },
  {
    id: 5,
    orderNumber: 'ORD-2023-1005',
    customerName: 'Michael Brown',
    customerId: 5,
    status: 'cancelled',
    orderDate: new Date('2023-11-15'),
    deliveryDate: null,
    totalAmount: 389.98,
    items: [
      {
        id: 13,
        productId: 113,
        productName: 'Headphones',
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99
      },
      {
        id: 14,
        productId: 114,
        productName: 'Bluetooth Speaker',
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99
      }
    ],
    shippingAddress: {
      street: '222 Elm St',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'refunded',
    notes: 'Customer requested cancellation'
  }
];

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export const orderService = {
  async getOrderSummary(): Promise<OrderSummary> {
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
    const processingOrders = mockOrders.filter(o => o.status === 'processing').length;
    const shippedOrders = mockOrders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = mockOrders.filter(o => o.status === 'cancelled').length;
    
    const totalRevenue = mockOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    };
  },

  async getOrders(): Promise<Order[]> {
    return [...mockOrders];
  },

  async getOrder(id: number): Promise<Order> {
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const order = mockOrders.find(o => o.orderNumber === orderNumber);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber'>): Promise<Order> {
    const newId = Math.max(0, ...mockOrders.map(o => o.id)) + 1;
    const orderNumber = `ORD-${new Date().getFullYear()}-${1000 + newId}`;
    
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber
    };
    
    mockOrders.push(newOrder);
    return { ...newOrder };
  },

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    const updatedOrder = {
      ...mockOrders[index],
      ...orderData,
    };
    
    mockOrders[index] = updatedOrder;
    return { ...updatedOrder };
  },

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    return this.updateOrder(id, { status });
  },

  async deleteOrder(id: number): Promise<void> {
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    mockOrders.splice(index, 1);
  },
}; 