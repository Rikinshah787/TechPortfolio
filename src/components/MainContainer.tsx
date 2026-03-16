import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));
const ChatWidget = lazy(() => import("./ChatWidget"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const resizeHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsDesktopView(window.innerWidth > 1024);
        setSplitText();
      }, 150);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
      <SocialIcons />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView ? (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            ) : (
              <div className="techstack techstack-mobile">
                <h2>My Techstack</h2>
                <div className="techstack-grid">
                  {[
                    { src: "/images/react2.webp", label: "React" },
                    { src: "/images/typescript.webp", label: "TypeScript" },
                    { src: "/images/javascript.webp", label: "JavaScript" },
                    { src: "/images/node2.webp", label: "Node.js" },
                    { src: "/images/mysql.webp", label: "MySQL" },
                    { src: "/images/mongo.webp", label: "MongoDB" },
                    { src: "/images/express.webp", label: "Express" },
                    { src: "/images/next1.webp", label: "Next.js" },
                  ].map((t) => (
                    <div className="techstack-item" key={t.label}>
                      <img src={t.src} alt={t.label} loading="lazy" />
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
                <h3 className="techstack-section-label">AI Tools</h3>
                <div className="techstack-grid">
                  {[
                    { label: "Claude", abbr: "C" },
                    { label: "ChatGPT", abbr: "G" },
                    { label: "Copilot", abbr: "Co" },
                    { label: "Cursor", abbr: "Cu" },
                    { label: "v0", abbr: "v0" },
                    { label: "Bolt", abbr: "B" },
                    { label: "Lovable", abbr: "L" },
                    { label: "Midjourney", abbr: "M" },
                  ].map((t) => (
                    <div className="techstack-item" key={t.label}>
                      <div className="techstack-ai-icon">{t.abbr}</div>
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
