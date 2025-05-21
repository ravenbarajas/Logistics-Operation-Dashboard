"use client"

import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  FileText,
  BarChart2,
  Clock,
  Download,
  Share2,
  FileBarChart,
  FileSpreadsheet,
  FilePieChart,
  FileLineChart,
  Zap,
  Repeat,
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
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function ReportsLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/reports/recent")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Powerful Insights Through Advanced Reporting
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              Generate comprehensive reports and gain valuable insights into your logistics operations with our advanced
              reporting platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold bg-blue-600 hover:bg-blue-700"
              >
                Explore Reports <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-md px-8 py-6 h-auto font-semibold border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/reports/templates")}
              >
                View Templates
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-border/40 shadow-xl dark:shadow-lg dark:shadow-blue-500/20 bg-card">
              <div className="absolute inset-0 p-6">
                <ReportsDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Comprehensive Reporting Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportTypeCard
            icon={<FileBarChart />}
            title="Performance Reports"
            description="Track KPIs and performance metrics across your logistics operations."
          />
          <ReportTypeCard
            icon={<FileSpreadsheet />}
            title="Financial Reports"
            description="Generate detailed financial reports with revenue, costs, and profitability analysis."
          />
          <ReportTypeCard
            icon={<FilePieChart />}
            title="Resource Allocation"
            description="Analyze resource distribution and optimize allocation for maximum efficiency."
          />
          <ReportTypeCard
            icon={<FileLineChart />}
            title="Trend Analysis"
            description="Identify patterns and trends in your data to make informed business decisions."
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Reporting Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart2 />}
              title="Interactive Visualizations"
              description="Transform complex data into clear, interactive visualizations for better understanding and decision-making."
            >
              <div className="h-40 mt-4 shadow-xl dark:shadow-lg dark:shadow-blue-500/20">
                <MultiTypeChart />
              </div>
            </FeatureCard>
            <FeatureCard
              icon={<Clock />}
              title="Scheduled Reports"
              description="Set up automated report generation and distribution on your preferred schedule."
            />
            <FeatureCard
              icon={<Download />}
              title="Multiple Export Formats"
              description="Export reports in various formats including PDF, Excel, CSV, and interactive HTML."
            />
            <FeatureCard
              icon={<Share2 />}
              title="Seamless Sharing"
              description="Share reports with team members and stakeholders with customizable access controls."
            />
            <FeatureCard
              icon={<Zap />}
              title="Real-time Data"
              description="Generate reports with the latest data for up-to-the-minute insights and decision-making."
            />
            <FeatureCard
              icon={<Repeat />}
              title="Custom Templates"
              description="Create and save custom report templates tailored to your specific business needs."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Driving Business Success with Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard number="500+" label="Report Templates" />
          <StatCard number="65%" label="Time Saved on Reporting" />
          <StatCard number="42%" label="Improved Decision Speed" />
          <StatCard number="24/7" label="Data Accessibility" />
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Teams Use Our Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <UseCaseCard
              title="Executive Dashboards"
              description="Provide leadership with high-level insights into business performance and KPIs through customizable executive dashboards."
            />
            <UseCaseCard
              title="Operational Analysis"
              description="Track day-to-day operations, identify bottlenecks, and optimize processes with detailed operational reports."
            />
            <UseCaseCard
              title="Financial Planning"
              description="Support budgeting and financial planning with comprehensive revenue, expense, and profitability reports."
            />
            <UseCaseCard
              title="Compliance Reporting"
              description="Generate accurate compliance reports to meet regulatory requirements and internal governance standards."
            />
          </div>
        </div>
      </div>

      {/* Report Examples */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Report Examples</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
          Explore some of our most popular report templates and visualizations that help businesses make data-driven
          decisions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ReportExampleCard
            title="Performance Dashboard"
            description="Comprehensive view of key performance indicators and metrics."
            chart={<div className="h-48 mt-4 shadow-xl dark:shadow-lg dark:shadow-blue-500/20"><PerformanceChart /></div>}
          />
          <ReportExampleCard
            title="Resource Allocation"
            description="Visualization of how resources are distributed across different areas."
            chart={<div className="h-48 mt-4 shadow-xl dark:shadow-lg dark:shadow-blue-500/20"><ResourceChart /></div>}
          />
          <ReportExampleCard
            title="Trend Analysis"
            description="Historical data analysis showing patterns and trends over time."
            chart={<div className="h-48 mt-4 shadow-xl dark:shadow-lg dark:shadow-blue-500/20"><TrendChart /></div>}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 md:py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Reporting?</h2>
            <p className="text-xl mb-10 text-blue-100">
              Join hundreds of companies that have revolutionized their decision-making process with our reporting
              platform.
            </p>
            <Button
              onClick={handleGoToDashboard}
              size="lg"
              className="text-md px-10 py-6 h-auto font-semibold bg-white text-blue-700 hover:bg-blue-50"
            >
              Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportTypeCard({ icon, title, description }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-blue-500/20 hover:shadow-md text-center">
      <CardHeader className="pb-2">
        <div className="mx-auto h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
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
        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
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
      <p className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{number}</p>
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

function ReportExampleCard({ title, description, chart }) {
  return (
    <Card className="border border-border/40 transition-all duration-200 hover:border-blue-500/20 hover:shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full">{chart}</div>
      </CardContent>
    </Card>
  )
}

// Reports Dashboard
function ReportsDashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Reports Dashboard</h3>
        <span className="text-sm text-muted-foreground">Last updated: Today</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <ReportMetricCard title="Available Reports" value="42" icon={<FileText className="h-5 w-5" />} color="blue" />
        <ReportMetricCard
          title="Generated This Month"
          value="156"
          icon={<BarChart2 className="h-5 w-5" />}
          color="indigo"
        />
        <ReportMetricCard title="Scheduled Reports" value="8" icon={<Clock className="h-5 w-5" />} color="purple" />
        <ReportMetricCard title="Shared Reports" value="24" icon={<Share2 className="h-5 w-5" />} color="violet" />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Report Types</h4>
          <div className="h-[160px]">
            <ReportTypesChart />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Report Generation</h4>
          <div className="h-[160px]">
            <ReportGenerationChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportMetricCard({ title, value, icon, color }) {
  const getColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-500/10 text-blue-600",
      indigo: "bg-indigo-500/10 text-indigo-600",
      purple: "bg-purple-500/10 text-purple-600",
      violet: "bg-violet-500/10 text-violet-600",
    }
    return colorMap[color] || "bg-blue-500/10 text-blue-600"
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

function ReportTypesChart() {
  const data = [
    { name: "Performance", value: 35 },
    { name: "Financial", value: 25 },
    { name: "Operational", value: 20 },
    { name: "Custom", value: 20 },
  ]

  const COLORS = ["#3b82f6", "#4f46e5", "#8b5cf6", "#a78bfa"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
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
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

function ReportGenerationChart() {
  const data = [
    { name: "Mon", reports: 18 },
    { name: "Tue", reports: 25 },
    { name: "Wed", reports: 22 },
    { name: "Thu", reports: 30 },
    { name: "Fri", reports: 28 },
    { name: "Sat", reports: 15 },
    { name: "Sun", reports: 12 },
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
          formatter={(value) => [`${value} reports`, "Generated"]}
        />
        <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function MultiTypeChart() {
  const data = [
    { name: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
    { name: "Feb", revenue: 5000, expenses: 2800, profit: 2200 },
    { name: "Mar", revenue: 6000, expenses: 3200, profit: 2800 },
    { name: "Apr", revenue: 7000, expenses: 3600, profit: 3400 },
    { name: "May", revenue: 8000, expenses: 4000, profit: 4000 },
    { name: "Jun", revenue: 9000, expenses: 4400, profit: 4600 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
        <Bar dataKey="expenses" fill="#4f46e5" name="Expenses" />
        <Bar dataKey="profit" fill="#8b5cf6" name="Profit" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function PerformanceChart() {
  const data = [
    { name: "Jan", performance: 65 },
    { name: "Feb", performance: 70 },
    { name: "Mar", performance: 68 },
    { name: "Apr", performance: 75 },
    { name: "May", performance: 82 },
    { name: "Jun", performance: 88 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value) => [`${value}%`, "Performance"]}
        />
        <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ResourceChart() {
  const data = [
    { name: "Team A", value: 30 },
    { name: "Team B", value: 25 },
    { name: "Team C", value: 20 },
    { name: "Team D", value: 15 },
    { name: "Team E", value: 10 },
  ]

  const COLORS = ["#3b82f6", "#4f46e5", "#8b5cf6", "#a78bfa", "#c4b5fd"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          formatter={(value) => [`${value}%`, "Allocation"]}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

function TrendChart() {
  const data = [
    { name: "Week 1", value: 4000 },
    { name: "Week 2", value: 3000 },
    { name: "Week 3", value: 5000 },
    { name: "Week 4", value: 2780 },
    { name: "Week 5", value: 1890 },
    { name: "Week 6", value: 2390 },
    { name: "Week 7", value: 3490 },
    { name: "Week 8", value: 4000 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
        />
        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ReportsLandingPage
