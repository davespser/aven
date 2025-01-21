// src/ModeloPatio.js
import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import * as THREE from 'three';

function ModeloPatio() {
  const { scene } = useGLTF('/models/patio.glb');
  const { gl, camera, scene: threeScene, size } = useThree();
  const composer = useRef();

  useEffect(() => {
    // Crear OutlinePass
    const outlinePass = new OutlinePass(
      new THREE.Vector2(size.width, size.height),
      threeScene,
      camera
    );
    outlinePass.edgeStrength = 2.5; // Ajusta la fuerza del borde
    outlinePass.edgeGlow = 0.4; // Ajusta el brillo del borde
    outlinePass.edgeThickness = 1.2; // Ajusta el grosor del borde
    outlinePass.visibleEdgeColor.set('#ffffff'); // Color del borde visible
    outlinePass.hiddenEdgeColor.set('#000000'); // Color del borde oculto
    outlinePass.selectedObjects = [scene]; // Modelo al que se aplica el efecto

    // Añadir FXAA para suavizar bordes
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms['resolution'].value.set(
      1 / size.width,
      1 / size.height
    );

    // Configuración del EffectComposer
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(threeScene, camera)); // Renderizado normal
    composer.current.addPass(outlinePass); // Agregar el efecto de borde
    composer.current.addPass(fxaaPass); // Suavizado de bordes

    // Render loop personalizado
    const render = () => composer.current.render();
    gl.setAnimationLoop(render);

    // Cleanup al desmontar
    return () => {
      gl.setAnimationLoop(null);
    };
  }, [gl, camera, threeScene, scene, size]);

  return <primitive object={scene} scale={8} />;
}

export default ModeloPatio;