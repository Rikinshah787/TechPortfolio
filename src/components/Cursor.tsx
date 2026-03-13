import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let hover = false;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const loop = () => {
      if (!hover) {
        const ease = 0.12;
        cursorPos.x += (mousePos.x - cursorPos.x) * ease;
        cursorPos.y += (mousePos.y - cursorPos.y) * ease;
        cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    const onMouseOver = (e: Event) => {
      const element = e.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      if (element.dataset.cursor === "icons") {
        cursor.classList.add("cursor-icons");
        cursorPos.x = rect.left;
        cursorPos.y = rect.top;
        cursor.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      }
      if (element.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const onMouseOut = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
    };

    const cursorElements = document.querySelectorAll("[data-cursor]");
    cursorElements.forEach((el) => {
      el.addEventListener("mouseover", onMouseOver);
      el.addEventListener("mouseout", onMouseOut);
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      cursorElements.forEach((el) => {
        el.removeEventListener("mouseover", onMouseOver);
        el.removeEventListener("mouseout", onMouseOut);
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
