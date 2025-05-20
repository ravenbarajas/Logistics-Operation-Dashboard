"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  Users,
  MessageSquare,
  BarChart,
  Heart,
  TrendingUp,
  UserPlus,
  Star,
  Mail,
  Calendar,
  Activity,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function CustomersLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/customers/summary")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
              Build Stronger Customer Relationships
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Manage your customer relationships and gain actionable insights with our comprehensive customer management
              system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold bg-teal-600 hover:bg-teal-700"
              >
                Go to Dashboard <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold border-teal-200 text-teal-700 hover:bg-teal-50"
                onClick={() => navigate("/customers/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl dark:shadow-lg dark:shadow-teal-500/20 bg-card">
              <div className="absolute inset-0 p-6">
                <CustomerDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comprehensive Customer Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Users />}
            title="Customer Profiles"
            description="Create detailed customer profiles with purchase history, preferences, and interaction logs."
          >
            <div className="h-32 mt-4 shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
              <CustomerSegmentChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<MessageSquare />}
            title="Communication Tools"
            description="Engage with customers through integrated email, SMS, and social media channels."
          />
          <FeatureCard
            icon={<BarChart />}
            title="Behavior Analytics"
            description="Analyze customer behavior patterns to identify opportunities and improve engagement."
          />
          <FeatureCard
            icon={<Heart />}
            title="Loyalty Programs"
            description="Create and manage loyalty programs to increase customer retention and lifetime value."
          />
          <FeatureCard
            icon={<TrendingUp />}
            title="Growth Insights"
            description="Track customer acquisition, retention, and churn with actionable insights."
          >
            <div className="h-32 mt-4 shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
              <CustomerGrowthChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<UserPlus />}
            title="Lead Management"
            description="Convert prospects into customers with powerful lead tracking and nurturing tools."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-teal-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Proven Results for Businesses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="32%" label="Increase in Customer Retention" />
            <StatCard number="45%" label="Higher Customer Satisfaction" />
            <StatCard number="28%" label="Growth in Customer Lifetime Value" />
            <StatCard number="3.5x" label="ROI on Customer Engagement" />
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Businesses Use Our Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UseCaseCard
            icon={<Star />}
            title="Improve Customer Experience"
            description="Track satisfaction metrics and identify areas for improvement to enhance the overall customer experience."
          />
          <UseCaseCard
            icon={<Mail />}
            title="Personalized Marketing"
            description="Segment customers and create targeted marketing campaigns based on preferences and behavior."
          />
          <UseCaseCard
            icon={<Calendar />}
            title="Streamlined Support"
            description="Manage customer inquiries efficiently with a complete view of customer history and preferences."
          />
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-teal-100">
              <div className="flex flex-col items-center text-center">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg italic mb-6">
                  "This platform has transformed how we manage our customer relationships. We've seen a 40% increase in
                  customer satisfaction and a significant boost in repeat business."
                </p>
                <p className="font-semibold text-teal-800">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Customer Success Manager, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Customer Relationships?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join thousands of businesses that have improved customer satisfaction and increased retention with our
            platform.
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

function StatCard({ number, label }) {
  return (
    <div className="text-center p-6 rounded-lg bg-white border border-teal-100 shadow-sm">
      <p className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function UseCaseCard({ icon, title, description }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-teal-500/20 hover:shadow-md">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 mb-4">
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

// Customer Dashboard
function CustomerDashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Customer Insights Dashboard</h3>
        <span className="text-sm text-muted-foreground">Last updated: Today</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <CustomerMetricCard title="Total Customers" value="2,547" change="+12%" icon={<Users className="h-5 w-5" />} />
        <CustomerMetricCard title="Satisfaction" value="92%" change="+5%" icon={<Heart className="h-5 w-5" />} />
        <CustomerMetricCard title="Active Today" value="342" change="+8%" icon={<Activity className="h-5 w-5" />} />
        <CustomerMetricCard title="New This Week" value="87" change="+15%" icon={<UserPlus className="h-5 w-5" />} />
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-medium mb-2">Customer Growth (Last 6 Months)</h4>
        <div className="h-[180px] shadow-xl dark:shadow-lg dark:shadow-teal-500/20">
          <CustomerTrendChart />
        </div>
      </div>
    </div>
  )
}

function CustomerMetricCard({ title, value, change, icon }) {
  const isPositive = change.startsWith("+")

  return (
    <div className="rounded-lg border border-border/40 p-3 flex items-center gap-3">
      <div className="rounded-full p-2 bg-teal-500/10 text-teal-600">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold">{value}</p>
          <span className={`text-xs ${isPositive ? "text-emerald-500" : "text-red-500"}`}>{change}</span>
        </div>
      </div>
    </div>
  )
}

function CustomerTrendChart() {
  const data = [
    { name: "Jan", customers: 1850 },
    { name: "Feb", customers: 1950 },
    { name: "Mar", customers: 2100 },
    { name: "Apr", customers: 2250 },
    { name: "May", customers: 2400 },
    { name: "Jun", customers: 2547 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value} customers`, "Total"]}
        />
        <Area type="monotone" dataKey="customers" stroke="#14b8a6" fillOpacity={1} fill="url(#colorCustomers)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function CustomerSegmentChart() {
  const data = [
    { name: "New", value: 25 },
    { name: "Occasional", value: 35 },
    { name: "Regular", value: 25 },
    { name: "VIP", value: 15 },
  ]

  const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#99f6e4"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={50}
          paddingAngle={2}
          dataKey="value"
          label={({ name }) => name}
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
          formatter={(value) => [`${value}%`, "Segment"]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function CustomerGrowthChart() {
  const data = [
    { name: "Q1", new: 120, returning: 180 },
    { name: "Q2", new: 150, returning: 200 },
    { name: "Q3", new: 170, returning: 230 },
    { name: "Q4", new: 190, returning: 270 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Bar dataKey="new" stackId="a" fill="#0d9488" radius={[4, 4, 0, 0]} name="New" />
        <Bar dataKey="returning" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Returning" />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export default CustomersLandingPage
