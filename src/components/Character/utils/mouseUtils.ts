import * as THREE from "three";

interface MouseState {
  x: number;
  y: number;
}

interface MouseTrackingRefs {
  headGroup?: THREE.Group;
  leftPupil?: THREE.Mesh;
  rightPupil?: THREE.Mesh;
}

export function createMouseTracker(refs: MouseTrackingRefs) {
  const mouse: MouseState = { x: 0, y: 0 };
  const smoothMouse: MouseState = { x: 0, y: 0 };
  const PUPIL_RANGE = 0.015;
  const HEAD_RANGE = 0.12;
  const SMOOTH_FACTOR = 0.08;

  function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(event: TouchEvent) {
    if (event.touches.length > 0) {
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  function onTouchEnd() {
    setTimeout(() => {
      mouse.x = 0;
      mouse.y = 0;
    }, 1500);
  }

  function update() {
    const head = refs.headGroup;
    if (!head) return;
    if (window.scrollY > 300) return;

    smoothMouse.x = THREE.MathUtils.lerp(smoothMouse.x, mouse.x, SMOOTH_FACTOR);
    smoothMouse.y = THREE.MathUtils.lerp(smoothMouse.y, mouse.y, SMOOTH_FACTOR);

    // Pupil tracking (only when we have explicit pupil meshes)
    if (refs.leftPupil && refs.rightPupil) {
      refs.leftPupil.position.x = smoothMouse.x * PUPIL_RANGE;
      refs.leftPupil.position.y = smoothMouse.y * PUPIL_RANGE;
      refs.rightPupil.position.x = smoothMouse.x * PUPIL_RANGE;
      refs.rightPupil.position.y = smoothMouse.y * PUPIL_RANGE;
    }

    // Subtle head rotation toward cursor
    head.rotation.y = THREE.MathUtils.lerp(
      head.rotation.y,
      smoothMouse.x * HEAD_RANGE,
      0.05
    );
    head.rotation.x = THREE.MathUtils.lerp(
      head.rotation.x,
      -smoothMouse.y * HEAD_RANGE * 0.5,
      0.05
    );
  }

  function attach(_element: HTMLElement | Document) {
    document.addEventListener("mousemove", onMouseMove);

    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchmove", onTouchMove, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd);
    }
  }

  function detach() {
    document.removeEventListener("mousemove", onMouseMove);

    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.removeEventListener("touchmove", onTouchMove);
      landingDiv.removeEventListener("touchend", onTouchEnd);
    }
  }

  return { update, attach, detach };
}
