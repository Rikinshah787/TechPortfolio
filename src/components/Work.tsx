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
              name: "AgentOS – Multi‑LLM Orchestration",
              category: "AI Engineering / Multi-Agent Systems",
              description:
                "Experimental multi-LLM orchestration system where Llama, Kimi and other models share a real-time context graph and persistent memory, coordinating without a central supervisor. Agents broadcast, critique, execute and spawn new tasks while writing into a shared world state, leading to emergent collaboration.",
              tech: "Llama, Kimi, Python, TypeScript, shared context graph, persistent memory, autonomous agents",
              link: "https://github.com/Rikinshah787/AgentOS-Multi-LLM-System",
              video: "/videos/Mutli-orch.mp4",
            },
            {
              name: "ClawArmy",
              category: "AI Agent Platform",
              description:
                "An elite Mission Control platform for designing, deploying, and synchronizing AI Agent Specialists. Enables developers to synthesize custom agent squads and inject them directly into local workspaces with zero-friction automation.",
              tech: "TypeScript, AI agents, orchestration, automation",
              link: "https://github.com/Rikinshah787/clawarmy",
              video: "/videos/clawarmy.mp4",
            },
            {
              name: "JobGrid",
              category: "Chrome Extension",
              description:
                "Browser-native job search extension orchestrating 18+ job boards (LinkedIn, Indeed, Glassdoor, Dice, RemoteOK, Wellfound) into a split-screen unified dashboard with Magic Search, URL-level query normalization, and cross-site filter sync. V2.00 launching based on user feedback.",
              tech: "JavaScript, Chrome APIs, HTML, CSS",
              link: "https://github.com/Rikinshah787/Jobgrid",
              image: "/images/1771099904206.jpg",
            },
            {
              name: "ReachAI",
              category: "AI/ML Platform",
              description:
                "Multi-agent outbound automation engine that handles the full SDR workflow end-to-end: lead sourcing via Hunter.io, Groq-hosted Llama 3.1 for AI-personalized cold emails, batch scheduling, rate limiting, SMTP delivery + reply classification, all through a real-time Python/React dashboard.",
              tech: "Python, React, Groq, Llama 3.1, Hunter.io, SMTP",
              link: "https://github.com/Rikinshah787/ReachAI",
            },
            {
              name: "MailAlarm",
              category: "Full-Stack App",
              description:
                "Open-source email monitoring service that watches IMAP inboxes for high-priority senders and triggers Twilio voice calls every 30 seconds with IVR and 'press 1-9-9' acknowledgement, backed by a web dashboard for sender rules and one-click deployment.",
              tech: "Vite.js, Express, Twilio, IMAP, Node.js",
            },
            {
              name: "LLMResume",
              category: "AI Tool",
              description:
                "Flask-based ATS resume optimizer that intelligently tailors LaTeX resumes to job descriptions. Choose between AI-powered bullet rewriting (PRO Mode with Groq LLM) or fast rule-based keyword injection (SMART Mode).",
              tech: "Python, Flask, Groq LLM, LaTeX",
              link: "https://github.com/Rikinshah787/llmresume",
            },
            {
              name: "SmartKid Academy",
              category: "EdTech Platform",
              description:
                "Chess coaching platform serving 200+ students with a team of 6 instructors. Features SEO-optimized website driving 100+ weekly active users, training materials, and hybrid learning support.",
              tech: "HTML, CSS, JavaScript, SEO",
              link: "https://smartkid.co.in",
            },
            {
              name: "SAP Analytics Suite",
              category: "Enterprise Data",
              description:
                "Enterprise reporting and analytics solutions using SAP BW/4HANA with scalable ETL pipelines processing 3.2M+ records across fintech, healthcare, and automotive clients.",
              tech: "SAP BW, HANA, BODS, SSIS, SSRS, Python, Databricks",
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
                {project.description && <p>{project.description}</p>}
                <h4>Tools and features</h4>
                <p>{project.tech}</p>
                {"link" in project && project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                    className="work-project-link"
                  >
                    View GitHub
                  </a>
                )}
              </div>
              <WorkImage
                image={"image" in project && project.image ? project.image : "/images/placeholder.webp"}
                alt={project.name}
                video={"video" in project ? project.video : undefined}
                link={"link" in project ? project.link : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
