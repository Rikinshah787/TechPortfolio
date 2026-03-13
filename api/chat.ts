import type { VercelRequest, VercelResponse } from "@vercel/node";

// Lightweight, in-repo knowledge base about Rikin.
// This is what \"trains\" the avatar to answer from the portfolio.
interface KnowledgeEntry {
  id: string;
  tags: string[];
  text: string;
}

const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "about",
    tags: ["who", "about", "rikin", "bio", "summary", "introduce"],
    text:
      "Rikin Shah, MS, CSM, is a Creative Builder, Agentic AI Developer, and Project Manager with 6+ years of experience across enterprise tech (Deloitte, CBS), SAP, GenAI, and data systems. He blends engineering depth, product thinking, and delivery discipline to ship useful systems end-to-end. He currently works on AGI-aligned automation platforms with multi-agent pipelines and DevOps deployment. He has 2,900+ LinkedIn connections and is actively building in the AI agent space.",
  },
  {
    id: "experience-cbs",
    tags: ["cbs", "creative business", "agentic", "agi", "current", "contract", "devops", "azure"],
    text:
      "At Creative Business Solutions, Inc. (Nov 2025–Present), Rikin works as an Agentic AI Developer (Contract). He leads requirements gathering and system architecture for AGI-aligned automation platforms, translating decision workflows into orchestrated multi-agent pipelines, model API interfaces, and scalable DevOps-ready deployments. He manages Jira and Azure DevOps boards, integrated 5+ enterprise data sources into cloud environments powering agentic reasoning, and reduced end-to-end deployment latency by 15% through DevOps optimization.",
  },
  {
    id: "experience-enterprise",
    tags: ["deloitte", "sap", "enterprise", "consultant", "analytics suite", "etl", "pipeline", "power bi", "go", "rest api"],
    text:
      "At Deloitte India (Jan 2021–Dec 2023), Rikin was a Consultant who delivered 3 end-to-end enterprise data platform implementations supporting large-scale analytics and ML workloads across agro-business, healthcare, and automotive clients. He designed distributed data architectures using SQL, Python, R; engineered scalable ETL pipelines processing 3.2M+ records; developed backend services using REST APIs, message queues, and event-driven pipelines (including Go); executed Agile delivery across 12 sprints managing Jira and Azure DevOps; improved release cycle time by 45% and delivery velocity by 15%; achieved 7.5% cost savings. Earned Applause Award (Apr 2023) and Spot Award (Dec 2022).",
  },
  {
    id: "experience-asu",
    tags: ["asu", "arizona", "grader", "teaching", "ta", "java", "ai", "ml", "genai"],
    text:
      "At Arizona State University (Feb 2024–Dec 2025), Rikin served as IT/AI Grader, guiding PM students on applying GenAI and data engineering concepts within software lifecycles including system design, model evaluation, data pipelines, and production deployment planning. He supported Agile-based coursework showing how AI integrates with sprint execution, backlog prioritization, and milestone-driven delivery.",
  },
  {
    id: "experience-smartkid",
    tags: ["smartkid", "chess", "academy", "coaching", "founder", "uscf"],
    text:
      "Rikin founded SmartKid Academy (Jun 2017–Present), a chess coaching platform where he has trained 200+ students with a team of six instructors. He is a USCF-rated 1792 player, AICF-certified chess instructor, USCF Tournament Director, and built the SEO-optimized website at smartkid.co.in that drives 100+ weekly active users.",
  },
  {
    id: "experience-infornation",
    tags: ["infornation", "techserve", "software engineer", "foodmantic", "wireframe", "ado"],
    text:
      "At Infornation Techserve (May 2017–May 2020), Rikin worked as a Software Engineer. He built normalized schemas, transformation jobs, and aggregation layers; supported migration of legacy data workflows to modern pipelines; and coordinated development tasks and release activities using Azure DevOps (ADO).",
  },
  {
    id: "multi-llm-orchestration",
    tags: ["multi-llm", "orchestration", "agents", "context graph", "emergent", "agentos", "clawarmy"],
    text:
      "In his Multi-LLM Orchestration with Shared Memory project (AgentOS), Rikin wired multiple models like Llama and Kimi into a shared, real-time context graph and persistent memory. Agents broadcast, critique, execute, and spawn new tasks without a supervisor, leading to emergent coordination. His related project ClawArmy is a Mission Control platform for designing, deploying, and synchronizing AI Agent Specialists with zero-friction automation.",
  },
  {
    id: "reachai",
    tags: ["reachai", "outbound", "groq", "llama 3.1", "sdr", "email", "cold email", "automation"],
    text:
      "ReachAI is Rikin's multi-agent outbound automation engine. It uses Groq-hosted Llama 3.1, Hunter.io, and SMTP to automate the full SDR workflow: lead sourcing, AI-personalized cold emails, batch scheduling, rate limiting, SMTP delivery, and reply classification, all through a real-time Python/React dashboard.",
  },
  {
    id: "mailalarm",
    tags: ["mailalarm", "email", "twilio", "alert", "phone", "imap"],
    text:
      "MailAlarm is a Vite.js and Express based system that watches IMAP inboxes for high-priority senders and triggers Twilio voice calls every 30 seconds with IVR and 'press 1-9-9' acknowledgement, backed by a web dashboard for sender rules and one-click deployment.",
  },
  {
    id: "jobgrid",
    tags: ["jobgrid", "chrome extension", "job search", "job board"],
    text:
      "JobGrid is a Chrome extension that orchestrates 18+ job boards (LinkedIn, Indeed, Glassdoor, Dice, RemoteOK, Wellfound, etc.) into a split-screen unified dashboard with Magic Search, URL-level query normalization, and cross-site filter sync. V2.00 is launching based on user feedback.",
  },
  {
    id: "llmresume",
    tags: ["resume", "ats", "latex", "optimizer"],
    text:
      "Rikin built LLMResume, a Flask-based ATS resume optimizer that tailors LaTeX resumes to job descriptions. It offers PRO Mode (AI-powered bullet rewriting with Groq LLM) and SMART Mode (fast rule-based keyword injection).",
  },
  {
    id: "ibm-watson",
    tags: ["ibm", "watson", "hackathon", "orchestration"],
    text:
      "In the IBM Watson Orchestration Hackathon (Nov 2025), Rikin built and deployed a modular AI orchestration platform coordinating 4 autonomous agents, scaling Watson API integration with open-source code, and delivering unified company insights that improved decision-making efficiency by 80%.",
  },
  {
    id: "portfolio-3d",
    tags: ["portfolio", "3d", "avatar", "three.js", "website", "resume"],
    text:
      "Rikin's portfolio is built with React, TypeScript, Three.js, and GSAP, featuring a custom 3D avatar, dark + emerald aesthetic, smooth scrolling, and an AI-powered chat avatar backed by Groq so visitors can ask questions conversationally. His resume is available for download at /videos/resume_20260303_144417_928013_7cce5aaa.pdf.",
  },
  {
    id: "skills",
    tags: ["skills", "stack", "tech", "language", "framework", "tool", "pm", "agile", "data", "cloud", "ai", "sap"],
    text:
      "Rikin's skills span four pillars: PM & Agile (Scrum, Agile, Airtable, Jira, Confluence, Azure DevOps, Microsoft Project, Visio, OKRs, KPIs); Data & Cloud (SQL, Fabric, PL-SQL, Python, Databricks, AWS, GCP BigQuery, Hadoop, ETL/ELT Pipelines, Data Modeling); AI & Analytics (Power BI, IBM Orchestrate, Tableau, ML, NLP, Cursor, n8n, Crew.ai, Bedrock, Phantombuster); SAP & Tech (SAP BW/4HANA, S/4 HANA, BODS, Datasphere, BTP, SSIS, SSRS, Data Integration, Git). He also works with React, TypeScript, Node.js, Three.js, Go, and modern GenAI tooling.",
  },
  {
    id: "education",
    tags: ["education", "degree", "university", "college", "masters", "bachelor", "gpa"],
    text:
      "Rikin holds an M.S. in Information Technology (Project Management) from Arizona State University (Jan 2024–Dec 2025, GPA 4.00) and an M.S. in Information Technology (Data & AI) from Mumbai University (Nov 2020–Aug 2022, GPA 9.88). At ASU he studied Advanced Database Management, AWS Cloud Architecture, Security Policy, and Data Processing at Scale.",
  },
  {
    id: "certifications",
    tags: ["certification", "csm", "aws", "databricks", "scrum", "pmp", "mern"],
    text:
      "Rikin holds: Certified Scrum Master (CSM), PMI GenAI for Project Managers, PMP (In-Progress), Leading Agile Teams with Jira, AWS Cloud Architecting, AWS Cloud Operations, Databricks Fundamentals, SAP Fundamentals, MERN Stack certification, and Git/GitHub Version Control certification.",
  },
  {
    id: "awards",
    tags: ["award", "recognition", "applause", "spot"],
    text:
      "Rikin received an Applause Award (Apr 2023) and a Spot Award (Dec 2022) from Deloitte Consulting for exceptional delivery performance.",
  },
  {
    id: "publications",
    tags: ["publication", "paper", "research", "sentiment", "intrusion"],
    text:
      "Rikin co-authored 'A Comparative Analysis of Modern Intrusion Detection Systems: Effectiveness in Detecting Zero-Day Attacks' (Feb 2025) and published 'Sentiment Analysis' in the ICETDT-2022 proceedings (International Journal of Advance and Innovative Research, Volume 9).",
  },
  {
    id: "recommendations",
    tags: ["recommendation", "reference", "professor", "paul", "naresh"],
    text:
      "Professor Paul Fries (ASU Cloud Operations & Security) called Rikin 'one of the most intellectually curious, disciplined, and technically adept students' and praised his ability to connect cloud architecture with real-world security. Dr. Naresh Sukhani (UPG College) highlighted his strong work ethic, problem-solving skills, and proactive approach.",
  },
  {
    id: "contact",
    tags: ["contact", "email", "github", "linkedin", "reach", "hire", "opportunity", "location", "relocate", "tempe", "arizona"],
    text:
      "Rikin is currently based in Tempe, Arizona and is open to relocating for the right opportunity. The best way to reach him is at rshah88@asu.edu or phone 917-238-5682. Find him on GitHub (github.com/Rikinshah787, 26 public repos), LinkedIn (linkedin.com/in/rikinshah787, 2,900+ connections), and his website rikin.tech. He is actively seeking full-time opportunities. Visitors can also scroll to the Contact section on this portfolio page or download his resume.",
  },
];

