import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Supplier, SupplierProduct, supplierService } from "@/services/supplierService";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier;
  onSuccess: () => void;
}

interface SupplierFormData {
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
  joinDate: string;
  notes: string;
  products: SupplierProduct[];
}

// Predefined supplier categories
const supplierCategories = [
  "Electronics",
  "Packaging",
  "Office Supplies",
  "Logistics",
  "Software",
  "Hardware",
  "Food & Beverage",
  "Medical",
  "Automotive",
  "Other"
];

export function SupplierModal({ isOpen, onClose, supplier, onSuccess }: SupplierModalProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA"
    },
    category: "",
    status: "active",
    rating: 0,
    joinDate: new Date().toISOString().split('T')[0],
    notes: "",
    products: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add state for current product being added
  const [currentProduct, setCurrentProduct] = useState<Partial<SupplierProduct>>({
    name: "",
    price: 0,
    category: "",
    leadTime: 1
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone,
        address: { ...supplier.address },
        category: supplier.category,
        status: supplier.status,
        rating: supplier.rating,
        joinDate: supplier.joinDate ? new Date(supplier.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: supplier.notes,
        products: [...supplier.products]
      });
    } else {
      // Reset form for new supplier
      setFormData({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "USA"
        },
        category: "",
        status: "active",
        rating: 0,
        joinDate: new Date().toISOString().split('T')[0],
        notes: "",
        products: []
      });
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.category) {
        throw new Error("Name, email and category are required");
      }

      // Convert form data dates to Date objects
      const supplierData = {
        ...formData,
        joinDate: new Date(formData.joinDate),
      };

      if (supplier) {
        await supplierService.updateSupplier(supplier.id, supplierData);
      } else {
        await supplierService.createSupplier(supplierData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!currentProduct.name || !currentProduct.price) {
      setError("Please fill in product name and price");
      return;
    }

    const newProduct: SupplierProduct = {
      id: Math.max(0, ...formData.products.map(product => product.id), 0) + 1,
      name: currentProduct.name || "",
      price: currentProduct.price || 0,
      category: currentProduct.category || "Other",
      leadTime: currentProduct.leadTime || 1
    };

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));

    // Reset current product
    setCurrentProduct({
      name: "",
      price: 0,
      category: "",
      leadTime: 1
    });
  };

  const handleRemoveProduct = (productId: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== productId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Address</Label>
            <div className="grid grid-cols-1 gap-2">
              <Input
                placeholder="Street"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                />
                <Input
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Postal Code"
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, postalCode: e.target.value }
                  })}
                />
                <Input
                  placeholder="Country"
                  value={formData.address.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {supplierCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Products/Services</Label>
            <div className="border rounded p-4">
              <div className="grid grid-cols-5 gap-2 mb-2">
                <Input
                  placeholder="Product Name"
                  value={currentProduct.name || ""}
                  onChange={(e) => setCurrentProduct({
                    ...currentProduct,
                    name: e.target.value
                  })}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  value={currentProduct.price || ""}
                  onChange={(e) => setCurrentProduct({
                    ...currentProduct,
                    price: parseFloat(e.target.value) || 0
                  })}
                />
                <Input
                  placeholder="Category"
                  value={currentProduct.category || ""}
                  onChange={(e) => setCurrentProduct({
                    ...currentProduct,
                    category: e.target.value
                  })}
                />
                <Input
                  type="number"
                  placeholder="Lead Time (days)"
                  min="1"
                  value={currentProduct.leadTime || ""}
                  onChange={(e) => setCurrentProduct({
                    ...currentProduct,
                    leadTime: parseInt(e.target.value) || 1
                  })}
                />
                <Button type="button" onClick={handleAddProduct}>Add</Button>
              </div>
              
              {formData.products.length > 0 ? (
                <div className="space-y-2">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-2">Product</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Lead Time</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.category}</td>
                          <td className="p-2">${product.price.toFixed(2)}</td>
                          <td className="p-2">{product.leadTime} days</td>
                          <td className="p-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No products added yet</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the supplier"
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
              {loading ? "Saving..." : supplier ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 