import { Zap, Clock, Calendar } from "lucide-react";

const trustItems = [
  {
    icon: Zap,
    text: "No fee to start fundraising",
  },
  {
    icon: Clock,
    text: "1 donation made every second",
    highlight: "1",
  },
  {
    icon: Calendar,
    text: "8K+ fundraisers started daily",
    highlight: "8K+",
  },
];

export function TrustBar() {
  return (
    <section className="bg-[#f9f7f2] py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0">
          {trustItems.map((item, index) => (
            <div key={item.text} className="flex items-center">
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                <span className="text-sm text-foreground">
                  {item.highlight ? (
                    <>
                      <span className="font-bold">{item.highlight}</span>
                      {item.text.replace(item.highlight, "")}
                    </>
                  ) : (
                    item.text
                  )}
                </span>
              </div>
              {index < trustItems.length - 1 && (
                <div className="hidden md:flex items-center mx-8">
                  <span className="text-muted-foreground tracking-[0.3em]">
                    ··················
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
