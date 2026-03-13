import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export interface CharacterRefs {
  character: THREE.Group;
  headGroup?: THREE.Group;
  leftPupil?: THREE.Mesh;
  rightPupil?: THREE.Mesh;
  leftEyelid?: THREE.Mesh;
  rightEyelid?: THREE.Mesh;
  leftBrow?: THREE.Mesh;
  rightBrow?: THREE.Mesh;
  torso?: THREE.Object3D;
}

const AVATAR_URL = "/models/a879efc698e76f49a2e08e8f4a6ba89f.glb";

export function createRikinCharacter(): CharacterRefs {
  const character = new THREE.Group();
  character.name = "rikin-character";

  const loader = new GLTFLoader();
  loader.load(
    AVATAR_URL,
    (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      model.scale.setScalar(1.6);
      model.position.set(0, -0.9, 0);
      character.add(model);
    },
    undefined,
    (error) => {
      console.error("Failed to load avatar model", error);
    }
  );

  // For existing animation/mouse utils, fall back to animating the whole group.
  const headGroup = character;
  const torso = character;

  return {
    character,
    headGroup,
    torso,
  };
}

function createGradientTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#555";
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = "#999";
  ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = "#ddd";
  ctx.fillRect(2, 0, 1, 1);
  ctx.fillStyle = "#fff";
  ctx.fillRect(3, 0, 1, 1);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

function createHair(color: number, gradientMap: THREE.Texture): THREE.Group {
  const hairGroup = new THREE.Group();
  const mat = new THREE.MeshToonMaterial({ color, gradientMap });

  // Main hair volume on top
  const topGeo = new THREE.SphereGeometry(0.36, 32, 32);
  const topHair = new THREE.Mesh(topGeo, mat);
  topHair.scale.set(1.05, 0.4, 1.0);
  topHair.position.set(0.05, 0.08, -0.02);
  hairGroup.add(topHair);

  // Swept right volume
  const sideGeo = new THREE.SphereGeometry(0.25, 32, 32);
  const sideHair = new THREE.Mesh(sideGeo, mat);
  sideHair.scale.set(0.6, 0.5, 0.8);
  sideHair.position.set(0.2, 0.1, 0.05);
  hairGroup.add(sideHair);

  // Front fringe bump
  const fringeGeo = new THREE.SphereGeometry(0.2, 24, 24);
  const fringeHair = new THREE.Mesh(fringeGeo, mat);
  fringeHair.scale.set(0.9, 0.3, 0.5);
  fringeHair.position.set(0.08, 0.06, 0.18);
  hairGroup.add(fringeHair);

  // Back hair
  const backGeo = new THREE.SphereGeometry(0.34, 32, 32);
  const backHair = new THREE.Mesh(backGeo, mat);
  backHair.scale.set(1.0, 0.5, 0.8);
  backHair.position.set(0, 0.0, -0.1);
  hairGroup.add(backHair);

  // Left side (shorter than right)
  const leftGeo = new THREE.SphereGeometry(0.18, 24, 24);
  const leftHair = new THREE.Mesh(leftGeo, mat);
  leftHair.scale.set(0.4, 0.4, 0.7);
  leftHair.position.set(-0.22, 0.04, 0.0);
  hairGroup.add(leftHair);

  return hairGroup;
}

function createEyes() {
  const createSingleEye = () => {
    const eyeGroup = new THREE.Group();

    // Sclera (larger, more cartoony)
    const scleraGeo = new THREE.SphereGeometry(0.085, 24, 24);
    const sclera = new THREE.Mesh(
      scleraGeo,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sclera.scale.set(1.05, 1.3, 0.5);
    eyeGroup.add(sclera);

    // Iris
    const irisGeo = new THREE.SphereGeometry(0.045, 24, 24);
    const iris = new THREE.Mesh(
      irisGeo,
      new THREE.MeshBasicMaterial({ color: 0x3d1f00 })
    );
    iris.position.z = 0.02;
    eyeGroup.add(iris);

    // Pupil
    const pupilGeo = new THREE.SphereGeometry(0.024, 16, 16);
    const pupil = new THREE.Mesh(
      pupilGeo,
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    pupil.position.z = 0.035;
    pupil.name = "pupil";
    eyeGroup.add(pupil);

    // Highlight
    const highlightGeo = new THREE.SphereGeometry(0.011, 8, 8);
    const highlight = new THREE.Mesh(
      highlightGeo,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    highlight.position.set(0.015, 0.015, 0.04);
    eyeGroup.add(highlight);

    return { eyeGroup, pupil };
  };

  const left = createSingleEye();
  const right = createSingleEye();

  return {
    leftEye: left.eyeGroup,
    rightEye: right.eyeGroup,
    leftPupil: left.pupil,
    rightPupil: right.pupil,
  };
}

function createEyelid(skinColor: number): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.07, 24, 24);
  const lid = new THREE.Mesh(
    geo,
    new THREE.MeshToonMaterial({ color: skinColor })
  );
  lid.scale.set(1.1, 1.3, 0.6);
  return lid;
}

function createEyebrow(color: number): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.moveTo(-0.05, 0);
  shape.quadraticCurveTo(0, 0.018, 0.05, 0);
  shape.quadraticCurveTo(0, -0.006, -0.05, 0);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.012,
    bevelEnabled: false,
  });
  const brow = new THREE.Mesh(
    geo,
    new THREE.MeshToonMaterial({ color })
  );
  return brow;
}

