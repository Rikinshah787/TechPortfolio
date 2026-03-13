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
