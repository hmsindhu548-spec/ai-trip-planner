"use client";

import { FormEvent, useState } from "react";
import { Compass, MapPin, Sparkles, Clock3, Wallet, Users, Leaf, ArrowRight, LoaderCircle } from "lucide-react";

type Day = { day: number; title: string; activities: { time: string; name: string; description: string; estimatedCost: string }[] };
type Trip = { title: string; overview: string; estimatedBudget: string; bestTime: string; tips: string[]; itinerary: Day[]; demoMode?: boolean };

export default function Home() {
  const [destination, setDestination] = useState("Coorg, Karnataka");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("₹15,000");
  const [travelers, setTravelers] = useState("2");
  const [style, setStyle] = useState("Nature & slow travel");
  const [interests, setInterests] = useState("waterfalls, local food, coffee estates, scenic viewpoints");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(""); setTrip(null);
    try {
      const response = await fetch("/api/trips/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days: Number(days), budget, travelers: Number(travelers), style, interests })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create your itinerary.");
      setTrip({ ...data.trip, demoMode: Boolean(data.demoMode) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  return <main>
    <header style={{ borderBottom: "1px solid #e8e8df", background: "rgba(255,255,255,.72)" }}>
      <div className="container" style={{ height: 76, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, color: "inherit", textDecoration: "none", fontWeight: 900, fontSize: 22 }}><span style={{ background: "#365314", color: "white", padding: 9, borderRadius: 12, display: "inline-flex" }}><Compass size={22}/></span> roamly<span style={{ color: "#65a30d" }}>.</span></a>
        <span style={{ fontSize: 13, color: "#647067" }}>Travel thoughtfully · Go further</span>
      </div>
    </header>

    <section className="hero" style={{ padding: "76px 0 64px" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(300px,.82fr)", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #d4e4c7", borderRadius: 99, padding: "8px 13px", color: "#45651d", fontSize: 13, fontWeight: 700, background: "#ffffffa8" }}><Sparkles size={15}/> YOUR PERSONAL AI TRAVEL DESIGNER</div>
          <h1 style={{ fontSize: "clamp(42px,6vw,72px)", lineHeight: 1.02, letterSpacing: "-.055em", margin: "22px 0", maxWidth: 680 }}>Less planning.<br/><span style={{ color: "#65a30d" }}>More wonder.</span></h1>
          <p style={{ color: "#59655b", fontSize: 18, lineHeight: 1.7, maxWidth: 520 }}>Tell us your destination, budget, and travel style. Get a day-by-day trip plan made for you—not everyone else.</p>
          <div style={{ display: "flex", gap: 22, marginTop: 28, flexWrap: "wrap", color: "#465347", fontSize: 13 }}><span style={{ display: "flex", gap: 7, alignItems: "center" }}><Leaf size={16}/> Personalised routes</span><span style={{ display: "flex", gap: 7, alignItems: "center" }}><Wallet size={16}/> Budget-aware ideas</span><span style={{ display: "flex", gap: 7, alignItems: "center" }}><Clock3 size={16}/> Day-by-day plan</span></div>
        </div>
        <div style={{ borderRadius: 28, overflow: "hidden", minHeight: 320, background: "linear-gradient(160deg,#b8d4a3,#6c8c62 48%,#254a38)", position: "relative", padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white" }}>
          <div style={{ position: "absolute", inset: 0, opacity: .24, backgroundImage: "radial-gradient(ellipse at 20% 30%, #fff 0 1px, transparent 2px), radial-gradient(ellipse at 70% 55%, #fff 0 1px, transparent 2px)", backgroundSize: "34px 34px, 48px 48px" }} />
          <div style={{ position: "relative", alignSelf: "flex-end", background: "#ffffff26", border: "1px solid #ffffff55", padding: "9px 12px", borderRadius: 99, fontSize: 12 }}>✦ A little adventure awaits</div>
          <div style={{ position: "relative" }}><div style={{ fontSize: 13, opacity: .8, letterSpacing: ".15em" }}>THE WEEKEND EDIT</div><div style={{ fontSize: 39, fontWeight: 800, letterSpacing: "-.04em", marginTop: 8 }}>Find your<br/>own kind of wild.</div><div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}><MapPin size={16}/> Western Ghats, India</div></div>
        </div>
      </div>
    </section>

    <section className="container" style={{ marginTop: -22, position: "relative", paddingBottom: 80 }}>
      <div className="card" style={{ padding: "clamp(22px,4vw,38px)" }}>
        <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 26, margin: 0, letterSpacing: "-.03em" }}>Plan your escape</h2><p style={{ color: "#738075", margin: "8px 0 0" }}>A few details are all we need to get started.</p></div>
        <form onSubmit={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: "grid", gap: 9 }}>Where to? <input className="field" required value={destination} onChange={e=>setDestination(e.target.value)} placeholder="e.g. Kyoto, Japan"/></label>
            <label style={{ fontSize: 13, fontWeight: 700, display: "grid", gap: 9 }}>Trip duration <select className="field" value={days} onChange={e=>setDays(e.target.value)}>{[1,2,3,4,5,6,7,8,9,10,14].map(n=><option key={n} value={n}>{n} day{n>1?"s":""}</option>)}</select></label>
            <label style={{ fontSize: 13, fontWeight: 700, display: "grid", gap: 9 }}>Total budget <input className="field" required value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. ₹20,000"/></label>
            <label style={{ fontSize: 13, fontWeight: 700, display: "grid", gap: 9 }}>Travellers <select className="field" value={travelers} onChange={e=>setTravelers(e.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} traveller{n>1?"s":""}</option>)}</select></label>
            <label style={{ fontSize: 13, fontWeight: 700, display: "grid", gap: 9 }}>Travel vibe <select className="field" value={style} onChange={e=>setStyle(e.target.value)}>{["Nature & slow travel","Food & culture","Adventure","Luxury & comfort","Family-friendly","Budget backpacking","Romantic getaway","History & architecture"].map(s=><option key={s}>{s}</option>)}</select></label>
            <label style={{ fontSize: 13, fontWeight: 700, display: "grid", gap: 9 }}>What do you love? <input className="field" value={interests} onChange={e=>setInterests(e.target.value)} placeholder="Food, beaches, museums…"/></label>
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ marginTop: 24, background: "#365314", color: "white", border: 0, display: "inline-flex", gap: 10, alignItems: "center" }}>{loading?<><LoaderCircle size={17} className="spin"/> Creating your trip…</>:<>Create my itinerary <ArrowRight size={17}/></>}</button>
        </form>
        {error && <p role="alert" style={{ marginTop: 18, color: "#b42318" }}>{error}</p>}
      </div>

      {trip && <section aria-live="polite" style={{ marginTop: 32 }}>
        <div className="card" style={{ padding: "clamp(22px,4vw,36px)" }}>
          <div style={{ color: "#65a30d", fontWeight: 800, fontSize: 12, letterSpacing: ".12em" }}>YOUR PERSONAL ITINERARY</div>
          {trip.demoMode && (
            <div style={{ display: "inline-flex", marginTop: 8, background: "#fef3c7", border: "1px solid #f9d77f", color: "#92400e", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 700 }}>
              Demo mode: sample itinerary data
            </div>
          )}
          <h2 style={{ fontSize: 34, letterSpacing: "-.04em", margin: "10px 0" }}>{trip.title}</h2>
          <p style={{ color: "#5b665c", lineHeight: 1.7 }}>{trip.overview}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "20px 0 30px" }}>
            {[["Estimated budget",trip.estimatedBudget],["Best time",trip.bestTime]].map(([label,value])=><div key={label} style={{ background: "#f2f6ec", borderRadius: 13, padding: "13px 16px" }}><div style={{ fontSize: 11, color: "#75816f" }}>{label}</div><div style={{ fontWeight: 800, marginTop: 4 }}>{value}</div></div>)}
          </div>
          <div style={{ display: "grid", gap: 16 }}>{trip.itinerary?.map(day=><article key={day.day} style={{ border: "1px solid #e6e9df", borderRadius: 18, padding: 20 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 20 }}>Day {day.day} · {day.title}</h3>
            <div style={{ display: "grid", gap: 12 }}>{day.activities?.map((a,i)=><div key={i} style={{ display: "grid", gridTemplateColumns: "88px minmax(0,1fr)", gap: 12 }}>
              <span style={{ fontSize: 12, color: "#6d7b69", paddingTop: 3 }}>{a.time}</span><div><div style={{ fontWeight: 800 }}>{a.name}</div><div style={{ color: "#687368", fontSize: 14, lineHeight: 1.6, marginTop: 3 }}>{a.description}</div><div style={{ color: "#4d7c0f", fontSize: 12, marginTop: 5 }}>{a.estimatedCost}</div></div>
            </div>)}</div>
          </article>)}</div>
          {trip.tips?.length>0 && <div style={{ marginTop: 24, background: "#f7f8f2", borderRadius: 16, padding: 20 }}><h3 style={{ marginTop: 0 }}>Helpful tips</h3><ul style={{ marginBottom: 0, color: "#5e6a5f", lineHeight: 1.9 }}>{trip.tips.map((tip,i)=><li key={i}>{tip}</li>)}</ul></div>}
          <p style={{ fontSize: 12, color: "#889187", marginTop: 22 }}>AI-generated suggestions can be inaccurate. Confirm opening hours, prices, transport, and local safety guidance before travelling.</p>
        </div>
      </section>}
      <footer style={{ padding: "30px 0", textAlign: "center", color: "#879084", fontSize: 12 }}>Made for curious travellers · Roamly AI Trip Planner</footer>
    </section>
    <style jsx global>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } @media(max-width:760px){ .hero .container { grid-template-columns:1fr !important; } }`}</style>
  </main>;
}