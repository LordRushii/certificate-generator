import { Navigation } from "@/components/sections/navigation";
import { Hero } from "@/components/sections/hero";
import { InteractiveDemo } from "@/components/sections/interactive-demo";
import { Features } from "@/components/sections/features";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background font-sans overflow-x-hidden">
      <Navigation />
      <Hero />
      <InteractiveDemo />
      <Features />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
