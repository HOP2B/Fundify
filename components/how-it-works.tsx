import { Button } from "@/components/ui/button"
import { FileText, Share2, DollarSign, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Start your fundraiser",
    description: "Set up your fundraiser in just a few minutes. Add your story, photos, and set your goal.",
  },
  {
    icon: Share2,
    step: "02",
    title: "Share with friends",
    description: "Share your fundraiser on social media, email, and messaging apps to reach more people.",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Collect donations",
    description: "Receive donations directly to your bank account. Track progress in real-time.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Withdraw funds",
    description: "Easily withdraw your funds at any time. No penalties for not reaching your goal.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How FundRise works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Starting a fundraiser is simple and free. Here's how it works.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-card rounded-2xl p-6 h-full border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-border">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            Start your fundraiser
          </Button>
        </div>
      </div>
    </section>
  )
}
