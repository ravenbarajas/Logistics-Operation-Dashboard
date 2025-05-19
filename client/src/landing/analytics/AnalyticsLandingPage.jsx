"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, BarChart3, ChevronRight, PieChart, Shield, TrendingUp, Zap } from "lucide-react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function AnalyticsLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/analytics/risk")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-700">
              Data-Driven Insights for Smarter Decisions
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Transform your logistics data into actionable insights with our comprehensive analytics platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleGoToDashboard} size="lg" className="text-md px-8 py-6 h-auto font-semibold">
                Explore Dashboard <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold"
                onClick={() => navigate("/analytics/demo")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl bg-card">
              <div className="absolute inset-0 p-6">
                <DemoAreaChart />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Analytics for Every Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<TrendingUp />}
            title="Performance Metrics"
            description="Track key performance indicators and identify trends to optimize your logistics operations."
          >
            <div className="h-32 mt-4">
              <DemoLineChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<BarChart3 />}
            title="Comparative Analysis"
            description="Compare performance across different time periods, regions, or business units."
          >
            <div className="h-32 mt-4">
              <DemoBarChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<PieChart />}
            title="Distribution Insights"
            description="Understand the distribution of your logistics resources and identify optimization opportunities."
          >
            <div className="h-32 mt-4">
              <DemoPieChart />
            </div>
          </FeatureCard>
          <FeatureCard
            icon={<Shield />}
            title="Risk Assessment"
            description="Identify potential risks in your supply chain and take proactive measures to mitigate them."
          />
          <FeatureCard
            icon={<Zap />}
            title="Real-time Monitoring"
            description="Monitor your logistics operations in real-time and respond quickly to changing conditions."
          />
          <FeatureCard
            icon={<AreaChart />}
            title="Predictive Analytics"
            description="Leverage machine learning to predict future trends and make data-driven decisions."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Driving Business Success with Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="30%" label="Average Cost Reduction" />
            <StatCard number="45%" label="Improved Decision Speed" />
            <StatCard number="99.9%" label="Data Accuracy" />
            <StatCard number="24/7" label="Real-time Monitoring" />
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Analytics for Every Business Function</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UseCaseCard
            title="Supply Chain Optimization"
            description="Identify bottlenecks in your supply chain and optimize for efficiency and cost-effectiveness."
          />
          <UseCaseCard
            title="Inventory Management"
            description="Maintain optimal inventory levels and reduce carrying costs with data-driven insights."
          />
          <UseCaseCard
            title="Route Planning"
            description="Plan the most efficient routes for your deliveries and reduce transportation costs."
          />
          <UseCaseCard
            title="Customer Satisfaction"
            description="Track delivery performance and customer satisfaction to improve service quality."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Data?</h2>
          <p className="text-xl mb-10 text-muted-foreground">
            Join hundreds of companies that have revolutionized their logistics operations with our analytics platform.
          </p>
          <Button onClick={handleGoToDashboard} size="lg" className="text-md px-10 py-6 h-auto font-semibold">
            Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, children }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-violet-500/20 hover:shadow-md overflow-hidden">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 mb-4">
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
    <div className="text-center p-6 rounded-lg bg-background border border-border/40">
      <p className="text-4xl md:text-5xl font-bold text-violet-500 mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function UseCaseCard({ title, description }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-violet-500/20 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

// Demo Charts
function DemoAreaChart() {
  const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 900 },
    { name: "Jul", value: 1000 },
    { name: "Aug", value: 1200 },
    { name: "Sep", value: 1100 },
    { name: "Oct", value: 1300 },
    { name: "Nov", value: 1500 },
    { name: "Dec", value: 1700 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

function DemoLineChart() {
  const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 900 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

function DemoBarChart() {
  const data = [
    { name: "A", value: 400 },
    { name: "B", value: 300 },
    { name: "C", value: 600 },
    { name: "D", value: 800 },
    { name: "E", value: 500 },
    { name: "F", value: 900 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

function DemoPieChart() {
  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ]

  const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
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
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export default AnalyticsLandingPage
