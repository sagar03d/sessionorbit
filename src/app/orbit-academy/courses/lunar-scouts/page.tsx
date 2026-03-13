import { type Metadata } from "next";
import CourseDetailTemplate from "../../components/CourseDetailTemplate";

export const metadata: Metadata = {
  title: "Lunar Scouts — SessionOrbit Academy",
  description: "Explore moon science, orbital mechanics, and lunar geology. A beginner-friendly space course for kids aged 10-12.",
};

export default function LunarScoutsPage() {
  return (
    <CourseDetailTemplate
      badge="Ages 10–12 · Beginner Friendly"
      badgeColor="#00f2ff"
      title="Lunar Scouts"
      tagline="Where Every Great Space Career Begins"
      description="Your child's first giant leap! Lunar Scouts makes the Moon our classroom — from surface geology and lunar phases to the engineering challenges that make living on another world possible."
      accentColor="#00f2ff"
      heroGradient="linear-gradient(135deg, #060820 0%, #0a1a3a 50%, #060820 100%)"
      previewTitle="Introduction to Lunar Exploration · Live Sample Lesson"
      videoSrc="/academy/sample-video/commandar-nova-sample.mp4" 
      stats={[
        { icon: "BookOpen", label: "Live Lessons", value: "12" },
        { icon: "Users", label: "Avg Class Size", value: "8–12" },
        { icon: "Clock", label: "Per Session", value: "45 min" },
        { icon: "Star", label: "Avg Rating", value: "4.9★" },
      ]}
      teacher={{
        name: "ARIA",
        nickname: "Astronaut Research & Interactive AI",
        avatar: "/academy/aria.jpg",
        specialty: "Lunar Science, Orbital Mechanics & Space History",
        bio: "ARIA is a patient, encouraging AI educator who loves making complex science feel like an adventure. She adapts to each student's pace and celebrates every milestone on their lunar learning journey.",
        stats: [
          { label: "Students", value: "3.2K+" },
          { label: "Rating", value: "4.9★" },
          { label: "Courses", value: "6" },
        ],
      }}
      syllabus={[
        {
          week: "Week 1–2",
          title: "The Moon: Earth's Neighbor in Space",
          topics: [
            "Formation of the Moon — the Giant Impact Hypothesis",
            "Moon phases explained with interactive 3D model",
            "Tides, gravity, and their effect on Earth",
            "Quiz: Lunar geography & feature identification",
          ],
        },
        {
          week: "Week 3–4",
          title: "Orbital Mechanics Made Simple",
          topics: [
            "What is an orbit? Gravity vs. velocity",
            "How Apollo astronauts reached the Moon",
            "Understanding Kepler's laws with animations",
            "Mini-project: Plot your own lunar orbit",
          ],
        },
        {
          week: "Week 5–6",
          title: "Lunar Geology & Surface Exploration",
          topics: [
            "Craters, maria, and highlands — reading the Moon's history",
            "What astronauts brought back: Moon rocks & regolith",
            "Virtual field trip: Apollo 11 landing site",
            "Build your own crater model",
          ],
        },
        {
          week: "Week 7–8",
          title: "Living on the Moon — Engineering Challenges",
          topics: [
            "Why the Moon is so different from Earth",
            "Designing a lunar habitat (temperature, radiation, air)",
            "Water on the Moon: Ice in the shadows",
            "Team project: Design your lunar base blueprint",
          ],
        },
        {
          week: "Week 9–10",
          title: "Robots & Rovers on the Moon",
          topics: [
            "History of lunar robots: Soviet and US missions",
            "How rovers navigate without a driver",
            "Programming a virtual rover challenge",
            "Compare: Curiosity vs. Artemis rovers",
          ],
        },
        {
          week: "Week 11–12",
          title: "Graduation Mission: Lunar Colony Design",
          topics: [
            "Capstone project: Full lunar colony design presentation",
            "Student mission briefing & peer review",
            "Certificate ceremony with parent showcase",
            "Preview: Advancing to Rocket Architects",
          ],
        },
      ]}
      outcomes={[
        "Explain how the Moon formed and orbits Earth",
        "Identify major lunar features using real NASA imagery",
        "Understand orbital mechanics and gravitational physics",
        "Design a functional concept lunar habitat",
        "Interpret basic mission data like real space scientists",
        "Build confidence in STEM thinking and problem-solving",
      ]}
    />
  );
}
