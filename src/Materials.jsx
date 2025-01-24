import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

export const createIceMaterial = () => {
  const material = new THREE.MeshPhysicalMaterial({
    color: '#d4f1f9',
    transparent: true,
    opacity: 0.8,
    transmission: 0.2,
    roughness: 0.9,
    metalness: 0.5,
    clearcoat: 0.9,
    clearcoatRoughness: 2,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };

    shader.vertexShader = `
      varying vec3 vWorldPos;
      uniform float time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float voronoi(vec2 p) {
        vec2 g = floor(p);
        vec2 f = fract(p);
        float d = 1.0;
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 lattice = vec2(x, y);
            vec2 offset = vec2(hash(g + lattice), hash(g.yx + lattice));
            vec2 r = lattice + offset - f;
            d = min(d, dot(r, r));
          }
        }
        return d;
      }

      ${shader.vertexShader}
    `.replace(
      `#include <worldpos_vertex>`,
      `
      #include <worldpos_vertex>
      vWorldPos = position;

      float cracks = voronoi(position.xz * 5.0 + time * 2.5);
      cracks = smoothstep(0.1, 0.15, cracks);
      transformed.z += cracks * 1.8;
      `
    );

    shader.fragmentShader = `
      varying vec3 vWorldPos;
      uniform float time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float voronoi(vec2 p) {
        vec2 g = floor(p);
        vec2 f = fract(p);
        float d = 2.0;
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 lattice = vec2(x, y);
            vec2 offset = vec2(hash(g + lattice), hash(g.yx + lattice));
            vec2 r = lattice + offset - f;
            d = min(d, dot(r, r));
          }
        }
        return d;
      }

      ${shader.fragmentShader}
    `.replace(
      `#include <roughnessmap_fragment>`,
      `
      #include <roughnessmap_fragment>
      float cracks = voronoi(vWorldPos.xz * 50.0 + time * 1.5);
      cracks = smoothstep(0.1, 0.06, cracks);
      roughnessFactor = mix(roughnessFactor, cracks, 2.8);
      `
    );
  };

  return material;
};

export const createLineMaterial = () => {
  const material = new LineMaterial({
    color: 'black',
    linewidth: 0.8,
  });
  material.resolution.set(window.innerWidth, window.innerHeight);
  return material;
};