const FALLBACK_ANSWERS: Record<string, string> = {
  experience:
    "Rikin has 6+ years of experience spanning enterprise tech (Deloitte, SAP), GenAI, and project management. He's worked across full-stack engineering, data pipelines, and agile delivery.",
  project:
    "Some key projects: Multi-LLM Orchestration with Shared Memory, JobGrid, MailAlarm, ReachAI, SmartKid Academy, and an SAP Analytics Suite handling 3.2M+ records.",
  skill:
    "Rikin works with React, TypeScript, Python, Java, SAP BW/4HANA, AWS, Power BI, SQL, Node.js, and GenAI. He's also a Certified Scrum Master.",
  education:
    "MS in IT Project Management from Arizona State University, plus MS IT and BS IT from UPG College in India (9.88 and 8.75 GPA respectively).",
  chess:
    "Rikin is a USCF-rated 1792 chess player and founder of SmartKid Academy, where he's coached 200+ students with a team of 6 instructors.",
  contact:
    "You can reach Rikin at rikinshah787@gmail.com, or find him on GitHub (Rikinshah787) and LinkedIn (rikinshah787).",
  hire:
    "Rikin is a creative builder who combines engineering depth with project management skills. He'd love to discuss opportunities — drop him a line at rikinshah787@gmail.com!",
  about:
    "Rikin Shah is a Creative Builder, Project Manager, and Engineer. He's passionate about building things that solve real problems, from GenAI agents to chess education platforms.",
  deloitte:
    "At Deloitte India (Jan 2021–Dec 2023), Rikin led 3 end-to-end SAP ERP implementations, built ETL pipelines for 3.2M+ records, and improved delivery timelines by 45%.",
  asu:
    "At Arizona State University, Rikin served as SAP PM / IT Grader, guiding students through SAP enterprise systems with a 97% completion rate. He also mentored AI/ML projects.",
  jobgrid:
    "JobGrid is a Chrome extension that orchestrates 18+ job boards with a Magic Search feature, making job hunting dramatically faster and more organized.",
  reachai:
    "ReachAI is a multi-agent outbound automation system built with Groq LLM, Hunter.io, and SMTP — automating intelligent outreach at scale.",
  certification:
    "Rikin holds certifications in Scrum (CSM), AWS (2x Academy), Databricks Fundamentals, and Generative AI for PMs.",
};

