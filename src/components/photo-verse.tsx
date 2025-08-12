"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Photo } from "@/types";

type PhotoVerseProps = {
  photos: Photo[];
  backgroundColor: string;
  brightness: number;
  onPhotoClick: (photo: Photo) => void;
  focusedPhoto: Photo | null;
};

export function PhotoVerse({
  photos,
  backgroundColor,
  brightness,
  onPhotoClick,
  focusedPhoto,
}: PhotoVerseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const photoMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
  const animationState = useRef({
    isFocusing: false,
    cameraTargetPos: new THREE.Vector3(),
    controlsTargetPos: new THREE.Vector3(),
    savedCameraPos: new THREE.Vector3(),
    savedControlsTarget: new THREE.Vector3(),
  }).current;

  const onPhotoClickRef = useRef(onPhotoClick);
  onPhotoClickRef.current = onPhotoClick;
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 20;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (event: MouseEvent) => {
      if (!currentMount || animationState.isFocusing) return;
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;
      raycaster.setFromCamera(camera, mouse);
      const intersects = raycaster.intersectObjects(Array.from(photoMeshes.current.values()));
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const photo = photosRef.current.find(p => p.url === clickedObject.userData.url);
        if (photo) onPhotoClickRef.current(photo);
      }
    };
    currentMount.addEventListener('click', onClick);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      
      photosRef.current.forEach(photo => {
        const mesh = photoMeshes.current.get(photo.url);
        if (mesh) {
          const targetPos = new THREE.Vector3(photo.x, photo.y, photo.z);
          mesh.position.lerp(targetPos, 0.05);
          const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, photo.rotationY, 0));
          mesh.quaternion.slerp(targetQuat, 0.05);
        }
      });
      
      if (animationState.isFocusing) {
        camera.position.lerp(animationState.cameraTargetPos, 0.07);
        controls.target.lerp(animationState.controlsTargetPos, 0.07);
        if (camera.position.distanceTo(animationState.cameraTargetPos) < 0.01) {
          animationState.isFocusing = false;
          camera.position.copy(animationState.cameraTargetPos);
          controls.target.copy(animationState.controlsTargetPos);
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = currentMount.clientWidth / currentMount.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if(currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(backgroundColor);
      const light = sceneRef.current.children.find(c => c.isAmbientLight) as THREE.AmbientLight;
      if (light) light.intensity = brightness;
    }
  }, [backgroundColor, brightness]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    
    const textureLoader = new THREE.TextureLoader();
    const currentUrls = new Set(photos.map(p => p.url));

    photoMeshes.current.forEach((mesh, url) => {
      if (!currentUrls.has(url)) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
            if ('map' in mesh.material && mesh.material.map instanceof THREE.Texture) {
                mesh.material.map.dispose();
            }
            mesh.material.dispose();
        }
        photoMeshes.current.delete(url);
      }
    });

    photos.forEach((photo) => {
      if (!photoMeshes.current.has(photo.url)) {
        textureLoader.load(photo.url, (texture) => {
          if (!sceneRef.current) return;
          const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
          const geometry = new THREE.PlaneGeometry(aspectRatio * 4, 4);
          const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0 });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(photo.x, photo.y, photo.z);
          mesh.rotation.y = photo.rotationY;
          mesh.userData.url = photo.url;
          scene.add(mesh);
          photoMeshes.current.set(photo.url, mesh);
          
          let opacity = 0;
          const fadeIn = () => {
            if (material.opacity >= 1) return;
            opacity = Math.min(1, opacity + 0.05);
            material.opacity = opacity;
            requestAnimationFrame(fadeIn);
          };
          fadeIn();
        });
      }
    });
  }, [photos]);

  useEffect(() => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;
    
    if (focusedPhoto) {
      const mesh = photoMeshes.current.get(focusedPhoto.url);
      if (!mesh) return;
      
      if (!animationState.isFocusing) {
        animationState.savedCameraPos.copy(camera.position);
        animationState.savedControlsTarget.copy(controls.target);
      }
      
      controls.enabled = false;
      const meshPosition = new THREE.Vector3();
      mesh.getWorldPosition(meshPosition);
      
      const offset = new THREE.Vector3(0, 0, 6);
      offset.applyQuaternion(mesh.quaternion);
      animationState.cameraTargetPos.copy(meshPosition).add(offset);
      animationState.controlsTargetPos.copy(meshPosition);
      animationState.isFocusing = true;
    } else {
        controls.enabled = true;
        if(animationState.savedCameraPos.length() > 0) {
          animationState.cameraTargetPos.copy(animationState.savedCameraPos);
          animationState.controlsTargetPos.copy(animationState.savedControlsTarget);
          animationState.isFocusing = true;
        }
    }
  }, [focusedPhoto, animationState]);

  return <div ref={mountRef} className="w-full h-full" />;
}
