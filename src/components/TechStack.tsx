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

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
  "/images/node2.webp",
  "/images/mysql.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

const spheres = [...Array(12)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
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
        castShadow
        receiveShadow
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
          setIsActive((window.scrollY || document.documentElement.scrollTop) > threshold);
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
    return textures.map(
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
    // Enable heavier post-processing only on reasonably capable devices.
    const cores = (navigator as any).hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio ?? 1;
    setEnableAO(cores >= 6 && dpr <= 2);
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[256, 256]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[Math.floor(Math.random() * materials.length)]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
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
