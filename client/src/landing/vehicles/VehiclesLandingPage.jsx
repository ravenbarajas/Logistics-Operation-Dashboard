"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  Car,
  Truck,
  Wrench,
  Fuel,
  BarChart2,
  MapPin,
  Calendar,
  AlertTriangle,
  Users,
  TrendingDown,
  CheckCircle2,
  XCircle,
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

function VehiclesLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/vehicles/inventory")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
              Intelligent Fleet Management
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Optimize your fleet operations, reduce costs, and improve efficiency with our comprehensive vehicle
              management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold bg-teal-600 hover:bg-teal-700"
              >
                Manage Fleet <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold border-teal-200 text-teal-700 hover:bg-teal-50"
                onClick={() => navigate("/vehicles/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl dark:shadow-lg dark:shadow-teal-500/20 bg-card">
              <div className="absolute inset-0 p-6">
                <FleetDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Search */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-teal-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Find Vehicle Information</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter vehicle ID or license plate"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 py-3">Search</Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-teal-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Benefits of Fleet Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Fuel />}
              title="Reduce Fuel Costs"
              description="Monitor fuel consumption and identify opportunities to improve efficiency and reduce costs."
              stat="24%"
              statLabel="Average Fuel Savings"
            />
            <BenefitCard
              icon={<Wrench />}
              title="Optimize Maintenance"
              description="Schedule preventive maintenance to reduce breakdowns and extend vehicle lifespan."
              stat="65%"
              statLabel="Fewer Breakdowns"
            />
            <BenefitCard
              icon={<TrendingDown />}
              title="Lower Operating Costs"
              description="Track and analyze all vehicle-related expenses to identify cost-saving opportunities."
              stat="32%"
              statLabel="Cost Reduction"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comprehensive Fleet Management Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MapPin />}
            title="Real-time Tracking"
            description="Monitor your vehicles in real-time with GPS tracking and location history."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
              <VehicleLocationMap />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<Calendar />}
            title="Maintenance Scheduling"
            description="Plan and track maintenance activities to keep your fleet in optimal condition."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
              <MaintenanceScheduleChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<Fuel />}
            title="Fuel Management"
            description="Track fuel consumption, costs, and identify vehicles with abnormal fuel usage."
          />
          <FeatureCard
            icon={<BarChart2 />}
            title="Performance Analytics"
            description="Analyze vehicle performance data to make informed fleet management decisions."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
              <FleetPerformanceChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<AlertTriangle />}
            title="Diagnostics & Alerts"
            description="Receive real-time alerts for vehicle issues, maintenance needs, and driver behavior."
          />
          <FeatureCard
            icon={<Users />}
            title="Driver Management"
            description="Track driver assignments, performance, and ensure compliance with regulations."
          />
        </div>
      </div>

      {/* Fleet Types */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Solutions for Every Fleet Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FleetTypeCard
              icon={<Car />}
              title="Corporate Fleets"
              description="Manage company vehicles with comprehensive tracking and reporting."
            />
            <FleetTypeCard
              icon={<Truck />}
              title="Delivery Fleets"
              description="Optimize delivery routes and track vehicle performance for logistics operations."
            />
            <FleetTypeCard
              icon={<Ambulance />}
              title="Emergency Services"
              description="Ensure rapid response times and optimal vehicle readiness for emergency fleets."
            />
            <FleetTypeCard
              icon={<Bus />}
              title="Public Transportation"
              description="Maintain schedules and monitor vehicle health for public transit fleets."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Driving Fleet Excellence</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard number="42%" label="Reduction in Maintenance Costs" />
          <StatCard number="3.8x" label="Return on Investment" />
          <StatCard number="28%" label="Improved Fleet Utilization" />
          <StatCard number="65%" label="Fewer Vehicle Breakdowns" />
        </div>
      </div>

      {/* Vehicle Health Scorecard */}
      <div className="bg-teal-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Comprehensive Vehicle Health Monitoring</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Track the health and performance of every vehicle in your fleet with detailed scorecards and maintenance
            histories.
          </p>
          <div className="max-w-5xl mx-auto">
            <div className="shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
              <VehicleHealthScorecard />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Our Platform Works</h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Connect Your Fleet"
              description="Install our GPS trackers or connect to your vehicles' existing telematics systems."
            />
            <StepCard
              number="2"
              title="Monitor Performance"
              description="Track location, fuel usage, maintenance needs, and driver behavior in real-time."
            />
            <StepCard
              number="3"
              title="Analyze Data"
              description="Review comprehensive reports and analytics to identify optimization opportunities."
            />
            <StepCard
              number="4"
              title="Optimize Operations"
              description="Implement data-driven decisions to reduce costs and improve fleet efficiency."
            />
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-teal-100">
              <div className="flex flex-col items-center text-center">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg italic mb-6">
                  "This platform has transformed how we manage our fleet of 120 vehicles. We've reduced maintenance
                  costs by 35% and improved vehicle utilization by 28%. The real-time tracking and analytics have been
                  game-changers for our operations."
                </p>
                <p className="font-semibold text-teal-800">Sarah Thompson</p>
                <p className="text-sm text-muted-foreground">Fleet Manager, Logistics Pro Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Fleet Management?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join hundreds of companies that have optimized their fleet operations and reduced costs with our platform.
          </p>
          <Button
            onClick={handleGoToDashboard}
            size="lg"
            className="text-md px-10 py-6 h-auto font-semibold bg-teal-600 hover:bg-teal-700"
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
    <Card className="border border-border/40 transition-all duration-200 hover:border-teal-500/20 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 mb-4">
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
    <Card className="border border-teal-100 bg-white transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">{description}</CardDescription>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-teal-600">{stat}</span>
          <span className="text-sm text-muted-foreground">{statLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function FleetTypeCard({ icon, title, description }) {
  return (
    <Card className="border border-teal-100 bg-white transition-all duration-200 hover:shadow-md text-center">
      <CardHeader className="pb-2">
        <div className="mx-auto h-16 w-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 mb-4">
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
    <div className="text-center p-6 rounded-lg bg-white border border-teal-100 shadow-sm">
      <p className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="h-16 w-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
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

function Ambulance(props) {
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
      <path d="m6 2-4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
      <path d="M6 12h4v4H6z" />
      <path d="M2 12h4" />
      <path d="M18 16h2a2 2 0 0 0 2-2v-5l-3-3h-3" />
      <path d="M22 12h-4" />
      <circle cx="18" cy="18" r="2" />
      <circle cx="8" cy="18" r="2" />
      <path d="M10 6v4" />
      <path d="M8 8h4" />
    </svg>
  )
}

function Bus(props) {
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
      <path d="M8 6v6" />
      <path d="M16 6v6" />
      <path d="M2 12h20" />
      <path d="M18 18h2a2 2 0 0 0 2-2v-6l-2-4H4l-2 4v6a2 2 0 0 0 2 2h2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}

// Fleet Dashboard
function FleetDashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Fleet Management Dashboard</h3>
        <span className="text-sm text-muted-foreground">42 Active Vehicles</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <VehicleMetricCard
          title="Vehicles On Road"
          value="32"
          percentage="76%"
          icon={<Car className="h-5 w-5" />}
          color="teal"
        />
        <VehicleMetricCard
          title="Maintenance Due"
          value="5"
          percentage="12%"
          icon={<Wrench className="h-5 w-5" />}
          color="amber"
        />
        <VehicleMetricCard
          title="Fuel Efficiency"
          value="24.8"
          unit="mpg"
          icon={<Fuel className="h-5 w-5" />}
          color="green"
        />
        <VehicleMetricCard
          title="Alerts"
          value="3"
          status="Requires Attention"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
        />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Fleet Status</h4>
          <div className="h-[160px] shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
            <FleetStatusChart />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Fuel Consumption</h4>
          <div className="h-[160px] shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
            <FuelConsumptionChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function VehicleMetricCard({ title, value, percentage, unit, status, icon, color }) {
  const getColorClass = (color) => {
    const colorMap = {
      teal: "bg-teal-500/10 text-teal-600",
      amber: "bg-amber-500/10 text-amber-600",
      green: "bg-green-500/10 text-green-600",
      red: "bg-red-500/10 text-red-600",
      blue: "bg-blue-500/10 text-blue-600",
    }
    return colorMap[color] || "bg-teal-500/10 text-teal-600"
  }

  return (
    <div className="rounded-lg border border-border/40 p-3 flex items-center gap-3">
      <div className={`rounded-full p-2 ${getColorClass(color)}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold">{value}</p>
          {percentage && <span className="text-xs text-muted-foreground">{percentage}</span>}
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          {status && <span className="text-xs text-red-500">{status}</span>}
        </div>
      </div>
    </div>
  )
}

function FleetStatusChart() {
  const data = [
    { name: "On Road", value: 32 },
    { name: "In Maintenance", value: 5 },
    { name: "Available", value: 3 },
    { name: "Out of Service", value: 2 },
  ]

  const COLORS = ["#0d9488", "#f59e0b", "#3b82f6", "#ef4444"]

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
          formatter={(value) => [`${value} vehicles`, "Count"]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function FuelConsumptionChart() {
  const data = [
    { name: "Jan", consumption: 2400 },
    { name: "Feb", consumption: 2100 },
    { name: "Mar", consumption: 2200 },
    { name: "Apr", consumption: 2000 },
    { name: "May", consumption: 1800 },
    { name: "Jun", consumption: 1700 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value} gal`, "Consumption"]}
        />
        <Area type="monotone" dataKey="consumption" stroke="#0d9488" fillOpacity={1} fill="url(#colorConsumption)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function VehicleLocationMap() {
  // This is a simplified map visualization
  return (
    <div className="relative h-full w-full bg-[#f2f7f7] rounded-md overflow-hidden border border-teal-100">
      {/* Map Background */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=160&width=320')] bg-cover opacity-30"></div>

      {/* Vehicle Locations */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 160" fill="none">
        {/* Roads */}
        <path d="M20,80 H300" stroke="#d1d5db" strokeWidth="2" />
        <path d="M160,20 V140" stroke="#d1d5db" strokeWidth="2" />
        <path d="M80,40 H240" stroke="#d1d5db" strokeWidth="2" />
        <path d="M60,120 H260" stroke="#d1d5db" strokeWidth="2" />

        {/* Vehicles */}
        <circle cx="120" cy="80" r="6" fill="#0d9488" />
        <circle cx="180" cy="60" r="6" fill="#0d9488" />
        <circle cx="220" cy="120" r="6" fill="#0d9488" />
        <circle cx="80" cy="40" r="6" fill="#0d9488" />
        <circle cx="160" cy="100" r="6" fill="#f59e0b" />
        <circle cx="60" cy="120" r="6" fill="#ef4444" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-md text-xs border border-teal-100">
        <div className="flex items-center gap-1 mb-1">
          <div className="h-3 w-3 rounded-full bg-teal-600"></div>
          <span>On Route</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
          <span>Idle</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <span>Alert</span>
        </div>
      </div>
    </div>
  )
}

function MaintenanceScheduleChart() {
  const data = [
    { name: "Vehicle 1", days: 5 },
    { name: "Vehicle 2", days: 12 },
    { name: "Vehicle 3", days: 3 },
    { name: "Vehicle 4", days: 8 },
    { name: "Vehicle 5", days: 15 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 70, bottom: 5 }}>
        <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={65} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value} days`, "Until Maintenance"]}
        />
        <Bar
          dataKey="days"
          fill={(entry) => (entry.days <= 5 ? "#ef4444" : entry.days <= 10 ? "#f59e0b" : "#0d9488")}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

function FleetPerformanceChart() {
  const data = [
    { name: "Jan", mileage: 12500, maintenance: 1200 },
    { name: "Feb", mileage: 11800, maintenance: 800 },
    { name: "Mar", mileage: 13200, maintenance: 1500 },
    { name: "Apr", mileage: 12800, maintenance: 900 },
    { name: "May", mileage: 14500, maintenance: 1100 },
    { name: "Jun", mileage: 15200, maintenance: 1000 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="mileage" stroke="#0d9488" strokeWidth={2} name="Total Mileage" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="maintenance"
          stroke="#f59e0b"
          strokeWidth={2}
          name="Maintenance Cost"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function VehicleHealthScorecard() {
  const categories = [
    { name: "Engine", score: 92, status: "excellent" },
    { name: "Transmission", score: 87, status: "good" },
    { name: "Brakes", score: 78, status: "average" },
    { name: "Tires", score: 85, status: "good" },
    { name: "Battery", score: 90, status: "excellent" },
    { name: "Fluids", score: 95, status: "excellent" },
  ]

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <Card className="border border-teal-100 shadow-md">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Vehicle Health Scorecard</CardTitle>
            <CardDescription>2023 Ford Transit - License: XYZ-1234</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Health</div>
            <div className="text-3xl font-bold text-teal-600">88/100</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Component Health</h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.status === "excellent" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : category.status === "poor" ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <div
                        className={`h-5 w-5 rounded-full ${
                          category.status === "good" ? "bg-blue-600" : "bg-amber-500"
                        }`}
                      ></div>
                    )}
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          category.score >= 90
                            ? "bg-green-600"
                            : category.score >= 80
                              ? "bg-blue-600"
                              : category.score >= 70
                                ? "bg-amber-500"
                                : "bg-red-600"
                        }`}
                        style={{ width: `${category.score}%` }}
                      ></div>
                    </div>
                    <span className={`font-medium ${getScoreColor(category.score)}`}>{category.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Maintenance History</h3>
            <div className="space-y-4">
              <div className="border border-border/40 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Oil Change & Filter Replacement</h4>
                    <p className="text-sm text-muted-foreground">Completed on May 15, 2025</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Next service due in 4,500 miles</p>
              </div>
              <div className="border border-border/40 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Brake Inspection</h4>
                    <p className="text-sm text-muted-foreground">Completed on April 22, 2025</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Next service due in 8,000 miles</p>
              </div>
              <div className="border border-border/40 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Tire Rotation</h4>
                    <p className="text-sm text-muted-foreground">Scheduled for May 28, 2025</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                    Upcoming
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Service due in 3 days</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VehiclesLandingPage
