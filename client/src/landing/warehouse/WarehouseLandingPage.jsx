"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  Package,
  BarChart2,
  Search,
  Truck,
  WarehouseIcon,
  ClipboardList,
  QrCode,
  TrendingUp,
  Clock,
  Layers,
  ArrowDownUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function WarehouseLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/warehouse/warehouses")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
              Intelligent Warehouse Management
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Optimize your inventory, streamline operations, and gain real-time visibility into your warehouse
              performance with our comprehensive management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold bg-orange-600 hover:bg-orange-700"
              >
                Manage Warehouse <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => navigate("/warehouse/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl dark:shadow-lg dark:shadow-orange-500/20 bg-card">
              <div className="absolute inset-0 p-6">
                <WarehouseDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Search */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-orange-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Find Inventory Items</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter SKU, product name, or location"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700 py-3">Search</Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-orange-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Benefits of Warehouse Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<TrendingUp />}
              title="Increase Efficiency"
              description="Optimize picking routes, reduce travel time, and streamline warehouse operations."
              stat="35%"
              statLabel="Productivity Increase"
            />
            <BenefitCard
              icon={<Package />}
              title="Inventory Accuracy"
              description="Maintain accurate inventory levels with real-time tracking and automated cycle counts."
              stat="99.8%"
              statLabel="Inventory Accuracy"
            />
            <BenefitCard
              icon={<Clock />}
              title="Faster Fulfillment"
              description="Reduce order processing time and improve on-time delivery performance."
              stat="42%"
              statLabel="Faster Order Processing"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Comprehensive Warehouse Management Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Package />}
            title="Inventory Management"
            description="Track inventory levels, locations, and movements with real-time visibility."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-orange-500/20">
              <InventoryLevelChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<WarehouseIcon />}
            title="Space Utilization"
            description="Optimize warehouse layout and storage to maximize space utilization."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-orange-500/20">
              <SpaceUtilizationChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<ClipboardList />}
            title="Order Fulfillment"
            description="Streamline picking, packing, and shipping processes for faster order fulfillment."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-orange-500/20">
              <OrderFulfillmentChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<QrCode />}
            title="Barcode & RFID"
            description="Implement barcode and RFID scanning for accurate inventory tracking and movement."
          />
          <FeatureCard
            icon={<BarChart2 />}
            title="Analytics & Reporting"
            description="Gain insights into warehouse performance with comprehensive analytics and reports."
          />
          <FeatureCard
            icon={<Truck />}
            title="Receiving & Shipping"
            description="Manage inbound and outbound logistics with streamlined processes and documentation."
          />
        </div>
      </div>

      {/* Warehouse Layout Visualization */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Optimize Your Warehouse Layout</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Visualize your warehouse layout, identify bottlenecks, and optimize storage locations for maximum
            efficiency.
          </p>
          <div className="max-w-5xl mx-auto">
            <div className="shadow-xl dark:shadow-lg dark:shadow-orange-500/20">
              <WarehouseLayoutVisualization />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Driving Warehouse Excellence</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard number="42%" label="Reduction in Picking Time" />
          <StatCard number="3.5x" label="Return on Investment" />
          <StatCard number="28%" label="Increase in Storage Capacity" />
          <StatCard number="65%" label="Reduction in Errors" />
        </div>
      </div>

      {/* Inventory Management Process */}
      <div className="bg-orange-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Streamlined Inventory Management Process</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ProcessCard
                number="1"
                title="Receiving"
                description="Efficiently receive and log incoming inventory with barcode scanning and quality control."
                icon={<Truck />}
              />
              <ProcessCard
                number="2"
                title="Storage"
                description="Optimize storage locations based on item characteristics and picking frequency."
                icon={<Layers />}
              />
              <ProcessCard
                number="3"
                title="Picking"
                description="Streamline order picking with optimized routes and batch picking capabilities."
                icon={<ClipboardList />}
              />
              <ProcessCard
                number="4"
                title="Shipping"
                description="Automate packing, labeling, and shipping processes for faster fulfillment."
                icon={<ArrowDownUp />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Warehouse Management for Every Industry</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UseCaseCard
            title="E-commerce"
            description="Manage high-volume order fulfillment with efficient picking, packing, and shipping processes."
            icon={<ShoppingCart />}
          />
          <UseCaseCard
            title="Manufacturing"
            description="Track raw materials, work-in-progress, and finished goods inventory with real-time visibility."
            icon={<Factory />}
          />
          <UseCaseCard
            title="Distribution"
            description="Optimize cross-docking, wave picking, and zone routing for efficient distribution operations."
            icon={<Network />}
          />
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-100">
              <div className="flex flex-col items-center text-center">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg italic mb-6">
                  "This platform has transformed our warehouse operations. We've increased picking efficiency by 45%,
                  reduced errors by 78%, and significantly improved inventory accuracy. The real-time visibility and
                  analytics have been game-changers for our business."
                </p>
                <p className="font-semibold text-orange-800">Michael Rodriguez</p>
                <p className="text-sm text-muted-foreground">Warehouse Operations Director, Global Distribution Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Warehouse Operations?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join hundreds of companies that have optimized their warehouse management and improved efficiency with our
            platform.
          </p>
          <Button
            onClick={handleGoToDashboard}
            size="lg"
            className="text-md px-10 py-6 h-auto font-semibold bg-orange-600 hover:bg-orange-700"
          >
            Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, children }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-orange-500/20 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
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

function BenefitCard({ icon, title, description, stat, statLabel }) {
  return (
    <Card className="border border-orange-100 bg-white transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">{description}</CardDescription>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-orange-600">{stat}</span>
          <span className="text-sm text-muted-foreground">{statLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 rounded-lg bg-white border border-orange-100 shadow-sm">
      <p className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function ProcessCard({ number, title, description, icon }) {
  return (
    <div className="text-center">
      <div className="relative mx-auto mb-4">
        <div className="h-16 w-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold mx-auto">
          {number}
        </div>
        <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-600">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function UseCaseCard({ title, description, icon }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-orange-500/20 hover:shadow-md">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

// Custom Icons
function Star(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ShoppingCart(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function Factory(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  )
}

function Network(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  )
}

// Warehouse Dashboard
function WarehouseDashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Warehouse Management Dashboard</h3>
        <span className="text-sm text-muted-foreground">Last updated: Today</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <WarehouseMetricCard
          title="Inventory Items"
          value="12,547"
          change="+124"
          icon={<Package className="h-5 w-5" />}
          color="orange"
        />
        <WarehouseMetricCard
          title="Space Utilization"
          value="78%"
          change="+5%"
          icon={<WarehouseIcon className="h-5 w-5" />}
          color="blue"
        />
        <WarehouseMetricCard
          title="Orders Pending"
          value="42"
          change="-8"
          icon={<ClipboardList className="h-5 w-5" />}
          color="green"
        />
        <WarehouseMetricCard
          title="Low Stock Items"
          value="18"
          status="Requires Attention"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
        />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Inventory by Category</h4>
          <div className="h-[160px] shadow-xl dark:shadow-lg dark:shadow-orange-500/20">
            <InventoryCategoryChart />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Daily Order Volume</h4>
          <div className="h-[160px] shadow-xl dark:shadow-lg dark:shadow-orange-500/20">
            <OrderVolumeChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function WarehouseMetricCard({ title, value, change, status, icon, color }) {
  const getColorClass = (color) => {
    const colorMap = {
      orange: "bg-orange-500/10 text-orange-600",
      blue: "bg-blue-500/10 text-blue-600",
      green: "bg-green-500/10 text-green-600",
      red: "bg-red-500/10 text-red-600",
    }
    return colorMap[color] || "bg-orange-500/10 text-orange-600"
  }

  const isPositive = change && change.startsWith("+")
  const changeColor = isPositive ? "text-green-600" : "text-red-600"

  return (
    <div className="rounded-lg border border-border/40 p-3 flex items-center gap-3">
      <div className={`rounded-full p-2 ${getColorClass(color)}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold">{value}</p>
          {change && <span className={`text-xs ${changeColor}`}>{change}</span>}
          {status && <span className="text-xs text-red-500">{status}</span>}
        </div>
      </div>
    </div>
  )
}

function InventoryCategoryChart() {
  const data = [
    { name: "Electronics", value: 35 },
    { name: "Apparel", value: 25 },
    { name: "Home Goods", value: 20 },
    { name: "Sporting", value: 15 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"]

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
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function OrderVolumeChart() {
  const data = [
    { name: "Mon", orders: 65 },
    { name: "Tue", orders: 78 },
    { name: "Wed", orders: 82 },
    { name: "Thu", orders: 75 },
    { name: "Fri", orders: 85 },
    { name: "Sat", orders: 45 },
    { name: "Sun", orders: 30 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value} orders`, "Volume"]}
        />
        <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function InventoryLevelChart() {
  const data = [
    { name: "Jan", stock: 1200 },
    { name: "Feb", stock: 1400 },
    { name: "Mar", stock: 1800 },
    { name: "Apr", stock: 1600 },
    { name: "May", stock: 2000 },
    { name: "Jun", stock: 2400 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value} units`, "Inventory"]}
        />
        <Area type="monotone" dataKey="stock" stroke="#f97316" fillOpacity={1} fill="url(#colorStock)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function SpaceUtilizationChart() {
  const data = [
    { name: "Zone A", used: 85, available: 15 },
    { name: "Zone B", used: 70, available: 30 },
    { name: "Zone C", used: 90, available: 10 },
    { name: "Zone D", used: 65, available: 35 },
    { name: "Zone E", used: 75, available: 25 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 70, bottom: 5 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={65}
          tickFormatter={(value) => (value.length > 8 ? `${value.substring(0, 8)}...` : value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value}%`, "Percentage"]}
        />
        <Legend />
        <Bar dataKey="used" stackId="a" fill="#f97316" name="Used" />
        <Bar dataKey="available" stackId="a" fill="#fed7aa" name="Available" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function OrderFulfillmentChart() {
  const data = [
    { name: "Jan", onTime: 92, delayed: 8 },
    { name: "Feb", onTime: 94, delayed: 6 },
    { name: "Mar", onTime: 91, delayed: 9 },
    { name: "Apr", onTime: 95, delayed: 5 },
    { name: "May", onTime: 97, delayed: 3 },
    { name: "Jun", onTime: 98, delayed: 2 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value}%`, "Percentage"]}
        />
        <Legend />
        <Line type="monotone" dataKey="onTime" stroke="#22c55e" strokeWidth={2} name="On-Time" />
        <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} name="Delayed" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function WarehouseLayoutVisualization() {
  return (
    <div className="bg-white rounded-xl border border-orange-100 p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Warehouse Layout & Utilization</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm">High Utilization</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span className="text-sm">Medium Utilization</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Low Utilization</span>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] border border-border/40 rounded-lg overflow-hidden">
        {/* Warehouse Layout Grid */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" fill="none">
          {/* Background Grid */}
          <rect width="800" height="400" fill="#f8fafc" />

          {/* Warehouse Sections */}
          <g>
            {/* Receiving Area */}
            <rect x="20" y="20" width="150" height="80" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
            <text x="95" y="60" textAnchor="middle" fill="#9a3412" fontSize="14" fontWeight="bold">
              Receiving
            </text>

            {/* Storage Zones */}
            {/* Zone A - High Utilization */}
            <rect x="20" y="120" width="150" height="260" fill="#bbf7d0" stroke="#22c55e" strokeWidth="2" />
            <text x="95" y="140" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="bold">
              Zone A (92%)
            </text>
            {/* Storage Racks */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={`rackA${i}`}
                x="35"
                y={160 + i * 35}
                width="120"
                height="25"
                fill="#dcfce7"
                stroke="#22c55e"
                strokeWidth="1"
              />
            ))}

            {/* Zone B - Medium Utilization */}
            <rect x="190" y="20" width="150" height="360" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <text x="265" y="40" textAnchor="middle" fill="#b45309" fontSize="14" fontWeight="bold">
              Zone B (75%)
            </text>
            {/* Storage Racks */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <rect
                key={`rackB${i}`}
                x="205"
                y={60 + i * 35}
                width="120"
                height="25"
                fill="#fef9c3"
                stroke="#f59e0b"
                strokeWidth="1"
              />
            ))}

            {/* Zone C - High Utilization */}
            <rect x="360" y="20" width="150" height="360" fill="#bbf7d0" stroke="#22c55e" strokeWidth="2" />
            <text x="435" y="40" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="bold">
              Zone C (95%)
            </text>
            {/* Storage Racks */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <rect
                key={`rackC${i}`}
                x="375"
                y={60 + i * 35}
                width="120"
                height="25"
                fill="#dcfce7"
                stroke="#22c55e"
                strokeWidth="1"
              />
            ))}

            {/* Zone D - Low Utilization */}
            <rect x="530" y="20" width="150" height="260" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text x="605" y="40" textAnchor="middle" fill="#b91c1c" fontSize="14" fontWeight="bold">
              Zone D (45%)
            </text>
            {/* Storage Racks */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={`rackD${i}`}
                x="545"
                y={60 + i * 35}
                width="120"
                height="25"
                fill="#fee2e2"
                stroke="#ef4444"
                strokeWidth="1"
              />
            ))}

            {/* Shipping Area */}
            <rect x="530" y="300" width="150" height="80" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
            <text x="605" y="340" textAnchor="middle" fill="#9a3412" fontSize="14" fontWeight="bold">
              Shipping
            </text>

            {/* Main Aisle */}
            <rect x="190" y="190" width="490" height="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

            {/* Cross Aisles */}
            <rect x="360" y="100" width="20" height="200" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <rect x="530" y="100" width="20" height="200" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

            {/* Activity Indicators */}
            <circle cx="95" cy="60" r="5" fill="#f97316" />
            <circle cx="605" cy="340" r="5" fill="#f97316" />
            <circle cx="435" cy="200" r="5" fill="#3b82f6" />
            <circle cx="265" cy="200" r="5" fill="#3b82f6" />
          </g>
        </svg>

        {/* Overlay with Hotspots */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md text-xs border border-orange-100">
          <div className="flex items-center gap-1 mb-1">
            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            <span>Activity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Workers</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
          <h4 className="text-sm font-semibold mb-1">Optimization Opportunities</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" /> Rearrange Zone D for better utilization
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" /> Add cross-aisle between Zones B and C
            </li>
          </ul>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
          <h4 className="text-sm font-semibold mb-1">Space Utilization Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Total Capacity:</p>
              <p className="font-medium">25,000 sq ft</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Utilization:</p>
              <p className="font-medium">78%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WarehouseLandingPage
