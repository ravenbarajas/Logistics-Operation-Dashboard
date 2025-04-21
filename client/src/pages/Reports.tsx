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
  RefreshCw
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
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
        
        {/* Recent Reports Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Recently generated reports with download links</CardDescription>
              </div>
              <div className="flex gap-2">
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
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredReports(reports).length > 0 ? (
                    getFilteredReports(reports).map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            report.category === 'operations' ? 'default' : 
                            report.category === 'fleet' ? 'secondary' : 
                            report.category === 'customer' ? 'success' : 
                            'warning'
                          }>
                            {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell>{report.author}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleReportDownload(report)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No reports found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredReports(reports).length} of {reports.length} reports
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Report Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Standard report templates for quick generation</CardDescription>
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
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automatically generated reports on schedule</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Report
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Weekly Operations Summary</TableCell>
                    <TableCell>Operations</TableCell>
                    <TableCell>Weekly (Monday)</TableCell>
                    <TableCell>Aug 28, 2023</TableCell>
                    <TableCell>5 recipients</TableCell>
                    <TableCell>PDF</TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
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
                          <DropdownMenuItem>Edit schedule</DropdownMenuItem>
                          <DropdownMenuItem>View recipients</DropdownMenuItem>
                          <DropdownMenuItem>Run now</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Disable schedule</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monthly Fleet Report</TableCell>
                    <TableCell>Fleet</TableCell>
                    <TableCell>Monthly (1st)</TableCell>
                    <TableCell>Sep 1, 2023</TableCell>
                    <TableCell>3 recipients</TableCell>
                    <TableCell>PDF, CSV</TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
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
                          <DropdownMenuItem>Edit schedule</DropdownMenuItem>
                          <DropdownMenuItem>View recipients</DropdownMenuItem>
                          <DropdownMenuItem>Run now</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Disable schedule</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Daily Delivery Exceptions</TableCell>
                    <TableCell>Delivery</TableCell>
                    <TableCell>Daily (6PM)</TableCell>
                    <TableCell>Today</TableCell>
                    <TableCell>7 recipients</TableCell>
                    <TableCell>PDF</TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
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
                          <DropdownMenuItem>Edit schedule</DropdownMenuItem>
                          <DropdownMenuItem>View recipients</DropdownMenuItem>
                          <DropdownMenuItem>Run now</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Disable schedule</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing 3 scheduled reports
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Custom Report Builder Tab */}
        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create customized reports based on specific criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Report Type</label>
                  <Select defaultValue="performance" onValueChange={setSelectedReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Analysis</SelectItem>
                      <SelectItem value="fleet">Fleet Utilization</SelectItem>
                      <SelectItem value="delivery">Delivery Metrics</SelectItem>
                      <SelectItem value="cost">Cost Analysis</SelectItem>
                      <SelectItem value="customer">Customer Satisfaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Input type="text" placeholder="From date" value="01/08/2023" readOnly />
                    </div>
                    <div className="relative">
                      <Input type="text" placeholder="To date" value="31/08/2023" readOnly />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Format</label>
                  <Select defaultValue="pdf" onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-2">Data Sections</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="overview" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="overview" className="text-sm">Executive Overview</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="metrics" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="metrics" className="text-sm">Key Metrics</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="trends" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="trends" className="text-sm">Trend Analysis</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="recommendations" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="recommendations" className="text-sm">Recommendations</label>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-3 flex justify-end mt-4">
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
              </div>

              {selectedReportType && (
                <div className="mt-8 border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Report Preview</h4>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center mb-4">
                      <div className={`h-10 w-10 rounded-md mr-3 flex items-center justify-center ${
                        selectedFormat === 'pdf' ? 'bg-red-100 text-red-700' :
                        selectedFormat === 'csv' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedFormat === 'pdf' ? <FileText className="h-6 w-6" /> :
                         selectedFormat === 'csv' ? <FileText className="h-6 w-6" /> :
                         <Database className="h-6 w-6" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedReportType === 'performance' ? 'Performance Analysis Report' :
                           selectedReportType === 'fleet' ? 'Fleet Utilization Report' :
                           selectedReportType === 'delivery' ? 'Delivery Metrics Report' :
                           selectedReportType === 'cost' ? 'Cost Analysis Report' :
                           'Customer Satisfaction Report'
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedFormat.toUpperCase()} format • Data from 01/08/2023 to 31/08/2023
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded w-4/5"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}