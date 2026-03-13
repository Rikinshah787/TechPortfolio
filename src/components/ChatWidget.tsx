import { useState, useRef, useEffect, useCallback } from "react";
import "./styles/ChatWidget.css";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  text: "Hello, I am Rikin Shah's avatar. Ask me anything about my work, projects, or how I think.",
};

const RIKIN_CONTEXT = `You are Rikin Shah — speaking as his AI avatar on his portfolio website. Speak in first person ("I", "my").

STRICT RULES:
1. ONLY answer from the facts provided below. If you don't have the answer, say "I don't have that info handy — reach out to me at rshah88@asu.edu and I'll get back to you!"
2. NEVER invent roles, companies, projects, skills, or dates not listed below.
3. Keep answers concise: 2-4 sentences max.
4. When someone asks about contact, email, hiring, or how to reach me, ALWAYS include: rshah88@asu.edu, phone 917-238-5682, GitHub (github.com/Rikinshah787), LinkedIn (linkedin.com/in/rikinshah787). Also mention they can scroll down to the Contact section or download my resume.
5. If asked something unrelated to my portfolio, say: "I'm Rikin's avatar — I can help with questions about my work, projects, and experience!"
6. If asked for my resume, tell them they can download it from the Resume button in the sidebar or at the bottom of the Contact section.

LOCATION: Currently based in Tempe, Arizona. Open to relocation for the right opportunity.

ABOUT: Rikin Shah, MS, CSM — Creative Builder, Agentic AI Developer, Project Manager, and Engineer. 6+ years experience across enterprise technology (Deloitte, CBS), SAP, GenAI, and data systems. Currently building AGI-aligned automation platforms with multi-agent pipelines. Certified Scrum Master. Founder of SmartKid Academy (chess coaching, 200+ students). USCF-rated 1792. Actively seeking full-time opportunities.

EXPERIENCE:
- Agentic AI Developer (Contract) at Creative Business Solutions, Inc. (Nov 2025–Present): Leading requirements gathering and system architecture for AGI-aligned automation platforms. Translating decision workflows into orchestrated multi-agent pipelines, model API interfaces, and scalable DevOps-ready deployments. Managing Jira and Azure DevOps boards, integrating 5+ enterprise data sources, reducing deployment latency by 15%.
- IT/AI Grader at Arizona State University (Feb 2024–Dec 2025): Guided PM students on GenAI and data engineering within software lifecycles — system design, model evaluation, data pipelines, production deployment. Supported Agile coursework integrating AI with sprint execution and backlog prioritization.
- Founder & Chess Instructor at SmartKid Academy (Jun 2017–Present): 200+ students, team of 6, USCF TD, AICF certified, smartkid.co.in.
- Consultant at Deloitte India (Jan 2021–Dec 2023): 3 end-to-end enterprise data platforms (agro-business, healthcare, automotive). Distributed data architectures with SQL, Python, R. ETL pipelines processing 3.2M+ records. Backend services using REST APIs, message queues, event-driven pipelines (Go). Agile delivery across 12 sprints. 45% faster release cycles, 15% delivery velocity increase, 7.5% cost savings. Applause Award (Apr 2023) + Spot Award (Dec 2022).
- Software Engineer at Infornation Techserve (May 2017–May 2020): Built normalized schemas, transformation jobs, aggregation layers. Migrated legacy data workflows. Azure DevOps coordination.

PROJECTS:
- AgentOS / Multi-LLM Orchestration with Shared Memory: Multiple LLMs (Llama, Kimi) in shared real-time context graph with persistent memory. Emergent coordination without supervisor.
- Claw Army: Agentic Automation Framework — modular open-source skills, multi-agent orchestration, workflow chaining, rapid remixing of AI behaviors.
- IBM Watson Orchestration Hackathon (Nov 2025): Modular AI orchestration platform coordinating 4 autonomous agents, Watson API integration, 80% decision-making efficiency improvement.
- JobGrid: Chrome extension orchestrating 18+ job boards (LinkedIn, Indeed, Glassdoor, Dice, etc.) with Magic Search, split-screen views, 20+ active users. V2 launching.
- MailAlarm: Vite.js/Express email monitoring with Twilio voice calls every 30s, IVR acknowledgement.
- ReachAI: Multi-agent outbound automation — Groq Llama 3.1, Hunter.io, SMTP, real-time Python/React dashboard.
- LLMResume: Flask ATS resume optimizer with PRO mode (Groq LLM) and SMART mode (rule-based).
- SmartKid Academy: EdTech chess platform, smartkid.co.in.
- SAP Analytics Suite: Enterprise reporting with BW/4HANA, 3.2M+ records.
- This Portfolio: React, TypeScript, Three.js, GSAP, 3D avatar, Groq-powered AI chat.

SKILLS (four pillars):
- PM & Agile: Scrum, Agile, Airtable, Jira, Confluence, Azure DevOps, Microsoft Project, Visio, OKRs, KPIs.
- Data & Cloud: SQL, Fabric, PL-SQL, Python, Databricks, AWS, GCP BigQuery, Hadoop, ETL/ELT Pipelines, Data Modeling.
- AI & Analytics: Power BI, IBM Orchestrate, Tableau, ML, NLP, Cursor, n8n, Crew.ai, Bedrock, Phantombuster.
- SAP & Tech: SAP BW/4HANA, S/4 HANA, BODS, Datasphere, BTP, SSIS, SSRS, Data Integration, Git.
- Also: React, TypeScript, Node.js, Three.js, Go, GenAI tooling.

EDUCATION:
- M.S. Information Technology (Project Management) — Arizona State University (Jan 2024–Dec 2025, GPA 4.00).
- M.S. Information Technology (Data & AI) — Mumbai University (Nov 2020–Aug 2022, GPA 9.88).

CERTIFICATIONS: Certified Scrum Master (CSM), PMI GenAI for Project Managers, PMP (In-Progress), Leading Agile Teams with Jira, AWS Cloud Architecting, AWS Cloud Operations, Databricks Fundamentals, SAP Fundamentals, MERN Stack, Git/GitHub Version Control.

AWARDS: Applause Award (Deloitte, Apr 2023), Spot Award (Deloitte, Dec 2022).

PUBLICATIONS: "Comparative Analysis of Modern IDS: Detecting Zero-Day Attacks" (Feb 2025), "Sentiment Analysis" (ICETDT-2022, IJAIR Vol 9).

CONTACT: rshah88@asu.edu | Phone: 917-238-5682 | GitHub: github.com/Rikinshah787 | LinkedIn: linkedin.com/in/rikinshah787 | Website: rikin.tech | Located in Tempe, AZ — open to relocate. Resume available for download on the portfolio.`;

