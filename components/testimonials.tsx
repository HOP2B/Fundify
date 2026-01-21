import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "FundRise helped us raise funds for my mother's surgery within weeks. The support from strangers was overwhelming and restored my faith in humanity.",
    author: "Jennifer Martinez",
    role: "Raised $45,000 for medical expenses",
    rating: 5,
  },
  {
    quote: "As a first-generation college student, I never thought I could afford tuition. Thanks to the generosity of donors on FundRise, I'm graduating this spring!",
    author: "Marcus Thompson",
    role: "Raised $28,000 for education",
    rating: 5,
  },
  {
    quote: "After the fire destroyed our community center, we turned to FundRise. In just 3 months, we raised enough to rebuild and even expand our programs.",
    author: "Sarah Chen",
    role: "Raised $120,000 for community rebuild",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stories of hope and generosity
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real people, real impact. See how FundRise is making a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
