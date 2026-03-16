import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

// ── Mobile detection ──
const mobile =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (window.innerWidth <= 1024 && "ontouchstart" in window);

// ── Tech stack image textures ──
const textureLoader = new THREE.TextureLoader();
const techImageUrls = [
  "/images/react2.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
  "/images/node2.webp",
  "/images/mysql.webp",
  "/images/mongo.webp",
  "/images/express.webp",
  "/images/next1.webp",
  "/images/cursor.png",
  "/images/antigravity.jpg",
];
const techTextures = techImageUrls.map((url) => textureLoader.load(url));

// ── Canvas-generated AI tool textures ──
function createAITexture(abbr: string, bg: string): THREE.CanvasTexture {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2 - 3, 0, Math.PI * 2);
  ctx.stroke();

  const fs = abbr.length > 2 ? 56 : abbr.length > 1 ? 72 : 96;
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${fs}px "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(abbr, s / 2, s / 2 + 4);

  return new THREE.CanvasTexture(canvas);
}

const aiToolDefs = [
  { abbr: "C", bg: "#D97757" },   // Claude
  { abbr: "G", bg: "#74AA9C" },   // ChatGPT
  { abbr: "Co", bg: "#0078D4" },  // Copilot
  { abbr: "v0", bg: "#333333" },  // v0
  { abbr: "B", bg: "#E8A317" },   // Bolt
  { abbr: "L", bg: "#FF6B9D" },   // Lovable
  { abbr: "Mj", bg: "#293956" },  // Midjourney
];
const aiTextures = aiToolDefs.map((t) => createAITexture(t.abbr, t.bg));

const allTextures = [...techTextures, ...aiTextures]; // 16 total

// ── Geometry ──
const sphereGeometry = new THREE.SphereGeometry(
  1,
  mobile ? 14 : 20,
  mobile ? 14 : 20
);

// ── Ball configuration ──
const BALL_COUNT = 17;

// Shuffle texture indices so each ball gets a unique texture
const textureAssignment = (() => {
  const arr = Array.from({ length: BALL_COUNT }, (_, i) => i % allTextures.length);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
})();

const spheres = [...Array(BALL_COUNT)].map((_, i) => ({
  scale: [0.7, 1, 0.8, 1, 0.9][Math.floor(Math.random() * 5)],
  texIdx: textureAssignment[i],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

const _impulseVec = new THREE.Vector3();

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const t = api.current!.translation();
    vec.set(t.x, t.y, t.z).normalize();
    _impulseVec.set(
      vec.x * -50 * delta * scale,
      vec.y * -150 * delta * scale,
      vec.z * -50 * delta * scale
    );
    api.current?.applyImpulse(_impulseVec, true);
    state.invalidate();
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow={!mobile}
        receiveShadow={!mobile}
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

const _pointerTarget = new THREE.Vector3();

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame((state) => {
    if (!isActive) return;
    const { pointer, viewport } = state;
    _pointerTarget.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );
    vec.lerp(_pointerTarget, 0.2);
    ref.current?.setNextKinematicTranslation(vec);
    state.invalidate();
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [enableAO, setEnableAO] = useState(false);

  useEffect(() => {
    const workEl = document.getElementById("work");
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && workEl) {
        ticking = true;
        requestAnimationFrame(() => {
          const threshold = workEl.getBoundingClientRect().top;
          setIsActive(
            (window.scrollY || document.documentElement.scrollTop) > threshold
          );
          ticking = false;
        });
      }
    };
    const onNavClick = () => {
      let count = 0;
      const id = setInterval(() => {
        handleScroll();
        if (++count >= 50) clearInterval(id);
      }, 20);
    };
    document.querySelectorAll(".header a").forEach((el) => {
      (el as HTMLAnchorElement).addEventListener("click", onNavClick);
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.querySelectorAll(".header a").forEach((el) => {
        (el as HTMLAnchorElement).removeEventListener("click", onNavClick);
      });
    };
  }, []);

  const materials = useMemo(() => {
    return allTextures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  useEffect(() => {
    if (mobile) return;
    const cores = (navigator as any).hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio ?? 1;
    setEnableAO(cores >= 6 && dpr <= 2);
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        shadows={!mobile}
        frameloop="demand"
        dpr={mobile ? [1, 1] : [1, 1.5]}
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{
          position: [0, 0, 20],
          fov: mobile ? 40 : 32.5,
          near: 1,
          far: 100,
        }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow={!mobile}
          shadow-mapSize={mobile ? [128, 128] : [256, 256]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              scale={props.scale}
              material={materials[props.texIdx]}
              isActive={isActive}
            />
          ))}
        </Physics>
        {!mobile && (
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
        )}
        {enableAO && (
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#001a14" aoRadius={2} intensity={1.0} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default TechStack;
