import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
  let translateX: number = 0;

  function setTranslateX() {
    const box = document.getElementsByClassName("work-box");
    const rectLeft = document
      .querySelector(".work-container")!
      .getBoundingClientRect().left;
    const rect = box[0].getBoundingClientRect();
    const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
    let padding: number =
      parseInt(window.getComputedStyle(box[0]).padding) / 2;
    translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
  }

  setTranslateX();

  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: `+=${translateX}`, // Use actual scroll width
      scrub: true,
      pin: true,
      id: "work",
    },
  });

  timeline.to(".work-flex", {
    x: -translateX,
    ease: "none",
  });

  // Clean up (optional, good practice)
  return () => {
    timeline.kill();
    ScrollTrigger.getById("work")?.kill();
  };
}, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[
            {
              name: "JobGrid",
              category: "Chrome Extension",
              description: "Multi-Platform Job Search Chrome Extension orchestrating 18+ job boards into a unified dashboard with Magic Search and cross-site filter synchronization.",
              tech: "JavaScript, Chrome APIs, HTML, CSS",
            },
            {
              name: "MailAlarm",
              category: "Full-Stack App",
              description: "Phone-Call Based Email Alert System that watches IMAP inboxes for high-priority senders and triggers Twilio voice calls with IVR acknowledgement.",
              tech: "Vite.js, Express, Twilio, IMAP",
            },
            {
              name: "ReachAI",
              category: "AI/ML Platform",
              description: "Multi-Agent Outbound Automation Engine automating SDR workflow with AI-personalized cold emails via Groq-hosted Llama 3.1.",
              tech: "Python, React, Groq, Hunter.io",
            },
            {
              name: "SmartKid Academy",
              category: "EdTech Platform",
              description: "Chess coaching platform with training materials and learning support for 200+ students across in-person and hybrid formats.",
              tech: "HTML, CSS, JavaScript, SEO",
            },
            {
              name: "SAP Analytics Suite",
              category: "Enterprise Data",
              description: "Enterprise reporting and analytics solutions using SAP BW/4HANA with scalable ETL pipelines processing 3.2M+ records.",
              tech: "SAP BW, HANA, BODS, Python",
            },
            {
              name: "Portfolio Website",
              category: "Creative Web",
              description: "This creative 3D portfolio built with React, Three.js, and GSAP featuring a custom cartoon avatar and physics-based interactions.",
              tech: "React, TypeScript, Three.js, GSAP",
            },
          ].map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tech}</p>
              </div>
              <WorkImage image="/images/placeholder.webp" alt={project.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
