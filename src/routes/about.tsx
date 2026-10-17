import { createFileRoute, Link } from "@tanstack/react-router";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Artisan Hardware" },
      { name: "description", content: "The story and craft behind Artisan Hardware." },
      { property: "og:title", content: "About — Artisan Hardware" },
      { property: "og:description", content: "The story and craft behind Artisan Hardware." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="bg-showroom px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <img src={founder} alt="Founder in the workshop" width={1024} height={1280} className="rounded-[2rem]" />
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="mt-4 font-display text-5xl">CRAFT YOU CAN FEEL</h1>
          <p className="mt-6 leading-relaxed text-muted-foreground">What started as a single lathe in a brass workshop is now a full architectural hardware range. Every handle, knob, hinge and channel is machined, finished and inspected by hand.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">We design families, not one-offs — so every fitting in a room shares the same profile and finish.</p>
          <Link to="/products" className="mt-8 inline-block rounded-full bg-foreground px-8 py-4 text-sm tracking-widest text-background">SEE THE RANGE</Link>
        </div>
      </div>
    </main>
  );
}
