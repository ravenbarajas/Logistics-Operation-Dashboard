import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Factory, 
  Search, 
  MoreHorizontal, 
  Star, 
  Package, 
  TrendingUp, 
  Clock,
  ExternalLink,
  CalendarIcon,
  Plus,
  RefreshCw,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Supplier, supplierService } from "@/services/supplierService";
import { SupplierModal } from "@/components/suppliers/SupplierModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define supplier interface that matches the format of suppliers in the page
interface PageSupplier {
  id: string;
  name: string;
  category: string;
  location: string;
  contact: string;
  email: string;
  rating: number;
  status: "active" | "review" | "inactive";
  lastDelivery: string;
  onTimeRate: number;
  phone?: string;
  joinDate?: string;
  website?: string;
  certifications?: string[];
  complianceStatus?: "compliant" | "pending" | "non-compliant";
  paymentTerms?: string;
  currency?: string;
  creditLimit?: number;
  performanceScore?: number;
  qualityScore?: number;
  communicationScore?: number;
  notes?: string;
}

// Extended supplier data
const supplierData: PageSupplier[] = [
  {
    id: "SUP-2301",
    name: "Global Electronics Manufacturing",
    category: "Electronics",
    location: "Shenzhen, China",
    contact: "John Chen",
    email: "john@gemfg.com",
    phone: "+86 755 1234 5678",
    rating: 4.8,
    status: "active",
    lastDelivery: "Aug 15, 2023",
    onTimeRate: 98,
    website: "www.gemfg.com",
    joinDate: "Jan 10, 2018",
    certifications: ["ISO 9001", "ISO 14001"],
    complianceStatus: "compliant",
    paymentTerms: "Net 30",
    currency: "USD",
    creditLimit: 500000,
    performanceScore: 92,
    qualityScore: 95,
    communicationScore: 90,
    notes: "Strategic partner for electronic components"
  },
  {
    id: "SUP-2302",
    name: "American Industrial Solutions",
    category: "Industrial",
    location: "Detroit, MI, USA",
    contact: "Sarah Johnson",
    email: "sarah@ais.com",
    phone: "+1 313 555 7890",
    rating: 4.6,
    status: "active",
    lastDelivery: "Aug 12, 2023",
    onTimeRate: 95,
    website: "www.ais-industrial.com",
    joinDate: "Mar 22, 2019",
    certifications: ["ISO 9001"],
    complianceStatus: "compliant",
    paymentTerms: "Net 45",
    currency: "USD",
    creditLimit: 750000,
    performanceScore: 88,
    qualityScore: 92,
    communicationScore: 87,
    notes: "Specialized in heavy machinery parts"
  },
  {
    id: "SUP-2303",
    name: "EuroTech Components",
    category: "Electronics",
    location: "Munich, Germany",
    contact: "Klaus Mueller",
    email: "klaus@eurotech.com",
    phone: "+49 89 1234 5678",
    rating: 4.3,
    status: "active",
    lastDelivery: "Aug 10, 2023",
    onTimeRate: 92,
    website: "www.eurotech-components.eu",
    joinDate: "Nov 5, 2020",
    certifications: ["ISO 9001", "ISO 27001"],
    complianceStatus: "compliant",
    paymentTerms: "Net 30",
    currency: "EUR",
    creditLimit: 400000,
    performanceScore: 85,
    qualityScore: 90,
    communicationScore: 82,
    notes: "High-quality precision electronic components"
  },
  {
    id: "SUP-2304",
    name: "Pacific Logistics Partners",
    category: "Logistics",
    location: "Singapore",
    contact: "Mei Lin",
    email: "mei@pacificlogistics.com",
    phone: "+65 6123 4567",
    rating: 4.7,
    status: "active",
    lastDelivery: "Aug 18, 2023",
    onTimeRate: 97,
    website: "www.pacific-logistics.sg",
    joinDate: "Feb 14, 2021",
    certifications: ["ISO 9001", "C-TPAT"],
    complianceStatus: "compliant",
    paymentTerms: "Net 15",
    currency: "SGD",
    creditLimit: 350000,
    performanceScore: 93,
    qualityScore: 91,
    communicationScore: 95,
    notes: "Excellent service for Asia-Pacific distribution"
  },
  {
    id: "SUP-2305",
    name: "Maple Wood Furniture",
    category: "Furniture",
    location: "Toronto, Canada",
    contact: "David Williams",
    email: "david@maplewood.com",
    phone: "+1 416 555 1234",
    rating: 4.2,
    status: "review",
    lastDelivery: "Aug 5, 2023",
    onTimeRate: 86,
    website: "www.maplewoodfurniture.ca",
    joinDate: "Jul 8, 2022",
    certifications: ["FSC Certified"],
    complianceStatus: "pending",
    paymentTerms: "Net 30",
    currency: "CAD",
    creditLimit: 250000,
    performanceScore: 79,
    qualityScore: 88,
    communicationScore: 75,
    notes: "Under review due to recent quality issues"
  },
  {
    id: "SUP-2306",
    name: "SouthAsia Textiles",
    category: "Textiles",
    location: "Mumbai, India",
    contact: "Raj Patel",
    email: "raj@satextiles.com",
    phone: "+91 22 2345 6789",
    rating: 4.0,
    status: "active",
    lastDelivery: "Aug 8, 2023",
    onTimeRate: 90,
    website: "www.southasiatextiles.in",
    joinDate: "Apr 15, 2020",
    certifications: ["OEKO-TEX"],
    complianceStatus: "compliant",
    paymentTerms: "Net 45",
    currency: "USD",
    creditLimit: 300000,
    performanceScore: 84,
    qualityScore: 85,
    communicationScore: 80,
    notes: "Good variety of sustainable textile options"
  },
  {
    id: "SUP-2307",
    name: "Nordic Steel Works",
    category: "Raw Materials",
    location: "Stockholm, Sweden",
    contact: "Elsa Andersson",
    email: "elsa@nordicsteel.com",
    phone: "+46 8 123 4567",
    rating: 4.5,
    status: "inactive",
    lastDelivery: "Jul 28, 2023",
    onTimeRate: 93,
    website: "www.nordicsteel.se",
    joinDate: "Sep 30, 2019",
    certifications: ["ISO 9001", "ISO 14001"],
    complianceStatus: "compliant",
    paymentTerms: "Net 30",
    currency: "SEK",
    creditLimit: 450000,
    performanceScore: 87,
    qualityScore: 94,
    communicationScore: 88,
    notes: "Currently inactive due to facility upgrades"
  },
  {
    id: "SUP-2308",
    name: "Desert Packaging Solutions",
    category: "Packaging",
    location: "Phoenix, AZ, USA",
    contact: "Maria Sanchez",
    email: "maria@desertpack.com",
    phone: "+1 602 555 9876",
    rating: 4.4,
    status: "active",
    lastDelivery: "Aug 14, 2023",
    onTimeRate: 94,
    website: "www.desertpackaging.com",
    joinDate: "Jun 12, 2020",
    certifications: ["FSC Certified", "ISO 9001"],
    complianceStatus: "compliant",
    paymentTerms: "Net 30",
    currency: "USD",
    creditLimit: 275000,
    performanceScore: 89,
    qualityScore: 88,
    communicationScore: 92,
    notes: "Specializes in sustainable packaging solutions"
  },
  {
    id: "SUP-2309",
    name: "African Minerals Ltd",
    category: "Raw Materials",
    location: "Johannesburg, South Africa",
    contact: "Nelson Mandela",
    email: "nelson@africanminerals.co.za",
    phone: "+27 11 234 5678",
    rating: 4.1,
    status: "review",
    lastDelivery: "Jul 22, 2023",
    onTimeRate: 85,
    website: "www.africanminerals.co.za",
    joinDate: "Nov 18, 2021",
    certifications: ["ISO 14001"],
    complianceStatus: "pending",
    paymentTerms: "Net 45",
    currency: "USD",
    creditLimit: 500000,
    performanceScore: 78,
    qualityScore: 83,
    communicationScore: 76,
    notes: "Under review for compliance with new regulations"
  },
  {
    id: "SUP-2310",
    name: "Tokyo Tech Innovations",
    category: "Electronics",
    location: "Tokyo, Japan",
    contact: "Hiroshi Tanaka",
    email: "hiroshi@tokyotech.jp",
    phone: "+81 3 1234 5678",
    rating: 4.9,
    status: "active",
    lastDelivery: "Aug 16, 2023",
    onTimeRate: 99,
    website: "www.tokyotech.jp",
    joinDate: "Jan 5, 2019",
    certifications: ["ISO 9001", "ISO 27001"],
    complianceStatus: "compliant",
    paymentTerms: "Net 30",
    currency: "JPY",
    creditLimit: 600000,
    performanceScore: 96,
    qualityScore: 98,
    communicationScore: 94,
    notes: "Premium supplier for high-precision components"
  },
  {
    id: "SUP-2311",
    name: "Brazilian Wood Exports",
    category: "Raw Materials",
    location: "São Paulo, Brazil",
    contact: "Carlos Silva",
    email: "carlos@brazilwood.com.br",
    phone: "+55 11 9876 5432",
    rating: 3.9,
    status: "inactive",
    lastDelivery: "Jun 15, 2023",
    onTimeRate: 82,
    website: "www.brazilianwoodexports.com.br",
    joinDate: "Mar 20, 2020",
    certifications: ["FSC Certified"],
    complianceStatus: "non-compliant",
    paymentTerms: "Net 60",
    currency: "USD",
    creditLimit: 250000,
    performanceScore: 74,
    qualityScore: 80,
    communicationScore: 72,
    notes: "Account suspended pending sustainability audit"
  },
  {
    id: "SUP-2312",
    name: "UK Office Systems",
    category: "Office Supplies",
    location: "London, UK",
    contact: "Emma Thompson",
    email: "emma@ukoffice.co.uk",
    phone: "+44 20 7946 0987",
    rating: 4.3,
    status: "active",
    lastDelivery: "Aug 10, 2023",
    onTimeRate: 91,
    website: "www.ukofficesystems.co.uk",
    joinDate: "Oct 12, 2018",
    certifications: ["ISO 9001"],
    complianceStatus: "compliant",
    paymentTerms: "Net 30",
    currency: "GBP",
    creditLimit: 200000,
    performanceScore: 86,
    qualityScore: 89,
    communicationScore: 85,
    notes: "Reliable supplier for office equipment"
  },
  {
    id: "SUP-2313",
    name: "Mediterranean Olive Oils",
    category: "Food & Beverage",
    location: "Barcelona, Spain",
    contact: "Miguel Rodriguez",
    email: "miguel@medolive.es",
    phone: "+34 93 234 5678",
    rating: 4.7,
    status: "active",
    lastDelivery: "Aug 17, 2023",
    onTimeRate: 96,
    website: "www.mediterraneanoliveoils.es",
    joinDate: "Feb 28, 2019",
    certifications: ["ISO 22000", "Organic Certified"],
    complianceStatus: "compliant",
    paymentTerms: "Net 15",
    currency: "EUR",
    creditLimit: 180000,
    performanceScore: 92,
    qualityScore: 95,
    communicationScore: 90,
    notes: "Premium quality olive oils and related products"
  },
  {
    id: "SUP-2314",
    name: "Australian Mining Equipment",
    category: "Industrial",
    location: "Perth, Australia",
    contact: "James Wilson",
    email: "james@ausmining.com.au",
    phone: "+61 8 9876 5432",
    rating: 4.4,
    status: "review",
    lastDelivery: "Jul 30, 2023",
    onTimeRate: 87,
    website: "www.australianminingequipment.com.au",
    joinDate: "Sep 15, 2020",
    certifications: ["ISO 9001", "AS 4801"],
    complianceStatus: "pending",
    paymentTerms: "Net 45",
    currency: "AUD",
    creditLimit: 550000,
    performanceScore: 83,
    qualityScore: 86,
    communicationScore: 82,
    notes: "Under review for equipment safety compliance"
  },
  {
    id: "SUP-2315",
    name: "Dutch Tulip Growers",
    category: "Agriculture",
    location: "Amsterdam, Netherlands",
    contact: "Sofie Van Der Berg",
    email: "sofie@dutchtulips.nl",
    phone: "+31 20 123 4567",
    rating: 4.6,
    status: "inactive",
    lastDelivery: "May 10, 2023",
    onTimeRate: 94,
    website: "www.dutchtulipgrowers.nl",
    joinDate: "Jan 25, 2020",
    certifications: ["Global GAP"],
    complianceStatus: "compliant",
    paymentTerms: "Net 30",
    currency: "EUR",
    creditLimit: 120000,
    performanceScore: 90,
    qualityScore: 95,
    communicationScore: 88,
    notes: "Seasonal supplier, inactive until next growing season"
  }
];