function createSmile(): THREE.Line {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.08, 0, 0),
    new THREE.Vector3(0, -0.04, 0.02),
    new THREE.Vector3(0.08, 0, 0)
  );
  const points = curve.getPoints(20);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x8b4513, linewidth: 2 });
  return new THREE.Line(geo, mat);
}

function createBeard(color: number, gradientMap: THREE.Texture): THREE.Group {
  const beardGroup = new THREE.Group();
  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap,
    transparent: true,
    opacity: 0.85,
  });

  // Chin
  const chinGeo = new THREE.SphereGeometry(0.2, 32, 32);
  const chin = new THREE.Mesh(chinGeo, mat);
  chin.scale.set(0.7, 0.4, 0.5);
  chin.position.set(0, -0.22, 0.12);
  beardGroup.add(chin);

  // Jaw sides
  const jawGeo = new THREE.SphereGeometry(0.12, 24, 24);
  [-1, 1].forEach((side) => {
    const jaw = new THREE.Mesh(jawGeo, mat);
    jaw.scale.set(0.5, 0.5, 0.4);
    jaw.position.set(side * 0.15, -0.17, 0.15);
    beardGroup.add(jaw);
  });

  // Mustache
  const mustacheGeo = new THREE.SphereGeometry(0.08, 20, 20);
  const mustache = new THREE.Mesh(mustacheGeo, mat);
  mustache.scale.set(1.2, 0.25, 0.4);
  mustache.position.set(0, -0.1, 0.28);
  beardGroup.add(mustache);

  return beardGroup;
}

function createEar(skinColor: number, gradientMap: THREE.Texture): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.06, 16, 16);
  const ear = new THREE.Mesh(
    geo,
    new THREE.MeshToonMaterial({ color: skinColor, gradientMap })
  );
  ear.scale.set(0.5, 0.8, 0.4);
  return ear;
}

function createBody(
  hoodieColor: number,
  pantsColor: number,
  skinColor: number,
  gradientMap: THREE.Texture
): { bodyGroup: THREE.Group; torso: THREE.Mesh } {
  const bodyGroup = new THREE.Group();

  // Torso (hoodie) - slightly wider, a bit shorter
  const torsoGeo = new THREE.CylinderGeometry(0.29, 0.27, 0.45, 18);
  const torso = new THREE.Mesh(
    torsoGeo,
    new THREE.MeshToonMaterial({ color: hoodieColor, gradientMap })
  );
  torso.position.y = 0.4;
  torso.name = "torso";
  bodyGroup.add(torso);

  // Hoodie hood behind head
  const hoodGeo = new THREE.SphereGeometry(
    0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2
  );
  const hood = new THREE.Mesh(
    hoodGeo,
    new THREE.MeshToonMaterial({ color: hoodieColor, gradientMap })
  );
  hood.position.set(0, 0.68, -0.15);
  hood.rotation.x = 0.3;
  bodyGroup.add(hood);

  // Hoodie front pocket detail (subtle darker rectangle)
  const pocketGeo = new THREE.PlaneGeometry(0.22, 0.09);
  const pocket = new THREE.Mesh(
    pocketGeo,
    new THREE.MeshToonMaterial({
      color: 0x0d9668,
      gradientMap,
      side: THREE.FrontSide,
    })
  );
  pocket.position.set(0, 0.3, 0.235);
  bodyGroup.add(pocket);

  // Hoodie strings
  const stringMat = new THREE.LineBasicMaterial({ color: 0xffffff });
  [-0.04, 0.04].forEach((xOff) => {
    const points = [
      new THREE.Vector3(xOff, 0.68, 0.24),
      new THREE.Vector3(xOff, 0.52, 0.25),
    ];
    const stringGeo = new THREE.BufferGeometry().setFromPoints(points);
    bodyGroup.add(new THREE.Line(stringGeo, stringMat));
  });

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.32, 12);
  const armMat = new THREE.MeshToonMaterial({ color: hoodieColor, gradientMap });

  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.position.set(-0.3, 0.37, 0);
  leftArm.rotation.z = 0.2;
  bodyGroup.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.position.set(0.3, 0.37, 0);
  rightArm.rotation.z = -0.2;
  bodyGroup.add(rightArm);

  // Hands
  const handGeo = new THREE.SphereGeometry(0.05, 12, 12);
  const handMat = new THREE.MeshToonMaterial({ color: skinColor, gradientMap });

  const leftHand = new THREE.Mesh(handGeo, handMat);
  leftHand.position.set(-0.35, 0.19, 0);
  bodyGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handGeo, handMat);
  rightHand.position.set(0.35, 0.19, 0);
  bodyGroup.add(rightHand);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.28, 12);
  const legMat = new THREE.MeshToonMaterial({ color: pantsColor, gradientMap });

  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.1, -0.02, 0);
  bodyGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.1, -0.02, 0);
  bodyGroup.add(rightLeg);

  // Shoes
  const shoeGeo = new THREE.BoxGeometry(0.11, 0.05, 0.16);
  const shoeMat = new THREE.MeshToonMaterial({ color: 0x111111, gradientMap });

  const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
  leftShoe.position.set(-0.1, -0.18, 0.04);
  bodyGroup.add(leftShoe);

  const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
  rightShoe.position.set(0.1, -0.18, 0.04);
  bodyGroup.add(rightShoe);

  return { bodyGroup, torso };
}
