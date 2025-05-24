"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  Users,
  BarChart2,
  FileText,
  AlertTriangle,
  Globe,
  TrendingUp,
  ShieldCheck,
  Clock,
  DollarSign,
  Star,
  Building,
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
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function SuppliersLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/suppliers/performance")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-violet-700">
              Strategic Supplier Management
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Build stronger supplier relationships, track performance metrics, and optimize your supply chain with our
              comprehensive supplier management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold bg-purple-700 hover:bg-purple-800"
              >
                Manage Suppliers <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => navigate("/suppliers/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl dark:shadow-lg dark:shadow-purple-500/20 bg-card">
              <div className="absolute inset-0 p-6">
                <SupplierDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-purple-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Benefits of Supplier Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<DollarSign />}
              title="Cost Reduction"
              description="Identify cost-saving opportunities and negotiate better terms with suppliers."
              stat="18%"
              statLabel="Average Cost Savings"
            />
            <BenefitCard
              icon={<ShieldCheck />}
              title="Risk Mitigation"
              description="Proactively identify and address supplier risks before they impact your business."
              stat="65%"
              statLabel="Risk Reduction"
            />
            <BenefitCard
              icon={<TrendingUp />}
              title="Performance Improvement"
              description="Track and improve supplier performance with data-driven insights."
              stat="32%"
              statLabel="Performance Boost"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comprehensive Supplier Management Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Users />}
            title="Supplier Profiles"
            description="Create detailed supplier profiles with contact information, certifications, and performance history."
          />
          <FeatureCard
            icon={<BarChart2 />}
            title="Performance Analytics"
            description="Track key performance indicators and identify trends to optimize supplier relationships."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-purple-500/20">
              <SupplierPerformanceChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<FileText />}
            title="Contract Management"
            description="Store, track, and manage supplier contracts with automated renewal reminders."
          />
          <FeatureCard
            icon={<AlertTriangle />}
            title="Risk Assessment"
            description="Evaluate supplier risks with customizable risk scoring and automated alerts."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-purple-500/20">
              <SupplierRiskChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<Globe />}
            title="Supplier Diversity"
            description="Track and improve supplier diversity with detailed reporting and analytics."
          >
            <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-purple-500/20">
              <SupplierDiversityChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<Clock />}
            title="On-time Delivery"
            description="Monitor supplier delivery performance and address issues proactively."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Driving Supply Chain Excellence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="42%" label="Reduction in Supplier Issues" />
            <StatCard number="3.5x" label="Return on Investment" />
            <StatCard number="28%" label="Faster Supplier Onboarding" />
            <StatCard number="98%" label="Customer Satisfaction" />
          </div>
        </div>
      </div>

      {/* Supplier Scorecard */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Comprehensive Supplier Scorecards</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
          Evaluate suppliers across multiple dimensions with customizable scorecards that provide a complete view of
          supplier performance.
        </p>
        <div className="max-w-5xl mx-auto">
          <SupplierScorecard />
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-purple-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Supplier Management for Every Industry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard
              title="Manufacturing"
              description="Ensure reliable component supply and quality control for manufacturing operations."
              icon={<Building />}
            />
            <UseCaseCard
              title="Retail"
              description="Manage diverse supplier networks and optimize inventory across multiple product categories."
              icon={<ShoppingBag />}
            />
            <UseCaseCard
              title="Healthcare"
              description="Maintain compliance and quality standards with healthcare supplier management."
              icon={<Stethoscope />}
            />
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
              title="Supplier Onboarding"
              description="Easily onboard new suppliers with customizable forms and automated workflows."
            />
            <StepCard
              number="2"
              title="Performance Tracking"
              description="Monitor key metrics and set performance targets for each supplier."
            />
            <StepCard
              number="3"
              title="Risk Management"
              description="Identify and mitigate supplier risks with proactive monitoring and alerts."
            />
            <StepCard
              number="4"
              title="Relationship Building"
              description="Strengthen supplier relationships with collaborative tools and communication."
            />
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-purple-100">
              <div className="flex flex-col items-center text-center">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg italic mb-6">
                  "This platform has transformed how we manage our supplier relationships. We've reduced costs by 22%
                  and significantly improved supplier performance across our entire network."
                </p>
                <p className="font-semibold text-purple-800">Michael Johnson</p>
                <p className="text-sm text-muted-foreground">Chief Procurement Officer, Global Manufacturing Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Supplier Management?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join hundreds of companies that have optimized their supply chain and improved supplier relationships with
            our platform.
          </p>
          <Button
            onClick={handleGoToDashboard}
            size="lg"
            className="text-md px-10 py-6 h-auto font-semibold bg-purple-700 hover:bg-purple-800"
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
    <Card className="border border-border/40 transition-all duration-200 hover:border-purple-500/20 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-700 mb-4">
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
    <Card className="border border-purple-100 bg-white transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-700 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">{description}</CardDescription>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-purple-700">{stat}</span>
          <span className="text-sm text-muted-foreground">{statLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 rounded-lg bg-white border border-purple-100 shadow-sm">
      <p className="text-4xl md:text-5xl font-bold text-purple-700 mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function UseCaseCard({ title, description, icon }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-purple-500/20 hover:shadow-md">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-700 mb-4">
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
      <div className="h-16 w-16 rounded-full bg-purple-700 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

// Custom Icons
function ShoppingBag(props) {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function Stethoscope(props) {
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
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  )
}

// Supplier Dashboard
function SupplierDashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Supplier Performance Dashboard</h3>
        <span className="text-sm text-muted-foreground">42 Active Suppliers</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <SupplierMetricCard
          title="On-Time Delivery"
          value="92%"
          change="+5%"
          icon={<Clock className="h-5 w-5" />}
          color="green"
        />
        <SupplierMetricCard
          title="Quality Rating"
          value="4.7/5"
          change="+0.3"
          icon={<Star className="h-5 w-5" />}
          color="amber"
        />
        <SupplierMetricCard
          title="Cost Variance"
          value="-3.2%"
          change="Favorable"
          icon={<DollarSign className="h-5 w-5" />}
          color="purple"
        />
        <SupplierMetricCard
          title="Response Time"
          value="4.2 hrs"
          change="-12%"
          icon={<TrendingUp className="h-5 w-5" />}
          color="blue"
        />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Top Suppliers by Performance</h4>
          <div className="h-[160px]">
            <TopSuppliersChart />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Risk Distribution</h4>
          <div className="h-[160px]">
            <RiskDistributionChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function SupplierMetricCard({ title, value, change, icon, color }) {
  const getColorClass = (color) => {
    const colorMap = {
      green: "bg-green-500/10 text-green-600",
      amber: "bg-amber-500/10 text-amber-600",
      purple: "bg-purple-500/10 text-purple-600",
      blue: "bg-blue-500/10 text-blue-600",
      red: "bg-red-500/10 text-red-600",
    }
    return colorMap[color] || "bg-purple-500/10 text-purple-600"
  }

  const isPositive = change.startsWith("+") || change === "Favorable"
  const changeColor = isPositive ? "text-green-600" : "text-red-600"

  return (
    <div className="rounded-lg border border-border/40 p-3 flex items-center gap-3">
      <div className={`rounded-full p-2 ${getColorClass(color)}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold">{value}</p>
          <span className={`text-xs ${changeColor}`}>{change}</span>
        </div>
      </div>
    </div>
  )
}

function TopSuppliersChart() {
  const data = [
    { name: "Acme Corp", score: 92 },
    { name: "TechSupply", score: 88 },
    { name: "GlobalParts", score: 85 },
    { name: "FastLogistics", score: 82 },
    { name: "QualityGoods", score: 78 },
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
          formatter={(value) => [`${value}/100`, "Score"]}
        />
        <Bar dataKey="score" fill="#9333ea" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function RiskDistributionChart() {
  const data = [
    { name: "Low", value: 65 },
    { name: "Medium", value: 25 },
    { name: "High", value: 10 },
  ]

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"]

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

function SupplierPerformanceChart() {
  const data = [
    { name: "Jan", performance: 82 },
    { name: "Feb", performance: 85 },
    { name: "Mar", performance: 83 },
    { name: "Apr", performance: 87 },
    { name: "May", performance: 90 },
    { name: "Jun", performance: 92 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          domain={[75, 100]}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value}%`, "Performance"]}
        />
        <Line type="monotone" dataKey="performance" stroke="#9333ea" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function SupplierRiskChart() {
  const data = [
    { name: "Financial", value: 65 },
    { name: "Quality", value: 85 },
    { name: "Delivery", value: 78 },
    { name: "Compliance", value: 92 },
    { name: "Geopolitical", value: 72 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="20%"
        outerRadius="80%"
        barSize={10}
        data={data}
        startAngle={180}
        endAngle={-180}
      >
        <RadialBar
          minAngle={15}
          background
          clockWise={true}
          dataKey="value"
          cornerRadius={10}
          label={{ fill: "#666", position: "insideStart" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value}/100`, "Score"]}
        />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

function SupplierDiversityChart() {
  const data = [
    { name: "Small Business", value: 35 },
    { name: "Minority-owned", value: 25 },
    { name: "Women-owned", value: 20 },
    { name: "Veteran-owned", value: 10 },
    { name: "Other", value: 10 },
  ]

  const COLORS = ["#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
        <Legend layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function SupplierScorecard() {
  const categories = [
    { name: "Quality", score: 92, status: "excellent" },
    { name: "Delivery", score: 87, status: "good" },
    { name: "Cost", score: 78, status: "average" },
    { name: "Innovation", score: 85, status: "good" },
    { name: "Responsiveness", score: 90, status: "excellent" },
    { name: "Compliance", score: 95, status: "excellent" },
  ]

  const getStatusColor = (status) => {
    const statusMap = {
      excellent: "bg-green-100 text-green-700 border-green-300",
      good: "bg-blue-100 text-blue-700 border-blue-300",
      average: "bg-amber-100 text-amber-700 border-amber-300",
      poor: "bg-red-100 text-red-700 border-red-300",
    }
    return statusMap[status] || "bg-gray-100 text-gray-700 border-gray-300"
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <Card className="border border-purple-100 shadow-md">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Supplier Scorecard</CardTitle>
            <CardDescription>Acme Corporation</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <div className="text-3xl font-bold text-purple-700">88/100</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Categories</h3>
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
            <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
            <div className="h-64 shadow-xl dark:shadow-lg dark:shadow-purple-500/20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: "Jan", score: 82 },
                    { month: "Feb", score: 84 },
                    { month: "Mar", score: 83 },
                    { month: "Apr", score: 86 },
                    { month: "May", score: 87 },
                    { month: "Jun", score: 88 },
                  ]}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={[75, 100]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => [`${value}/100`, "Score"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#9333ea"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SuppliersLandingPage
