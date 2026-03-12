import * as THREE from "three";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
  directionalLight.position.set(2, 4, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0);
  scene.add(ambientLight);

  // Emerald accent light from below-left
  const accentLight = new THREE.PointLight(0x10b981, 0, 15);
  accentLight.position.set(-2, -1, 3);
  scene.add(accentLight);

  // Warm fill light from the right
  const fillLight = new THREE.PointLight(0xffeedd, 0, 15);
  fillLight.position.set(3, 2, 2);
  scene.add(fillLight);

  const duration = 1.8;
  const ease = "power2.inOut";

  function turnOnLights() {
    gsap.to(directionalLight, { intensity: 1.8, duration, ease });
    gsap.to(ambientLight, { intensity: 0.6, duration, ease });
    gsap.to(accentLight, { intensity: 1.2, duration, ease, delay: 0.3 });
    gsap.to(fillLight, { intensity: 0.8, duration, ease, delay: 0.2 });
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