function buildKnowledgeContext(userText: string): string {
  const q = userText.toLowerCase();
  const scored = KNOWLEDGE.map((entry) => {
    let score = 0;
    for (const tag of entry.tags) {
      if (q.includes(tag)) score += 2;
    }
    if (q.includes("project") && entry.id.includes("multi-llm")) score += 1;
    if (q.includes("portfolio") && entry.id === "portfolio-3d") score += 1;
    return { entry, score };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 4).map((x) => `- ${x.entry.text}`);

  if (!top.length) return "";
  return `Here are structured facts about Rikin's portfolio and work. Ground your answer ONLY in these when relevant:\n\n${top.join(
    "\n"
  )}`;
}

function fallbackReply(userText: string): string {
  const lower = userText.toLowerCase();
  for (const [key, answer] of Object.entries(FALLBACK_ANSWERS)) {
    if (lower.includes(key)) return answer;
  }
  if (lower.match(/who|about|tell me|introduce/))
    return FALLBACK_ANSWERS.about;
  if (lower.match(/work|job|career|experience|where/))
    return FALLBACK_ANSWERS.experience;
  if (lower.match(/build|project|made|create/))
    return FALLBACK_ANSWERS.project;
  if (lower.match(/tech|stack|skill|know|language|framework/))
    return FALLBACK_ANSWERS.skill;
  if (lower.match(/school|degree|study|universit|college/))
    return FALLBACK_ANSWERS.education;
  if (lower.match(/reach|email|contact|connect|social/))
    return FALLBACK_ANSWERS.contact;
  if (lower.match(/hire|recruit|opportu|position|availab/))
    return FALLBACK_ANSWERS.hire;

  return "Great question! Rikin has a diverse background in engineering, project management, and GenAI. Try asking about his projects, skills, or experience for specifics!";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, context } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages required" });
  }

  const lastUserMsg = messages.filter((m: { role: string }) => m.role === "user").pop();
  const provider = process.env.LLM_PROVIDER || "groq";
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const userText = lastUserMsg?.content || "";
  const kb = buildKnowledgeContext(userText);
  const systemContext = kb
    ? `${context}\n\n${kb}`
    : context;

  try {
    if (provider === "groq" && groqKey) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 200,
          messages: [
            { role: "system", content: systemContext },
            ...messages.slice(-6),
          ],
        }),
      });

      if (!groqRes.ok) {
        return res.json({ reply: fallbackReply(lastUserMsg?.content || "") });
      }

      const data = await groqRes.json();
      const reply =
        data.choices?.[0]?.message?.content || fallbackReply(lastUserMsg?.content || "");
      return res.json({ reply });
    }

    if (openaiKey) {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
          max_tokens: 200,
          messages: [
            { role: "system", content: systemContext },
            ...messages.slice(-6),
          ],
        }),
      });

      if (!openaiRes.ok) {
        return res.json({ reply: fallbackReply(lastUserMsg?.content || "") });
      }

      const data = await openaiRes.json();
      const reply =
        data.choices?.[0]?.message?.content || fallbackReply(lastUserMsg?.content || "");
      return res.json({ reply });
    }

    // No keys configured – pure fallback mode
    return res.json({ reply: fallbackReply(lastUserMsg?.content || "") });
  } catch {
    return res.json({ reply: fallbackReply(lastUserMsg?.content || "") });
  }
}
