import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              RIKIN
              <br />
              <span>SHAH</span>
            </h1>
          </div>
          <div className="landing-avatar-slot">
            {children}
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2" aria-label="Builder, Engineer">
              <span className="landing-h2-1">Builder</span>
              <span className="landing-h2-2">Engineer</span>
            </h2>
            <button
              className="landing-chat-cta"
              type="button"
              data-cursor="disable"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("rikin-open-chat"));
                }
              }}
            >
              <span className="landing-chat-dot" />
              <span>Ask my avatar or scroll!</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
