import { type Metadata } from "next";
import CourseDetailTemplate from "../../components/CourseDetailTemplate";

export const metadata: Metadata = {
  title: "Mars Colonist (Elite) — SessionOrbit Academy",
  description: "1-on-1 AI-led Mars mission simulations with Commander Nova. The pinnacle of space education for elite young scientists.",
};

export default function MarsColonistPage() {
  return (
    <CourseDetailTemplate
      badge="Elite Program · By Application"
      badgeColor="#f7c948"
      title="Mars Colonist"
      tagline="The Most Advanced Space Education Program on Earth"
      description="The elite program reserved for our most dedicated young scientists. Work directly with Commander Nova in personalized 1-on-1 AI-led sessions, tackling the real challenges of colonizing Mars — from terraforming to interplanetary logistics."
      accentColor="#f7c948"
      heroGradient="linear-gradient(135deg, #1a0800 0%, #2d1000 50%, #1a0800 100%)"
      previewTitle="Watch Commander Nova lead a terraforming simulation."
      videoSrc="/academy/sample-video/commandar-nova-sample.mp4"
      stats={[
        { icon: "BookOpen", label: "Sessions (Unlimited)", value: "∞" },
        { icon: "Users", label: "Class Size", value: "1-on-1" },
        { icon: "Clock", label: "Session Length", value: "90 min" },
        { icon: "Star", label: "Avg Rating", value: "5.0★" },
      ]}
      teacher={{
        name: "Commander Nova",
        nickname: "AI Mission Specialist & Colonization Strategist",
        avatar: "/academy/nova.jpg",
        specialty: "Mars Mission Architecture, Terraforming & Interplanetary Logistics",
        bio: "Commander Nova is Orbit Academy's most advanced AI instructor — a mission specialist AI trained on the complete canon of Mars research, planetary science, and colonization theory. Nova provides deep, personalized mentorship that adapts to each elite student's unique trajectory.",
        stats: [
          { label: "1-on-1 Sessions", value: "800+" },
          { label: "Rating", value: "5.0★" },
          { label: "Mission Plans", value: "120+" },
        ],
      }}
      syllabus={[
        {
          week: "Module 1",
          title: "Why Mars? The Science & Politics of Colonization",
          topics: [
            "Mars vs. Moon vs. asteroids — why Mars is the next giant leap",
            "Mars atmosphere, gravity, and surface conditions",
            "The Fermi Paradox and the urgency of becoming multi-planetary",
            "Reading: Elon Musk & Zubrin's Mars colonization plans",
          ],
        },
        {
          week: "Module 2",
          title: "Getting to Mars — Trajectory & Transit",
          topics: [
            "Hohmann transfer orbits and launch windows",
            "The 6–9 month journey: Challenges of deep space transit",
            "Cosmic radiation protection during transit",
            "1-on-1: Design your own Mars transit plan with Commander Nova",
          ],
        },
        {
          week: "Module 3",
          title: "Landing on Mars — Entry, Descent & Landing",
          topics: [
            "Atmospheric entry with a thin CO₂ atmosphere",
            "Heat shield engineering and EDL sequence",
            "Precision landing: How Perseverance nailed it",
            "Simulation: Pilot your own EDL sequence",
          ],
        },
        {
          week: "Module 4",
          title: "Surviving Mars — Life Support & Habitat Design",
          topics: [
            "ISRU — making oxygen, water, and fuel from Martian resources",
            "Radiation shielding: underground habitats & regolith walls",
            "Food production in Martian gravity and light",
            "Project: Design a 10-person self-sustaining Mars habitat",
          ],
        },
        {
          week: "Module 5",
          title: "Terraforming Mars — Long-Term Vision",
          topics: [
            "What is terraforming and is it possible?",
            "Greenhouse gas injection and atmospheric pressure building",
            "Melting Martian polar ice caps — feasibility analysis",
            "Ethics of terraforming and planetary protection",
          ],
        },
        {
          week: "Module 6",
          title: "Governance & Society on Mars",
          topics: [
            "Who owns Mars? Legal frameworks for space settlement",
            "Building a Martian economy: resources, trade, independence",
            "Social structure and governance in isolated communities",
            "Student debate: Should Mars be governed by Earth?",
          ],
        },
        {
          week: "Ongoing",
          title: "Personal Mission Planning with Commander Nova",
          topics: [
            "Monthly 1-on-1 deep dive sessions tailored to student goals",
            "Guest sessions with aerospace professionals and scientists",
            "Collaborative research projects with global elite cohort",
            "Portfolio building for future university and aerospace applications",
          ],
        },
      ]}
      outcomes={[
        "Design end-to-end Mars mission architecture from launch to settlement",
        "Analyze terraforming strategies using real planetary science data",
        "Develop working ISRU (In-Situ Resource Utilization) proposals",
        "Navigate interplanetary orbital mechanics with precision",
        "Evaluate governance and sociological challenges of extraterrestrial colonies",
        "Produce a publishable-quality Mars colonization feasibility study",
        "Build a university-level STEM portfolio through hands-on mission design",
        "Connect with the global elite network of future space professionals",
      ]}
    />
  );
}
