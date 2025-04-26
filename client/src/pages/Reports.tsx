import React, { useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon, 
  BarChart, 
  TrendingUp, 
  AlertTriangle,
  Truck,
  Users,
  Check,
  Search,
  Loader2,
  Database,
  Filter,
  FileSpreadsheet,
  Clock,
  Plus,
  MoreHorizontal,
  Package,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  Trash2,
  Activity as ActivityIcon,
  BarChart3,
  Ruler,
  FileCode,
  CheckSquare,
  Eye,
  Save,
  RotateCcw,
  ChevronDown
} from "lucide-react";
import {
  LineChart, 
  Line,
  AreaChart,
  Area,
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Dummy report data
const reports = [
  {
    id: "REP-2023-1201",
    name: "Monthly Operations Summary",
    category: "operations",
    date: "Aug 1, 2023",
    size: "1.2 MB",
    status: "completed",
    author: "System"
  },
  {
    id: "REP-2023-1202",
    name: "Fleet Performance Analysis",
    category: "fleet",
    date: "Aug 5, 2023",
    size: "3.5 MB",
    status: "completed",
    author: "John Smith"
  },
  {
    id: "REP-2023-1203",
    name: "Delivery Time Optimization",
    category: "delivery",
    date: "Aug 8, 2023",
    size: "2.8 MB",
    status: "completed",
    author: "System"
  },
  {
    id: "REP-2023-1204",
    name: "Customer Satisfaction Survey",
    category: "customer",
    date: "Aug 10, 2023",
    size: "4.1 MB",
    status: "completed",
    author: "Emily Johnson"
  },
  {
    id: "REP-2023-1205",
    name: "Fuel Consumption Trends",
    category: "fleet",
    date: "Aug 12, 2023",
    size: "1.9 MB",
    status: "completed",
    author: "System"
  },
  {
    id: "REP-2023-1206",
    name: "Maintenance Schedule Overview",
    category: "maintenance",
    date: "Aug 15, 2023",
    size: "2.3 MB",
    status: "completed",
    author: "Michael Davis"
  },
  {
    id: "REP-2023-1207",
    name: "Route Efficiency Analysis",
    category: "route",
    date: "Aug 18, 2023",
    size: "3.2 MB",
    status: "completed",
    author: "System"
  },
  {
    id: "REP-2023-1208",
    name: "Driver Performance Review",
    category: "operations",
    date: "Aug 20, 2023",
    size: "2.7 MB",
    status: "completed",
    author: "Sarah Wilson"
  },
  {
    id: "REP-2023-1209",
    name: "Warehouse Inventory Status",
    category: "operations",
    date: "Aug 22, 2023",
    size: "5.2 MB",
    status: "completed",
    author: "System"
  },
  {
    id: "REP-2023-1210",
    name: "Vehicle Maintenance Costs",
    category: "fleet",
    date: "Aug 25, 2023",
    size: "1.8 MB",
    status: "completed",
    author: "Robert Brown"
  },
  {
    id: "REP-2023-1211",
    name: "Customer Complaint Analysis",
    category: "customer",
    date: "Aug 27, 2023",
    size: "3.4 MB",
    status: "completed",
    author: "Jennifer Lee"
  },
  {
    id: "REP-2023-1212",
    name: "Delivery Exception Report",
    category: "delivery",
    date: "Aug 29, 2023",
    size: "2.1 MB",
    status: "completed",
    author: "System"
  },
  {
    id: "REP-2023-1213",
    name: "Quarterly Financial Summary",
    category: "operations",
    date: "Aug 30, 2023",
    size: "4.6 MB",
    status: "completed",
    author: "David Miller"
  }
];

// Operations report data
const operationsReports = [
  {
    id: "OPS-2023-0801",
    name: "Daily Operations Summary",
    date: "Aug 15, 2023",
    department: "Logistics",
    status: "completed",
    size: "1.1 MB"
  },
  {
    id: "OPS-2023-0802",
    name: "Warehouse Productivity",
    date: "Aug 16, 2023",
    department: "Warehouse",
    status: "completed",
    size: "2.3 MB"
  },
  {
    id: "OPS-2023-0803",
    name: "Staff Performance Metrics",
    date: "Aug 17, 2023",
    department: "HR",
    status: "completed",
    size: "3.2 MB"
  },
  {
    id: "OPS-2023-0804",
    name: "Process Efficiency Analysis",
    date: "Aug 18, 2023",
    department: "Operations",
    status: "completed",
    size: "1.8 MB"
  },
  {
    id: "OPS-2023-0805",
    name: "Inventory Turnover Report",
    date: "Aug 20, 2023",
    department: "Inventory",
    status: "completed",
    size: "2.5 MB"
  },
  {
    id: "OPS-2023-0806",
    name: "Cost Reduction Initiatives",
    date: "Aug 22, 2023",
    department: "Finance",
    status: "completed",
    size: "1.6 MB"
  },
  {
    id: "OPS-2023-0807",
    name: "Equipment Utilization",
    date: "Aug 24, 2023",
    department: "Operations",
    status: "completed",
    size: "2.2 MB"
  },
  {
    id: "OPS-2023-0808",
    name: "Labor Distribution",
    date: "Aug 26, 2023",
    department: "HR",
    status: "completed",
    size: "1.9 MB"
  }
];

// Fleet report data
const fleetReports = [
  {
    id: "FL-2023-0801",
    name: "Vehicle Utilization Report",
    date: "Aug 14, 2023",
    fleetType: "Delivery Vans",
    status: "completed",
    size: "2.3 MB"
  },
  {
    id: "FL-2023-0802",
    name: "Fuel Efficiency Analysis",
    date: "Aug 16, 2023",
    fleetType: "All Vehicles",
    status: "completed",
    size: "3.1 MB"
  },
  {
    id: "FL-2023-0803",
    name: "Maintenance Schedule",
    date: "Aug 18, 2023",
    fleetType: "Trucks",
    status: "completed",
    size: "1.7 MB"
  },
  {
    id: "FL-2023-0804",
    name: "Driver Assignment Optimization",
    date: "Aug 20, 2023",
    fleetType: "All Vehicles",
    status: "completed",
    size: "2.4 MB"
  },
  {
    id: "FL-2023-0805",
    name: "Vehicle Acquisition Plan",
    date: "Aug 22, 2023",
    fleetType: "Management",
    status: "completed",
    size: "4.2 MB"
  },
  {
    id: "FL-2023-0806",
    name: "Fleet Carbon Footprint",
    date: "Aug 25, 2023",
    fleetType: "All Vehicles",
    status: "completed",
    size: "2.8 MB"
  },
  {
    id: "FL-2023-0807",
    name: "Vehicle Age Distribution",
    date: "Aug 28, 2023",
    fleetType: "All Vehicles",
    status: "completed",
    size: "1.5 MB"
  }
];

// Customer report data
const customerReports = [
  {
    id: "CUS-2023-0801",
    name: "Satisfaction Survey Results",
    date: "Aug 15, 2023",
    segment: "Retail",
    status: "completed",
    size: "3.4 MB"
  },
  {
    id: "CUS-2023-0802",
    name: "Delivery Time Analysis",
    date: "Aug 17, 2023",
    segment: "All Segments",
    status: "completed",
    size: "2.6 MB"
  },
  {
    id: "CUS-2023-0803",
    name: "Complaint Resolution Time",
    date: "Aug 19, 2023",
    segment: "All Segments",
    status: "completed",
    size: "1.8 MB"
  },
  {
    id: "CUS-2023-0804",
    name: "Customer Retention Rate",
    date: "Aug 21, 2023",
    segment: "Corporate",
    status: "completed",
    size: "2.2 MB"
  },
  {
    id: "CUS-2023-0805",
    name: "Net Promoter Score Analysis",
    date: "Aug 23, 2023",
    segment: "All Segments",
    status: "completed",
    size: "3.7 MB"
  },
  {
    id: "CUS-2023-0806",
    name: "Customer Demographic Profile",
    date: "Aug 25, 2023",
    segment: "All Segments",
    status: "completed",
    size: "4.1 MB"
  },
  {
    id: "CUS-2023-0807",
    name: "Service Level Achievement",
    date: "Aug 27, 2023",
    segment: "Premium",
    status: "completed",
    size: "2.3 MB"
  },
  {
    id: "CUS-2023-0808",
    name: "Customer Feedback Summary",
    date: "Aug 29, 2023",
    segment: "All Segments",
    status: "completed",
    size: "3.2 MB"
  }
];

// Performance metrics data
const performanceData = [
  { month: "Jan", deliverySpeed: 92, costEfficiency: 88, customerSatisfaction: 86 },
  { month: "Feb", deliverySpeed: 93, costEfficiency: 86, customerSatisfaction: 85 },
  { month: "Mar", deliverySpeed: 91, costEfficiency: 89, customerSatisfaction: 87 },
  { month: "Apr", deliverySpeed: 94, costEfficiency: 91, customerSatisfaction: 88 },
  { month: "May", deliverySpeed: 95, costEfficiency: 92, customerSatisfaction: 90 },
  { month: "Jun", deliverySpeed: 93, costEfficiency: 90, customerSatisfaction: 91 },
  { month: "Jul", deliverySpeed: 96, costEfficiency: 93, customerSatisfaction: 92 },
  { month: "Aug", deliverySpeed: 97, costEfficiency: 94, customerSatisfaction: 93 }
];

// Incident data
const incidentData = [
  { month: "Jan", incidents: 12 },
  { month: "Feb", incidents: 15 },
  { month: "Mar", incidents: 10 },
  { month: "Apr", incidents: 8 },
  { month: "May", incidents: 5 },
  { month: "Jun", incidents: 6 },
  { month: "Jul", incidents: 4 },
  { month: "Aug", incidents: 3 }
];

// Add scheduled reports data array
const scheduledReports = [
  {
    id: "SCH-2023-1001",
    name: "Weekly Operations Summary",
    type: "Operations",
    frequency: "Weekly (Monday)",
    nextRun: "Aug 28, 2023",
    recipients: "5 recipients",
    format: "PDF",
    status: "active"
  },
  {
    id: "SCH-2023-1002",
    name: "Monthly Fleet Report",
    type: "Fleet",
    frequency: "Monthly (1st)",
    nextRun: "Sep 1, 2023",
    recipients: "3 recipients",
    format: "PDF, CSV",
    status: "active"
  },
  {
    id: "SCH-2023-1003",
    name: "Daily Delivery Exceptions",
    type: "Delivery",
    frequency: "Daily (6PM)",
    nextRun: "Today",
    recipients: "7 recipients",
    format: "PDF",
    status: "active"
  },
  {
    id: "SCH-2023-1004",
    name: "Customer Satisfaction Summary",
    type: "Customer",
    frequency: "Bi-weekly",
    nextRun: "Sep 5, 2023",
    recipients: "4 recipients",
    format: "PDF, Excel",
    status: "paused"
  },
  {
    id: "SCH-2023-1005",
    name: "Route Optimization Analysis",
    type: "Route",
    frequency: "Weekly (Friday)",
    nextRun: "Sep 1, 2023",
    recipients: "2 recipients",
    format: "PDF, JSON",
    status: "active"
  },
  {
    id: "SCH-2023-1006",
    name: "Warehouse Inventory Report",
    type: "Inventory",
    frequency: "Daily (9AM)",
    nextRun: "Tomorrow",
    recipients: "6 recipients",
    format: "CSV",
    status: "active"
  },
  {
    id: "SCH-2023-1007",
    name: "Driver Performance Report",
    type: "Personnel",
    frequency: "Monthly (15th)",
    nextRun: "Sep 15, 2023",
    recipients: "3 recipients",
    format: "PDF",
    status: "active"
  },
  {
    id: "SCH-2023-1008",
    name: "Cost Analysis Report",
    type: "Finance",
    frequency: "Quarterly",
    nextRun: "Oct 1, 2023",
    recipients: "2 recipients",
    format: "Excel",
    status: "paused"
  }
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedMonth, setSelectedMonth] = React.useState("august");
  const [selectedFormat, setSelectedFormat] = React.useState("pdf");
  const [selectedReportType, setSelectedReportType] = React.useState("performance");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showGeneratedReport, setShowGeneratedReport] = React.useState(false);
  const [generatedReportDetails, setGeneratedReportDetails] = React.useState({
    id: "",
    name: "",
    category: "",
    date: "",
    size: "",
    format: ""
  });
  
  // Get current location and navigate function from wouter
  const [location, setLocation] = useLocation();
  
  // State for department, fleet type, and segment filters
  const [selectedDepartment, setSelectedDepartment] = React.useState("all");
  const [selectedFleetType, setSelectedFleetType] = React.useState("all");
  const [selectedSegment, setSelectedSegment] = React.useState("all");
  
  // Add state for the main tab navigation (matching the sidebar navigation)
  const [mainTab, setMainTab] = React.useState("recent");
  
  // Add pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [selectedReports, setSelectedReports] = React.useState<string[]>([]);
  
  // Add pagination and selection state for scheduled reports
  const [currentScheduledPage, setCurrentScheduledPage] = React.useState(1);
  const [scheduledPageSize, setScheduledPageSize] = React.useState(5);
  const [selectedScheduledReports, setSelectedScheduledReports] = React.useState<string[]>([]);
  const [scheduledStatusFilter, setScheduledStatusFilter] = React.useState("all");
  const [scheduledSearchTerm, setScheduledSearchTerm] = React.useState("");
  
  // Set the active tab based on the current URL path
  useEffect(() => {
    // Extract the last part of the path to determine which tab should be active
    const path = window.location.pathname;
    
    if (path.includes('/reports/recent')) {
      setMainTab('recent');
    } else if (path.includes('/reports/templates')) {
      setMainTab('templates');
    } else if (path.includes('/reports/scheduled')) {
      setMainTab('scheduled');
    } else if (path.includes('/reports/builder')) {
      setMainTab('builder');
    }
  }, [location]); // Re-run when location changes
  
  // Handle main tab change and update URL without page reload
  const handleTabChange = (value: string) => {
    setMainTab(value);
    setLocation(`/reports/${value}`);
  };
  
  // Get the current page name for the heading
  const getCurrentPageName = () => {
    if (mainTab === "recent") {
      return "Recent Reports";
    } else if (mainTab === "templates") {
      return "Report Templates";
    } else if (mainTab === "scheduled") {
      return "Scheduled Reports";
    } else if (mainTab === "builder") {
      return "Custom Report Builder";
    } else {
      return "Reports & Analytics";
    }
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  // Filter reports based on search term and category
  const getFilteredReports = (data: any[], category?: string) => {
    let filtered = data;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.category && report.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.department && report.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.segment && report.segment.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.fleetType && report.fleetType.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter if needed
    if (category && category !== 'all') {
      filtered = filtered.filter(report => report.category === category);
    }
    
    return filtered;
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle report selection
  const handleToggleReportSelection = (reportId: string) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };
  
  // Filter operations reports by department
  const getFilteredOperationsReports = () => {
    let filtered = operationsReports;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.department && report.department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(report => 
        report.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }
    
    return filtered;
  };
  
  // Filter fleet reports by fleet type
  const getFilteredFleetReports = () => {
    let filtered = fleetReports;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.fleetType && report.fleetType.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply fleet type filter
    if (selectedFleetType !== 'all') {
      filtered = filtered.filter(report => {
        // Handle special case for "All Vehicles"
        if (selectedFleetType === 'vans') {
          return report.fleetType.includes('Delivery Vans');
        } else if (selectedFleetType === 'trucks') {
          return report.fleetType.includes('Trucks');
        } else if (selectedFleetType === 'management') {
          return report.fleetType.includes('Management');
        }
        return true;
      });
    }
    
    return filtered;
  };
  
  // Filter customer reports by segment
  const getFilteredCustomerReports = () => {
    let filtered = customerReports;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.segment && report.segment.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply segment filter
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(report => {
        if (selectedSegment === 'retail') {
          return report.segment.includes('Retail');
        } else if (selectedSegment === 'corporate') {
          return report.segment.includes('Corporate');
        } else if (selectedSegment === 'premium') {
          return report.segment.includes('Premium');
        }
        return true;
      });
    }
    
    return filtered;
  };
  
  // Add filter function for scheduled reports
  const getFilteredScheduledReports = () => {
    let filtered = scheduledReports;
    
    // Apply search filter
    if (scheduledSearchTerm) {
      filtered = filtered.filter(report => 
        report.id.toLowerCase().includes(scheduledSearchTerm.toLowerCase()) ||
        report.name.toLowerCase().includes(scheduledSearchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(scheduledSearchTerm.toLowerCase()) ||
        report.frequency.toLowerCase().includes(scheduledSearchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (scheduledStatusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === scheduledStatusFilter);
    }
    
    return filtered;
  };
  
  // Handle scheduled reports page change
  const handleScheduledPageChange = (page: number) => {
    setCurrentScheduledPage(page);
  };
  
  // Handle scheduled report selection
  const handleToggleScheduledReportSelection = (reportId: string) => {
    if (selectedScheduledReports.includes(reportId)) {
      setSelectedScheduledReports(selectedScheduledReports.filter(id => id !== reportId));
    } else {
      setSelectedScheduledReports([...selectedScheduledReports, reportId]);
    }
  };
  
  // Handle scheduled report search
  const handleScheduledSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduledSearchTerm(e.target.value);
    setCurrentScheduledPage(1); // Reset to first page on search
  };
  
  // Handle report download for all report tables
  const handleReportDownload = (report: any) => {
    // Determine format based on file extension or defaulting to PDF
    let format = 'pdf';
    if (report.name.toLowerCase().includes('spreadsheet') || 
        report.name.toLowerCase().includes('excel')) {
      format = 'csv';
    } else if (report.name.toLowerCase().includes('data')) {
      format = 'json';
    }
    
    generateFileDownload(report.name, format, report.category || 'operations');
  };
  
  // Function to handle report generation
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation with a delay
    setTimeout(() => {
      const reportId = `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const reportDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      let reportName = "";
      let reportCategory = "";
      let reportSize = "";
      
      // Set report name and category based on selected report type
      switch (selectedReportType) {
        case "performance":
          reportName = "Performance Analysis Report";
          reportCategory = "operations";
          reportSize = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
          break;
        case "fleet":
          reportName = "Fleet Utilization Report";
          reportCategory = "fleet";
          reportSize = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
          break;
        case "delivery":
          reportName = "Delivery Metrics Report";
          reportCategory = "delivery";
          reportSize = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
          break;
        case "cost":
          reportName = "Cost Analysis Report";
          reportCategory = "operations";
          reportSize = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
          break;
        case "customer":
          reportName = "Customer Satisfaction Report";
          reportCategory = "customer";
          reportSize = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
          break;
        default:
          reportName = "Custom Report";
          reportCategory = "operations";
          reportSize = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
      }
      
      // Set generated report details
      setGeneratedReportDetails({
        id: reportId,
        name: reportName,
        category: reportCategory,
        date: reportDate,
        size: reportSize,
        format: selectedFormat.toUpperCase()
      });
      
      // Generate and download the file based on the selected format
      generateFileDownload(reportName, selectedFormat, selectedReportType);
      
      setIsGenerating(false);
      setShowGeneratedReport(true);
      
      // Hide the generated report message after 5 seconds
      setTimeout(() => {
        setShowGeneratedReport(false);
      }, 5000);
    }, 2000);
  };
  
  // Function to generate and download files of different formats
  const generateFileDownload = (reportName: string, format: string, reportType: string) => {
    let content = '';
    let mimeType = '';
    let extension = '';
    let fileName = reportName.replace(/\s+/g, '_');
    
    // Get report data based on the report type
    const reportData = {
      reportName: reportName,
      generatedDate: new Date().toLocaleDateString(),
      generatedBy: "System",
      metrics: {
        deliverySpeed: 97,
        costEfficiency: 94,
        customerSatisfaction: 93
      },
      summary: "This report provides a comprehensive analysis of logistics performance metrics for the selected period.",
      recommendations: [
        "Implement route optimization for 15% of underperforming routes",
        "Increase driver training for time management",
        "Review fuel consumption patterns in the northeast region"
      ]
    };
    
    // Create content based on the selected format
    switch (format) {
      case 'pdf':
        // For PDF, since we can't create actual PDFs in the browser without libraries,
        // we'll create an HTML document that browsers can easily convert to PDF when printed
        mimeType = 'text/html';
        extension = 'pdf';
        
        // Create a styled HTML document that looks like a PDF report
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${reportName}</title>
              <style>
                @media print {
                  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
                body { 
                  font-family: Arial, sans-serif; 
                  max-width: 800px; 
                  margin: 0 auto; 
                  padding: 30px;
                  color: #333;
                }
                h1 { 
                  color: #333; 
                  border-bottom: 1px solid #ddd; 
                  padding-bottom: 10px; 
                }
                .header { 
                  margin-bottom: 30px; 
                }
                .logo {
                  text-align: right;
                  font-size: 22px;
                  font-weight: bold;
                  color: #1a56db;
                  margin-bottom: 20px;
                }
                .section { 
                  margin-bottom: 20px; 
                }
                .metrics { 
                  display: flex; 
                  justify-content: space-between; 
                  margin: 20px 0; 
                }
                .metric { 
                  text-align: center; 
                  padding: 15px; 
                  background: #f7f7f7; 
                  border-radius: 5px;
                  width: 30%;
                }
                .metric h3 { 
                  margin: 0;
                  font-size: 24px;
                  color: #1a56db;
                }
                .recommendations li { 
                  margin-bottom: 10px; 
                }
                .footer {
                  margin-top: 50px;
                  padding-top: 10px;
                  border-top: 1px solid #ddd;
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="logo">Logistics Dashboard</div>
              <div class="header">
                <h1>${reportName}</h1>
                <p>Generated on: ${reportData.generatedDate} | Generated by: ${reportData.generatedBy}</p>
              </div>
              
              <div class="section">
                <h2>Executive Summary</h2>
                <p>${reportData.summary}</p>
              </div>
              
              <div class="section">
                <h2>Key Metrics</h2>
                <div class="metrics">
                  <div class="metric">
                    <h3>${reportData.metrics.deliverySpeed}%</h3>
                    <p>Delivery Speed</p>
                  </div>
                  <div class="metric">
                    <h3>${reportData.metrics.costEfficiency}%</h3>
                    <p>Cost Efficiency</p>
                  </div>
                  <div class="metric">
                    <h3>${reportData.metrics.customerSatisfaction}%</h3>
                    <p>Customer Satisfaction</p>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h2>Recommendations</h2>
                <ul class="recommendations">
                  ${reportData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
              
              <div class="footer">
                <p>This report is automatically generated by the Logistics Dashboard system. For questions or support, please contact the IT department.</p>
                <p>Document ID: ${Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
              </div>
              
              <script>
                // Auto-print the page when loaded, which will allow saving as PDF
                window.onload = function() {
                  // Display a message instructing the user how to save as PDF
                  const printMsg = document.createElement('div');
                  printMsg.style.position = 'fixed';
                  printMsg.style.top = '10px';
                  printMsg.style.left = '50%';
                  printMsg.style.transform = 'translateX(-50%)';
                  printMsg.style.padding = '10px 20px';
                  printMsg.style.background = '#f0f0f0';
                  printMsg.style.border = '1px solid #ddd';
                  printMsg.style.borderRadius = '5px';
                  printMsg.style.zIndex = '9999';
                  printMsg.innerHTML = '<p>To save as PDF, use Print (Ctrl+P or ⌘+P) and select "Save as PDF" as the destination.</p>';
                  document.body.appendChild(printMsg);
                  
                  // Remove the print message when printing
                  window.matchMedia('print').addEventListener('change', function(mql) {
                    if (mql.matches) {
                      printMsg.style.display = 'none';
                    }
                  });
                };
              </script>
            </body>
          </html>
        `;
        
        // Create HTML blob and open in a new tab for proper PDF saving
        const blob = new Blob([htmlContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        // Instead of forcing download which results in corrupted PDF,
        // open in a new tab which user can save as PDF
        window.open(url, '_blank');
        
        // Also provide a direct download option for the HTML file
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.html`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);
        
        return; // Early return to avoid default behavior
        
      case 'csv':
        mimeType = 'text/csv';
        extension = 'csv';
        // Create a well-formatted CSV with proper quoting
        content = `"Report Name","${reportName}"\r\n`;
        content += `"Generated Date","${reportData.generatedDate}"\r\n`;
        content += `"Generated By","${reportData.generatedBy}"\r\n\r\n`;
        
        // Add metrics table with headers
        content += `"Key Performance Metrics"\r\n`;
        content += `"Metric","Value"\r\n`;
        content += `"Delivery Speed","${reportData.metrics.deliverySpeed}%"\r\n`;
        content += `"Cost Efficiency","${reportData.metrics.costEfficiency}%"\r\n`;
        content += `"Customer Satisfaction","${reportData.metrics.customerSatisfaction}%"\r\n\r\n`;
        
        // Add summary
        content += `"Executive Summary"\r\n`;
        content += `"${reportData.summary}"\r\n\r\n`;
        
        // Add recommendations with proper formatting
        content += `"Recommendations"\r\n`;
        reportData.recommendations.forEach((rec, index) => {
          content += `"${index + 1}","${rec}"\r\n`;
        });
        break;
        
      case 'json':
        mimeType = 'application/json';
        extension = 'json';
        content = JSON.stringify(reportData, null, 2);
        break;
        
      default:
        mimeType = 'text/plain';
        extension = 'txt';
        content = `${reportName}\n\n`;
        content += `Generated Date: ${reportData.generatedDate}\n`;
        content += `Generated By: ${reportData.generatedBy}\n\n`;
        content += `Summary: ${reportData.summary}\n\n`;
        content += `Key Metrics:\n`;
        content += `- Delivery Speed: ${reportData.metrics.deliverySpeed}%\n`;
        content += `- Cost Efficiency: ${reportData.metrics.costEfficiency}%\n`;
        content += `- Customer Satisfaction: ${reportData.metrics.customerSatisfaction}%\n\n`;
        content += `Recommendations:\n`;
        reportData.recommendations.forEach((rec, index) => {
          content += `${index + 1}. ${rec}\n`;
        });
    }
    
    // Only handle formats that weren't specifically handled above
    if (format !== 'pdf') {
      // Create the file and initiate download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    }
  };

  // Inside the render block, replace References to paginatedReports with the following calculation:
  const renderReportsList = () => {
    const filteredReports = getFilteredReports(reports);
    const totalReports = filteredReports.length;
    const totalPages = Math.ceil(totalReports / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize);

    if (paginatedReports.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-6">
          <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-center mb-2">No reports found</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search filters to find what you're looking for." 
              : "No reports have been generated yet."}
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-muted/50 text-sm">
              <tr>
                <th className="py-3 px-4 text-left font-medium w-[40px]">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === paginatedReports.length && paginatedReports.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports(paginatedReports.map(r => r.id.toString()));
                      } else {
                        setSelectedReports([]);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="py-3 px-4 text-left font-medium w-[120px]">Report ID</th>
                <th className="py-3 px-4 text-left font-medium">Report Name</th>
                <th className="py-3 px-4 text-left font-medium">Category</th>
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Size</th>
                <th className="py-3 px-4 text-left font-medium">Author</th>
                <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedReports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id.toString())}
                      onChange={() => handleToggleReportSelection(report.id.toString())}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm">{report.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      {report.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={
                      report.category === 'operations' ? 'default' : 
                      report.category === 'fleet' ? 'secondary' : 
                      report.category === 'customer' ? 'success' : 
                      'warning'
                    }>
                      {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">{report.date}</td>
                  <td className="py-3 px-4 text-sm">{report.size}</td>
                  <td className="py-3 px-4 text-sm">{report.author}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleReportDownload(report)} 
                        className="h-8 w-8"
                        title="Download Report"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {}} 
                        className="h-8 w-8"
                        title="View Report"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {}} 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Delete Report"
                      >
                        <Trash2 className="h-4 w-4" />
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
              Showing {Math.min((currentPage - 1) * pageSize + 1, totalReports)} to {Math.min(currentPage * pageSize, totalReports)} of {totalReports} {totalReports === 1 ? 'report' : 'reports'}
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
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-left">
            Reports & Analytics
          </h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">
              {getCurrentPageName()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {showGeneratedReport && (
        <Card className="mb-6 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Report generated successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  {generatedReportDetails.name} ({generatedReportDetails.id}) - {generatedReportDetails.format} format
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => generateFileDownload(generatedReportDetails.name, selectedFormat, selectedReportType)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards based on active tab */}
      {mainTab === "recent" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+12 from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Generated Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+3 from yesterday</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.7 MB</div>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">-0.3 MB improvement</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Download Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+2% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {mainTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+3 new templates</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Operations</div>
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground">48% of all generated</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Generated MTD</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+18% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Template Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground">Across all departments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {mainTab === "scheduled" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+2 from last week</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reports This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground">Next: Today at 6PM</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+5 new recipients</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.4%</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+0.2% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {mainTab === "builder" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+14 this month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120+</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-xs text-green-500">+12 new fields</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground">Connected systems</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Export Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground">PDF, CSV, XLSX, JSON, HTML</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main tabs structure that matches the sidebar navigation */}
      <Tabs value={mainTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="recent">
            <FileText className="h-4 w-4 mr-2" />
            Recent Reports
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Package className="h-4 w-4 mr-2" />
            Report Templates
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Scheduled Reports
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Database className="h-4 w-4 mr-2" />
            Custom Report Builder
          </TabsTrigger>
        </TabsList>
        
        {/* Recent Reports Tab - Updated */}
        <TabsContent value="recent">
          {/* Additional components for Custom Report Builder - goes between TabsList and TabsContent */}
          <Card className="mb-6">
              <div className="col-span-1 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Builder Presets</CardTitle>
                  <CardDescription>Quick-start templates for custom reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <div className="bg-muted/30 hover:bg-muted/50 rounded-md p-3 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <TrendingUp className="h-8 w-8 mb-2 text-blue-500" />
                        <h4 className="text-sm font-medium mb-1">Performance Dashboard</h4>
                        <p className="text-xs text-muted-foreground">Operations KPIs and metrics</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 hover:bg-muted/50 rounded-md p-3 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <Truck className="h-8 w-8 mb-2 text-green-500" />
                        <h4 className="text-sm font-medium mb-1">Fleet Analysis</h4>
                        <p className="text-xs text-muted-foreground">Vehicle utilization metrics</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 hover:bg-muted/50 rounded-md p-3 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <Users className="h-8 w-8 mb-2 text-amber-500" />
                        <h4 className="text-sm font-medium mb-1">Customer Insights</h4>
                        <p className="text-xs text-muted-foreground">Satisfaction and engagement</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 hover:bg-muted/50 rounded-md p-3 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <ActivityIcon className="h-8 w-8 mb-2 text-red-500" />
                        <h4 className="text-sm font-medium mb-1">Delivery Metrics</h4>
                        <p className="text-xs text-muted-foreground">On-time delivery analysis</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 hover:bg-muted/50 rounded-md p-3 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <BarChart3 className="h-8 w-8 mb-2 text-purple-500" />
                        <h4 className="text-sm font-medium mb-1">Financial Overview</h4>
                        <p className="text-xs text-muted-foreground">Cost and revenue metrics</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
          </Card>
          {/* Additional visualization for Recent Reports - goes between TabsList and TabsContent */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Report Generation Trends</CardTitle>
                <CardDescription>Weekly report generation activity</CardDescription>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { day: 'Mon', reports: 12, downloaded: 10 },
                      { day: 'Tue', reports: 18, downloaded: 14 },
                      { day: 'Wed', reports: 15, downloaded: 12 },
                      { day: 'Thu', reports: 21, downloaded: 18 },
                      { day: 'Fri', reports: 16, downloaded: 13 },
                      { day: 'Sat', reports: 8, downloaded: 6 },
                      { day: 'Sun', reports: 5, downloaded: 4 }
                    ]}
                    margin={{ top: 20, right: 15, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-md shadow-sm p-2">
                              <p className="font-medium text-xs">{payload[0].payload.day}</p>
                              <p className="text-xs">
                                Generated: <span className="font-medium">{payload[0].value}</span>
                              </p>
                              <p className="text-xs">
                                Downloaded: <span className="font-medium">{payload[1].value}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar name="Generated" dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar name="Downloaded" dataKey="downloaded" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Legend 
                      verticalAlign="top"
                      height={30}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span className="text-xs font-medium">{value}</span>}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Report Categories</CardTitle>
                <CardDescription>Distribution by report type</CardDescription>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Operations', value: 35, color: '#3b82f6' },
                        { name: 'Fleet', value: 25, color: '#10b981' },
                        { name: 'Delivery', value: 20, color: '#f59e0b' },
                        { name: 'Customer', value: 15, color: '#f43f5e' },
                        { name: 'Other', value: 5, color: '#6b7280' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Operations', value: 35, color: '#3b82f6' },
                        { name: 'Fleet', value: 25, color: '#10b981' },
                        { name: 'Delivery', value: 20, color: '#f59e0b' },
                        { name: 'Customer', value: 15, color: '#f43f5e' },
                        { name: 'Other', value: 5, color: '#6b7280' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-md shadow-sm p-2">
                              <p className="font-medium text-xs">{payload[0].name}</p>
                              <p className="text-xs">
                                <span className="font-medium">{payload[0].value}%</span> of reports
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span className="text-xs font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Report Metrics</CardTitle>
                <CardDescription>Performance summary</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm">Generation Time</div>
                      <div className="text-sm font-medium">3.5s avg</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <div>0s</div>
                      <div>10s</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm">Download Rate</div>
                      <div className="text-sm font-medium">82%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <div>0%</div>
                      <div>100%</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm">File Size</div>
                      <div className="text-sm font-medium">2.7 MB avg</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <div>0 MB</div>
                      <div>5 MB</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm">User Satisfaction</div>
                      <div className="text-sm font-medium">94%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <div>0%</div>
                      <div>100%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Recently generated reports with download links</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search reports..."
                    className="w-[200px] pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => {
                    setPageSize(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="15">15 per page</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all" onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="fleet">Fleet</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderReportsList()}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Report Templates Tab */}
        <TabsContent value="templates">
          {/* Additional Template Analytics */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Template Usage Analytics</CardTitle>
              <CardDescription>Distribution and trends of report template usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        width={60}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        cursor={{stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '3 3'}}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-md shadow-sm p-3">
                                <p className="font-medium">{label}</p>
                                {payload.map((entry, index) => (
                                  <div key={`tooltip-${index}`} className="flex items-center my-1">
                                    <div 
                                      className="h-3 w-3 rounded-full mr-2" 
                                      style={{ backgroundColor: entry.stroke }}
                                    />
                                    <span className="text-sm">
                                      {entry.name}: <span className="font-medium">{entry.value}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        name="Operations Templates"
                        type="monotone"
                        dataKey="costEfficiency"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Line
                        name="Fleet Templates"
                        type="monotone"
                        dataKey="deliverySpeed"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Line
                        name="Customer Templates"
                        type="monotone"
                        dataKey="customerSatisfaction"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Legend 
                        verticalAlign="top"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span className="text-xs font-medium">{value}</span>}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px] flex flex-col">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { name: 'PDF', value: 45 },
                          { name: 'CSV', value: 28 },
                          { name: 'Excel', value: 15 },
                          { name: 'JSON', value: 8 },
                          { name: 'HTML', value: 4 }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="templateFormatGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-md shadow-sm p-2">
                                  <p className="font-medium text-sm">{payload[0].payload.name}</p>
                                  <p className="text-sm">
                                    <span className="font-medium">{payload[0].value}%</span> of all exports
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#templateFormatGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-4">
                        <div className="text-center">
                          <div className="bg-primary/10 rounded-md py-2 mb-1">
                            <div className="font-medium text-xs">PDF</div>
                            <div className="text-lg font-bold">45%</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Format</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-green-500/10 rounded-md py-2 mb-1">
                            <div className="font-medium text-xs">CSV</div>
                            <div className="text-lg font-bold">28%</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Format</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-500/10 rounded-md py-2 mb-1">
                            <div className="font-medium text-xs">Excel</div>
                            <div className="text-lg font-bold">15%</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Format</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-amber-500/10 rounded-md py-2 mb-1">
                            <div className="font-medium text-xs">JSON</div>
                            <div className="text-lg font-bold">8%</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Format</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-red-500/10 rounded-md py-2 mb-1">
                            <div className="font-medium text-xs">HTML</div>
                            <div className="text-lg font-bold">4%</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Format</div>
                        </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Standard report templates for quick generation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Template cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Operations Summary</CardTitle>
                    <CardDescription>Daily overview of operational metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      <span>PDF, CSV, Excel formats</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Generated in ~30 seconds</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm" onClick={() => handleGenerateReport()}>Generate</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fleet Performance</CardTitle>
                    <CardDescription>Vehicle utilization and efficiency metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      <span>PDF, CSV formats</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Generated in ~45 seconds</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm" onClick={() => handleGenerateReport()}>Generate</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Delivery Analytics</CardTitle>
                    <CardDescription>On-time delivery and route efficiency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      <span>PDF, CSV formats</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Generated in ~60 seconds</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm" onClick={() => handleGenerateReport()}>Generate</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
                    <CardDescription>Customer feedback and service metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      <span>PDF, CSV formats</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Generated in ~40 seconds</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm" onClick={() => handleGenerateReport()}>Generate</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled">
          {/* Report Scheduling Heatmap */}
          <Card className="mb-6">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
               <div>
                <CardTitle>Report Scheduling Heatmap</CardTitle>
                <CardDescription>Scheduled report generation patterns by day and time</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 py-0">
              <div className="mb-3 flex items-center justify-between">
                <Select defaultValue="september">
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="august">August 2023</SelectItem>
                    <SelectItem value="september">September 2023</SelectItem>
                    <SelectItem value="october">October 2023</SelectItem>
                    <SelectItem value="november">November 2023</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2 text-xs items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 bg-blue-500/20 border border-blue-500/30"></div>
                    <span>0-1</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 bg-blue-500/40 border border-blue-500/50"></div>
                    <span>2-3</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 bg-blue-500/60 border border-blue-500/70"></div>
                    <span>4-5</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 bg-blue-500/80 text-primary-foreground"></div>
                    <span>6+</span>
                  </div>
                </div>
              </div>
              <div className="h-[235px] overflow-hidden mb-3">
                {/* Fixed grid layout with proper alignment */}
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '100px repeat(7, 1fr)', gridGap: '4px' }}>
                  {/* Header row with weekdays */}
                  <div className="text-xs text-muted-foreground"></div>
                  <div className="text-xs font-medium text-center">Sunday</div>
                  <div className="text-xs font-medium text-center">Monday</div>
                  <div className="text-xs font-medium text-center">Tuesday</div>
                  <div className="text-xs font-medium text-center">Wednesday</div>
                  <div className="text-xs font-medium text-center">Thursday</div>
                  <div className="text-xs font-medium text-center">Friday</div>
                  <div className="text-xs font-medium text-center">Saturday</div>
                  
                  {/* Morning row */}
                  <div className="text-xs font-medium flex items-center justify-start pr-2">Morning<br/>(6AM-9AM)</div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">3</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">3</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">2</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">2</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">2</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>

                  {/* Midday row */}
                  <div className="text-xs font-medium flex items-center justify-start pr-2">Midday<br/>(10AM-12PM)</div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">2</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/60 border border-blue-500/70 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">5</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/60 border border-blue-500/70 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">4</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/60 border border-blue-500/70 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">5</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">3</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">3</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>

                  {/* Afternoon row */}
                  <div className="text-xs font-medium flex items-center justify-start pr-2">Afternoon<br/>(1PM-4PM)</div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/80 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-white text-right">7</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/60 border border-blue-500/70 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">5</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/80 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-white text-right">6</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/60 border border-blue-500/70 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">4</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">2</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>

                  {/* Evening row */}
                  <div className="text-xs font-medium flex items-center justify-start pr-2">Evening<br/>(5PM-8PM)</div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/60 border border-blue-500/70 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">4</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">3</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/40 border border-blue-500/50 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">3</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/80 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-white text-right">6</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>

                  {/* Night row */}
                  <div className="text-xs font-medium flex items-center justify-start pr-2">Night<br/>(9PM-12AM)</div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>

                  {/* Early AM row */}
                  <div className="text-xs font-medium flex items-center justify-start pr-2">Early AM<br/>(1AM-5AM)</div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                  <div className="p-1 rounded-md bg-blue-500/20 border border-blue-500/30 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">1</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                  <div className="p-1 rounded-md opacity-10 h-[32px] flex flex-col justify-between">
                    <div className="text-[10px] opacity-80"></div>
                    <div className="text-xs font-bold text-right">0</div>
                  </div>
                </div>
              </div>
              <div className="mb-6 my-3 grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-md p-2">
                  <div className="text-xs text-muted-foreground mb-1">Monthly Summary</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Reports Scheduled</span>
                    <span className="text-sm font-bold">78</span>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-md p-2">
                  <div className="text-xs text-muted-foreground mb-1">Peak Time</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monday, 1PM-4PM</span>
                    <span className="text-sm font-medium text-blue-500">7 reports</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports Tab */} 
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automatically generated reports on schedule</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search scheduled..."
                        className="w-[200px] pl-8"
                        value={scheduledSearchTerm}
                        onChange={handleScheduledSearch}
                      />
                </div>
                <Select 
                  value={scheduledPageSize.toString()} 
                  onValueChange={(value) => {
                    setScheduledPageSize(parseInt(value));
                    setCurrentScheduledPage(1);
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="15">15 per page</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={scheduledStatusFilter} 
                  onValueChange={setScheduledStatusFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-0 pb-0">
                {(() => {
                  const filteredReports = getFilteredScheduledReports();
                  const totalReports = filteredReports.length;
                  const totalPages = Math.ceil(totalReports / scheduledPageSize);
                  const startIndex = (currentScheduledPage - 1) * scheduledPageSize;
                  const paginatedReports = filteredReports.slice(startIndex, startIndex + scheduledPageSize);

                  if (paginatedReports.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center h-64 p-6">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-center mb-2">No scheduled reports found</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          {scheduledSearchTerm || scheduledStatusFilter !== "all" 
                            ? "Try adjusting your search filters to find what you're looking for." 
                            : "Get started by scheduling your first report."}
                        </p>
                        {!scheduledSearchTerm && scheduledStatusFilter === "all" && (
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule New Report
                          </Button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div>
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th className="py-3 px-4 text-left font-medium w-[40px]">
                                <input
                                  type="checkbox"
                                  checked={selectedScheduledReports.length === paginatedReports.length && paginatedReports.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedScheduledReports(paginatedReports.map((r: {id: string}) => r.id.toString()));
                                    } else {
                                      setSelectedScheduledReports([]);
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </th>
                              <th className="py-3 px-4 text-left font-medium w-[100px]">ID</th>
                              <th className="py-3 px-4 text-left font-medium">Name</th>
                              <th className="py-3 px-4 text-left font-medium">Type</th>
                              <th className="py-3 px-4 text-left font-medium">Frequency</th>
                              <th className="py-3 px-4 text-left font-medium">Next Run</th>
                              <th className="py-3 px-4 text-left font-medium">Recipients</th>
                              <th className="py-3 px-4 text-left font-medium">Format</th>
                              <th className="py-3 px-4 text-left font-medium">Status</th>
                              <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {paginatedReports.map((report: {
                               id: string;
                               name: string;
                               type: string;
                               frequency: string;
                               nextRun: string;
                               recipients: string;
                               format: string;
                               status: string;
                             }) => {
                              const statusColor = report.status === 'active' ? 'green' : 'amber';
                              const statusLabel = report.status.charAt(0).toUpperCase() + report.status.slice(1);
                              
                              return (
                                <tr 
                                  key={report.id} 
                                  className="hover:bg-muted/50 transition-colors"
                                >
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedScheduledReports.includes(report.id.toString())}
                                      onChange={() => handleToggleScheduledReportSelection(report.id.toString())}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                  </td>
                                  <td className="py-3 px-4 text-sm">{report.id}</td>
                                  <td className="py-3 px-4">
                                    <div className="font-medium flex items-center">
                                      <FileText className="h-4 w-4 mr-2 text-primary" />
                                      {report.name}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-sm">{report.type}</td>
                                  <td className="py-3 px-4 text-sm">{report.frequency}</td>
                                  <td className="py-3 px-4 text-sm">{report.nextRun}</td>
                                  <td className="py-3 px-4 text-sm">{report.recipients}</td>
                                  <td className="py-3 px-4 text-sm">{report.format}</td>
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
                                        onClick={() => {}} 
                                        className="h-8 w-8"
                                        title="View Details"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => {}} 
                                        className="h-8 w-8"
                                        title="Edit Schedule"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => {}} 
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        title="Delete Schedule"
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
                      
                      <div className="border-t mt-4">
                        <div className="flex items-center justify-between py-4 px-6">
                          <div className="flex-1 text-sm text-muted-foreground">
                            Showing {Math.min((currentScheduledPage - 1) * scheduledPageSize + 1, totalReports)} to {Math.min(currentScheduledPage * scheduledPageSize, totalReports)} of {totalReports} {totalReports === 1 ? 'scheduled report' : 'scheduled reports'}
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleScheduledPageChange(1)}
                                disabled={currentScheduledPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleScheduledPageChange(currentScheduledPage - 1)}
                                disabled={currentScheduledPage === 1}
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
                                    variant={currentScheduledPage === i+1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handleScheduledPageChange(i+1)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${i+1}`}
                                    aria-current={currentScheduledPage === i+1 ? "page" : undefined}
                                  >
                                    {i+1}
                                  </Button>
                                ))
                              ) : (
                                // Show limited pages with ellipsis
                                <>
                                  <Button
                                    variant={currentScheduledPage === 1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handleScheduledPageChange(1)}
                                    className="h-8 w-8"
                                    aria-label="Page 1"
                                  >
                                    1
                                  </Button>
                                  
                                  {currentScheduledPage > 3 && <span className="mx-1">...</span>}
                                  
                                  {currentScheduledPage > 2 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleScheduledPageChange(currentScheduledPage - 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentScheduledPage - 1}`}
                                    >
                                      {currentScheduledPage - 1}
                                    </Button>
                                  )}
                                  
                                  {currentScheduledPage !== 1 && currentScheduledPage !== totalPages && (
                                    <Button
                                      variant="default"
                                      size="icon"
                                      onClick={() => handleScheduledPageChange(currentScheduledPage)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentScheduledPage}`}
                                      aria-current="page"
                                    >
                                      {currentScheduledPage}
                                    </Button>
                                  )}
                                  
                                  {currentScheduledPage < totalPages - 1 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleScheduledPageChange(currentScheduledPage + 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentScheduledPage + 1}`}
                                    >
                                      {currentScheduledPage + 1}
                                    </Button>
                                  )}
                                  
                                  {currentScheduledPage < totalPages - 2 && <span className="mx-1">...</span>}
                                  
                                  <Button
                                    variant={currentScheduledPage === totalPages ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handleScheduledPageChange(totalPages)}
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
                                onClick={() => handleScheduledPageChange(currentScheduledPage + 1)}
                                disabled={currentScheduledPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleScheduledPageChange(totalPages)}
                                disabled={currentScheduledPage === totalPages}
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
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Custom Report Builder Tab */}
        <TabsContent value="builder">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>Create customized reports based on specific criteria</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button className="w-full md:w-auto" onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Custom Report
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Report Configuration - Left Column */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Report Configuration</h3>
                    
                    {/* Report Type */}
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select defaultValue="operations">
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">Operations Report</SelectItem>
                          <SelectItem value="fleet">Fleet Management</SelectItem>
                          <SelectItem value="delivery">Delivery Performance</SelectItem>
                          <SelectItem value="customer">Customer Analytics</SelectItem>
                          <SelectItem value="financial">Financial Summary</SelectItem>
                          <SelectItem value="inventory">Inventory Status</SelectItem>
                          <SelectItem value="custom">Custom SQL Query</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Date Range */}
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="from-date" className="text-xs">From</Label>
                          <Input id="from-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="to-date" className="text-xs">To</Label>
                          <Input id="to-date" type="date" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button variant="outline" size="sm">Today</Button>
                        <Button variant="outline" size="sm">This Week</Button>
                        <Button variant="outline" size="sm">This Month</Button>
                        <Button variant="outline" size="sm">This Quarter</Button>
                        <Button variant="outline" size="sm">Year to Date</Button>
                      </div>
                    </div>
                    
                    {/* Format Options */}
                    <div className="space-y-2">
                      <Label>Export Format</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="format-pdf" />
                          <Label htmlFor="format-pdf" className="text-sm">PDF</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="format-excel" defaultChecked />
                          <Label htmlFor="format-excel" className="text-sm">Excel</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="format-csv" />
                          <Label htmlFor="format-csv" className="text-sm">CSV</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="format-json" />
                          <Label htmlFor="format-json" className="text-sm">JSON</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="format-html" />
                          <Label htmlFor="format-html" className="text-sm">HTML</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="format-image" />
                          <Label htmlFor="format-image" className="text-sm">Image</Label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Advanced Options */}
                    <Collapsible className="w-full">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="flex w-full justify-between p-0">
                          <span>Advanced Options</span>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 space-y-4">
                        {/* Aggregation */}
                        <div className="space-y-2">
                          <Label>Data Aggregation</Label>
                          <Select defaultValue="none">
                            <SelectTrigger>
                              <SelectValue placeholder="Select aggregation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Aggregation</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Sorting */}
                        <div className="space-y-2">
                          <Label>Sort By</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Select defaultValue="date">
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="value">Value</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="location">Location</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select defaultValue="desc">
                              <SelectTrigger>
                                <SelectValue placeholder="Order" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Limit Results */}
                        <div className="space-y-2">
                          <Label htmlFor="limit-results">Limit Results</Label>
                          <Input id="limit-results" type="number" placeholder="1000" />
                        </div>
                        
                        {/* Include Historical Data */}
                        <div className="flex items-center space-x-2">
                          <Switch id="historical-data" />
                          <Label htmlFor="historical-data">Include Historical Comparison</Label>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-center space-x-2">
                          <Switch id="schedule-report" />
                          <Label htmlFor="schedule-report">Schedule this Report</Label>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
                
                {/* Data Selection - Right Column */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Selection</h3>
                    
                    {/* Data Sections */}
                    <div className="space-y-2">
                      <Label>Include Sections</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-summary" defaultChecked />
                            <Label htmlFor="include-summary">Executive Summary</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-charts" defaultChecked />
                            <Label htmlFor="include-charts">Charts & Visualizations</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-tables" defaultChecked />
                            <Label htmlFor="include-tables">Data Tables</Label>
                          </div>
                        </div>
                          <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-trends" />
                            <Label htmlFor="include-trends">Trend Analysis</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-forecasts" />
                            <Label htmlFor="include-forecasts">Forecasts & Predictions</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-anomalies" />
                            <Label htmlFor="include-anomalies">Anomaly Detection</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visualization Types */}
                    <div className="space-y-2">
                      <Label>Visualization Types</Label>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="viz-bar" defaultChecked />
                          <Label htmlFor="viz-bar" className="text-sm">Bar Charts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="viz-line" defaultChecked />
                          <Label htmlFor="viz-line" className="text-sm">Line Charts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="viz-pie" />
                          <Label htmlFor="viz-pie" className="text-sm">Pie Charts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="viz-scatter" />
                          <Label htmlFor="viz-scatter" className="text-sm">Scatter Plots</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="viz-map" />
                          <Label htmlFor="viz-map" className="text-sm">Geographic Maps</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="viz-heat" />
                          <Label htmlFor="viz-heat" className="text-sm">Heat Maps</Label>
                        </div>
                      </div>
                    </div>

                    {/* Data Filters */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Data Filters</Label>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Filter
                        </Button>
                      </div>
                      
                      <div className="space-y-3 border rounded-md p-3">
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-5">
                            <Select defaultValue="status">
                              <SelectTrigger>
                                <SelectValue placeholder="Field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="location">Location</SelectItem>
                                <SelectItem value="vehicle">Vehicle Type</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Select defaultValue="equals">
                              <SelectTrigger>
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="starts">Starts with</SelectItem>
                                <SelectItem value="ends">Ends with</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4">
                            <Input placeholder="Value" defaultValue="Completed" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-5">
                            <Select defaultValue="vehicle">
                              <SelectTrigger>
                                <SelectValue placeholder="Field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="location">Location</SelectItem>
                                <SelectItem value="vehicle">Vehicle Type</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Select defaultValue="equals">
                              <SelectTrigger>
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="starts">Starts with</SelectItem>
                                <SelectItem value="ends">Ends with</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4">
                            <Input placeholder="Value" defaultValue="Truck" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced SQL Query */}
              <div className="mt-6 border-t pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Custom SQL Query</h3>
                    <Switch id="enable-sql" />
                  </div>
                  <Textarea 
                    className="font-mono text-sm h-32" 
                    placeholder="SELECT * FROM deliveries WHERE status = 'completed' AND delivery_date BETWEEN '2023-01-01' AND '2023-12-31'" 
                  />
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileCode className="h-4 w-4 mr-1" />
                      Load Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Validate Query
                    </Button>
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div className="mt-6 border-t pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Report Preview</h3>
                  <div className="rounded-md border overflow-hidden h-[300px] flex items-center justify-center bg-muted/50">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Configure your report and click "Generate" to preview</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Eye className="h-4 w-4 mr-1" />
                        Quick Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Report Options */}
              <div className="mt-6 border-t pt-6">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="watermark" />
                    <Label htmlFor="watermark">Add Company Watermark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="encrypt" />
                    <Label htmlFor="encrypt">Encrypt Report</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="save-template" />
                    <Label htmlFor="save-template">Save as Template</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="email" defaultChecked />
                    <Label htmlFor="email">Email when Complete</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 justify-between">
              <div>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save Draft
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}