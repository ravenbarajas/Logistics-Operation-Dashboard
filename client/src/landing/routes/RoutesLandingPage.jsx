"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  Map,
  Clock,
  Truck,
  Fuel,
  Route,
  MapPin,
  Navigation,
  Calendar,
  Zap,
  Users,
  TrendingDown,
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

function RoutesLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/routes/management")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
              Intelligent Route Optimization
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Plan, optimize, and manage your delivery routes for maximum efficiency, reduced costs, and improved
              customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold bg-green-600 hover:bg-green-700"
              >
                Optimize Routes <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => navigate("/routes/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl bg-card">
              <div className="absolute inset-0">
                <RouteMapVisualization />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-green-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Benefits of Route Optimization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Fuel />}
              title="Reduce Fuel Costs"
              description="Cut fuel consumption by up to 30% with optimized routes and reduced mileage."
              stat="30%"
              statLabel="Fuel Savings"
            />
            <BenefitCard
              icon={<Clock />}
              title="Save Time"
              description="Decrease delivery times and increase the number of stops per driver."
              stat="25%"
              statLabel="Time Saved"
            />
            <BenefitCard
              icon={<TrendingDown />}
              title="Lower Operational Costs"
              description="Minimize vehicle maintenance costs and optimize resource allocation."
              stat="20%"
              statLabel="Cost Reduction"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Route Optimization Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Map />}
            title="Real-time Route Planning"
            description="Create optimized routes in seconds considering traffic, weather, and delivery windows."
          />
          <FeatureCard
            icon={<Truck />}
            title="Fleet Management"
            description="Manage your entire fleet with vehicle tracking, maintenance scheduling, and driver assignment."
          >
            <div className="h-32 mt-4">
              <FleetUtilizationChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<MapPin />}
            title="Multi-stop Optimization"
            description="Efficiently plan routes with multiple stops while considering priority deliveries and time windows."
          />
          <FeatureCard
            icon={<Navigation />}
            title="Turn-by-turn Navigation"
            description="Provide drivers with detailed navigation instructions optimized for their vehicle type."
          />
          <FeatureCard
            icon={<Calendar />}
            title="Delivery Scheduling"
            description="Schedule deliveries in advance and automatically assign them to the most efficient routes."
          />
          <FeatureCard
            icon={<Zap />}
            title="Dynamic Rerouting"
            description="Adapt to real-time changes such as traffic, new orders, or cancellations with instant rerouting."
          >
            <div className="h-32 mt-4">
              <DeliveryPerformanceChart />
            </div>
          </FeatureCard>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Driving Efficiency with Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="45%" label="Reduction in Miles Driven" />
            <StatCard number="98%" label="On-time Delivery Rate" />
            <StatCard number="35%" label="Increase in Deliveries per Day" />
            <StatCard number="3.2x" label="Return on Investment" />
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Route Optimization for Every Industry</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UseCaseCard
            title="Last-Mile Delivery"
            description="Optimize the final leg of delivery to reduce costs and improve customer satisfaction."
            icon={<Truck />}
          />
          <UseCaseCard
            title="Field Service Management"
            description="Schedule technicians efficiently to maximize service calls and minimize travel time."
            icon={<Users />}
          />
          <UseCaseCard
            title="Waste Collection"
            description="Plan efficient collection routes to reduce fuel consumption and vehicle wear."
            icon={<Route />}
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-green-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Route Optimization Works</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                title="Input Your Deliveries"
                description="Enter delivery locations, time windows, and any special requirements."
              />
              <StepCard
                number="2"
                title="Generate Optimal Routes"
                description="Our algorithm creates the most efficient routes based on your parameters."
              />
              <StepCard
                number="3"
                title="Execute and Track"
                description="Dispatch drivers and monitor deliveries in real-time with automatic updates."
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Optimize Your Routes?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join thousands of businesses that have transformed their delivery operations with our route optimization
            platform.
          </p>
          <Button
            onClick={handleGoToDashboard}
            size="lg"
            className="text-md px-10 py-6 h-auto font-semibold bg-green-600 hover:bg-green-700"
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
    <Card className="border border-border/40 transition-all duration-200 hover:border-green-500/20 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 mb-4">
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
    <Card className="border border-green-100 bg-white transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">{description}</CardDescription>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-green-600">{stat}</span>
          <span className="text-sm text-muted-foreground">{statLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 rounded-lg bg-white border border-green-100 shadow-sm">
      <p className="text-4xl md:text-5xl font-bold text-green-600 mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function UseCaseCard({ title, description, icon }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-green-500/20 hover:shadow-md">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 mb-4">
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

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="h-16 w-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

// Route Map Visualization
function RouteMapVisualization() {
  return (
    <div className="relative h-full w-full bg-[#f2f7f5] overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] bg-cover opacity-50"></div>

      {/* Map Overlay */}
      <div className="absolute inset-0 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Route Optimization Dashboard</h3>
          <span className="text-sm text-muted-foreground">5 Vehicles • 42 Deliveries</span>
        </div>

        {/* Route Visualization */}
        <div className="relative h-[320px]">
          {/* Map Routes - Simplified visualization */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 320" fill="none">
            {/* Route 1 */}
            <path
              d="M100,160 C150,100 200,80 250,120 C300,160 350,180 400,140 C450,100 500,120 550,160"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 4"
              fill="none"
            />
            {/* Route 2 */}
            <path
              d="M100,200 C150,240 200,260 250,220 C300,180 350,160 400,200 C450,240 500,220 550,180"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 4"
              fill="none"
            />
            {/* Route 3 */}
            <path
              d="M50,120 C100,80 150,60 200,100 C250,140 300,160 350,120 C400,80 450,100 500,140"
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 4"
              fill="none"
            />

            {/* Starting Point */}
            <circle cx="100" cy="160" r="8" fill="#10b981" />
            <circle cx="100" cy="200" r="8" fill="#0ea5e9" />
            <circle cx="50" cy="120" r="8" fill="#8b5cf6" />

            {/* Delivery Points */}
            {[
              [250, 120],
              [400, 140],
              [550, 160],
              [250, 220],
              [400, 200],
              [550, 180],
              [200, 100],
              [350, 120],
              [500, 140],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="6" fill="#f43f5e" />
            ))}

            {/* Vehicles */}
            <circle cx="180" cy="90" r="6" fill="#8b5cf6" stroke="white" strokeWidth="2" />
            <circle cx="320" cy="170" r="6" fill="#0ea5e9" stroke="white" strokeWidth="2" />
            <circle cx="420" cy="150" r="6" fill="#10b981" stroke="white" strokeWidth="2" />
          </svg>

          {/* Route Stats */}
          <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-4">
            <div className="bg-white/90 p-3 rounded-lg border border-green-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Route A</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">15 stops • 28.4 miles</div>
            </div>
            <div className="bg-white/90 p-3 rounded-lg border border-green-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">Route B</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">12 stops • 22.7 miles</div>
            </div>
            <div className="bg-white/90 p-3 rounded-lg border border-green-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium">Route C</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">15 stops • 26.2 miles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FleetUtilizationChart() {
  const data = [
    { name: "Vehicle A", utilization: 85 },
    { name: "Vehicle B", utilization: 92 },
    { name: "Vehicle C", utilization: 78 },
    { name: "Vehicle D", utilization: 95 },
    { name: "Vehicle E", utilization: 88 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 50, bottom: 5 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value}%`, "Utilization"]}
        />
        <Bar dataKey="utilization" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function DeliveryPerformanceChart() {
  const data = [
    { name: "Mon", onTime: 95, delayed: 5 },
    { name: "Tue", onTime: 97, delayed: 3 },
    { name: "Wed", onTime: 94, delayed: 6 },
    { name: "Thu", onTime: 98, delayed: 2 },
    { name: "Fri", onTime: 96, delayed: 4 },
    { name: "Sat", onTime: 99, delayed: 1 },
    { name: "Sun", onTime: 100, delayed: 0 },
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
          formatter={(value) => [`${value}%`, "Percentage"]}
        />
        <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
        <Bar dataKey="delayed" stackId="a" fill="#f43f5e" name="Delayed" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RoutesLandingPage