// Update performance by category with more categories
const categoryPerformance = [
  { category: "Electronics", rating: 4.7, onTime: 96, quality: 95, pricing: 85 },
  { category: "Industrial", rating: 4.5, onTime: 94, quality: 92, pricing: 88 },
  { category: "Logistics", rating: 4.6, onTime: 95, quality: 90, pricing: 92 },
  { category: "Furniture", rating: 4.2, onTime: 88, quality: 93, pricing: 90 },
  { category: "Textiles", rating: 4.0, onTime: 85, quality: 87, pricing: 94 },
  { category: "Raw Materials", rating: 4.4, onTime: 92, quality: 89, pricing: 86 },
  { category: "Packaging", rating: 4.4, onTime: 94, quality: 91, pricing: 87 },
  { category: "Office Supplies", rating: 4.3, onTime: 91, quality: 89, pricing: 91 },
  { category: "Food & Beverage", rating: 4.7, onTime: 96, quality: 95, pricing: 83 },
  { category: "Agriculture", rating: 4.6, onTime: 94, quality: 95, pricing: 86 }
];

// Delivery reliability data
const deliveryReliability = [
  { month: "Mar", onTime: 91 },
  { month: "Apr", onTime: 92 },
  { month: "May", onTime: 93 },
  { month: "Jun", onTime: 94 },
  { month: "Jul", onTime: 95 },
  { month: "Aug", onTime: 96 }
];

