import { type Metadata } from "next";
import CourseDetailTemplate from "../../components/CourseDetailTemplate";

export const metadata: Metadata = {
  title: "Rocket Architects — SessionOrbit Academy",
  description: "Dive into STEM physics, propulsion, and rocket design. A hands-on engineering course for kids aged 12-15.",
};

export default function RocketArchitectsPage() {
  return (
    <CourseDetailTemplate
      badge="Ages 12–15 · STEM Intensive"
      badgeColor="#a855f7"
      title="Rocket Architects"
      tagline="Science Meets Engineering — Build What Others Only Dream"
      description="The course where physics gets real. Students explore propulsion, aerodynamics, and advanced mathematics to design rockets that could actually work. Hands-on simulations and team competitions included."
      accentColor="#a855f7"
      heroGradient="linear-gradient(135deg, #0d0520 0%, #1a0a40 50%, #0d0520 100%)"
      previewTitle="Introduction to Rocket Propulsion · Live Sample Lesson"
      videoSrc="/academy/sample-video/commandar-nova-sample.mp4"
      stats={[
        { icon: "BookOpen", label: "Live Lessons", value: "16" },
        { icon: "Users", label: "Avg Class Size", value: "6–10" },
        { icon: "Clock", label: "Per Session", value: "60 min" },
        { icon: "Star", label: "Avg Rating", value: "4.8★" },
      ]}
      teacher={{
        name: "NEXUS",
        nickname: "Next-gen Engineering eXpert & Unified Simulator",
        avatar: "/academy/nexus.jpg",
        specialty: "Propulsion Physics, Rocket Design & Advanced STEM Math",
        bio: "NEXUS is a high-energy AI instructor who thrives on turning 'this is too hard' into 'I just built that'. With real simulation tools and adaptive challenges, NEXUS pushes every student to their best.",
        stats: [
          { label: "Students", value: "2.8K+" },
          { label: "Rating", value: "4.8★" },
          { label: "Projects", value: "50+" },
        ],
      }}
      syllabus={[
        {
          week: "Week 1–2",
          title: "Newton's Laws: The Foundation of Rocketry",
          topics: [
            "Review of Newton's 3 Laws with real rocket examples",
            "What makes a rocket different from a plane",
            "Forces on a rocket: thrust, drag, lift, gravity",
            "Assignment: Calculate escape velocity from different planets",
          ],
        },
        {
          week: "Week 3–4",
          title: "Propulsion Systems & Rocket Fuels",
          topics: [
            "Solid vs. liquid vs. hybrid fuel engines",
            "How SpaceX Merlin and Raptor engines work",
            "The Tsiolkovsky rocket equation — made accessible",
            "Lab: Simulate a water-propulsion launch",
          ],
        },
        {
          week: "Week 5–6",
          title: "Aerodynamics & Rocket Stability",
          topics: [
            "Center of gravity vs. center of pressure",
            "Fin design and stability optimization",
            "Supersonic flight and aerodynamic heating",
            "Design challenge: Wind tunnel simulation",
          ],
        },
        {
          week: "Week 7–8",
          title: "Guidance, Navigation & Control",
          topics: [
            "How do rockets steer in space?",
            "Gimbal systems and thrust vector control",
            "Gyroscopes, accelerometers, and flight computers",
            "Code challenge: Program a virtual guidance system",
          ],
        },
        {
          week: "Week 9–10",
          title: "Multi-Stage Rockets & Orbital Insertion",
          topics: [
            "Why multi-stage rockets are more efficient",
            "Stage separation mechanics and guidance",
            "Inserting payload into low Earth orbit (LEO)",
            "Simulation: Design a 2-stage rocket to orbit",
          ],
        },
        {
          week: "Week 11–12",
          title: "Reusable Rockets & Modern Private Space",
          topics: [
            "Landing boosters: How SpaceX does it",
            "Economic case for reusability",
            "Compare: Falcon 9 vs. New Glenn vs. Starship",
            "Student debate: Should Mars be the next goal?",
          ],
        },
        {
          week: "Week 13–14",
          title: "Mission Planning & Payload Design",
          topics: [
            "What payloads to LEO, GEO, and deep space",
            "Satellite design basics and fairing constraints",
            "Heat shields and reentry thermal protection",
            "Group project: Design a complete satellite mission",
          ],
        },
        {
          week: "Week 15–16",
          title: "Capstone: Full Mission Design Competition",
          topics: [
            "Team formation and mission brief assignment",
            "Full rocket design — propulsion through payload",
            "Launch simulation & performance scoring",
            "Presentation to guest judges from aerospace industry",
          ],
        },
      ]}
      outcomes={[
        "Apply Newton's laws and calculus to real rocket design problems",
        "Understand propulsion types and calculate delta-V for missions",
        "Design aerodynamically stable multi-stage rockets",
        "Program basic guidance and navigation logic",
        "Analyze past and present real-world rocket systems",
        "Collaborate on complex engineering problems in a team",
        "Build a competition-ready mission design portfolio",
        "Qualify for Orbit Academy's Interplanetary Challenge",
      ]}
    />
  );
}
