import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Share2, DollarSign, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Хандивын аянаа эхлүүлэх",
    description: "Хандивын аянаа зөвхөн хэдхэн минутад үүсгээрэй. Өөрийн түүхээ, зургуудыг нэмээд зорилгоо тогтооно уу.",
  },
  {
    icon: Share2,
    step: "02",
    title: "Найз нөхөдтэйгээ хуваалцах",
    description: "Хандивын аянаа олон хүнд хүргэхийн тулд нийгмийн сүлжээ, имэйл, мессеж апп-уудаар хуваалцаарай.",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Хандив цуглуулах",
    description: "Хандивыг шууд өөрийн банкны данс руу хүлээн авч, явцыг бодит цаг хугацаанд хянаарай.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Мөнгөө татах",
    description: "Мөнгө оруулсан хандивыг хүссэн үедээ амархан авах боломжтой. Зорилгодоо хүрээгүй тохиолдолд ямар ч торгууль байхгүй.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            FundRise хэрхэн ажилладаг вэ
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
          <Link href="/donate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            “Хандивын аянаа эхлүүлэх”
          </Button>
            </Link>
        </div>
      </div>
    </section>
  )
}