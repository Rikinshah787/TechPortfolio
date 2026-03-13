import * as THREE from "three";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
  directionalLight.position.set(1.5, 3.5, 4.5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0);
  scene.add(ambientLight);

  // Emerald accent light from below-left
  const accentLight = new THREE.PointLight(0x10b981, 0, 18);
  accentLight.position.set(-2, -1, 3);
  scene.add(accentLight);

  // Warm fill light from the right
  const fillLight = new THREE.PointLight(0xdbeafe, 0, 18);
  fillLight.position.set(3, 2.5, 3);
  scene.add(fillLight);

  const duration = 1.8;
  const ease = "power2.inOut";

  function turnOnLights() {
    gsap.to(directionalLight, { intensity: 1.4, duration, ease });
    gsap.to(ambientLight, { intensity: 0.75, duration, ease });
    gsap.to(accentLight, { intensity: 0.9, duration, ease, delay: 0.25 });
    gsap.to(fillLight, { intensity: 0.7, duration, ease, delay: 0.25 });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { turnOnLights };
};

export default setLighting;
