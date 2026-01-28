import { Heart, Users, Globe, Shield } from "lucide-react"

const stats = [
  {
    icon: Heart,
    value: "$30B+",
    label: "Total raised",
    description: "Since we started",
  },
  {
    icon: Users,
    value: "150M+",
    label: "Donors",
    description: "People giving back",
  },
  {
    icon: Globe,
    value: "19",
    label: "Countries",
    description: "Global reach",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Secure",
    description: "Protected donations",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Хамгийн найдвартай онлайн хандивын платформ
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Өдөр бүр өөрсдийн орон нутгийг өөрчилж, сайн сайхныг бүтээж буй сая сая хүмүүст нэгдээрэй
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-lg font-medium">{stat.label}</div>
                <div className="text-sm text-primary-foreground/70">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
