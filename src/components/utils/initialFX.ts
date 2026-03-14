import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  const main = document.getElementsByTagName("main")[0];
  if (main) main.classList.add("main-active");

  gsap.to("body", {
    backgroundColor: "#0a0f0d",
    duration: 0.5,
    delay: 1,
  });

  gsap.fromTo(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.08,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-h2-info",
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  loopTwoLines(".landing-h2-info", ".landing-h2-info-1");
  loopTwoLines(".landing-h2-1", ".landing-h2-2");
}

function loopTwoLines(selector1: string, selector2: string) {
  const el1 = document.querySelector(selector1);
  const el2 = document.querySelector(selector2);
  if (!el1 || !el2) return;

  gsap.set(el2, { opacity: 0, y: 80 });
  const delay = 4;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  tl.to(el2, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.inOut",
    delay,
  })
    .to(el1, {
      y: -80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
    }, `+=${delay}`)
    .to(el2, {
      y: -80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
    }, `+=${delay}`)
    .set(el1, { y: 80 })
    .to(el1, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
    });
}
