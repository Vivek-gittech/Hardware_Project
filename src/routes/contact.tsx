import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Artisan Hardware" },
      { name: "description", content: "Enquire about Artisan Hardware handles, knobs, hinges and channels." },
      { property: "og:title", content: "Contact — Artisan Hardware" },
      { property: "og:description", content: "Talk to us about your project." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get("email") ?? "");
    if (!String(d.get("name")).trim() || !/^\S+@\S+\.\S+$/.test(email) || String(d.get("message")).trim().length < 5) {
      setError("Please add your name, a valid email and a short message.");
      return;
    }
    setError("");
    setSent(true);
  };
  const field = "w-full rounded-2xl border border-input bg-card px-5 py-4 outline-none focus:border-primary";
  return (
    <main className="bg-showroom min-h-screen px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 font-display text-5xl">LET'S TALK HARDWARE</h1>
          <p className="mt-6 text-muted-foreground">Samples, trade pricing or a finish match for your project — we reply within one working day.</p>
          <div className="mt-10 space-y-2 text-muted-foreground">
            <p>hello@artisanhardware.example</p>
            <p>+91 00000 00000</p>
          </div>
        </div>
        {sent ? (
          <div className="card-showroom p-10">
            <h2 className="font-display text-2xl">THANK YOU</h2>
            <p className="mt-4 text-muted-foreground">Your message is noted — we'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <input name="name" placeholder="Name" className={field} />
            <input name="email" type="email" placeholder="Email" className={field} />
            <input name="phone" placeholder="Phone (optional)" className={field} />
            <textarea name="message" rows={5} placeholder="Tell us about your project" className={field} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button className="rounded-full bg-foreground px-8 py-4 text-sm tracking-widest text-background">SEND MESSAGE</button>
          </form>
        )}
      </div>
    </main>
  );
}