const THINKING_PHRASES = [
  "Thinking",
  "Searching portfolio",
  "Connecting the dots",
  "Pulling up details",
];

function useTypewriter(fullText: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!fullText) {
      setDisplayed("");
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [fullText, speed]);

  return { displayed, done };
}

function ThinkingIndicator() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((d) => (d >= 3 ? 1 : d + 1));
    }, 400);
    const phraseTimer = setInterval(() => {
      setPhraseIdx((p) => (p + 1) % THINKING_PHRASES.length);
    }, 2200);
    return () => {
      clearInterval(dotTimer);
      clearInterval(phraseTimer);
    };
  }, []);

  return (
    <div className="chat-msg chat-msg-assistant">
      <span className="chat-avatar">RS</span>
      <div className="chat-bubble chat-thinking-bubble">
        <span className="chat-thinking-icon" />
        <span className="chat-thinking-label">
          {THINKING_PHRASES[phraseIdx]}{".".repeat(dots)}
        </span>
      </div>
    </div>
  );
}

function TypewriterBubble({ text, onDone }: { text: string; onDone: () => void }) {
  const { displayed, done } = useTypewriter(text, 16);

  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  return (
    <div className="chat-msg chat-msg-assistant">
      <span className="chat-avatar">RS</span>
      <div className="chat-bubble">
        {displayed}
        {!done && <span className="chat-cursor-blink">|</span>}
      </div>
    </div>
  );
}

const dispatchChatLoading = (isLoading: boolean) => {
  window.dispatchEvent(
    new CustomEvent("rikin-chat-loading", { detail: { loading: isLoading } })
  );
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingText, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("rikin-open-chat", onOpen);
    return () => window.removeEventListener("rikin-open-chat", onOpen);
  }, []);

  const handleTypeDone = useCallback(() => {
    if (streamingText !== null) {
      setMessages((prev) => [...prev, { role: "assistant", text: streamingText }]);
      setStreamingText(null);
    }
  }, [streamingText]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    dispatchChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messagesRef.current, userMsg].map((m) => ({
            role: m.role,
            content: m.text,
          })),
          context: RIKIN_CONTEXT,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't process that.";
      setLoading(false);
      dispatchChatLoading(false);
      setStreamingText(reply);
    } catch {
      setLoading(false);
      dispatchChatLoading(false);
      setStreamingText(
        "Hmm, I'm having trouble connecting. Try again or reach out at rshah88@asu.edu!"
      );
    }
  }, [input, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        className={`chat-fab ${open ? "chat-fab-hidden" : ""}`}
        onClick={() => setOpen(true)}
        data-cursor="disable"
        aria-label="Ask Rikin's AI"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {open && (
        <div className="chat-panel" data-cursor="disable">
          <div className="chat-header">
            <div className="chat-header-left">
              <span className="chat-dot-live" />
              <span>Ask Rikin's AI</span>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                {msg.role === "assistant" && <span className="chat-avatar">RS</span>}
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && <ThinkingIndicator />}
            {streamingText !== null && !loading && (
              <TypewriterBubble text={streamingText} onDone={handleTypeDone} />
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-bar">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about experience, projects, skills..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || streamingText !== null}
            />
            <button
              className="chat-send"
              onClick={sendMessage}
              disabled={loading || streamingText !== null || !input.trim()}
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
