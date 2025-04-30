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
  ArrowDown,
  Users,
  Boxes,
  ShoppingCart,
  FileSpreadsheet,
  BarChart3,
  FileText,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Check,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Pencil,
  Trash2
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
  Radar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
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
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { Label } from "@/components/ui/label";

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

// Define purchase order interface
interface PurchaseOrder {
  id: string;
  supplier: string;
  supplierID: string;
  orderDate: string;
  deliveryDate: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: number;
  total: number;
  priority: "low" | "medium" | "high";
  paymentStatus: "unpaid" | "partial" | "paid";
}

// Define supplier quality metric interface
interface QualityMetric {
  id: string;
  supplier: string;
  date: string;
  defectRate: number;
  returnRate: number;
  qualityScore: number;
  complianceScore: number;
  inspectionResult: "passed" | "conditional" | "failed";
}

// Define cost optimization initiative interface
interface CostOptimizationInitiative {
  id: string;
  name: string;
  category: string;
  targetSavings: number;
  actualSavings: number;
  progress: number;
  roi: string;
  status: "in_progress" | "completed" | "planned" | "cancelled";
  startDate: string;
  endDate: string;
  owner: string;
  description?: string;
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

// Add new cost performance data
const costPerformanceData = [
  { month: "Mar", actual: 95000, planned: 100000 },
  { month: "Apr", actual: 97000, planned: 100000 },
  { month: "May", actual: 98000, planned: 100000 },
  { month: "Jun", actual: 99500, planned: 100000 },
  { month: "Jul", actual: 97800, planned: 100000 },
  { month: "Aug", actual: 97200, planned: 100000 },
];

// Add quality incidents trend data
const qualityIncidentsTrend = [
  { month: "Mar", critical: 3, major: 8, minor: 15 },
  { month: "Apr", critical: 2, major: 7, minor: 12 },
  { month: "May", critical: 1, major: 5, minor: 10 },
  { month: "Jun", critical: 1, major: 6, minor: 9 },
  { month: "Jul", critical: 0, major: 4, minor: 7 },
  { month: "Aug", critical: 0, major: 3, minor: 6 },
];

// Add supplier response time data
const responseTimeData = [
  { supplier: "Global Electronics", responseTime: 4.2 },
  { supplier: "American Industrial", responseTime: 6.8 },
  { supplier: "EuroTech Components", responseTime: 3.5 },
  { supplier: "Pacific Logistics", responseTime: 2.7 },
  { supplier: "Tokyo Tech", responseTime: 5.3 },
];

// Add risk assessment data
const riskAssessmentData = [
  { category: "Financial", low: 15, medium: 7, high: 3, critical: 1 },
  { category: "Operational", low: 12, medium: 9, high: 4, critical: 0 },
  { category: "Regulatory", low: 18, medium: 5, high: 2, critical: 0 },
  { category: "Geopolitical", low: 10, medium: 8, high: 6, critical: 2 },
  { category: "Environmental", low: 14, medium: 6, high: 3, critical: 1 },
];

// Supplier geographical distribution
const supplierGeographicData = [
  { region: "North America", count: 24, share: 28 },
  { region: "Europe", count: 18, share: 21 },
  { region: "Asia Pacific", count: 31, share: 36 },
  { region: "Latin America", count: 8, share: 9 },
  { region: "Middle East & Africa", count: 5, share: 6 },
];

// Supplier onboarding funnel data
const onboardingFunnelData = [
  { stage: "Initial Contact", count: 45 },
  { stage: "Qualification", count: 32 },
  { stage: "Documentation", count: 24 },
  { stage: "Compliance Check", count: 18 },
  { stage: "Final Approval", count: 15 },
  { stage: "Active Supplier", count: 12 },
];

// Supplier category breakdown
const supplierCategoryBreakdown = [
  { name: "Electronics", value: 25 },
  { name: "Industrial", value: 18 },
  { name: "Logistics", value: 15 },
  { name: "Raw Materials", value: 12 },
  { name: "Packaging", value: 10 },
  { name: "Office Supplies", value: 8 },
  { name: "Textiles", value: 6 },
  { name: "Furniture", value: 5 },
  { name: "Food & Beverage", value: 4 },
  { name: "Other", value: 7 },
];

// Supplier certification data
const certificationData = [
  { name: "ISO 9001", count: 42, percentage: 75 },
  { name: "ISO 14001", count: 28, percentage: 50 },
  { name: "ISO 27001", count: 14, percentage: 25 },
  { name: "FSC Certified", count: 12, percentage: 21 },
  { name: "Fair Trade", count: 8, percentage: 14 },
];

// Supplier relationship length data
const relationshipLengthData = [
  { range: "<1 Year", count: 12 },
  { range: "1-3 Years", count: 25 },
  { range: "3-5 Years", count: 18 },
  { range: "5-10 Years", count: 15 },
  { range: ">10 Years", count: 8 },
];

// Cost optimization initiatives data
const costOptimizationData: CostOptimizationInitiative[] = [
  {
    id: "COST-001",
    name: "Bulk Purchasing",
    category: "Raw Materials",
    targetSavings: 120000,
    actualSavings: 95000,
    progress: 79,
    roi: "3.2x",
    status: "in_progress",
    startDate: "2023-03-15",
    endDate: "2023-12-31",
    owner: "Procurement Team",
    description: "Consolidating purchases to achieve volume discounts"
  },
  {
    id: "COST-002",
    name: "Supplier Consolidation",
    category: "Electronics",
    targetSavings: 85000,
    actualSavings: 85000,
    progress: 100,
    roi: "2.8x", 
    status: "completed",
    startDate: "2023-01-10",
    endDate: "2023-07-31",
    owner: "Supply Chain",
    description: "Reducing the number of suppliers for electronic components"
  },
  {
    id: "COST-003",
    name: "Just-in-Time Delivery",
    category: "Logistics",
    targetSavings: 65000,
    actualSavings: 45000,
    progress: 69,
    roi: "1.9x",
    status: "in_progress",
    startDate: "2023-04-01",
    endDate: "2023-12-15",
    owner: "Operations",
    description: "Implementing JIT delivery to reduce inventory costs"
  },
  {
    id: "COST-004",
    name: "Contract Renegotiation",
    category: "Office Supplies",
    targetSavings: 35000,
    actualSavings: 32000,
    progress: 91,
    roi: "2.5x",
    status: "in_progress",
    startDate: "2023-05-20",
    endDate: "2023-09-30",
    owner: "Procurement Team",
    description: "Renegotiating contracts with key office supply vendors"
  },
  {
    id: "COST-005",
    name: "Energy Efficiency",
    category: "Facilities",
    targetSavings: 50000,
    actualSavings: 28000,
    progress: 56,
    roi: "1.8x",
    status: "in_progress",
    startDate: "2023-02-15",
    endDate: "2023-11-30",
    owner: "Facilities Management",
    description: "Implementing energy-efficient solutions across facilities"
  },
  {
    id: "COST-006",
    name: "Transportation Optimization",
    category: "Logistics",
    targetSavings: 78000,
    actualSavings: 52000,
    progress: 67,
    roi: "2.1x",
    status: "in_progress",
    startDate: "2023-03-01",
    endDate: "2023-10-31",
    owner: "Logistics Team",
    description: "Optimizing transportation routes and carrier selection"
  },
  {
    id: "COST-007",
    name: "Digital Invoicing",
    category: "Administration",
    targetSavings: 25000,
    actualSavings: 23000,
    progress: 92,
    roi: "3.0x",
    status: "completed",
    startDate: "2023-01-05",
    endDate: "2023-06-30",
    owner: "Finance",
    description: "Transitioning to paperless invoicing processes"
  },
  {
    id: "COST-008",
    name: "Packaging Redesign",
    category: "Packaging",
    targetSavings: 42000,
    actualSavings: 18000,
    progress: 43,
    roi: "1.5x",
    status: "in_progress",
    startDate: "2023-04-15",
    endDate: "2023-12-31",
    owner: "Product Development",
    description: "Redesigning packaging to use less material"
  },
  {
    id: "COST-009",
    name: "Outsourcing Non-Core Services",
    category: "Operations",
    targetSavings: 95000,
    actualSavings: 0,
    progress: 0,
    roi: "2.7x",
    status: "planned",
    startDate: "2023-09-01",
    endDate: "2024-06-30",
    owner: "Operations",
    description: "Outsourcing non-core business functions to specialized providers"
  },
  {
    id: "COST-010",
    name: "Inventory Optimization",
    category: "Warehousing",
    targetSavings: 110000,
    actualSavings: 68000,
    progress: 62,
    roi: "2.4x",
    status: "in_progress",
    startDate: "2023-02-01",
    endDate: "2023-11-30",
    owner: "Supply Chain",
    description: "Optimizing inventory levels to reduce holding costs"
  },
  {
    id: "COST-011",
    name: "Automated Quality Control",
    category: "Manufacturing",
    targetSavings: 72000,
    actualSavings: 45000,
    progress: 63,
    roi: "2.2x",
    status: "in_progress",
    startDate: "2023-03-10",
    endDate: "2023-12-15",
    owner: "Quality Assurance",
    description: "Implementing automated quality control processes"
  },
  {
    id: "COST-012",
    name: "Sustainable Sourcing",
    category: "Raw Materials",
    targetSavings: 55000,
    actualSavings: 12000,
    progress: 22,
    roi: "1.7x",
    status: "in_progress",
    startDate: "2023-05-01",
    endDate: "2024-01-31",
    owner: "Procurement Team",
    description: "Sourcing eco-friendly materials with long-term cost benefits"
  }
];

// Purchase order trends by month
const purchaseOrderTrends = [
  { month: "Jan", count: 42, value: 245000 },
  { month: "Feb", count: 38, value: 215000 },
  { month: "Mar", count: 55, value: 320000 },
  { month: "Apr", count: 47, value: 278000 },
  { month: "May", count: 62, value: 345000 },
  { month: "Jun", count: 51, value: 302000 },
  { month: "Jul", count: 49, value: 287000 },
  { month: "Aug", count: 64, value: 370000 },
];

// Purchase order fulfillment metrics
const orderFulfillmentMetrics = [
  { status: "On Time", count: 523, percentage: 78.5 },
  { status: "1-2 Days Late", count: 87, percentage: 13.1 },
  { status: "3-7 Days Late", count: 42, percentage: 6.3 },
  { status: ">7 Days Late", count: 14, percentage: 2.1 },
];

// Supplier order volume breakdown
const supplierOrderVolume = [
  { supplier: "Global Electronics Manufacturing", count: 28, value: 87500 },
  { supplier: "American Industrial Solutions", count: 22, value: 65200 },
  { supplier: "EuroTech Components", count: 19, value: 58400 },
  { supplier: "Pacific Logistics Partners", count: 15, value: 42300 },
  { supplier: "Tokyo Tech Innovations", count: 12, value: 38700 },
];

// Purchase order items by category
const orderItemsByCategory = [
  { category: "Electronics", count: 128, value: 185000 },
  { category: "Industrial", count: 85, value: 142000 },
  { category: "Raw Materials", count: 67, value: 98000 },
  { category: "Packaging", count: 42, value: 35000 },
  { category: "Office Supplies", count: 38, value: 28000 },
];

// Purchase order payment analytics
const paymentAnalytics = [
  { status: "Paid", count: 423, value: 1245000 },
  { status: "Pending", count: 112, value: 675000 },
  { status: "Overdue", count: 27, value: 183000 },
  { status: "Disputed", count: 8, value: 47000 },
];

// Historical purchase orders (longer history)
const historicalOrders = [
  { year: "2018", q1: 85000, q2: 92000, q3: 88000, q4: 95000 },
  { year: "2019", q1: 90000, q2: 98000, q3: 92000, q4: 105000 },
  { year: "2020", q1: 86000, q2: 82000, q3: 90000, q4: 98000 },
  { year: "2021", q1: 95000, q2: 102000, q3: 108000, q4: 115000 },
  { year: "2022", q1: 112000, q2: 118000, q3: 122000, q4: 135000 },
  { year: "2023", q1: 128000, q2: 142000, q3: 0, q4: 0 },
];

// Mock data for supplier performance metrics
const supplierRatings = [
  { name: "Alpha Corp", overall: 4.7, quality: 4.8, delivery: 4.5, price: 4.2, service: 4.8 },
  { name: "Beta Industries", overall: 4.2, quality: 4.5, delivery: 3.9, price: 4.6, service: 4.1 },
  { name: "Gamma Supplies", overall: 3.8, quality: 3.7, delivery: 3.5, price: 4.8, service: 3.9 },
  { name: "Delta Manufacturing", overall: 4.5, quality: 4.6, delivery: 4.7, price: 4.1, service: 4.5 },
  { name: "Epsilon Logistics", overall: 4.0, quality: 3.9, delivery: 4.8, price: 3.8, service: 4.2 },
];

const qualityMetrics = [
  { month: "Jan", defectRate: 0.8, returnRate: 1.2 },
  { month: "Feb", defectRate: 0.7, returnRate: 0.9 },
  { month: "Mar", defectRate: 1.1, returnRate: 1.4 },
  { month: "Apr", defectRate: 0.6, returnRate: 0.8 },
  { month: "May", defectRate: 0.5, returnRate: 0.7 },
  { month: "Jun", defectRate: 0.4, returnRate: 0.6 },
  { month: "Jul", defectRate: 0.5, returnRate: 0.8 },
  { month: "Aug", defectRate: 0.3, returnRate: 0.5 },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<PageSupplier[]>(supplierData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  // Get current location
  const [location, setLocation] = useLocation();
  
  // Add new filter states
  const [deliveryDateFilter, setDeliveryDateFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Cost optimization initiatives states
  const [costInitiatives, setCostInitiatives] = useState<CostOptimizationInitiative[]>(costOptimizationData);
  const [costSearchTerm, setCostSearchTerm] = useState("");
  const [costStatusFilter, setCostStatusFilter] = useState("all");
  const [costCategoryFilter, setCostCategoryFilter] = useState("all");
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  const [costCurrentPage, setCostCurrentPage] = useState(1);
  const [costPageSize, setCostPageSize] = useState(5);
  
  // Add state for the main tab navigation (different sections)
  const [mainTab, setMainTab] = useState("performance");
  
  // Add state for the content tabs within each main section
  const [directoryTab, setDirectoryTab] = useState("all");
  const [ordersTab, setOrdersTab] = useState("all");
  const [qualityTab, setQualityTab] = useState("metrics");
  const [performanceTab, setPerformanceTab] = useState("overview");
  // Add state for directory sub-tabs
  const [directorySubTab, setDirectorySubTab] = useState("list");
  // Add state for purchase orders sub-tabs
  const [ordersSubTab, setOrdersSubTab] = useState("current");
  
  // State for purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  
  // State for quality metrics
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  
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
  
  // Cost optimization initiatives handlers
  
  // Filter cost initiatives based on search term, status, and category
  const getFilteredCostInitiatives = () => {
    let filtered = costInitiatives;
    
    // Apply search filter
    if (costSearchTerm) {
      filtered = filtered.filter(initiative => 
        initiative.name.toLowerCase().includes(costSearchTerm.toLowerCase()) ||
        initiative.category.toLowerCase().includes(costSearchTerm.toLowerCase()) ||
        initiative.owner.toLowerCase().includes(costSearchTerm.toLowerCase()) ||
        initiative.description?.toLowerCase().includes(costSearchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (costStatusFilter !== "all") {
      filtered = filtered.filter(initiative => initiative.status === costStatusFilter);
    }
    
    // Apply category filter
    if (costCategoryFilter !== "all") {
      filtered = filtered.filter(initiative => 
        initiative.category.toLowerCase() === costCategoryFilter.toLowerCase()
      );
    }
    
    return filtered;
  };
  
  // Handle cost initiative pagination
  const handleCostPageChange = (page: number) => {
    setCostCurrentPage(page);
  };
  
  // Handle toggle initiative selection
  const handleToggleInitiativeSelection = (id: string) => {
    if (selectedInitiatives.includes(id)) {
      setSelectedInitiatives(selectedInitiatives.filter(i => i !== id));
    } else {
      setSelectedInitiatives([...selectedInitiatives, id]);
    }
  };
  
  // Handle cost search
  const handleCostSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCostSearchTerm(e.target.value);
    setCostCurrentPage(1); // Reset to first page after search
  };
  
  // Filter and paginate cost initiatives
  const filteredCostInitiatives = getFilteredCostInitiatives();
  const costTotalPages = Math.ceil(filteredCostInitiatives.length / costPageSize);
  const paginatedCostInitiatives = filteredCostInitiatives.slice(
    (costCurrentPage - 1) * costPageSize,
    costCurrentPage * costPageSize
  );
  
  // Get unique categories for the filter dropdown
  const uniqueCostCategories = Array.from(
    new Set(costInitiatives.map(initiative => initiative.category))
  );
  
  // Mock purchase order data
  useEffect(() => {
    // In a real app, this would be loaded from an API
    const mockPurchaseOrders: PurchaseOrder[] = [
      {
        id: "PO-10025",
        supplier: "Global Electronics Manufacturing",
        supplierID: "SUP-2301",
        orderDate: "2023-08-10",
        deliveryDate: "2023-08-25",
        status: "pending",
        items: 12,
        total: 18750.50,
        priority: "high",
        paymentStatus: "partial"
      },
      {
        id: "PO-10024",
        supplier: "American Industrial Solutions",
        supplierID: "SUP-2302",
        orderDate: "2023-08-08",
        deliveryDate: "2023-08-22",
        status: "shipped",
        items: 8,
        total: 12400.75,
        priority: "medium",
        paymentStatus: "paid"
      },
      {
        id: "PO-10023",
        supplier: "EuroTech Components",
        supplierID: "SUP-2303",
        orderDate: "2023-08-05",
        deliveryDate: "2023-08-18",
        status: "delivered",
        items: 15,
        total: 9875.25,
        priority: "medium",
        paymentStatus: "paid"
      },
      {
        id: "PO-10022",
        supplier: "Pacific Logistics Partners",
        supplierID: "SUP-2304",
        orderDate: "2023-08-02",
        deliveryDate: "2023-08-15",
        status: "delivered",
        items: 5,
        total: 5680.00,
        priority: "low",
        paymentStatus: "paid"
      },
      {
        id: "PO-10021",
        supplier: "Tokyo Tech Innovations",
        supplierID: "SUP-2310",
        orderDate: "2023-07-29",
        deliveryDate: "2023-08-12",
        status: "delivered",
        items: 20,
        total: 24950.30,
        priority: "high",
        paymentStatus: "paid"
      }
    ];
    setPurchaseOrders(mockPurchaseOrders);
    
    // Mock quality metrics
    const mockQualityMetrics: QualityMetric[] = [
      {
        id: "QM-2301",
        supplier: "Global Electronics Manufacturing",
        date: "2023-08-15",
        defectRate: 0.8,
        returnRate: 0.5,
        qualityScore: 95,
        complianceScore: 98,
        inspectionResult: "passed"
      },
      {
        id: "QM-2302",
        supplier: "American Industrial Solutions",
        date: "2023-08-12",
        defectRate: 1.2,
        returnRate: 0.7,
        qualityScore: 92,
        complianceScore: 95,
        inspectionResult: "passed"
      },
      {
        id: "QM-2303",
        supplier: "EuroTech Components",
        date: "2023-08-10",
        defectRate: 2.1,
        returnRate: 1.4,
        qualityScore: 88,
        complianceScore: 90,
        inspectionResult: "conditional"
      },
      {
        id: "QM-2304",
        supplier: "Pacific Logistics Partners",
        date: "2023-08-08",
        defectRate: 0.5,
        returnRate: 0.3,
        qualityScore: 97,
        complianceScore: 99,
        inspectionResult: "passed"
      },
      {
        id: "QM-2305",
        supplier: "Maple Wood Furniture",
        date: "2023-08-05",
        defectRate: 3.2,
        returnRate: 2.5,
        qualityScore: 82,
        complianceScore: 85,
        inspectionResult: "conditional"
      }
    ];
    setQualityMetrics(mockQualityMetrics);
  }, []);

  // Set the main tab based on the current URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/performance')) {
      setMainTab('performance');
    } else if (path.includes('/directory')) {
      setMainTab('directory');
    } else if (path.includes('/orders')) {
      setMainTab('orders');
    } else if (path.includes('/quality')) {
      setMainTab('quality');
    }
  }, [location]);

  // Get the current page name for the heading
  const getCurrentPageName = () => {
    if (mainTab === "performance") {
      return "Supplier Performance";
    } else if (mainTab === "directory") {
      return "Supplier Directory";
    } else if (mainTab === "orders") {
      return "Purchase Orders";
    } else if (mainTab === "quality") {
      return "Quality Analysis";
    } else {
      return "Supplier Management";
    }
  };
  
  // Handle main tab change
  const handleMainTabChange = (value: string) => {
    setMainTab(value);
    // Update URL based on selected tab
    setLocation(`/suppliers/${value}`);
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

  // Add state for pagination and selection
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate pagination values
  const filterSuppliers = () => {
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
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
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

  const filteredSuppliers = filterSuppliers();
  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / pageSize));
  const indexOfLastSupplier = currentPage * pageSize;
  const indexOfFirstSupplier = indexOfLastSupplier - pageSize;
  const paginatedSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle supplier selection toggle
  const handleToggleSupplierSelection = (supplierId: string) => {
    setSelectedSuppliers(prev => {
      if (prev.includes(supplierId)) {
        return prev.filter(id => id !== supplierId);
      } else {
        return [...prev, supplierId];
      }
    });
  };

  // Replace the Supplier Directory Card with this new implementation
  const renderSupplierDirectory = () => (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
        <div>
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>Complete listing of all supplier information and contacts</CardDescription>
        </div>
        <Button onClick={handleAddSupplier}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </CardHeader>
      
      <div className="p-6 bg-background py-0 mb-6">
        <div className="flex flex-wrap items-center gap-3">
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
          
          <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <RenderFilters />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(size) => handlePageSizeChange(Number(size))}
            >
              <SelectTrigger className="h-9 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="h-9 ml-auto" onClick={() => setSuppliers(supplierData)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Batch Operations */}
      {selectedSuppliers.length > 0 && (
        <div className="p-3 bg-muted/30 border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2">{selectedSuppliers.length}</Badge>
              <span className="text-sm font-medium">suppliers selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="" onValueChange={(value) => value && console.log(`Change status to ${value} for ${selectedSuppliers.length} suppliers`)}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Set Active</SelectItem>
                  <SelectItem value="review">Set Under Review</SelectItem>
                  <SelectItem value="inactive">Set Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedSuppliers([])}>
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Table Component */}
      <CardContent className="p-0">
        {filteredSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-6">
            <Factory className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">No suppliers found</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || ratingFilter !== "all" || deliveryDateFilter !== "all"
                ? "Try adjusting your search filters to find what you're looking for." 
                : "Get started by adding your first supplier."}
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && ratingFilter === "all" && deliveryDateFilter === "all" && (
              <Button onClick={handleAddSupplier}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            )}
          </div>
        ) : (
          <div>
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="bg-muted/50 text-sm">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium w-[40px]">
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.length === paginatedSuppliers.length && paginatedSuppliers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSuppliers(paginatedSuppliers.map(s => s.id.toString()));
                          } else {
                            setSelectedSuppliers([]);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                    <th className="py-3 px-4 text-left font-medium">Company</th>
                    <th className="py-3 px-4 text-left font-medium">POC</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">Phone</th>
                    <th className="py-3 px-4 text-left font-medium">Location</th>
                    <th className="py-3 px-4 text-left font-medium">Category</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedSuppliers.map((supplier) => {
                    const statusColor = supplier.status === 'active' ? 'green' : 
                      supplier.status === 'review' ? 'amber' : 'red';
                    const statusLabel = supplier.status === 'active' ? 'Active' :
                      supplier.status === 'review' ? 'Under Review' : 'Inactive';
                    
                    return (
                      <tr 
                        key={supplier.id} 
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedSuppliers.includes(supplier.id.toString())}
                            onChange={() => handleToggleSupplierSelection(supplier.id.toString())}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm">{supplier.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium flex items-center">
                            <Factory className="h-4 w-4 mr-2 text-primary" />
                            {supplier.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{supplier.contact}</td>
                        <td className="py-3 px-4">{supplier.email}</td>
                        <td className="py-3 px-4">{supplier.phone || "No phone"}</td>
                        <td className="py-3 px-4 text-sm">{supplier.location}</td>
                        <td className="py-3 px-4 text-sm">{supplier.category}</td>
                        <td className="py-3 px-4">
                          <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                            {statusLabel}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => console.log("View details for supplier:", supplier)} 
                              className="h-8 w-8"
                              title="View Details"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                // Convert PageSupplier to Supplier type
                                const supplierForModal: Supplier = {
                                  id: parseInt(supplier.id.replace('SUP-', '')), // Convert string ID to number
                                  name: supplier.name,
                                  contactName: supplier.contact,
                                  email: supplier.email,
                                  phone: supplier.phone || "",
                                  address: {
                                    street: supplier.location.split(',')[0] || "",
                                    city: supplier.location.split(',')[1]?.trim() || "",
                                    state: supplier.location.split(',')[2]?.trim() || "",
                                    postalCode: "",
                                    country: ""
                                  },
                                  category: supplier.category,
                                  status: supplier.status === "review" ? "pending" : supplier.status, // Map 'review' to 'pending'
                                  rating: supplier.rating,
                                  joinDate: supplier.joinDate ? new Date(supplier.joinDate) : new Date(),
                                  notes: supplier.notes || "",
                                  products: []
                                };
                                setSelectedSupplier(supplierForModal);
                              }} 
                              className="h-8 w-8"
                              title="Edit Supplier"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => console.log("Delete supplier:", supplier)} 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              title="Delete Supplier"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="border-t">
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredSuppliers.length)} to {Math.min(currentPage * pageSize, filteredSuppliers.length)} of {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'}
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                      aria-label="First page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {totalPages <= 5 ? (
                      // Show all pages if 5 or fewer
                      [...Array(totalPages)].map((_, i) => (
                        <Button
                          key={`page-${i+1}`}
                          variant={currentPage === i+1 ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(i+1)}
                          className="h-8 w-8"
                          aria-label={`Page ${i+1}`}
                          aria-current={currentPage === i+1 ? "page" : undefined}
                        >
                          {i+1}
                        </Button>
                      ))
                    ) : (
                      // Show limited pages with ellipsis
                      <>
                        <Button
                          variant={currentPage === 1 ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(1)}
                          className="h-8 w-8"
                          aria-label="Page 1"
                        >
                          1
                        </Button>
                        
                        {currentPage > 3 && <span className="mx-1">...</span>}
                        
                        {currentPage > 2 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="h-8 w-8"
                            aria-label={`Page ${currentPage - 1}`}
                          >
                            {currentPage - 1}
                          </Button>
                        )}
                        
                        {currentPage !== 1 && currentPage !== totalPages && (
                          <Button
                            variant="default"
                            size="icon"
                            onClick={() => handlePageChange(currentPage)}
                            className="h-8 w-8"
                            aria-label={`Page ${currentPage}`}
                            aria-current="page"
                          >
                            {currentPage}
                          </Button>
                        )}
                        
                        {currentPage < totalPages - 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="h-8 w-8"
                            aria-label={`Page ${currentPage + 1}`}
                          >
                            {currentPage + 1}
                          </Button>
                        )}
                        
                        {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                        
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(totalPages)}
                          className="h-8 w-8"
                          aria-label={`Page ${totalPages}`}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                      aria-label="Last page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 flex justify-end">
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Replace the existing supplier directory in TabsContent with the new one
  // ... existing code ...
  <TabsContent value="directory">
    {mainTab === "directory" && directoryTab === "all" && (
      <>
        {directorySubTab === "list" ? (
          renderSupplierDirectory()
        ) : (
          // Keep existing map view
          <div>
            {/* Map view component */}
          </div>
        )}
      </>
    )}
    {/* Keep other existing tab content */}
  </TabsContent>
  // ... existing code ...

  // Add new state variables for Onboarding table
  const [onboardingSuppliers, setOnboardingSuppliers] = useState([
    {
      id: "ONB-001",
      name: "Green Valley Organics",
      stage: "Documentation",
      startDate: "Aug 15, 2023",
      owner: "Sarah Johnson",
      progress: 50,
      timeInStage: "5 days",
      expectedCompletion: "Sep 10, 2023"
    },
    {
      id: "ONB-002",
      name: "MetalWorks Inc.",
      stage: "Compliance Check",
      startDate: "Aug 8, 2023",
      owner: "Michael Brown",
      progress: 75,
      timeInStage: "3 days",
      expectedCompletion: "Aug 28, 2023"
    },
    {
      id: "ONB-003",
      name: "Tech Solutions Ltd",
      stage: "Final Approval",
      startDate: "Jul 29, 2023",
      owner: "Emily Parker",
      progress: 90,
      timeInStage: "2 days",
      expectedCompletion: "Aug 22, 2023"
    },
    {
      id: "ONB-004",
      name: "Global Logistics Co.",
      stage: "Documentation",
      startDate: "Aug 12, 2023",
      owner: "Robert Chen",
      progress: 35,
      timeInStage: "7 days",
      expectedCompletion: "Sep 15, 2023"
    },
    {
      id: "ONB-005",
      name: "Farm Fresh Produce",
      stage: "Initial Assessment",
      startDate: "Aug 18, 2023",
      owner: "James Wilson",
      progress: 15,
      timeInStage: "2 days",
      expectedCompletion: "Sep 25, 2023"
    },
    {
      id: "ONB-006",
      name: "Eastern Electronics",
      stage: "Compliance Check",
      startDate: "Aug 5, 2023",
      owner: "Linda Martinez",
      progress: 65,
      timeInStage: "4 days",
      expectedCompletion: "Sep 1, 2023"
    },
    {
      id: "ONB-007",
      name: "Nordic Furniture Design",
      stage: "Final Approval",
      startDate: "Aug 1, 2023",
      owner: "Erik Hansen",
      progress: 95,
      timeInStage: "1 day",
      expectedCompletion: "Aug 21, 2023"
    }
  ]);
  const [onboardingSearchTerm, setOnboardingSearchTerm] = useState("");
  const [onboardingStageFilter, setOnboardingStageFilter] = useState("all");
  const [onboardingCurrentPage, setOnboardingCurrentPage] = useState(1);
  const [onboardingPageSize, setOnboardingPageSize] = useState(5);
  const [selectedOnboardingSuppliers, setSelectedOnboardingSuppliers] = useState<string[]>([]);

  // Add new functions for Onboarding table
  const filterOnboardingSuppliers = () => {
    let filtered = onboardingSuppliers;
    
    // Apply search filter
    if (onboardingSearchTerm) {
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(onboardingSearchTerm.toLowerCase()) ||
        supplier.owner.toLowerCase().includes(onboardingSearchTerm.toLowerCase()) ||
        supplier.stage.toLowerCase().includes(onboardingSearchTerm.toLowerCase())
      );
    }
    
    // Apply stage filter
    if (onboardingStageFilter !== "all") {
      filtered = filtered.filter(supplier => supplier.stage === onboardingStageFilter);
    }
    
    return filtered;
  };

  const handleOnboardingPageChange = (page: number) => {
    setOnboardingCurrentPage(page);
  };

  const handleToggleOnboardingSupplierSelection = (supplierId: string) => {
    setSelectedOnboardingSuppliers(prev => {
      if (prev.includes(supplierId)) {
        return prev.filter(id => id !== supplierId);
      } else {
        return [...prev, supplierId];
      }
    });
  };

  const handleOnboardingSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnboardingSearchTerm(e.target.value);
    setOnboardingCurrentPage(1); // Reset to first page after search
  };

  // Calculate pagination for Onboarding
  const filteredOnboardingSuppliers = filterOnboardingSuppliers();
  const onboardingTotalPages = Math.max(1, Math.ceil(filteredOnboardingSuppliers.length / onboardingPageSize));
  const paginatedOnboardingSuppliers = filteredOnboardingSuppliers.slice(
    (onboardingCurrentPage - 1) * onboardingPageSize,
    onboardingCurrentPage * onboardingPageSize
  );

  // Get unique stages for filter dropdown
  const uniqueStages = Array.from(
    new Set(onboardingSuppliers.map(supplier => supplier.stage))
  );

  // Add new state variables for Certification table
  const [certifications, setCertifications] = useState([
    {
      id: "CERT-001",
      supplier: "Global Electronics Manufacturing",
      certification: "ISO 9001",
      issuedDate: "Aug 15, 2022",
      expiryDate: "Aug 14, 2025",
      status: "valid",
      daysUntilExpiry: 685,
      renewalProcess: "Not started"
    },
    {
      id: "CERT-002",
      supplier: "American Industrial Solutions",
      certification: "ISO 14001",
      issuedDate: "Mar 22, 2021",
      expiryDate: "Mar 21, 2024",
      status: "expiring",
      daysUntilExpiry: 215,
      renewalProcess: "In progress"
    },
    {
      id: "CERT-003",
      supplier: "African Minerals Ltd",
      certification: "ISO 14001",
      issuedDate: "Jul 10, 2020",
      expiryDate: "Jul 9, 2023",
      status: "expired",
      daysUntilExpiry: -45,
      renewalProcess: "Overdue"
    },
    {
      id: "CERT-004",
      supplier: "EuroTech Components",
      certification: "ISO 27001",
      issuedDate: "Jun 05, 2022",
      expiryDate: "Jun 04, 2025",
      status: "valid",
      daysUntilExpiry: 615,
      renewalProcess: "Not started"
    },
    {
      id: "CERT-005",
      supplier: "Tokyo Tech Innovations",
      certification: "ISO 9001",
      issuedDate: "Apr 30, 2023",
      expiryDate: "Apr 29, 2026",
      status: "valid",
      daysUntilExpiry: 945,
      renewalProcess: "Not started"
    },
    {
      id: "CERT-006",
      supplier: "Pacific Logistics Partners",
      certification: "C-TPAT",
      issuedDate: "Oct 15, 2021",
      expiryDate: "Oct 14, 2023",
      status: "expiring",
      daysUntilExpiry: 45,
      renewalProcess: "In progress"
    },
    {
      id: "CERT-007",
      supplier: "Maple Wood Furniture",
      certification: "FSC Certified",
      issuedDate: "Jan 18, 2019",
      expiryDate: "Jan 17, 2022",
      status: "expired",
      daysUntilExpiry: -570,
      renewalProcess: "Renewal submitted"
    }
  ]);
  const [certSearchTerm, setCertSearchTerm] = useState("");
  const [certStatusFilter, setCertStatusFilter] = useState("all");
  const [certificationTypeFilter, setCertificationTypeFilter] = useState("all");
  const [certCurrentPage, setCertCurrentPage] = useState(1);
  const [certPageSize, setCertPageSize] = useState(5);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);

  // Add new functions for Certification table
  const filterCertifications = () => {
    let filtered = certifications;
    
    // Apply search filter
    if (certSearchTerm) {
      filtered = filtered.filter(cert => 
        cert.supplier.toLowerCase().includes(certSearchTerm.toLowerCase()) ||
        cert.certification.toLowerCase().includes(certSearchTerm.toLowerCase()) ||
        cert.renewalProcess.toLowerCase().includes(certSearchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (certStatusFilter !== "all") {
      filtered = filtered.filter(cert => cert.status === certStatusFilter);
    }
    
    // Apply certification type filter
    if (certificationTypeFilter !== "all") {
      filtered = filtered.filter(cert => cert.certification === certificationTypeFilter);
    }
    
    return filtered;
  };

  const handleCertPageChange = (page: number) => {
    setCertCurrentPage(page);
  };

  const handleToggleCertSelection = (certId: string) => {
    setSelectedCertifications(prev => {
      if (prev.includes(certId)) {
        return prev.filter(id => id !== certId);
      } else {
        return [...prev, certId];
      }
    });
  };

  const handleCertSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertSearchTerm(e.target.value);
    setCertCurrentPage(1); // Reset to first page after search
  };

  // Calculate pagination for Certifications
  const filteredCertifications = filterCertifications();
  const certTotalPages = Math.max(1, Math.ceil(filteredCertifications.length / certPageSize));
  const paginatedCertifications = filteredCertifications.slice(
    (certCurrentPage - 1) * certPageSize,
    certCurrentPage * certPageSize
  );

  // Get unique certification types for filter dropdown
  const uniqueCertTypes = Array.from(
    new Set(certifications.map(cert => cert.certification))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-left">
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
        </div>
      </div>
      
      {/* Summary Cards based on active tab */}
      {mainTab === "performance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On-time Delivery Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgOnTimeRate.toFixed(1)}%</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+1.5% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92.4%</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+0.8% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSuppliers}</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+2 since last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">-3 from last week</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {mainTab === "directory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuppliers}</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+3 since last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}/5</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+0.2 from last quarter</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSuppliers}</div>
              <div className="flex items-center">
                <div className="text-xs text-muted-foreground">{Math.round((activeSuppliers / totalSuppliers) * 100)}% of total</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(categories).length}</div>
              <div className="flex items-center">
                <div className="text-xs text-muted-foreground">Across all suppliers</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {mainTab === "orders" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchaseOrders.length}</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+2 since last week</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchaseOrders.filter(o => o.status === 'pending').length}
              </div>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">-1 from yesterday</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${purchaseOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+$12,450 from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 days</div>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">-0.3 days improvement</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {mainTab === "quality" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Quality Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(qualityMetrics.reduce((sum, metric) => sum + metric.qualityScore, 0) / qualityMetrics.length).toFixed(1)}%
              </div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+0.8% from last quarter</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Defect Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(qualityMetrics.reduce((sum, metric) => sum + metric.defectRate, 0) / qualityMetrics.length).toFixed(1)}%
              </div>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">-0.3% improvement</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(qualityMetrics.reduce((sum, metric) => sum + metric.returnRate, 0) / qualityMetrics.length).toFixed(1)}%
              </div>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">-0.2% improvement</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(qualityMetrics.reduce((sum, metric) => sum + metric.complianceScore, 0) / qualityMetrics.length).toFixed(1)}%
              </div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+1.2% from last year</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Main Section Tabs - Now after the summary cards */}
      <Tabs value={mainTab} onValueChange={handleMainTabChange} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="directory">
            <Users className="h-4 w-4 mr-2" />
            Directory
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="quality">
            <CheckCircle className="h-4 w-4 mr-2" />
            Quality Analysis
          </TabsTrigger>
        </TabsList>
        
        {/* Tab content will be added here */}
        <TabsContent value="performance">
          {/* Sub-navigation for Performance section */}
          <Tabs value={performanceTab} onValueChange={setPerformanceTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
              <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
              <TabsTrigger value="performance">Supplier Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {/* Existing Performance Charts */}
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
                    <CardTitle>Supplier Quality Metrics</CardTitle>
                    <CardDescription>Average quality scores by category</CardDescription>
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
                          <Bar dataKey="quality" name="Quality Score" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Top Performing Suppliers</CardTitle>
                    <CardDescription>Ranked by overall performance score</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-[200px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search suppliers..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="rawmaterials">Raw Materials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {suppliers.filter(s => s.status === 'active').length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 p-6">
                      <Factory className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium text-center mb-2">No suppliers found</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {searchTerm 
                          ? "Try adjusting your search filters to find what you're looking for." 
                          : "Get started by adding your first supplier."}
                      </p>
                      {!searchTerm && (
                        <Button onClick={handleAddSupplier}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Supplier
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th className="py-3 px-4 text-left font-medium w-[40px]">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </th>
                              <th className="py-3 px-4 text-left font-medium">Supplier</th>
                              <th className="py-3 px-4 text-left font-medium">Category</th>
                              <th className="py-3 px-4 text-left font-medium">On-Time %</th>
                              <th className="py-3 px-4 text-left font-medium">Quality Score</th>
                              <th className="py-3 px-4 text-left font-medium">Communication</th>
                              <th className="py-3 px-4 text-center font-medium">Overall Score</th>
                              <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {suppliers
                              .filter(s => s.status === 'active')
                              .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
                              .slice(0, 5)
                              .map(supplier => (
                                <tr key={supplier.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="font-medium flex items-center">
                                      <Factory className="h-4 w-4 mr-2 text-primary" />
                                      {supplier.name}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-sm">{supplier.category}</td>
                                  <td className="py-3 px-4 text-sm">{supplier.onTimeRate}%</td>
                                  <td className="py-3 px-4 text-sm">{supplier.qualityScore || "-"}</td>
                                  <td className="py-3 px-4 text-sm">{supplier.communicationScore || "-"}</td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex flex-col items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
                                        <div 
                                          className="bg-primary h-2 rounded-full" 
                                          style={{ width: `${supplier.performanceScore}%` }}
                                        />
                                      </div>
                                      <div className="text-xs mt-1 text-muted-foreground">
                                        {supplier.performanceScore || "-"}%
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        title="View Details"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        title="Performance History"
                                      >
                                        <TrendingUp className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        title="Contact Supplier"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="border-t">
                        <div className="flex items-center justify-between py-4 px-6">
                          <div className="flex-1 text-sm text-muted-foreground">
                            Showing 1 to {Math.min(5, suppliers.filter(s => s.status === 'active').length)} of {suppliers.filter(s => s.status === 'active').length} suppliers
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Page 1"
                                aria-current="page"
                              >
                                1
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex justify-end">
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="metrics">
              {/* Detailed Metrics Tab */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Performance Comparison</CardTitle>
                    <CardDescription>Radar chart of key metrics across multiple dimensions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={90} data={evaluationData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Top Supplier" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Radar name="Average" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                          <Legend />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Incidents Trend</CardTitle>
                    <CardDescription>Number of quality incidents by severity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={qualityIncidentsTrend}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="critical" stackId="1" stroke="#ff0000" fill="#ff0000" />
                          <Area type="monotone" dataKey="major" stackId="1" stroke="#ffa500" fill="#ffa500" />
                          <Area type="monotone" dataKey="minor" stackId="1" stroke="#ffff00" fill="#ffff00" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Analysis</CardTitle>
                  <CardDescription>Average response time in hours by top suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={responseTimeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" />
                        <YAxis dataKey="supplier" type="category" width={150} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="responseTime" name="Response Time (hours)" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="risk">
              {/* Risk Assessment Tab */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Risk Assessment</CardTitle>
                    <CardDescription>Risk distribution by category and severity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={riskAssessmentData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="low" stackId="a" name="Low Risk" fill="#82ca9d" />
                          <Bar dataKey="medium" stackId="a" name="Medium Risk" fill="#8884d8" />
                          <Bar dataKey="high" stackId="a" name="High Risk" fill="#ffc658" />
                          <Bar dataKey="critical" stackId="a" name="Critical Risk" fill="#ff8042" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Mitigation Progress</CardTitle>
                    <CardDescription>Status of risk mitigation actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex flex-col justify-center space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Financial Risk</p>
                            <p className="text-sm text-muted-foreground">Mitigation progress: 75%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-medium">Medium</span>
                          </div>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Supply Chain Disruption</p>
                            <p className="text-sm text-muted-foreground">Mitigation progress: 60%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-xs font-medium">High</span>
                          </div>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Regulatory Compliance</p>
                            <p className="text-sm text-muted-foreground">Mitigation progress: 90%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium">Low</span>
                          </div>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Quality Control</p>
                            <p className="text-sm text-muted-foreground">Mitigation progress: 85%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium">Low</span>
                          </div>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Risk & Contingency Planning</CardTitle>
                    <CardDescription>Key risk factors and mitigation strategies</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-[200px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search risks..."
                        className="pl-8 w-full"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Risk Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-sm">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium w-[40px]">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </th>
                          <th className="py-3 px-4 text-left font-medium">Risk Factor</th>
                          <th className="py-3 px-4 text-left font-medium">Impact</th>
                          <th className="py-3 px-4 text-left font-medium">Probability</th>
                          <th className="py-3 px-4 text-left font-medium">Risk Level</th>
                          <th className="py-3 px-4 text-left font-medium">Mitigation Strategy</th>
                          <th className="py-3 px-4 text-left font-medium">Owner</th>
                          <th className="py-3 px-4 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                              Supplier Bankruptcy
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">High</td>
                          <td className="py-3 px-4 text-sm">Low</td>
                          <td className="py-3 px-4">
                            <Badge variant="warning">Medium</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">Multi-sourcing strategy</td>
                          <td className="py-3 px-4 text-sm">Procurement</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="outline">In Progress</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                              Supply Chain Disruption
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">High</td>
                          <td className="py-3 px-4 text-sm">Medium</td>
                          <td className="py-3 px-4">
                            <Badge variant="destructive">High</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">Increased inventory levels</td>
                          <td className="py-3 px-4 text-sm">Operations</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="outline">In Progress</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-green-500" />
                              Quality Issues
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">Medium</td>
                          <td className="py-3 px-4 text-sm">Low</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">Low</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">Enhanced QA process</td>
                          <td className="py-3 px-4 text-sm">Quality</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="success">Completed</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                              Price Volatility
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">Medium</td>
                          <td className="py-3 px-4 text-sm">High</td>
                          <td className="py-3 px-4">
                            <Badge variant="warning">Medium</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">Long-term contracts</td>
                          <td className="py-3 px-4 text-sm">Finance</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="success">Completed</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t">
                    <div className="flex items-center justify-between py-4 px-6">
                      <div className="flex-1 text-sm text-muted-foreground">
                        Showing 1 to 4 of 4 risk factors
                      </div>
                      
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="First page"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="default"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Page 1"
                            aria-current="page"
                          >
                            1
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Next page"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Last page"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Risk
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cost">
              {/* Cost Analysis Tab */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Performance</CardTitle>
                    <CardDescription>Actual vs planned costs over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={costPerformanceData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="actual" name="Actual Cost" stroke="#ff7300" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="planned" name="Planned Cost" stroke="#387908" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Savings by Category</CardTitle>
                    <CardDescription>Breakdown of savings by supplier category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Electronics', value: 35000 },
                              { name: 'Logistics', value: 24000 },
                              { name: 'Raw Materials', value: 18000 },
                              { name: 'Industrial', value: 12000 },
                              { name: 'Others', value: 9000 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Electronics', value: 35000 },
                              { name: 'Logistics', value: 24000 },
                              { name: 'Raw Materials', value: 18000 },
                              { name: 'Industrial', value: 12000 },
                              { name: 'Others', value: 9000 },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => [`$${value.toLocaleString()}`, "Cost Savings"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Cost Optimization Initiatives</CardTitle>
                    <CardDescription>Tracking active cost savings programs</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-[200px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search initiatives..."
                        className="pl-8 w-full"
                        value={costSearchTerm}
                        onChange={handleCostSearch}
                      />
                    </div>
                    <Select value={costStatusFilter} onValueChange={setCostStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={costCategoryFilter} onValueChange={setCostCategoryFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCostCategories.map(category => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredCostInitiatives.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 p-6">
                      <Factory className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium text-center mb-2">No initiatives found</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {costSearchTerm || costStatusFilter !== "all" || costCategoryFilter !== "all" 
                          ? "Try adjusting your search filters to find what you're looking for." 
                          : "Get started by adding your first cost optimization initiative."}
                      </p>
                      {!costSearchTerm && costStatusFilter === "all" && costCategoryFilter === "all" && (
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Initiative
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th className="py-3 px-4 text-left font-medium w-[40px]">
                                <input
                                  type="checkbox"
                                  checked={selectedInitiatives.length === paginatedCostInitiatives.length && paginatedCostInitiatives.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedInitiatives(paginatedCostInitiatives.map(i => i.id));
                                    } else {
                                      setSelectedInitiatives([]);
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </th>
                              <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                              <th className="py-3 px-4 text-left font-medium">Initiative</th>
                              <th className="py-3 px-4 text-left font-medium">Category</th>
                              <th className="py-3 px-4 text-left font-medium">Status</th>
                              <th className="py-3 px-4 text-center font-medium">Target Savings</th>
                              <th className="py-3 px-4 text-center font-medium">Progress</th>
                              <th className="py-3 px-4 text-center font-medium">ROI</th>
                              <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {paginatedCostInitiatives.map((initiative) => {
                              const statusVariant = 
                                initiative.status === 'completed' ? 'success' : 
                                initiative.status === 'in_progress' ? 'default' : 
                                initiative.status === 'planned' ? 'secondary' : 'destructive';
                              
                              const statusLabel = 
                                initiative.status === 'in_progress' ? 'In Progress' : 
                                initiative.status === 'completed' ? 'Completed' : 
                                initiative.status === 'planned' ? 'Planned' : 'Cancelled';
                              
                              return (
                                <tr 
                                  key={initiative.id} 
                                  className="hover:bg-muted/50 transition-colors"
                                >
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedInitiatives.includes(initiative.id)}
                                      onChange={() => handleToggleInitiativeSelection(initiative.id)}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                  </td>
                                  <td className="py-3 px-4 text-sm">{initiative.id}</td>
                                  <td className="py-3 px-4">
                                    <div className="font-medium flex items-center">
                                      <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                                      {initiative.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">{initiative.owner}</div>
                                  </td>
                                  <td className="py-3 px-4 text-sm">{initiative.category}</td>
                                  <td className="py-3 px-4">
                                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                                  </td>
                                  <td className="py-3 px-4 text-center">${initiative.targetSavings.toLocaleString()}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex flex-col items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
                                        <div 
                                          className="bg-primary h-2 rounded-full" 
                                          style={{ width: `${initiative.progress}%` }}
                                        />
                                      </div>
                                      <div className="text-xs mt-1 text-muted-foreground">
                                        {initiative.progress}%
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">{initiative.roi}</td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        title="View Details"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        title="Edit Initiative"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        title="Delete Initiative"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="border-t">
                        <div className="flex items-center justify-between py-4 px-6">
                          <div className="flex-1 text-sm text-muted-foreground">
                            Showing {Math.min((costCurrentPage - 1) * costPageSize + 1, filteredCostInitiatives.length)} to {Math.min(costCurrentPage * costPageSize, filteredCostInitiatives.length)} of {filteredCostInitiatives.length} {filteredCostInitiatives.length === 1 ? 'initiative' : 'initiatives'}
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCostPageChange(1)}
                                disabled={costCurrentPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCostPageChange(costCurrentPage - 1)}
                                disabled={costCurrentPage === 1}
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {Array.from({ length: Math.min(5, costTotalPages) }, (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                  <Button
                                    key={`page-${pageNumber}`}
                                    variant={costCurrentPage === pageNumber ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handleCostPageChange(pageNumber)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${pageNumber}`}
                                    aria-current={costCurrentPage === pageNumber ? "page" : undefined}
                                  >
                                    {pageNumber}
                                  </Button>
                                );
                              })}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCostPageChange(costCurrentPage + 1)}
                                disabled={costCurrentPage === costTotalPages}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCostPageChange(costTotalPages)}
                                disabled={costCurrentPage === costTotalPages}
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex justify-end">
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Initiative
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Ratings Comparison</CardTitle>
                    <CardDescription>Performance metrics across suppliers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={90} data={supplierRatings.map(s => ({
                          subject: s.name,
                          quality: s.quality * 20,
                          delivery: s.delivery * 20,
                          price: s.price * 20,
                          service: s.service * 20
                        }))}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Quality" dataKey="quality" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Radar name="Delivery" dataKey="delivery" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                          <Radar name="Price" dataKey="price" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                          <Radar name="Service" dataKey="service" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                          <Legend />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Metrics Trend</CardTitle>
                    <CardDescription>Defect and return rates over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={qualityMetrics}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" />
                          <YAxis />
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
                            dataKey="defectRate" 
                            name="Defect Rate (%)" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="returnRate" 
                            name="Return Rate (%)" 
                            stroke="#82ca9d" 
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Supplier Rating Summary</CardTitle>
                    <CardDescription>Detailed breakdown of supplier performance ratings</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-[200px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search suppliers..."
                        className="pl-8 w-full"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="excellent">4.5+</SelectItem>
                        <SelectItem value="good">4.0-4.4</SelectItem>
                        <SelectItem value="average">Below 4.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-sm">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium w-[40px]">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </th>
                          <th className="py-3 px-4 text-left font-medium">Supplier</th>
                          <th className="py-3 px-4 text-left font-medium">Overall Rating</th>
                          <th className="py-3 px-4 text-center font-medium">Quality</th>
                          <th className="py-3 px-4 text-center font-medium">Delivery</th>
                          <th className="py-3 px-4 text-center font-medium">Price</th>
                          <th className="py-3 px-4 text-center font-medium">Service</th>
                          <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {supplierRatings.map((supplier, index) => (
                          <tr key={index} className="hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium flex items-center">
                                <Factory className="h-4 w-4 mr-2 text-primary" />
                                {supplier.name}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star key={i} 
                                    className={`h-4 w-4 ${i < Math.floor(supplier.overall) ? 'text-amber-500 fill-amber-500' : 'text-muted stroke-muted'}`} 
                                  />
                                ))}
                                <span className="ml-2">{supplier.overall.toFixed(1)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[60px]">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${(supplier.quality / 5) * 100}%` }}
                                  />
                                </div>
                                <div className="text-xs mt-1 text-muted-foreground">
                                  {supplier.quality.toFixed(1)}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[60px]">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(supplier.delivery / 5) * 100}%` }}
                                  />
                                </div>
                                <div className="text-xs mt-1 text-muted-foreground">
                                  {supplier.delivery.toFixed(1)}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[60px]">
                                  <div 
                                    className="bg-purple-500 h-2 rounded-full" 
                                    style={{ width: `${(supplier.price / 5) * 100}%` }}
                                  />
                                </div>
                                <div className="text-xs mt-1 text-muted-foreground">
                                  {supplier.price.toFixed(1)}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[60px]">
                                  <div 
                                    className="bg-amber-500 h-2 rounded-full" 
                                    style={{ width: `${(supplier.service / 5) * 100}%` }}
                                  />
                                </div>
                                <div className="text-xs mt-1 text-muted-foreground">
                                  {supplier.service.toFixed(1)}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  title="View Details"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  title="Rating History"
                                >
                                  <TrendingUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  title="Rate Supplier"
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t">
                    <div className="flex items-center justify-between py-4 px-6">
                      <div className="flex-1 text-sm text-muted-foreground">
                        Showing 1 to {supplierRatings.length} of {supplierRatings.length} supplier ratings
                      </div>
                      
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="First page"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="default"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Page 1"
                            aria-current="page"
                          >
                            1
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Next page"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Last page"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Ratings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="directory">
          {/* Additional Directory Analysis Components */}
          <div className="mt-8">
            <Tabs value={directorySubTab} onValueChange={setDirectorySubTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="list">Supplier List</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                {renderSupplierDirectory()}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Supplier Quick Overview</CardTitle>
                    <CardDescription>Supplier status overview and key metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex flex-col p-4 border rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Total Suppliers</div>
                        <div className="text-2xl font-bold">{totalSuppliers}</div>
                        <div className="mt-2 flex items-center text-sm">
                          <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-green-500">+3 since last month</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col p-4 border rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Active Suppliers</div>
                        <div className="text-2xl font-bold">{activeSuppliers}</div>
                        <div className="mt-2 flex items-center text-sm">
                          <span className="text-muted-foreground">{Math.round((activeSuppliers / totalSuppliers) * 100)}% of total</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col p-4 border rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Categories</div>
                        <div className="text-2xl font-bold">{Object.keys(categories).length}</div>
                        <div className="mt-2 flex items-center text-sm">
                          <span className="text-muted-foreground">Across {totalSuppliers} suppliers</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Geographical Distribution</CardTitle>
                      <CardDescription>Supplier distribution by region</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={supplierGeographicData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="region"
                              label={({region, share}) => `${region}: ${share}%`}
                            >
                              {supplierGeographicData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value, name, props) => [`${value} suppliers (${props.payload.share}%)`, props.payload.region]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Breakdown</CardTitle>
                      <CardDescription>Suppliers by product/service category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={supplierCategoryBreakdown}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis type="number" />
                            <YAxis 
                              type="category" 
                              dataKey="name" 
                              width={60}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value) => [`${value} suppliers`, "Count"]}
                            />
                            <Legend />
                            <Bar dataKey="value" name="Supplier Count" fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Relationship Length</CardTitle>
                      <CardDescription>Duration of supplier relationships</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={relationshipLengthData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value) => [`${value} suppliers`, "Count"]}
                            />
                            <Legend />
                            <Bar dataKey="count" name="Supplier Count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Status Distribution</CardTitle>
                      <CardDescription>Breakdown by supplier status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex flex-col justify-center space-y-8">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="h-4 w-4 rounded-full bg-green-500"></div>
                              <span className="text-sm font-medium">Active</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{activeSuppliers} suppliers ({Math.round((activeSuppliers / totalSuppliers) * 100)}%)</span>
                          </div>
                          <Progress value={(activeSuppliers / totalSuppliers) * 100} className="h-2 bg-muted" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                              <span className="text-sm font-medium">Under Review</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{reviewSuppliers} suppliers ({Math.round((reviewSuppliers / totalSuppliers) * 100)}%)</span>
                          </div>
                          <Progress value={(reviewSuppliers / totalSuppliers) * 100} className="h-2 bg-muted" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="h-4 w-4 rounded-full bg-gray-500"></div>
                              <span className="text-sm font-medium">Inactive</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{inactiveSuppliers} suppliers ({Math.round((inactiveSuppliers / totalSuppliers) * 100)}%)</span>
                          </div>
                          <Progress value={(inactiveSuppliers / totalSuppliers) * 100} className="h-2 bg-muted" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="onboarding">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Supplier Onboarding Pipeline</CardTitle>
                      <CardDescription>Current status of new supplier onboarding</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={onboardingFunnelData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="stage" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value) => [`${value} suppliers`, "Count"]}
                            />
                            <Bar dataKey="count" name="Suppliers" fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  

                      <Card>
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div>
                            <CardTitle>Ongoing Onboarding Processes</CardTitle>
                            <CardDescription>Suppliers currently in the onboarding process</CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            New Onboarding
                          </Button>
                        </CardHeader>
                        
                        <div className="p-6 bg-background py-0 mb-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full md:w-auto flex-1 max-w-sm">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search onboarding..."
                                className="pl-8 w-full md:w-[300px]"
                                value={onboardingSearchTerm}
                                onChange={handleOnboardingSearch}
                              />
                            </div>
                            
                            <Select value={onboardingStageFilter} onValueChange={setOnboardingStageFilter}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by stage" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Stages</SelectItem>
                                {uniqueStages.map(stage => (
                                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <div className="flex items-center gap-2 ml-auto">
                              <span className="text-sm font-medium">Rows per page</span>
                              <Select
                                value={onboardingPageSize.toString()}
                                onValueChange={(size) => {
                                  setOnboardingPageSize(Number(size));
                                  setOnboardingCurrentPage(1);
                                }}
                              >
                                <SelectTrigger className="h-9 w-[70px]">
                                  <SelectValue placeholder={onboardingPageSize.toString()} />
                                </SelectTrigger>
                                <SelectContent>
                                  {[5, 10, 25, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                      {size}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        {/* Table Component */}
                        <CardContent className="p-0">
                          {filteredOnboardingSuppliers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 p-6">
                              <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                              <h3 className="text-lg font-medium text-center mb-2">No onboarding suppliers found</h3>
                              <p className="text-sm text-muted-foreground text-center mb-4">
                                {onboardingSearchTerm || onboardingStageFilter !== "all"
                                  ? "Try adjusting your search filters to find what you're looking for."
                                  : "Get started by adding a new supplier onboarding process."}
                              </p>
                              {!onboardingSearchTerm && onboardingStageFilter === "all" && (
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  New Onboarding
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="overflow-auto">
                                <table className="w-full">
                                  <thead className="bg-muted/50 text-sm">
                                    <tr>
                                      <th className="py-3 px-4 text-left font-medium w-[40px]">
                                        <input
                                          type="checkbox"
                                          checked={selectedOnboardingSuppliers.length === paginatedOnboardingSuppliers.length && paginatedOnboardingSuppliers.length > 0}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedOnboardingSuppliers(paginatedOnboardingSuppliers.map(s => s.id));
                                            } else {
                                              setSelectedOnboardingSuppliers([]);
                                            }
                                          }}
                                          className="h-4 w-4 rounded border-gray-300"
                                        />
                                      </th>
                                      <th className="py-3 px-4 text-left font-medium">Supplier Name</th>
                                      <th className="py-3 px-4 text-left font-medium">Current Stage</th>
                                      <th className="py-3 px-4 text-left font-medium">Started On</th>
                                      <th className="py-3 px-4 text-left font-medium">Owner</th>
                                      <th className="py-3 px-4 text-center font-medium">Progress</th>
                                      <th className="py-3 px-4 text-left font-medium">Time in Stage</th>
                                      <th className="py-3 px-4 text-left font-medium">Expected Completion</th>
                                      <th className="py-3 px-4 text-right font-medium w-[100px]">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    {paginatedOnboardingSuppliers.map((supplier) => (
                                      <tr 
                                        key={supplier.id} 
                                        className="hover:bg-muted/50 transition-colors"
                                      >
                                        <td className="py-3 px-4">
                                          <input
                                            type="checkbox"
                                            checked={selectedOnboardingSuppliers.includes(supplier.id)}
                                            onChange={() => handleToggleOnboardingSupplierSelection(supplier.id)}
                                            className="h-4 w-4 rounded border-gray-300"
                                          />
                                        </td>
                                        <td className="py-3 px-4 font-medium">{supplier.name}</td>
                                        <td className="py-3 px-4">
                                          <Badge variant="outline">
                                            {supplier.stage}
                                          </Badge>
                                        </td>
                                        <td className="py-3 px-4">{supplier.startDate}</td>
                                        <td className="py-3 px-4">{supplier.owner}</td>
                                        <td className="py-3 px-4">
                                          <div className="flex flex-col items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
                                              <div 
                                                className="bg-primary h-2 rounded-full" 
                                                style={{ width: `${supplier.progress}%` }}
                                              />
                                            </div>
                                            <div className="text-xs mt-1 text-muted-foreground">
                                              {supplier.progress}%
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-3 px-4">{supplier.timeInStage}</td>
                                        <td className="py-3 px-4">{supplier.expectedCompletion}</td>
                                        <td className="py-3 px-4 text-right">
                                          <div className="flex items-center justify-end space-x-2">
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8"
                                              title="View Details"
                                            >
                                              <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8"
                                              title="Edit Process"
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="border-t">
                                <div className="flex items-center justify-between py-4 px-6">
                                  <div className="flex-1 text-sm text-muted-foreground">
                                    Showing {Math.min((onboardingCurrentPage - 1) * onboardingPageSize + 1, filteredOnboardingSuppliers.length)} to {Math.min(onboardingCurrentPage * onboardingPageSize, filteredOnboardingSuppliers.length)} of {filteredOnboardingSuppliers.length} {filteredOnboardingSuppliers.length === 1 ? 'supplier' : 'suppliers'}
                                  </div>
                                  
                                  <div className="flex-1 flex justify-center">
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleOnboardingPageChange(1)}
                                        disabled={onboardingCurrentPage === 1}
                                        className="h-8 w-8"
                                        aria-label="First page"
                                      >
                                        <ChevronsLeft className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleOnboardingPageChange(onboardingCurrentPage - 1)}
                                        disabled={onboardingCurrentPage === 1}
                                        className="h-8 w-8"
                                        aria-label="Previous page"
                                      >
                                        <ChevronLeft className="h-4 w-4" />
                                      </Button>
                                      
                                      {onboardingTotalPages <= 5 ? (
                                        // Show all pages if 5 or fewer
                                        [...Array(onboardingTotalPages)].map((_, i) => (
                                          <Button
                                            key={`page-${i+1}`}
                                            variant={onboardingCurrentPage === i+1 ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => handleOnboardingPageChange(i+1)}
                                            className="h-8 w-8"
                                            aria-label={`Page ${i+1}`}
                                            aria-current={onboardingCurrentPage === i+1 ? "page" : undefined}
                                          >
                                            {i+1}
                                          </Button>
                                        ))
                                      ) : (
                                        // Show limited pages with ellipsis
                                        <>
                                          <Button
                                            variant={onboardingCurrentPage === 1 ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => handleOnboardingPageChange(1)}
                                            className="h-8 w-8"
                                            aria-label="Page 1"
                                          >
                                            1
                                          </Button>
                                          
                                          {onboardingCurrentPage > 3 && <span className="mx-1">...</span>}
                                          
                                          {onboardingCurrentPage > 2 && (
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              onClick={() => handleOnboardingPageChange(onboardingCurrentPage - 1)}
                                              className="h-8 w-8"
                                              aria-label={`Page ${onboardingCurrentPage - 1}`}
                                            >
                                              {onboardingCurrentPage - 1}
                                            </Button>
                                          )}
                                          
                                          {onboardingCurrentPage !== 1 && onboardingCurrentPage !== onboardingTotalPages && (
                                            <Button
                                              variant="default"
                                              size="icon"
                                              onClick={() => handleOnboardingPageChange(onboardingCurrentPage)}
                                              className="h-8 w-8"
                                              aria-label={`Page ${onboardingCurrentPage}`}
                                              aria-current="page"
                                            >
                                              {onboardingCurrentPage}
                                            </Button>
                                          )}
                                          
                                          {onboardingCurrentPage < onboardingTotalPages - 1 && (
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              onClick={() => handleOnboardingPageChange(onboardingCurrentPage + 1)}
                                              className="h-8 w-8"
                                              aria-label={`Page ${onboardingCurrentPage + 1}`}
                                            >
                                              {onboardingCurrentPage + 1}
                                            </Button>
                                          )}
                                          
                                          {onboardingCurrentPage < onboardingTotalPages - 2 && <span className="mx-1">...</span>}
                                          
                                          <Button
                                            variant={onboardingCurrentPage === onboardingTotalPages ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => handleOnboardingPageChange(onboardingTotalPages)}
                                            className="h-8 w-8"
                                            aria-label={`Page ${onboardingTotalPages}`}
                                          >
                                            {onboardingTotalPages}
                                          </Button>
                                        </>
                                      )}
                                      
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleOnboardingPageChange(onboardingCurrentPage + 1)}
                                        disabled={onboardingCurrentPage === onboardingTotalPages}
                                        className="h-8 w-8"
                                        aria-label="Next page"
                                      >
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleOnboardingPageChange(onboardingTotalPages)}
                                        disabled={onboardingCurrentPage === onboardingTotalPages}
                                        className="h-8 w-8"
                                        aria-label="Last page"
                                      >
                                        <ChevronsRight className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 flex justify-end">
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                </div>
              </TabsContent>
              
              <TabsContent value="certifications">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Certification Distribution</CardTitle>
                      <CardDescription>Most common supplier certifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={certificationData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="count" name="Supplier Count" fill="hsl(var(--primary))" />
                            <Line yAxisId="right" dataKey="percentage" name="% of Suppliers" stroke="#ff7300" strokeWidth={2} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Certification Compliance</CardTitle>
                      <CardDescription>Supplier certification status overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex flex-col justify-center space-y-6">
                        {certificationData.map((cert, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{cert.name}</p>
                                <p className="text-sm text-muted-foreground">{cert.count} suppliers certified</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium">{cert.percentage}%</span>
                              </div>
                            </div>
                            <Progress value={cert.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Certification Expiry Monitor</CardTitle>
                      <CardDescription>Tracking upcoming certification renewals</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </CardHeader>
                  
                  <div className="p-6 bg-background py-0 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative w-full md:w-auto flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search certifications..."
                          className="pl-8 w-full md:w-[300px]"
                          value={certSearchTerm}
                          onChange={handleCertSearch}
                        />
                      </div>
                      
                      <Select value={certStatusFilter} onValueChange={setCertStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="valid">Valid</SelectItem>
                          <SelectItem value="expiring">Expiring Soon</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={certificationTypeFilter} onValueChange={setCertificationTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {uniqueCertTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm font-medium">Rows per page</span>
                        <Select
                          value={certPageSize.toString()}
                          onValueChange={(size) => {
                            setCertPageSize(Number(size));
                            setCertCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="h-9 w-[70px]">
                            <SelectValue placeholder={certPageSize.toString()} />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 10, 25, 50].map((size) => (
                              <SelectItem key={size} value={size.toString()}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Table Component */}
                  <CardContent className="p-0">
                    {filteredCertifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 p-6">
                        <CheckCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-center mb-2">No certifications found</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          {certSearchTerm || certStatusFilter !== "all" || certificationTypeFilter !== "all"
                            ? "Try adjusting your search filters to find what you're looking for."
                            : "Get started by adding a new supplier certification."}
                        </p>
                        {!certSearchTerm && certStatusFilter === "all" && certificationTypeFilter === "all" && (
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Certification
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="overflow-auto">
                          <table className="w-full">
                            <thead className="bg-muted/50 text-sm">
                              <tr>
                                <th className="py-3 px-4 text-left font-medium w-[40px]">
                                  <input
                                    type="checkbox"
                                    checked={selectedCertifications.length === paginatedCertifications.length && paginatedCertifications.length > 0}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCertifications(paginatedCertifications.map(c => c.id));
                                      } else {
                                        setSelectedCertifications([]);
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                </th>
                                <th className="py-3 px-4 text-left font-medium">Supplier</th>
                                <th className="py-3 px-4 text-left font-medium">Certification</th>
                                <th className="py-3 px-4 text-left font-medium">Issued Date</th>
                                <th className="py-3 px-4 text-left font-medium">Expiry Date</th>
                                <th className="py-3 px-4 text-left font-medium">Status</th>
                                <th className="py-3 px-4 text-center font-medium">Days Until Expiry</th>
                                <th className="py-3 px-4 text-left font-medium">Renewal Process</th>
                                <th className="py-3 px-4 text-right font-medium w-[100px]">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {paginatedCertifications.map((cert) => {
                                const statusColor = cert.status === 'valid' ? 'green' : 
                                  cert.status === 'expiring' ? 'amber' : 'red';
                                const statusLabel = cert.status === 'valid' ? 'Valid' :
                                  cert.status === 'expiring' ? 'Expiring Soon' : 'Expired';
                                
                                return (
                                  <tr 
                                    key={cert.id} 
                                    className="hover:bg-muted/50 transition-colors"
                                  >
                                    <td className="py-3 px-4">
                                      <input
                                        type="checkbox"
                                        checked={selectedCertifications.includes(cert.id)}
                                        onChange={() => handleToggleCertSelection(cert.id)}
                                        className="h-4 w-4 rounded border-gray-300"
                                      />
                                    </td>
                                    <td className="py-3 px-4 font-medium">{cert.supplier}</td>
                                    <td className="py-3 px-4">{cert.certification}</td>
                                    <td className="py-3 px-4">{cert.issuedDate}</td>
                                    <td className="py-3 px-4">{cert.expiryDate}</td>
                                    <td className="py-3 px-4">
                                      <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                                        {statusLabel}
                                      </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className={cert.daysUntilExpiry < 0 ? 'text-red-500' : 
                                                      cert.daysUntilExpiry < 60 ? 'text-amber-500' : 
                                                      'text-green-500'}>
                                        {cert.daysUntilExpiry}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">{cert.renewalProcess}</td>
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex items-center justify-end space-x-2">
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8"
                                          title="View Details"
                                        >
                                          <FileText className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8"
                                          title="Edit Certification"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="border-t">
                          <div className="flex items-center justify-between py-4 px-6">
                            <div className="flex-1 text-sm text-muted-foreground">
                              Showing {Math.min((certCurrentPage - 1) * certPageSize + 1, filteredCertifications.length)} to {Math.min(certCurrentPage * certPageSize, filteredCertifications.length)} of {filteredCertifications.length} {filteredCertifications.length === 1 ? 'certification' : 'certifications'}
                            </div>
                            
                            <div className="flex-1 flex justify-center">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCertPageChange(1)}
                                  disabled={certCurrentPage === 1}
                                  className="h-8 w-8"
                                  aria-label="First page"
                                >
                                  <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCertPageChange(certCurrentPage - 1)}
                                  disabled={certCurrentPage === 1}
                                  className="h-8 w-8"
                                  aria-label="Previous page"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                
                                {certTotalPages <= 5 ? (
                                  // Show all pages if 5 or fewer
                                  [...Array(certTotalPages)].map((_, i) => (
                                    <Button
                                      key={`page-${i+1}`}
                                      variant={certCurrentPage === i+1 ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleCertPageChange(i+1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${i+1}`}
                                      aria-current={certCurrentPage === i+1 ? "page" : undefined}
                                    >
                                      {i+1}
                                    </Button>
                                  ))
                                ) : (
                                  // Show limited pages with ellipsis
                                  <>
                                    <Button
                                      variant={certCurrentPage === 1 ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleCertPageChange(1)}
                                      className="h-8 w-8"
                                      aria-label="Page 1"
                                    >
                                      1
                                    </Button>
                                    
                                    {certCurrentPage > 3 && <span className="mx-1">...</span>}
                                    
                                    {certCurrentPage > 2 && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCertPageChange(certCurrentPage - 1)}
                                        className="h-8 w-8"
                                        aria-label={`Page ${certCurrentPage - 1}`}
                                      >
                                        {certCurrentPage - 1}
                                      </Button>
                                    )}
                                    
                                    {certCurrentPage !== 1 && certCurrentPage !== certTotalPages && (
                                      <Button
                                        variant="default"
                                        size="icon"
                                        onClick={() => handleCertPageChange(certCurrentPage)}
                                        className="h-8 w-8"
                                        aria-label={`Page ${certCurrentPage}`}
                                        aria-current="page"
                                      >
                                        {certCurrentPage}
                                      </Button>
                                    )}
                                    
                                    {certCurrentPage < certTotalPages - 1 && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCertPageChange(certCurrentPage + 1)}
                                        className="h-8 w-8"
                                        aria-label={`Page ${certCurrentPage + 1}`}
                                      >
                                        {certCurrentPage + 1}
                                      </Button>
                                    )}
                                    
                                    {certCurrentPage < certTotalPages - 2 && <span className="mx-1">...</span>}
                                    
                                    <Button
                                      variant={certCurrentPage === certTotalPages ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleCertPageChange(certTotalPages)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${certTotalPages}`}
                                    >
                                      {certTotalPages}
                                    </Button>
                                  </>
                                )}
                                
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCertPageChange(certCurrentPage + 1)}
                                  disabled={certCurrentPage === certTotalPages}
                                  className="h-8 w-8"
                                  aria-label="Next page"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCertPageChange(certTotalPages)}
                                  disabled={certCurrentPage === certTotalPages}
                                  className="h-8 w-8"
                                  aria-label="Last page"
                                >
                                  <ChevronsRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex-1 flex justify-end">
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          {/* Purchase Orders Table */}
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Purchase Orders</CardTitle>
                <CardDescription>All purchase orders and their current status</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-8 w-full md:w-[300px]"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'delivered' ? 'success' : 
                          order.status === 'shipped' ? 'default' : 
                          order.status === 'pending' ? 'warning' : 
                          'destructive'
                        }>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          order.priority === 'high' ? 'destructive' : 
                          order.priority === 'medium' ? 'warning' : 
                          'secondary'
                        } className="capitalize">
                          {order.priority}
                        </Badge>
                      </TableCell>
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
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Update status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Contact supplier</DropdownMenuItem>
                            <DropdownMenuItem>Download invoice</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Cancel order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {purchaseOrders.length} orders
              </div>
            </CardFooter>
          </Card>

          {/* Additional Purchase Order Analysis Components */}
          <div className="mt-8">
            <Tabs value={ordersSubTab} onValueChange={setOrdersSubTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="current">Current Orders</TabsTrigger>
                <TabsTrigger value="analytics">Order Analytics</TabsTrigger>
                <TabsTrigger value="suppliers">Supplier Breakdown</TabsTrigger>
                <TabsTrigger value="history">Order History</TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Order Status Breakdown</CardTitle>
                    <CardDescription>Overview of current purchase orders by status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Pending', value: purchaseOrders.filter(o => o.status === 'pending').length },
                              { name: 'Shipped', value: purchaseOrders.filter(o => o.status === 'shipped').length },
                              { name: 'Delivered', value: purchaseOrders.filter(o => o.status === 'delivered').length },
                              { name: 'Cancelled', value: purchaseOrders.filter(o => o.status === 'cancelled').length || 0 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Pending', value: purchaseOrders.filter(o => o.status === 'pending').length },
                              { name: 'Shipped', value: purchaseOrders.filter(o => o.status === 'shipped').length },
                              { name: 'Delivered', value: purchaseOrders.filter(o => o.status === 'delivered').length },
                              { name: 'Cancelled', value: purchaseOrders.filter(o => o.status === 'cancelled').length || 0 }
                            ].map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={[
                                  'hsl(var(--warning))', 
                                  'hsl(var(--primary))', 
                                  'hsl(var(--success))', 
                                  'hsl(var(--destructive))'
                                ][index % 4]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Orders by Priority</CardTitle>
                      <CardDescription>Purchase orders categorized by priority level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { priority: 'High', count: purchaseOrders.filter(o => o.priority === 'high').length },
                              { priority: 'Medium', count: purchaseOrders.filter(o => o.priority === 'medium').length },
                              { priority: 'Low', count: purchaseOrders.filter(o => o.priority === 'low').length }
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="priority" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                            <Bar 
                              dataKey="count" 
                              name="Number of Orders" 
                              fill="hsl(var(--primary))"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Value Trends</CardTitle>
                      <CardDescription>Monthly order value over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { month: 'Jan', value: 45000 },
                              { month: 'Feb', value: 52000 },
                              { month: 'Mar', value: 49000 },
                              { month: 'Apr', value: 63000 },
                              { month: 'May', value: 58000 },
                              { month: 'Jun', value: 72000 },
                              { month: 'Jul', value: 80000 },
                              { month: 'Aug', value: 74000 }
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="month" />
                            <YAxis 
                              tickFormatter={(value) => `$${value/1000}k`}
                            />
                            <Tooltip 
                              formatter={(value) => [`$${value.toLocaleString()}`, 'Order Value']}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))" 
                              fill="hsl(var(--primary)/0.2)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>On-Time vs Late Deliveries</CardTitle>
                      <CardDescription>Performance metrics for order fulfillment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'On Time', value: 78 },
                                { name: '1-2 Days Late', value: 14 },
                                { name: '3-7 Days Late', value: 6 },
                                { name: '>7 Days Late', value: 2 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: 'On Time', value: 78 },
                                { name: '1-2 Days Late', value: 14 },
                                { name: '3-7 Days Late', value: 6 },
                                { name: '>7 Days Late', value: 2 }
                              ].map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={[
                                    'hsl(var(--success))', 
                                    'hsl(var(--warning))', 
                                    'hsl(var(--warning)/0.7)', 
                                    'hsl(var(--destructive))'
                                  ][index % 4]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Percentage']}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Average Lead Time by Supplier</CardTitle>
                    <CardDescription>Time from order placement to delivery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { supplier: 'Tech Solutions Inc.', leadTime: 12 },
                            { supplier: 'Global Logistics', leadTime: 8 },
                            { supplier: 'EcoPackaging', leadTime: 15 },
                            { supplier: 'FastTrack Delivery', leadTime: 5 },
                            { supplier: 'Quality Materials', leadTime: 10 },
                            { supplier: 'Industrial Supplies', leadTime: 14 },
                            { supplier: 'Smart Components', leadTime: 9 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                          <YAxis 
                            type="category" 
                            dataKey="supplier" 
                            width={150}
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value} days`, 'Lead Time']}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="leadTime" 
                            name="Lead Time (Days)" 
                            fill="hsl(var(--primary))" 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="suppliers">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Orders by Supplier</CardTitle>
                      <CardDescription>Distribution of purchase orders across suppliers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={purchaseOrders.reduce((acc, order) => {
                                const existing = acc.find(item => item.name === order.supplier);
                                if (existing) {
                                  existing.value++;
                                } else {
                                  acc.push({ name: order.supplier, value: 1 });
                                }
                                return acc;
                              }, [] as { name: string; value: number }[]).slice(0, 5)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({name, percent}) => `${name.substring(0, 10)}...: ${(percent * 100).toFixed(0)}%`}
                            >
                              {purchaseOrders.reduce((acc, order) => {
                                const existing = acc.find(item => item.name === order.supplier);
                                if (existing) {
                                  existing.value++;
                                } else {
                                  acc.push({ name: order.supplier, value: 1 });
                                }
                                return acc;
                              }, [] as { name: string; value: number }[]).slice(0, 5).map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={[
                                    'hsl(var(--primary))', 
                                    'hsl(142, 76%, 36%)', 
                                    'hsl(217, 91%, 60%)', 
                                    'hsl(271, 91%, 65%)',
                                    'hsl(15, 90%, 65%)'
                                  ][index % 5]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Spend by Supplier</CardTitle>
                      <CardDescription>Total purchase value by supplier</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={purchaseOrders.reduce((acc, order) => {
                              const existing = acc.find(item => item.name === order.supplier);
                              if (existing) {
                                existing.value += order.total;
                              } else {
                                acc.push({ name: order.supplier, value: order.total });
                              }
                              return acc;
                            }, [] as { name: string; value: number }[]).slice(0, 5)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: 'hsl(var(--foreground))' }}
                              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                            />
                            <YAxis 
                              tickFormatter={(value) => `$${value/1000}k`}
                              tick={{ fill: 'hsl(var(--foreground))' }}
                            />
                            <Tooltip 
                              formatter={(value) => [`$${value.toLocaleString()}`, 'Total Spend']}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                            <Bar 
                              dataKey="value" 
                              name="Total Spend" 
                              fill="hsl(var(--primary))" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Performance Comparison</CardTitle>
                    <CardDescription>Key metrics across top suppliers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Order Count</TableHead>
                          <TableHead>Total Spend</TableHead>
                          <TableHead>Avg. Lead Time</TableHead>
                          <TableHead>On-Time Delivery</TableHead>
                          <TableHead>Cost Efficiency</TableHead>
                          <TableHead>Risk Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { 
                            supplier: 'Tech Solutions Inc.', 
                            orderCount: 24, 
                            spend: 182500, 
                            leadTime: 12, 
                            onTime: 92, 
                            costEfficiency: 'High',
                            riskLevel: 'Low' 
                          },
                          { 
                            supplier: 'Global Logistics', 
                            orderCount: 18, 
                            spend: 143000, 
                            leadTime: 8, 
                            onTime: 97, 
                            costEfficiency: 'Medium',
                            riskLevel: 'Low' 
                          },
                          { 
                            supplier: 'EcoPackaging', 
                            orderCount: 31, 
                            spend: 76500, 
                            leadTime: 15, 
                            onTime: 86, 
                            costEfficiency: 'Medium',
                            riskLevel: 'Medium' 
                          },
                          { 
                            supplier: 'FastTrack Delivery', 
                            orderCount: 15, 
                            spend: 58200, 
                            leadTime: 5, 
                            onTime: 99, 
                            costEfficiency: 'High',
                            riskLevel: 'Low' 
                          },
                          { 
                            supplier: 'Quality Materials', 
                            orderCount: 22, 
                            spend: 127000, 
                            leadTime: 10, 
                            onTime: 94, 
                            costEfficiency: 'High',
                            riskLevel: 'Low' 
                          }
                        ].map((item) => (
                          <TableRow key={item.supplier}>
                            <TableCell className="font-medium">{item.supplier}</TableCell>
                            <TableCell>{item.orderCount}</TableCell>
                            <TableCell>${item.spend.toLocaleString()}</TableCell>
                            <TableCell>{item.leadTime} days</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      item.onTime >= 95 ? 'bg-green-500' :
                                      item.onTime >= 90 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${item.onTime}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{item.onTime}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                item.costEfficiency === 'High' ? 'success' :
                                item.costEfficiency === 'Medium' ? 'warning' :
                                'destructive'
                              }>
                                {item.costEfficiency}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                item.riskLevel === 'Low' ? 'success' :
                                item.riskLevel === 'Medium' ? 'warning' :
                                'destructive'
                              }>
                                {item.riskLevel}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History Timeline</CardTitle>
                      <CardDescription>Chronological view of past orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {purchaseOrders
                          .filter(order => order.status === 'delivered')
                          .slice(0, 5)
                          .map((order, index) => (
                            <div key={order.id} className="flex">
                              <div className="flex flex-col items-center mr-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary">
                                  <Check className="h-5 w-5 text-primary" />
                                </div>
                                {index < 4 && <div className="w-px h-full bg-border"></div>}
                              </div>
                              <div className="pb-8">
                                <div className="flex items-center mb-1">
                                  <h4 className="text-lg font-medium">PO #{order.id}</h4>
                                  <Badge className="ml-3">{order.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Order placed on {new Date(order.orderDate).toLocaleDateString()} - 
                                  Delivered on {new Date(order.deliveryDate).toLocaleDateString()}
                                </p>
                                <div className="bg-muted/50 p-4 rounded-lg mb-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium mb-1">Supplier</p>
                                      <p className="text-sm">{order.supplier}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Items</p>
                                      <p className="text-sm">{order.items} items</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Total Value</p>
                                      <p className="text-sm">${order.total.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Payment Status</p>
                                      <Badge variant={
                                        order.paymentStatus === 'paid' ? 'success' :
                                        order.paymentStatus === 'partial' ? 'warning' :
                                        'destructive'
                                      }>
                                        {order.paymentStatus}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Invoice
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Search className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Order Volume</CardTitle>
                        <CardDescription>Historical order count by month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { month: 'Jan', count: 12 },
                                { month: 'Feb', count: 19 },
                                { month: 'Mar', count: 14 },
                                { month: 'Apr', count: 22 },
                                { month: 'May', count: 25 },
                                { month: 'Jun', count: 18 },
                                { month: 'Jul', count: 30 },
                                { month: 'Aug', count: 24 }
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="month" />
                              <YAxis />
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
                                dataKey="count" 
                                name="Order Count" 
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
                        <CardTitle>Order Status History</CardTitle>
                        <CardDescription>Status breakdown of past orders</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { month: 'Jan', delivered: 10, cancelled: 2 },
                                { month: 'Feb', delivered: 16, cancelled: 3 },
                                { month: 'Mar', delivered: 13, cancelled: 1 },
                                { month: 'Apr', delivered: 20, cancelled: 2 },
                                { month: 'May', delivered: 23, cancelled: 2 },
                                { month: 'Jun', delivered: 16, cancelled: 2 },
                                { month: 'Jul', delivered: 27, cancelled: 3 },
                                { month: 'Aug', delivered: 22, cancelled: 2 }
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                              />
                              <Legend />
                              <Bar dataKey="delivered" name="Delivered" stackId="a" fill="hsl(var(--success))" />
                              <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="hsl(var(--destructive))" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        <TabsContent value="quality">
          {/* Quality Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Score by Supplier</CardTitle>
                <CardDescription>Performance comparison across top suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={qualityMetrics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="supplier" 
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
                      <Bar dataKey="qualityScore" name="Quality Score" fill="hsl(var(--primary))" />
                      <Bar dataKey="complianceScore" name="Compliance Score" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Defect & Return Rate Analysis</CardTitle>
                <CardDescription>Relationship between defect and return rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      cx="50%" 
                      cy="50%" 
                      outerRadius="80%" 
                      data={[
                        { subject: 'Quality Score', A: 95, B: 90, fullMark: 100 },
                        { subject: 'Defect Rate', A: 98, B: 95, fullMark: 100 },
                        { subject: 'Return Rate', A: 97, B: 90, fullMark: 100 },
                        { subject: 'Compliance', A: 99, B: 92, fullMark: 100 },
                        { subject: 'Documentation', A: 94, B: 85, fullMark: 100 },
                      ]}
                    >
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
                        name="Top Performer"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Average"
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
          
          {/* Quality Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Quality Metrics</CardTitle>
              <CardDescription>Detailed quality analysis by supplier</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Defect Rate</TableHead>
                    <TableHead>Return Rate</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Inspection Result</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityMetrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.supplier}</TableCell>
                      <TableCell>{new Date(metric.date).toLocaleDateString()}</TableCell>
                      <TableCell>{metric.defectRate}%</TableCell>
                      <TableCell>{metric.returnRate}%</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{metric.qualityScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{metric.complianceScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          metric.inspectionResult === 'passed' ? 'success' : 
                          metric.inspectionResult === 'conditional' ? 'warning' : 
                          'destructive'
                        } className="capitalize">
                          {metric.inspectionResult}
                        </Badge>
                      </TableCell>
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
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>View inspection report</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Contact supplier</DropdownMenuItem>
                            <DropdownMenuItem>Update metrics</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quality Trends Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Trend Analysis</CardTitle>
                <CardDescription>Quality metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', defectRate: 2.4, returnRate: 1.8 },
                        { month: 'Feb', defectRate: 2.1, returnRate: 1.6 },
                        { month: 'Mar', defectRate: 2.3, returnRate: 1.9 },
                        { month: 'Apr', defectRate: 1.9, returnRate: 1.5 },
                        { month: 'May', defectRate: 1.7, returnRate: 1.3 },
                        { month: 'Jun', defectRate: 1.5, returnRate: 1.2 },
                        { month: 'Jul', defectRate: 1.3, returnRate: 1.0 },
                        { month: 'Aug', defectRate: 1.4, returnRate: 1.1 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                        formatter={(value) => [`${value}%`, '']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="defectRate" 
                        name="Defect Rate" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="returnRate" 
                        name="Return Rate" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inspection Results Distribution</CardTitle>
                <CardDescription>Breakdown of inspection outcomes by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Passed', value: 76 },
                          { name: 'Conditional', value: 18 },
                          { name: 'Failed', value: 6 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: 'Passed', value: 76 },
                          { name: 'Conditional', value: 18 },
                          { name: 'Failed', value: 6 }
                        ].map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              'hsl(var(--success))', 
                              'hsl(var(--warning))', 
                              'hsl(var(--destructive))'
                            ][index % 3]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Control Process KPIs */}
          <Card className="mb-6 mt-6">
            <CardHeader>
              <CardTitle>Quality Control Process KPIs</CardTitle>
              <CardDescription>Key performance indicators for quality control processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-1">First Time Pass Rate</div>
                  <div className="text-2xl font-bold">92.3%</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500">+2.1% vs last quarter</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-1">Avg. Resolution Time</div>
                  <div className="text-2xl font-bold">2.4 days</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500">-0.6 days improvement</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-1">Quality Audit Compliance</div>
                  <div className="text-2xl font-bold">98.7%</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500">+1.2% vs target</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-1">Supplier Quality Index</div>
                  <div className="text-2xl font-bold">4.3/5.0</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500">+0.2 vs baseline</span>
                  </div>
                </div>
              </div>
            
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Inspection Thoroughness</Label>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Documentation Accuracy</Label>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Process Adherence</Label>
                    <span className="text-sm font-medium">97%</span>
                  </div>
                  <Progress value={97} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Corrective Action Effectiveness</Label>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Root Cause Analysis Section */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Quality Issue Categories</CardTitle>
                <CardDescription>Distribution of quality issues by category</CardDescription>
              </div>
              <Select defaultValue="six_months">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="three_months">Last 3 Months</SelectItem>
                  <SelectItem value="six_months">Last 6 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { category: 'Material Defects', count: 42 },
                      { category: 'Assembly Errors', count: 28 },
                      { category: 'Specification Non-Compliance', count: 22 },
                      { category: 'Packaging Issues', count: 15 },
                      { category: 'Documentation Errors', count: 12 },
                      { category: 'Transportation Damage', count: 10 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="category" 
                      type="category" 
                      width={150}
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
                    <Bar dataKey="count" name="Issue Count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quality Improvement Initiatives */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quality Improvement Initiatives</CardTitle>
              <CardDescription>Tracking progress of active quality initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Initiative</TableHead>
                    <TableHead>Objective</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Supplier Quality Program</TableCell>
                    <TableCell>Reduce defect rate from suppliers</TableCell>
                    <TableCell>
                      <Badge variant="outline">&#60; 1.0%</Badge>
                    </TableCell>
                    <TableCell>1.3%</TableCell>
                    <TableCell className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Progress value={76} className="h-2" />
                        <span className="text-xs">76%</span>
                      </div>
                    </TableCell>
                    <TableCell>Sarah Johnson</TableCell>
                    <TableCell>
                      <Badge variant="outline">In Progress</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Inspection Process Optimization</TableCell>
                    <TableCell>Enhance quality inspection efficiency</TableCell>
                    <TableCell>
                      <Badge variant="outline">-25% time</Badge>
                    </TableCell>
                    <TableCell>-22%</TableCell>
                    <TableCell className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="h-2" />
                        <span className="text-xs">88%</span>
                      </div>
                    </TableCell>
                    <TableCell>Michael Chen</TableCell>
                    <TableCell>
                      <Badge variant="outline">In Progress</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Quality Documentation System</TableCell>
                    <TableCell>Implement digital documentation</TableCell>
                    <TableCell>
                      <Badge variant="outline">100% Digital</Badge>
                    </TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Progress value={100} className="h-2" />
                        <span className="text-xs">100%</span>
                      </div>
                    </TableCell>
                    <TableCell>David Wilson</TableCell>
                    <TableCell>
                      <Badge variant="success">Completed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Quality Certification Program</TableCell>
                    <TableCell>Achieve ISO 9001:2015 certification</TableCell>
                    <TableCell>
                      <Badge variant="outline">Full Compliance</Badge>
                    </TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="h-2" />
                        <span className="text-xs">92%</span>
                      </div>
                    </TableCell>
                    <TableCell>Jennifer Lopez</TableCell>
                    <TableCell>
                      <Badge variant="outline">In Progress</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
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