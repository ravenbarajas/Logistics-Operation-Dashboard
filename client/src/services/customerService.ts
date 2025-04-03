export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  company?: string;
  type: 'individual' | 'business';
  status: 'active' | 'inactive';
  dateJoined: Date;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  tags: string[];
  notes?: string;
}

// Mock data for customers
let mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(415) 555-1234',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    type: 'individual',
    status: 'active',
    dateJoined: new Date('2022-01-15'),
    totalOrders: 8,
    totalSpent: 1245.67,
    lastOrderDate: new Date('2023-11-05'),
    tags: ['loyal', 'premium'],
    notes: 'Prefers delivery on weekends'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    phone: '(312) 555-6789',
    address: {
      street: '456 Business Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    company: 'Acme Corporation',
    type: 'business',
    status: 'active',
    dateJoined: new Date('2021-08-20'),
    totalOrders: 24,
    totalSpent: 15780.42,
    lastOrderDate: new Date('2023-11-12'),
    tags: ['business', 'bulk-buyer', 'priority'],
    notes: 'Requires invoice before payment'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@email.com',
    phone: '(214) 555-7890',
    address: {
      street: '789 Oak St',
      city: 'Dallas',
      state: 'TX',
      postalCode: '75201',
      country: 'USA'
    },
    type: 'individual',
    status: 'inactive',
    dateJoined: new Date('2022-03-10'),
    totalOrders: 3,
    totalSpent: 320.15,
    lastOrderDate: new Date('2022-05-18'),
    tags: ['inactive'],
    notes: 'Account inactive since June 2022'
  },
  {
    id: 4,
    name: 'Tech Innovations Inc',
    email: 'orders@techinnovations.com',
    phone: '(206) 555-9012',
    address: {
      street: '101 Tech Blvd',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    company: 'Tech Innovations Inc',
    type: 'business',
    status: 'active',
    dateJoined: new Date('2020-11-15'),
    totalOrders: 56,
    totalSpent: 68420.99,
    lastOrderDate: new Date('2023-11-15'),
    tags: ['business', 'priority', 'partner'],
    notes: 'Strategic partner, assign dedicated account manager'
  },
  {
    id: 5,
    name: 'Mary Williams',
    email: 'mary.williams@example.com',
    phone: '(617) 555-3456',
    address: {
      street: '202 Maple Ave',
      city: 'Boston',
      state: 'MA',
      postalCode: '02108',
      country: 'USA'
    },
    type: 'individual',
    status: 'active',
    dateJoined: new Date('2023-01-05'),
    totalOrders: 2,
    totalSpent: 178.50,
    lastOrderDate: new Date('2023-09-22'),
    tags: ['new-customer'],
    notes: 'Recently signed up through promotional campaign'
  }
];

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  individualCustomers: number;
  businessCustomers: number;
  totalRevenue: number;
  averageSpentPerCustomer: number;
}

export const customerService = {
  async getCustomerSummary(): Promise<CustomerSummary> {
    const totalCustomers = mockCustomers.length;
    const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
    const inactiveCustomers = mockCustomers.filter(c => c.status === 'inactive').length;
    const individualCustomers = mockCustomers.filter(c => c.type === 'individual').length;
    const businessCustomers = mockCustomers.filter(c => c.type === 'business').length;
    
    const totalRevenue = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageSpentPerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      individualCustomers,
      businessCustomers,
      totalRevenue,
      averageSpentPerCustomer
    };
  },

  async getCustomers(): Promise<Customer[]> {
    return [...mockCustomers];
  },

  async getCustomer(id: number): Promise<Customer> {
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { ...customer };
  },

  async createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    const newId = Math.max(0, ...mockCustomers.map(c => c.id)) + 1;
    
    const newCustomer: Customer = {
      ...customerData,
      id: newId
    };
    
    mockCustomers.push(newCustomer);
    return { ...newCustomer };
  },

  async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer> {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const updatedCustomer = {
      ...mockCustomers[index],
      ...customerData,
    };
    
    mockCustomers[index] = updatedCustomer;
    return { ...updatedCustomer };
  },

  async deleteCustomer(id: number): Promise<void> {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    mockCustomers.splice(index, 1);
  },
}; 