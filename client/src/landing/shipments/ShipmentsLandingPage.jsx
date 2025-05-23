"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  Package,
  Globe,
  Truck,
  BarChart2,
  AlertCircle,
  Search,
  FileText,
  Ship,
  Plane,
  Train,
  Clock,
  CheckCircle2,
} from "lucide-react"
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function ShipmentsLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/shipments/tracking")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Global Shipment Management
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Track and manage your shipments with real-time updates, comprehensive analytics, and end-to-end visibility
              across your global supply chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold bg-blue-700 hover:bg-blue-800"
              >
                Track Shipments <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/shipments/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl bg-card">
              <div className="absolute inset-0">
                <ShipmentTrackingVisualization />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Search */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Track Your Shipment</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter tracking number"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button className="bg-blue-700 hover:bg-blue-800 py-3">Track Now</Button>
          </div>
        </div>
      </div>

      {/* Shipment Types */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comprehensive Shipment Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ShipmentTypeCard
              icon={<Truck />}
              title="Road Freight"
              description="Efficient ground transportation with real-time tracking and delivery updates."
            />
            <ShipmentTypeCard
              icon={<Ship />}
              title="Ocean Freight"
              description="Global sea shipping with container tracking and port-to-port visibility."
            />
            <ShipmentTypeCard
              icon={<Plane />}
              title="Air Freight"
              description="Express air shipping for time-sensitive cargo with priority handling."
            />
            <ShipmentTypeCard
              icon={<Train />}
              title="Rail Freight"
              description="Cost-effective rail transportation for large volume shipments."
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Shipment Management Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Globe />}
            title="Global Visibility"
            description="Track shipments across continents with real-time location updates and status changes."
          >
            <div className="h-40 mt-4">
              <ShipmentStatusChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<AlertCircle />}
            title="Proactive Alerts"
            description="Receive instant notifications about delays, exceptions, and delivery confirmations."
          />
          <FeatureCard
            icon={<BarChart2 />}
            title="Performance Analytics"
            description="Analyze carrier performance, transit times, and shipping costs with detailed reports."
          >
            <div className="h-40 mt-4">
              <ShipmentPerformanceChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<FileText />}
            title="Document Management"
            description="Store and access all shipping documents, customs forms, and certificates in one place."
          />
          <FeatureCard
            icon={<Clock />}
            title="Estimated Delivery"
            description="Get accurate delivery time predictions based on historical data and current conditions."
          />
          <FeatureCard
            icon={<Package />}
            title="Package Details"
            description="Track detailed information about each package including dimensions, weight, and contents."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trusted by Global Shippers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="5M+" label="Shipments Tracked Monthly" />
            <StatCard number="99.8%" label="Tracking Accuracy" />
            <StatCard number="32%" label="Reduction in Transit Delays" />
            <StatCard number="120+" label="Countries Covered" />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">End-to-End Shipment Visibility</h2>
        <div className="max-w-4xl mx-auto">
          <ShipmentTimeline />
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shipment Management for Every Business</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard
              title="E-commerce"
              description="Provide customers with accurate delivery estimates and real-time tracking information."
            />
            <UseCaseCard
              title="Manufacturing"
              description="Ensure timely delivery of components and raw materials to maintain production schedules."
            />
            <UseCaseCard
              title="Wholesale Distribution"
              description="Manage bulk shipments to retailers with efficient routing and delivery coordination."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Shipment Management?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join thousands of businesses that have improved visibility and efficiency with our shipment tracking
            platform.
          </p>
          <Button
            onClick={handleGoToDashboard}
            size="lg"
            className="text-md px-10 py-6 h-auto font-semibold bg-blue-700 hover:bg-blue-800"
          >
            Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ShipmentTypeCard({ icon, title, description }) {
  return (
    <Card className="border border-blue-100 bg-white transition-all duration-200 hover:shadow-md text-center">
      <CardHeader className="pb-2">
        <div className="mx-auto h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-700 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ icon, title, description, children }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-blue-500/20 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-700 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        {children}
      </CardContent>
    </Card>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 rounded-lg bg-white border border-blue-100 shadow-sm">
      <p className="text-4xl md:text-5xl font-bold text-blue-700 mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function UseCaseCard({ title, description }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-blue-500/20 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

// Shipment Tracking Visualization
function ShipmentTrackingVisualization() {
  return (
    <div className="relative h-full w-full bg-[#f8fafc] overflow-hidden">
      {/* World Map Background */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] bg-cover opacity-30"></div>

      {/* Map Overlay */}
      <div className="absolute inset-0 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Global Shipment Tracker</h3>
          <span className="text-sm text-muted-foreground">42 Active Shipments</span>
        </div>

        {/* Shipment Visualization */}
        <div className="relative h-[320px]">
          {/* Shipment Routes - Simplified visualization */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 320" fill="none">
            {/* Route 1: Asia to North America */}
            <path
              d="M500,120 C400,100 300,110 200,130 C100,150 50,180 20,160"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 4"
              fill="none"
            />

            {/* Route 2: Europe to South America */}
            <path
              d="M350,80 C300,120 250,160 200,200 C150,240 100,260 50,240"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 4"
              fill="none"
            />

            {/* Route 3: North America to Europe */}
            <path
              d="M100,100 C150,80 200,70 250,60 C300,50 350,60 400,80"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 4"
              fill="none"
            />

            {/* Origin Points */}
            <circle cx="500" cy="120" r="8" fill="#3b82f6" />
            <circle cx="350" cy="80" r="8" fill="#6366f1" />
            <circle cx="100" cy="100" r="8" fill="#8b5cf6" />

            {/* Destination Points */}
            <circle cx="20" cy="160" r="8" fill="#3b82f6" />
            <circle cx="50" cy="240" r="8" fill="#6366f1" />
            <circle cx="400" cy="80" r="8" fill="#8b5cf6" />

            {/* Shipment Points */}
            <circle cx="300" cy="110" r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
            <circle cx="250" cy="160" r="6" fill="#6366f1" stroke="white" strokeWidth="2" />
            <circle cx="200" cy="70" r="6" fill="#8b5cf6" stroke="white" strokeWidth="2" />
          </svg>

          {/* Shipment Stats */}
          <div className="absolute bottom-0 left-0 right-0 grid grid-cols-1 gap-4">
            <div className="bg-white/90 p-4 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm font-medium">Shanghai to Los Angeles</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                  In Transit
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Shipment #SH38291</span>
                <span>ETA: May 24, 2025</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShipmentStatusChart() {
  const data = [
    { name: "On Time", value: 75 },
    { name: "Delayed", value: 15 },
    { name: "Exception", value: 7 },
    { name: "Lost", value: 3 },
  ]

  const COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={60}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value}%`, "Percentage"]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function ShipmentPerformanceChart() {
  const data = [
    { name: "Jan", shipments: 420, onTime: 92 },
    { name: "Feb", shipments: 480, onTime: 94 },
    { name: "Mar", shipments: 520, onTime: 91 },
    { name: "Apr", shipments: 550, onTime: 95 },
    { name: "May", shipments: 600, onTime: 97 },
    { name: "Jun", shipments: 650, onTime: 98 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[80, 100]}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="shipments"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Total Shipments"
        />
        <Line yAxisId="right" type="monotone" dataKey="onTime" stroke="#22c55e" strokeWidth={2} name="On-Time %" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ShipmentTimeline() {
  const steps = [
    {
      title: "Order Placed",
      description: "Shipment request received and processed",
      icon: <Package className="h-6 w-6" />,
      status: "complete",
    },
    {
      title: "Picked Up",
      description: "Shipment collected from origin location",
      icon: <Truck className="h-6 w-6" />,
      status: "complete",
    },
    {
      title: "In Transit",
      description: "Shipment is on the way to destination",
      icon: <Ship className="h-6 w-6" />,
      status: "current",
    },
    {
      title: "Customs Clearance",
      description: "Shipment processing through customs",
      icon: <FileText className="h-6 w-6" />,
      status: "upcoming",
    },
    {
      title: "Out for Delivery",
      description: "Shipment is out for final delivery",
      icon: <Truck className="h-6 w-6" />,
      status: "upcoming",
    },
    {
      title: "Delivered",
      description: "Shipment successfully delivered",
      icon: <CheckCircle2 className="h-6 w-6" />,
      status: "upcoming",
    },
  ]

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-100"></div>

      {/* Timeline Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start">
            <div
              className={`absolute left-8 -translate-x-1/2 h-4 w-4 rounded-full border-2 ${
                step.status === "complete"
                  ? "bg-blue-600 border-blue-600"
                  : step.status === "current"
                    ? "bg-white border-blue-600"
                    : "bg-white border-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center h-16 w-16 rounded-full ${
                step.status === "complete"
                  ? "bg-blue-100 text-blue-600"
                  : step.status === "current"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {step.icon}
            </div>
            <div className="ml-4 pt-1">
              <h3 className={`text-lg font-semibold ${step.status === "upcoming" ? "text-gray-400" : "text-gray-900"}`}>
                {step.title}
              </h3>
              <p className={`text-sm ${step.status === "upcoming" ? "text-gray-400" : "text-gray-500"}`}>
                {step.description}
              </p>
              {step.status === "complete" && (
                <span className="inline-flex items-center mt-1 text-xs font-medium text-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                </span>
              )}
              {step.status === "current" && (
                <span className="inline-flex items-center mt-1 text-xs font-medium text-amber-600">
                  <Clock className="h-3 w-3 mr-1" /> In Progress
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShipmentsLandingPage
