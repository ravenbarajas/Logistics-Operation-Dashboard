export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'blacklisted';
  rating: number;
  joinDate: Date;
  notes: string;
  products: SupplierProduct[];
}

export interface SupplierProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  leadTime: number; // in days
}

// Mock data for suppliers
let mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Global Tech Solutions',
    contactName: 'Michael Chen',
    email: 'michael@globaltech.com',
    phone: '(415) 555-1234',
    address: {
      street: '123 Innovation Dr',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95113',
      country: 'USA'
    },
    category: 'Electronics',
    status: 'active',
    rating: 4.8,
    joinDate: new Date('2020-03-15'),
    notes: 'Reliable supplier for computer parts',
    products: [
      {
        id: 101,
        name: 'Processor Chips',
        price: 230.50,
        category: 'Components',
        leadTime: 14
      },
      {
        id: 102,
        name: 'Graphics Cards',
        price: 450.99,
        category: 'Components',
        leadTime: 21
      }
    ]
  },
  {
    id: 2,
    name: 'Eco Packaging Inc',
    contactName: 'Sarah Wilson',
    email: 'sarah@ecopackaging.com',
    phone: '(312) 555-6789',
    address: {
      street: '789 Green Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    category: 'Packaging',
    status: 'active',
    rating: 4.5,
    joinDate: new Date('2021-01-10'),
    notes: 'Sustainable packaging solutions',
    products: [
      {
        id: 201,
        name: 'Recyclable Boxes',
        price: 1.25,
        category: 'Packaging',
        leadTime: 7
      },
      {
        id: 202,
        name: 'Biodegradable Bubble Wrap',
        price: 15.99,
        category: 'Packaging',
        leadTime: 10
      }
    ]
  },
  {
    id: 3,
    name: 'Premium Office Supplies',
    contactName: 'Robert Brown',
    email: 'robert@premiumoffice.com',
    phone: '(212) 555-4321',
    address: {
      street: '456 Business Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    category: 'Office Supplies',
    status: 'inactive',
    rating: 3.7,
    joinDate: new Date('2019-06-25'),
    notes: 'Quality office equipment and supplies',
    products: [
      {
        id: 301,
        name: 'Ergonomic Chair',
        price: 259.99,
        category: 'Furniture',
        leadTime: 30
      },
      {
        id: 302,
        name: 'Standing Desk',
        price: 450.00,
        category: 'Furniture',
        leadTime: 45
      }
    ]
  },
  {
    id: 4,
    name: 'Swift Logistics Group',
    contactName: 'Jessica Martinez',
    email: 'jessica@swiftlogistics.com',
    phone: '(214) 555-9876',
    address: {
      street: '1010 Distribution Center',
      city: 'Dallas',
      state: 'TX',
      postalCode: '75201',
      country: 'USA'
    },
    category: 'Logistics',
    status: 'pending',
    rating: 4.0,
    joinDate: new Date('2022-02-18'),
    notes: 'Specializes in fast shipping solutions',
    products: [
      {
        id: 401,
        name: 'Overnight Shipping',
        price: 49.99,
        category: 'Services',
        leadTime: 1
      },
      {
        id: 402,
        name: 'International Shipping',
        price: 129.99,
        category: 'Services',
        leadTime: 5
      }
    ]
  },
  {
    id: 5,
    name: 'Tech Innovations Ltd',
    contactName: 'David Kim',
    email: 'david@techinnovations.com',
    phone: '(206) 555-5678',
    address: {
      street: '555 Tech Parkway',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    category: 'Software',
    status: 'active',
    rating: 4.9,
    joinDate: new Date('2020-09-05'),
    notes: 'Custom software solutions provider',
    products: [
      {
        id: 501,
        name: 'Inventory Management System',
        price: 1200.00,
        category: 'Software',
        leadTime: 60
      },
      {
        id: 502,
        name: 'Cloud Hosting',
        price: 99.99,
        category: 'Services',
        leadTime: 3
      }
    ]
  }
];

export interface SupplierSummary {
  totalSuppliers: number;
  activeSuppliers: number;
  pendingSuppliers: number;
  inactiveSuppliers: number;
  categoryCounts: Record<string, number>;
}

export const supplierService = {
  async getSupplierSummary(): Promise<SupplierSummary> {
    const totalSuppliers = mockSuppliers.length;
    const activeSuppliers = mockSuppliers.filter(s => s.status === 'active').length;
    const pendingSuppliers = mockSuppliers.filter(s => s.status === 'pending').length;
    const inactiveSuppliers = mockSuppliers.filter(s => s.status === 'inactive' || s.status === 'blacklisted').length;
    
    // Count suppliers by category
    const categoryCounts: Record<string, number> = {};
    mockSuppliers.forEach(supplier => {
      if (!categoryCounts[supplier.category]) {
        categoryCounts[supplier.category] = 0;
      }
      categoryCounts[supplier.category]++;
    });

    return {
      totalSuppliers,
      activeSuppliers,
      pendingSuppliers,
      inactiveSuppliers,
      categoryCounts
    };
  },

  async getSuppliers(): Promise<Supplier[]> {
    return [...mockSuppliers];
  },

  async getSupplier(id: number): Promise<Supplier> {
    const supplier = mockSuppliers.find(s => s.id === id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    return { ...supplier };
  },

  async createSupplier(supplierData: Omit<Supplier, 'id'>): Promise<Supplier> {
    const newId = Math.max(0, ...mockSuppliers.map(s => s.id)) + 1;
    
    const newSupplier: Supplier = {
      ...supplierData,
      id: newId
    };
    
    mockSuppliers.push(newSupplier);
    return { ...newSupplier };
  },

  async updateSupplier(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    const updatedSupplier = {
      ...mockSuppliers[index],
      ...supplierData,
    };
    
    mockSuppliers[index] = updatedSupplier;
    return { ...updatedSupplier };
  },

  async addProductToSupplier(supplierId: number, product: Omit<SupplierProduct, 'id'>): Promise<Supplier> {
    const supplier = await this.getSupplier(supplierId);
    
    const newProductId = Math.max(0, ...supplier.products.map(p => p.id)) + 1;
    const newProduct: SupplierProduct = {
      ...product,
      id: newProductId
    };
    
    return this.updateSupplier(supplierId, {
      products: [...supplier.products, newProduct]
    });
  },

  async deleteSupplier(id: number): Promise<void> {
    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    mockSuppliers.splice(index, 1);
  },
}; 