// Supplier evaluation data
const evaluationData = [
  { subject: 'Quality', A: 95, B: 88 },
  { subject: 'Delivery', A: 96, B: 85 },
  { subject: 'Price', A: 85, B: 92 },
  { subject: 'Communication', A: 90, B: 86 },
  { subject: 'Flexibility', A: 92, B: 80 },
  { subject: 'Support', A: 93, B: 89 },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<PageSupplier[]>(supplierData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  // Add new filter states
  const [deliveryDateFilter, setDeliveryDateFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  // Calculate supplier statistics
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const reviewSuppliers = suppliers.filter(s => s.status === 'review').length;
  const inactiveSuppliers = suppliers.filter(s => s.status === 'inactive').length;
  
  // Calculate average metrics
  const avgOnTimeRate = suppliers.reduce((sum, s) => sum + s.onTimeRate, 0) / totalSuppliers;
  const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / totalSuppliers;
  
  // Calculate category distribution
  const categories = {} as {[key: string]: number};
  suppliers.forEach(s => {
    categories[s.category] = (categories[s.category] || 0) + 1;
  });
  
  // Get the current page name for the heading
  const getCurrentPageName = () => {
    switch (activeTab) {
      case "all": return "All Suppliers";
      case "active": return "Active Suppliers";
      case "review": return "Suppliers Under Review";
      case "inactive": return "Inactive Suppliers";
      default: return "All Suppliers";
    }
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Open modal for adding new supplier
  const handleAddSupplier = () => {
    setSelectedSupplier(undefined);
    setIsModalOpen(true);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle successful supplier operation
  const handleSupplierSuccess = () => {
    // In a real application, we would refresh the supplier list from the backend
    // For this demo, we'll simply add a test supplier to the list if adding a new one
    if (!selectedSupplier) {
      const newId = `SUP-${(2315 + Math.floor(Math.random() * 100)).toString()}`;
      const newSupplier: PageSupplier = {
        id: newId,
        name: "New Test Supplier",
        category: "Electronics",
        location: "New York, USA",
        contact: "Test Contact",
        email: "test@example.com",
        rating: 4.0,
        status: "active",
        lastDelivery: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        onTimeRate: 90
      };
      setSuppliers([newSupplier, ...suppliers]);
    }
  };
  
  // Filter suppliers based on search term, status, and additional filters
  const getFilteredSuppliers = (status?: PageSupplier['status']) => {
    let filtered = suppliers;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter if needed
    if (status) {
      filtered = filtered.filter(supplier => supplier.status === status);
    }
    
    // Apply delivery date filter
    if (deliveryDateFilter !== "all") {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      filtered = filtered.filter(supplier => {
        const deliveryDate = new Date(supplier.lastDelivery);
        if (deliveryDateFilter === "today") {
          return deliveryDate.toDateString() === today.toDateString();
        } else if (deliveryDateFilter === "yesterday") {
          return deliveryDate.toDateString() === yesterday.toDateString();
        } else if (deliveryDateFilter === "week") {
          return deliveryDate >= lastWeek;
        }
        return true;
      });
    }
    
    // Apply rating filter
    if (ratingFilter !== "all") {
      if (ratingFilter === "excellent") {
        filtered = filtered.filter(supplier => supplier.rating >= 4.5);
      } else if (ratingFilter === "good") {
        filtered = filtered.filter(supplier => supplier.rating >= 4.0 && supplier.rating < 4.5);
      } else if (ratingFilter === "average") {
        filtered = filtered.filter(supplier => supplier.rating < 4.0);
      }
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(supplier => supplier.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    
    return filtered;
  };
  
  // Render filter controls for supplier tables
  const RenderFilters = () => (
    <div className="flex flex-row gap-2">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-4 w-4 opacity-50" />
        <Select value={deliveryDateFilter} onValueChange={setDeliveryDateFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Last delivery" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Select value={ratingFilter} onValueChange={setRatingFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="excellent">Excellent (&gt;4.5)</SelectItem>
          <SelectItem value="good">Good (4.0-4.5)</SelectItem>
          <SelectItem value="average">Average (&lt;4.0)</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="industrial">Industrial</SelectItem>
          <SelectItem value="logistics">Logistics</SelectItem>
          <SelectItem value="furniture">Furniture</SelectItem>
          <SelectItem value="textiles">Textiles</SelectItem>
          <SelectItem value="raw materials">Raw Materials</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
  
  // Render supplier table
  const renderSupplierTable = (suppliers: PageSupplier[]) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>On-Time %</TableHead>
            <TableHead>Last Delivery</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{supplier.name}</div>
                    <div className="text-sm text-muted-foreground">{supplier.contact}</div>
                  </div>
                </TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>{supplier.location}</TableCell>
                <TableCell>
                  <Badge variant={
                    supplier.status === 'active' ? 'success' : 
                    supplier.status === 'review' ? 'warning' : 
                    'secondary'
                  }>
                    {supplier.status === 'active' ? 'Active' :
                     supplier.status === 'review' ? 'Under Review' :
                     'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                    <span>{supplier.rating}</span>
                  </div>
                </TableCell>
                <TableCell>{supplier.onTimeRate}%</TableCell>
                <TableCell>{supplier.lastDelivery}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Performance history</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Contact supplier</DropdownMenuItem>
                      <DropdownMenuItem>Place order</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit supplier</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
                No suppliers found matching the criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Supplier Management
          </h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">
              {getCurrentPageName()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => setSuppliers(supplierData)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAddSupplier}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {activeTab === "all" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Total Suppliers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{totalSuppliers}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+3 since last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Average Rating</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{avgRating.toFixed(1)}/5</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+0.2 from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">On-Time Delivery</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{avgOnTimeRate.toFixed(1)}%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+1.5% from last year</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Active Suppliers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{activeSuppliers}</div>
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">{Math.round((activeSuppliers / totalSuppliers) * 100)}% of total</div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeTab === "active" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Active Suppliers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{activeSuppliers}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+2 since last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Average Rating</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{(suppliers.filter(s => s.status === 'active').reduce((sum, s) => sum + s.rating, 0) / activeSuppliers).toFixed(1)}/5</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+0.3 from inactive suppliers</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">On-Time Delivery</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{(suppliers.filter(s => s.status === 'active').reduce((sum, s) => sum + s.onTimeRate, 0) / activeSuppliers).toFixed(1)}%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+2.1% from overall average</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Active Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{Object.keys(suppliers.filter(s => s.status === 'active').reduce((acc, s) => ({...acc, [s.category]: true}), {})).length}</div>
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">Across all product lines</div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeTab === "review" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Under Review</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{reviewSuppliers}</div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-1 since last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Avg Review Duration</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">14 days</div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-2 days from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Review Approval Rate</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">78.5%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+3.2% from last year</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Top Review Reason</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">Quality</div>
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">42% of reviews</div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Inactive Suppliers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{inactiveSuppliers}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-amber-500" />
                  <p className="text-xs text-amber-500">+1 since last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Reactivation Rate</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">24.6%</div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-amber-500" />
                  <p className="text-xs text-amber-500">-2.3% from last year</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Avg Inactive Period</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">126 days</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-amber-500" />
                  <p className="text-xs text-amber-500">+12 days from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Top Inactive Reason</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">Pricing</div>
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">38% of cases</div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Reliability Trend</CardTitle>
            <CardDescription>On-time delivery percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={deliveryReliability}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    domain={[80, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="onTime" 
                    name="On-Time Delivery %" 
                    stroke="hsl(var(--primary))" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Evaluation</CardTitle>
            <CardDescription>Comparison of top suppliers across key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={evaluationData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Radar
                    name="Top Supplier"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Average Supplier"
                    dataKey="B"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <CardDescription>Supplier performance metrics by category and other things</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryPerformance}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="category" 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Bar dataKey="onTime" name="On-Time Delivery" fill="hsl(var(--primary))" />
                <Bar dataKey="quality" name="Quality Score" fill="#82ca9d" />
                <Bar dataKey="pricing" name="Price Competitiveness" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="p-6">
            <CardTitle>Supplier Performance Overview</CardTitle>
            <CardDescription>Monthly metrics for all supplier categories</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="onTime" name="On-Time Delivery" fill="hsl(var(--primary))" />
                  <Bar dataKey="quality" name="Quality Score" fill="#82ca9d" />
                  <Bar dataKey="pricing" name="Price Competitiveness" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-6">
            <CardTitle>Top Supplier Performance</CardTitle>
            <CardDescription>Comparing top and average metrics</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="80%" 
                  data={[
                    { subject: 'Quality', A: 95, B: 82 },
                    { subject: 'On-Time', A: 98, B: 90 },
                    { subject: 'Price', A: 85, B: 80 },
                    { subject: 'Communication', A: 92, B: 84 },
                    { subject: 'Flexibility', A: 88, B: 75 }
                  ]}
                >
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <PolarRadiusAxis 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Radar
                    name="Top Supplier"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Average Supplier"
                    dataKey="B"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Operations Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6 space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all">
            <Factory className="h-5 w-5 mr-2 text-primary" />
            All Suppliers
          </TabsTrigger>
          <TabsTrigger value="active">
            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
            Active
          </TabsTrigger>
          <TabsTrigger value="review">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Under Review
          </TabsTrigger>
          <TabsTrigger value="inactive">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Inactive
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>All Suppliers</CardTitle>
                <CardDescription>Manage all your supplier relationships</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search suppliers..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" onClick={handleAddSupplier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            
            <div className="p-6 bg-background py-0 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <RenderFilters />
                <Button variant="outline" className="h-9 ml-auto" onClick={() => setSuppliers(supplierData)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <CardContent className="p-6">
              {renderSupplierTable(getFilteredSuppliers())}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredSuppliers().length} of {totalSuppliers} suppliers
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Active Suppliers</CardTitle>
                <CardDescription>Currently active supplier accounts</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search active suppliers..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" onClick={handleAddSupplier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            
            <div className="p-6 bg-background py-0 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <RenderFilters />
                <Button variant="outline" className="h-9 ml-auto" onClick={() => setSuppliers(supplierData)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <CardContent className="p-6">
              {renderSupplierTable(getFilteredSuppliers('active'))}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredSuppliers('active').length} of {activeSuppliers} active suppliers
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Under Review</CardTitle>
                <CardDescription>Suppliers currently under evaluation</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search suppliers under review..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" onClick={handleAddSupplier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            
            <div className="p-6 bg-background py-0 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <RenderFilters />
                <Button variant="outline" className="h-9 ml-auto" onClick={() => setSuppliers(supplierData)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <CardContent className="p-6">
              {renderSupplierTable(getFilteredSuppliers('review'))}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredSuppliers('review').length} of {reviewSuppliers} suppliers under review
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Inactive Suppliers</CardTitle>
                <CardDescription>Suppliers with inactive accounts</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search inactive suppliers..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" onClick={handleAddSupplier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            
            <div className="p-6 bg-background py-0 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <RenderFilters />
                <Button variant="outline" className="h-9 ml-auto" onClick={() => setSuppliers(supplierData)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <CardContent className="p-6">
              {renderSupplierTable(getFilteredSuppliers('inactive'))}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredSuppliers('inactive').length} of {inactiveSuppliers} inactive suppliers
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Supplier Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={selectedSupplier}
        onSuccess={handleSupplierSuccess}
      />
    </div>
  );
}