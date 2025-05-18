"use client"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  Clock,
  Package,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Truck,
  ShoppingBag,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

function OrdersLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/orders/management")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12">
              Order Management Simplified
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Track, manage, and optimize your orders with our comprehensive system designed for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default"
                onClick={handleGoToDashboard} 
                size="lg" 
                className="text-md px-8 py-6 h-auto font-semibold">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold"
                onClick={() => navigate("/orders/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl dark:shadow-lg dark:shadow-primary/20 bg-card">
              <div className="absolute inset-0 p-6">
                <OrderFulfillmentDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need to Manage Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Package />}
            title="Order Tracking"
            description="Real-time tracking of all your orders from placement to delivery."
          />
          <FeatureCard
            icon={<BarChart3 />}
            title="Analytics Dashboard"
            description="Comprehensive analytics to understand your order patterns and customer behavior."
          />
          <FeatureCard
            icon={<Clock />}
            title="Automated Processing"
            description="Automate routine tasks and reduce processing time by up to 75%."
          />
          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure Management"
            description="Enterprise-grade security to protect your order data and customer information."
          />
          <FeatureCard
            icon={<TrendingUp />}
            title="Performance Insights"
            description="Track KPIs and get actionable insights to improve your order fulfillment."
          />
          <FeatureCard
            icon={<ArrowRight />}
            title="Seamless Integration"
            description="Easily integrate with your existing systems and third-party services."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trusted by Businesses Worldwide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="10k+" label="Orders Processed Daily" />
            <StatCard number="99.9%" label="System Uptime" />
            <StatCard number="85%" label="Reduction in Processing Time" />
            <StatCard number="24/7" label="Customer Support" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Streamline Your Order Management?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join thousands of businesses that have transformed their order processing with our platform.
          </p>
          <Button onClick={handleGoToDashboard} size="lg" className="text-md px-10 py-6 h-auto font-semibold">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white mb-4">
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

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 rounded-lg bg-background border border-border/40">
      <p className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

// Order Fulfillment Dashboard
function OrderFulfillmentDashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Order Fulfillment Dashboard</h3>
        <span className="text-sm text-muted-foreground">Last updated: Today</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <OrderStatusCard title="Pending" value={24} icon={<ShoppingBag className="h-5 w-5" />} color="amber" />
        <OrderStatusCard title="Processing" value={18} icon={<Clock className="h-5 w-5" />} color="blue" />
        <OrderStatusCard title="Shipped" value={42} icon={<Truck className="h-5 w-5" />} color="indigo" />
        <OrderStatusCard title="Delivered" value={86} icon={<CheckCircle2 className="h-5 w-5" />} color="green" />
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-medium mb-2">Order Volume (Last 7 Days)</h4>
        <div className="h-[180px]">
          <OrderVolumeChart />
        </div>
      </div>
    </div>
  )
}

function OrderStatusCard({ title, value, icon, color }) {
  const getColorClass = (color) => {
    const colorMap = {
      amber: "bg-amber-500/10 text-amber-500",
      blue: "bg-blue-500/10 text-blue-500",
      indigo: "bg-indigo-500/10 text-indigo-500",
      green: "bg-green-500/10 text-green-500",
      red: "bg-red-500/10 text-red-500",
    }
    return colorMap[color] || "bg-primary/10 text-primary"
  }

  return (
    <div className="rounded-lg border border-border/40 p-3 flex items-center gap-3">
      <div className={`rounded-full p-2 ${getColorClass(color)}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function OrderVolumeChart() {
  const data = [
    { name: "Mon", orders: 45 },
    { name: "Tue", orders: 52 },
    { name: "Wed", orders: 49 },
    { name: "Thu", orders: 63 },
    { name: "Fri", orders: 58 },
    { name: "Sat", orders: 41 },
    { name: "Sun", orders: 39 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => value} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value} orders`, "Volume"]}
        />
        <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorOrders)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default OrdersLandingPage
