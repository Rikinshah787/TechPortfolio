import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createRikinCharacter } from "./utils/character";
import setLighting from "./utils/lighting";
import { setupAnimations } from "./utils/animationUtils";
import { createMouseTracker } from "./utils/mouseUtils";
import handleResize from "./utils/resizeUtils";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!canvasDiv.current) return;

    const rect = canvasDiv.current.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 100);
    camera.position.set(0, 0.2, 4);
    camera.lookAt(0, 0.2, 0);

    // Build character
    const refs = createRikinCharacter();
    scene.add(refs.character);

    // Lighting
    const light = setLighting(scene);

    // Animations
    const animations = setupAnimations(refs);

    // Mouse tracking
    const mouseTracker = createMouseTracker({
      headGroup: refs.headGroup,
      leftPupil: refs.leftPupil,
      rightPupil: refs.rightPupil,
    });
    mouseTracker.attach(document);

    // Eyebrow hover on character hover area
    if (hoverDivRef.current) {
      const browRestL = refs.leftBrow.position.y;
      const browRestR = refs.rightBrow.position.y;
      const onHover = () => {
        refs.leftBrow.position.y = browRestL + 0.02;
        refs.rightBrow.position.y = browRestR + 0.02;
      };
      const onLeave = () => {
        refs.leftBrow.position.y = browRestL;
        refs.rightBrow.position.y = browRestR;
      };
      hoverDivRef.current.addEventListener("mouseenter", onHover);
      hoverDivRef.current.addEventListener("mouseleave", onLeave);
    }

    // GSAP scroll timelines
    setCharTimeline(refs.character, camera);
    setAllTimeline();

    // Loading progress simulation
    const progress = setProgress((value) => setLoading(value));

    // Character is built synchronously, so complete loading quickly
    setTimeout(() => {
      progress.loaded().then(() => {
        setTimeout(() => {
          light.turnOnLights();
        }, 2500);
      });
    }, 300);

    // Resize
    const onResize = () =>
      handleResize(renderer, camera, canvasDiv, refs.character);
    window.addEventListener("resize", onResize);

    // Render loop
    const clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      animations.update(elapsed);
      mouseTracker.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      animations.dispose();
      mouseTracker.detach();
      window.removeEventListener("resize", onResize);
      scene.clear();
      renderer.dispose();
      if (canvasDiv.current) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;
