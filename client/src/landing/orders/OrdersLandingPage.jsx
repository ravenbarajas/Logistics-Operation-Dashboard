"use client"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Clock, Package, ShieldCheck, TrendingUp } from "lucide-react"

function OrdersLandingPage() {
  const [, navigate] = useLocation()

  const handleGoToDashboard = () => {
    navigate("/orders/management")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Order Management Simplified
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
            Track, manage, and optimize your orders with our comprehensive system designed for modern businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleGoToDashboard} size="lg" className="text-md px-8 py-6 h-auto font-semibold">
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
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
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
      <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

export default OrdersLandingPage
