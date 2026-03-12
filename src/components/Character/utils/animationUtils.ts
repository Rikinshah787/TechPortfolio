import * as THREE from "three";
import type { CharacterRefs } from "./character";

export interface AnimationController {
  update: (time: number) => void;
  dispose: () => void;
}

export function setupAnimations(refs: CharacterRefs): AnimationController {
  const { headGroup, leftEyelid, rightEyelid, torso } = refs;

  let nextBlinkTime = randomBlinkDelay();
  let blinkPhase: "idle" | "closing" | "opening" = "idle";
  let blinkTimer = 0;

  const BLINK_CLOSE_DURATION = 0.07;
  const BLINK_OPEN_DURATION = 0.1;
  const BREATH_SPEED = 1.8;
  const BREATH_AMOUNT = 0.015;
  const HEAD_BOB_SPEED = 1.2;
  const HEAD_BOB_AMOUNT = 0.008;
  const HEAD_SWAY_AMOUNT = 0.005;

  const baseTorsoScaleY = torso.scale.y;
  const baseHeadY = headGroup.position.y;

  let lastTime = 0;
  let disposed = false;

  function randomBlinkDelay(): number {
    return 2.5 + Math.random() * 3.5;
  }

  function update(time: number) {
    if (disposed) return;

    const dt = lastTime === 0 ? 0.016 : Math.min(time - lastTime, 0.1);
    lastTime = time;

    // Idle breathing
    const breathOffset = Math.sin(time * BREATH_SPEED) * BREATH_AMOUNT;
    torso.scale.y = baseTorsoScaleY + breathOffset;

    // Subtle head bob
    headGroup.position.y =
      baseHeadY + Math.sin(time * HEAD_BOB_SPEED) * HEAD_BOB_AMOUNT;
    headGroup.rotation.z = Math.sin(time * HEAD_SWAY_AMOUNT * 60) * HEAD_SWAY_AMOUNT;

    // Blink system
    blinkTimer += dt;

    if (blinkPhase === "idle" && blinkTimer >= nextBlinkTime) {
      blinkPhase = "closing";
      blinkTimer = 0;
    }

    if (blinkPhase === "closing") {
      const progress = Math.min(blinkTimer / BLINK_CLOSE_DURATION, 1);
      leftEyelid.scale.y = progress;
      rightEyelid.scale.y = progress;
      if (progress >= 1) {
        blinkPhase = "opening";
        blinkTimer = 0;
      }
    }

    if (blinkPhase === "opening") {
      const progress = Math.min(blinkTimer / BLINK_OPEN_DURATION, 1);
      leftEyelid.scale.y = 1 - progress;
      rightEyelid.scale.y = 1 - progress;
      if (progress >= 1) {
        blinkPhase = "idle";
        blinkTimer = 0;
        nextBlinkTime = randomBlinkDelay();
        leftEyelid.scale.y = 0;
        rightEyelid.scale.y = 0;
      }
    }
  }

  function dispose() {
    disposed = true;
  }

  return { update, dispose };
}
