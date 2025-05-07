
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import { Planet, Constellation } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Search, Filter, Plus, Compass, Layers, MapPin } from 'lucide-react';

interface ThreeUniverseMapProps {
  planets: Planet[];
  constellations: Constellation[];
  selectedPlanet: string | null;
  onPlanetSelect: (planetId: string | null) => void;
  onCreatePlanet: () => void;
}

const ThreeUniverseMap: React.FC<ThreeUniverseMapProps> = ({
  planets,
  constellations,
  selectedPlanet,
  onPlanetSelect,
  onCreatePlanet
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planetObjectsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const guiRef = useRef<GUI | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showDebugUI, setShowDebugUI] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI;
    controlsRef.current = controls;

    // Add Ambient Light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Add Directional Light (sun-like)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Add galaxy background
    createGalaxyBackground();

    // Debug GUI (hidden by default)
    if (showDebugUI) {
      const gui = new GUI({ width: 300 });
      gui.close(); // Start closed
      guiRef.current = gui;
    }

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Animate planets (rotation, etc.)
      planetObjectsRef.current.forEach((planetObject) => {
        if (planetObject && planetObject.userData && planetObject.userData.animateFunction) {
          planetObject.userData.animateFunction();
        }
      });
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (guiRef.current) {
        guiRef.current.destroy();
      }
      
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, []);

  // Create galaxy background with stars
  const createGalaxyBackground = () => {
    if (!sceneRef.current) return;
    
    // Small stars
    const smallStarsGeometry = new THREE.BufferGeometry();
    const starsCount = 10000;
    const positions = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);
    const colors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      
      // Size
      sizes[i] = Math.random() * 2;
      
      // Color
      const colorChoice = Math.random();
      if (colorChoice > 0.95) {
        // Blue/white stars
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice > 0.9) {
        // Red stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.3;
      } else if (colorChoice > 0.8) {
        // Yellow stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.3;
      } else {
        // White stars
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }
    }

    smallStarsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    smallStarsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    smallStarsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Star material with shaders for better performance
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float distance = length(mvPosition.xyz);
          
          // Make stars twinkle with different frequencies
          float twinkle = sin(time * 0.001 * (position.x + position.y + position.z) * 0.1) * 0.5 + 0.5;

          gl_PointSize = size * twinkle * pixelRatio * (300.0 / distance);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          // Circular point
          if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
          
          // Soft edges for stars
          float strength = 1.0 - length(gl_PointCoord - vec2(0.5)) * 2.0;
          gl_FragColor = vec4(vColor, strength);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });

    const starPoints = new THREE.Points(smallStarsGeometry, starMaterial);
    sceneRef.current.add(starPoints);

    // Nebula effect (several colored fogs)
    createNebula(0x4B0082, 600, 1000, 400);
    createNebula(0x4682B4, 800, -500, 800);
    createNebula(0x800080, -700, 300, -200);

    // Update time uniform for star twinkling
    const updateTime = () => {
      if (starMaterial.uniforms) {
        starMaterial.uniforms.time.value = performance.now();
      }
      requestAnimationFrame(updateTime);
    };
    updateTime();
  };

  // Create a nebula (colored fog effect)
  const createNebula = (color: number, x: number, y: number, z: number) => {
    if (!sceneRef.current) return;
    
    const particlesCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const opacity = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount; i++) {
      const radius = 200 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = x + radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = y + radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = z + radius * Math.cos(theta);
      
      sizes[i] = 50 + Math.random() * 50;
      opacity[i] = Math.random() * 0.05; // Very subtle
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1));
    
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        uniform float time;
        varying float vOpacity;
        
        void main() {
          vOpacity = opacity;
          
          // Slow movement effect
          vec3 pos = position;
          float movement = sin(time * 0.0005 + position.x * 0.01) * cos(time * 0.0003 + position.y * 0.01) * 5.0;
          pos.x += movement;
          pos.y += movement;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;
        
        void main() {
          float strength = 0.5 - length(gl_PointCoord - vec2(0.5)) * 2.0;
          strength = max(0.0, strength);
          gl_FragColor = vec4(color, strength * vOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const nebula = new THREE.Points(geometry, nebulaMaterial);
    sceneRef.current.add(nebula);
    
    // Update time uniform for nebula movement
    const updateTime = () => {
      if (nebulaMaterial.uniforms) {
        nebulaMaterial.uniforms.time.value = performance.now();
      }
      requestAnimationFrame(updateTime);
    };
    updateTime();
  };

  // Effect to create/update planets when planets data changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear existing planets
    planetObjectsRef.current.forEach((planet) => {
      if (sceneRef.current) {
        sceneRef.current.remove(planet);
      }
    });
    planetObjectsRef.current.clear();
    
    // Filter planets based on search
    const filteredPlanets = searchQuery 
      ? planets.filter(planet => 
          planet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          planet.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : planets;
    
    // Create new planets
    filteredPlanets.forEach(createPlanetObject);
    
    // Create constellation connections
    createConstellationConnections();
    
  }, [planets, constellations, searchQuery]);

  // Effect to highlight selected planet
  useEffect(() => {
    planetObjectsRef.current.forEach((planet, id) => {
      if (id === selectedPlanet) {
        // Highlight selected planet
        gsap.to(planet.position, { 
          y: '+=1', 
          duration: 0.5, 
          yoyo: true, 
          repeat: 1
        });
        
        // Add glow effect or highlight
        if (planet.children.length > 0 && planet.children[0] instanceof THREE.Mesh) {
          const planetMesh = planet.children[0] as THREE.Mesh;
          if (planetMesh.material instanceof THREE.MeshStandardMaterial) {
            gsap.to(planetMesh.material, { 
              emissiveIntensity: 1, 
              duration: 0.5
            });
          }
        }
        
        // Focus camera on selected planet
        if (cameraRef.current && controlsRef.current) {
          gsap.to(cameraRef.current.position, {
            duration: 1.5,
            x: planet.position.x + 10,
            y: planet.position.y + 5,
            z: planet.position.z + 20,
            onUpdate: () => {
              if (controlsRef.current && planet) {
                controlsRef.current.target.copy(planet.position);
              }
            }
          });
        }
      } else {
        // Reset non-selected planets
        if (planet.children.length > 0 && planet.children[0] instanceof THREE.Mesh) {
          const planetMesh = planet.children[0] as THREE.Mesh;
          if (planetMesh.material instanceof THREE.MeshStandardMaterial) {
            gsap.to(planetMesh.material, { 
              emissiveIntensity: 0.2, 
              duration: 0.5 
            });
          }
        }
      }
    });
  }, [selectedPlanet]);

  // Create planet with Three.js
  const createPlanetObject = (planet: Planet) => {
    if (!sceneRef.current) return;
    
    // Planet group
    const planetGroup = new THREE.Group();
    planetGroup.name = `planet-${planet.id}`;
    planetGroup.position.set(
      planet.position[0] * 10, 
      planet.position[1] * 10, 
      planet.position[2] * 10
    );
    
    // Determine size based on planet stage
    let sizeMultiplier = 1;
    switch (planet.stage) {
      case 'asteroid': sizeMultiplier = 1; break;
      case 'planet': sizeMultiplier = 1.5; break;
      case 'gasGiant': sizeMultiplier = 2.5; break;
      case 'star': sizeMultiplier = 4; break;
    }
    
    const radius = planet.size * sizeMultiplier;
    
    // Create different planet types based on their properties
    let planetMesh: THREE.Mesh;
    
    // Create appropriate material based on planet type
    if (planet.stage === 'star') {
      // Star type
      const starGeometry = new THREE.SphereGeometry(radius, 64, 64);
      const starMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color || '#FF9500'),
        emissive: new THREE.Color(planet.color || '#FF9500'),
        emissiveIntensity: 1,
        roughness: 0.7,
        metalness: 0.3
      });
      
      // Add emission glow
      planetMesh = new THREE.Mesh(starGeometry, starMaterial);
      
      // Add corona effect (glow)
      const coronaSize = radius * 1.5;
      const coronaGeometry = new THREE.SphereGeometry(coronaSize, 32, 32);
      const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(planet.color || '#FF9500') },
          viewVector: { value: new THREE.Vector3(0, 0, 1) },
          starSize: { value: radius },
          coronaSize: { value: coronaSize }
        },
        vertexShader: `
          uniform vec3 viewVector;
          uniform float coronaSize;
          varying float intensity;
          
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(1.0 - dot(vNormal, vNormel), 2.0);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying float intensity;
          
          void main() {
            vec3 glow = color * intensity;
            gl_FragColor = vec4(glow, pow(intensity, 2.0) * 0.5);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      
      const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
      planetGroup.add(corona);
      
      // Add solar flares (animated particle system)
      const flareCount = 200;
      const flareGeometry = new THREE.BufferGeometry();
      const flarePositions = new Float32Array(flareCount * 3);
      const flareSizes = new Float32Array(flareCount);
      
      for (let i = 0; i < flareCount; i++) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = radius + (Math.random() * radius * 0.5);
        
        flarePositions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
        flarePositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        flarePositions[i * 3 + 2] = r * Math.cos(theta);
        
        flareSizes[i] = Math.random() * 0.5 + 0.1;
      }
      
      flareGeometry.setAttribute('position', new THREE.Float32BufferAttribute(flarePositions, 3));
      flareGeometry.setAttribute('size', new THREE.Float32BufferAttribute(flareSizes, 1));
      
      const flareMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(planet.color || '#FF9500') },
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          uniform float time;
          varying float vSize;
          
          void main() {
            vSize = size;
            
            // Pulsing effect
            float pulse = sin(time * 0.005 + position.x * position.y * position.z) * 0.5 + 0.5;
            vec3 pos = position;
            pos += normal * pulse * 0.5;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * 10.0;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying float vSize;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float strength = 1.0 - dist * 2.0;
            gl_FragColor = vec4(color, strength);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const flares = new THREE.Points(flareGeometry, flareMaterial);
      planetGroup.add(flares);
      
      // Animate flares
      const animateFlares = () => {
        if (flareMaterial.uniforms) {
          flareMaterial.uniforms.time.value = performance.now();
        }
        
        // Rotate the star
        planetMesh.rotation.y += 0.0005;
      };
      
      planetGroup.userData.animateFunction = animateFlares;
      
    } else if (planet.stage === 'gasGiant') {
      // Gas giant
      const gasGiantGeometry = new THREE.SphereGeometry(radius, 64, 64);
      const gasGiantMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color || '#FF8F00'),
        emissive: new THREE.Color(planet.color || '#FF8F00'),
        emissiveIntensity: 0.2,
        roughness: 0.8,
        metalness: 0.2,
        bumpScale: 0.02
      });
      
      // Add texture for gas bands
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
        const colorBase = new THREE.Color(planet.color || '#FF8F00');
        const colorDark = colorBase.clone().multiplyScalar(0.5).getHex();
        const colorBright = colorBase.clone().multiplyScalar(1.2).getHex();
        
        // Create gas band pattern
        gradient.addColorStop(0, '#' + colorBright.toString(16).padStart(6, '0'));
        gradient.addColorStop(0.2, '#' + colorBase.getHex().toString(16).padStart(6, '0'));
        gradient.addColorStop(0.35, '#' + colorDark.toString(16).padStart(6, '0'));
        gradient.addColorStop(0.5, '#' + colorBase.getHex().toString(16).padStart(6, '0'));
        gradient.addColorStop(0.65, '#' + colorDark.toString(16).padStart(6, '0'));
        gradient.addColorStop(0.8, '#' + colorBase.getHex().toString(16).padStart(6, '0'));
        gradient.addColorStop(1, '#' + colorBright.toString(16).padStart(6, '0'));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 1024);
        
        // Add noise
        for (let i = 0; i < 20000; i++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
          ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
        }
        
        // Add storm spots
        for (let i = 0; i < 5; i++) {
          const stormRadius = Math.random() * 50 + 20;
          const x = Math.random() * 1024;
          const y = Math.random() * 1024;
          
          const stormGradient = ctx.createRadialGradient(x, y, 0, x, y, stormRadius);
          stormGradient.addColorStop(0, `rgba(255,255,255,0.7)`);
          stormGradient.addColorStop(0.5, `rgba(255,255,255,0.3)`);
          stormGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = stormGradient;
          ctx.beginPath();
          ctx.ellipse(x, y, stormRadius, stormRadius * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        gasGiantMaterial.map = texture;
      }
      
      planetMesh = new THREE.Mesh(gasGiantGeometry, gasGiantMaterial);
      
      // Add rings
      const ringGeometry = new THREE.RingGeometry(radius * 1.4, radius * 2.2, 64);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color || '#FF8F00'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        emissive: new THREE.Color(planet.color || '#FF8F00'),
        emissiveIntensity: 0.1
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 3;
      planetGroup.add(ring);
      
      // Animate the gas giant
      const animateGasGiant = () => {
        planetMesh.rotation.y += 0.002;
      };
      
      planetGroup.userData.animateFunction = animateGasGiant;
      
    } else if (planet.isPrivate) {
      // Private planet (volcanic theme)
      const planetGeometry = new THREE.SphereGeometry(radius, 64, 64);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4A4A4A'),
        emissive: new THREE.Color('#FF4500'),
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.7
      });
      
      // Create lava texture
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dark surface
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(0, 0, 1024, 512);
        
        // Lava veins
        for (let i = 0; i < 15; i++) {
          const width = Math.random() * 30 + 10;
          const startX = Math.random() * 1024;
          const startY = Math.random() * 512;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          
          let x = startX;
          let y = startY;
          
          for (let j = 0; j < 10; j++) {
            x += Math.random() * 100 - 50;
            y += Math.random() * 100 - 50;
            ctx.lineTo(x, y);
          }
          
          ctx.lineWidth = width;
          ctx.strokeStyle = `rgba(255,69,0,${Math.random() * 0.5 + 0.5})`;
          ctx.stroke();
        }
        
        // Add glow to lava
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255,165,0,0.2)';
        ctx.fillRect(0, 0, 1024, 512);
        
        const texture = new THREE.CanvasTexture(canvas);
        planetMaterial.map = texture;
        planetMaterial.displacementMap = texture;
        planetMaterial.displacementScale = 0.1;
      }
      
      planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Add smoke particles
      const smokeCount = 50;
      const smokeGeometry = new THREE.BufferGeometry();
      const smokePositions = new Float32Array(smokeCount * 3);
      const smokeSizes = new Float32Array(smokeCount);
      
      for (let i = 0; i < smokeCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = radius * 1.05;
        smokePositions[i * 3] = r * Math.cos(angle);
        smokePositions[i * 3 + 1] = (Math.random() - 0.5) * radius * 0.5;
        smokePositions[i * 3 + 2] = r * Math.sin(angle);
        smokeSizes[i] = Math.random() * 0.5 + 0.5;
      }
      
      smokeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(smokePositions, 3));
      smokeGeometry.setAttribute('size', new THREE.Float32BufferAttribute(smokeSizes, 1));
      
      const smokeMaterial = new THREE.PointsMaterial({
        color: 0x444444,
        size: radius * 0.2,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      const smoke = new THREE.Points(smokeGeometry, smokeMaterial);
      planetGroup.add(smoke);
      
      // Animate the private planet
      const animatePrivatePlanet = () => {
        planetMesh.rotation.y += 0.001;
        
        // Animate smoke
        const positions = smoke.geometry.attributes.position;
        const positionAttribute = positions as THREE.BufferAttribute;
        
        for (let i = 0; i < smokeCount; i++) {
          // Using direct array access with proper type assertion
          const yIndex = i * 3 + 1; // Y is the second component (index 1) in the [x,y,z] triplet
          
          if (positionAttribute instanceof THREE.BufferAttribute) {
            // Safe access using getAttribute methods
            const y = positionAttribute.getY(i);
            positionAttribute.setY(i, y + 0.01);
            
            if (y + 0.01 > radius) {
              positionAttribute.setY(i, -radius);
            }
          }
        }
        
        positions.needsUpdate = true;
      };
      
      planetGroup.userData.animateFunction = animatePrivatePlanet;
      
    } else if (planet.type === 'timeLimited') {
      // Time-limited ice planet
      const planetGeometry = new THREE.SphereGeometry(radius, 64, 64);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#A5F2F3'),
        metalness: 0.1,
        roughness: 0.2,
        envMapIntensity: 1.5,
        emissive: new THREE.Color('#80D8DA'),
        emissiveIntensity: 0.3
      });
      
      planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Create ice crystal particles
      const crystalCount = 200;
      const crystalGeometry = new THREE.BufferGeometry();
      const crystalPositions = new Float32Array(crystalCount * 3);
      
      for (let i = 0; i < crystalCount; i++) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = radius * 1.05;
        
        crystalPositions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
        crystalPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        crystalPositions[i * 3 + 2] = r * Math.cos(theta);
      }
      
      crystalGeometry.setAttribute('position', new THREE.BufferAttribute(crystalPositions, 3));
      
      const crystalMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: radius * 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      const crystals = new THREE.Points(crystalGeometry, crystalMaterial);
      planetGroup.add(crystals);
      
      // Add time countdown effect
      const timeRingGeometry = new THREE.RingGeometry(radius * 1.2, radius * 1.25, 64);
      const timeRingMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      
      const timeRing = new THREE.Mesh(timeRingGeometry, timeRingMaterial);
      timeRing.rotation.x = Math.PI / 2;
      planetGroup.add(timeRing);
      
      // Animate the time-limited planet
      const animateTimeLimitedPlanet = () => {
        planetMesh.rotation.y += 0.003;
        crystals.rotation.y -= 0.002;
        
        // Pulse time ring
        const pulse = Math.sin(performance.now() * 0.001) * 0.5 + 0.5;
        timeRing.scale.set(1 + pulse * 0.05, 1 + pulse * 0.05, 1);
        if (timeRingMaterial.opacity !== undefined) {
          timeRingMaterial.opacity = 0.3 + pulse * 0.4;
        }
      };
      
      planetGroup.userData.animateFunction = animateTimeLimitedPlanet;
      
    } else {
      // Standard planet
      const planetGeometry = new THREE.SphereGeometry(radius, 64, 64);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color || '#3E9BFF'),
        roughness: 0.7,
        metalness: 0.3,
        emissive: new THREE.Color(planet.color || '#3E9BFF'),
        emissiveIntensity: 0.2
      });
      
      // Create simple texture for planet
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Base color
        const baseColor = new THREE.Color(planet.color || '#3E9BFF');
        ctx.fillStyle = `#${baseColor.getHexString()}`;
        ctx.fillRect(0, 0, 1024, 512);
        
        // Add some noise
        for (let i = 0; i < 10000; i++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
          ctx.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2);
        }
        
        // Create some land masses
        for (let i = 0; i < 15; i++) {
          const landSize = 50 + Math.random() * 100;
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          
          const darkColor = baseColor.clone().multiplyScalar(0.7);
          
          ctx.fillStyle = `#${darkColor.getHexString()}`;
          
          ctx.beginPath();
          
          // Create irregular shape
          ctx.moveTo(x, y);
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
            const radius = landSize * (0.5 + Math.random() * 0.5);
            const pointX = x + Math.cos(a) * radius;
            const pointY = y + Math.sin(a) * radius;
            ctx.lineTo(pointX, pointY);
          }
          
          ctx.closePath();
          ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        planetMaterial.map = texture;
        
        // Create bump map for terrain
        const bumpCanvas = document.createElement('canvas');
        bumpCanvas.width = 1024;
        bumpCanvas.height = 512;
        const bumpCtx = bumpCanvas.getContext('2d');
        
        if (bumpCtx) {
          bumpCtx.fillStyle = '#000000';
          bumpCtx.fillRect(0, 0, 1024, 512);
          
          // Add terrain bumps
          for (let i = 0; i < 30; i++) {
            const size = Math.random() * 100 + 50;
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            
            const gradient = bumpCtx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            bumpCtx.fillStyle = gradient;
            bumpCtx.fillRect(x - size, y - size, size * 2, size * 2);
          }
          
          const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
          planetMaterial.bumpMap = bumpTexture;
          planetMaterial.bumpScale = 0.05;
        }
      }
      
      planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Add clouds for standard planet
      const cloudGeometry = new THREE.SphereGeometry(radius * 1.02, 32, 32);
      const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        alphaMap: createCloudTexture(),
        side: THREE.DoubleSide,
        depthWrite: false
      });
      
      const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
      planetGroup.add(clouds);
      
      // Create cloud texture function
      function createCloudTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, 512, 512);
          
          // Create cloud puffs
          for (let i = 0; i < 20; i++) {
            const puffSize = 30 + Math.random() * 50;
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, puffSize);
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
            gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.5)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, puffSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        return new THREE.CanvasTexture(canvas);
      }
      
      // Animate standard planet
      const animateStandardPlanet = () => {
        planetMesh.rotation.y += 0.001;
        
        // Rotate clouds slightly faster
        if (clouds) {
          clouds.rotation.y += 0.0015;
        }
      };
      
      planetGroup.userData.animateFunction = animateStandardPlanet;
    }
    
    // Add planet mesh to group
    planetGroup.add(planetMesh);
    
    // Add label
    const labelSize = radius * 0.5;
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    const labelCtx = labelCanvas.getContext('2d');
    
    if (labelCtx) {
      labelCtx.fillStyle = 'rgba(0,0,0,0)';
      labelCtx.fillRect(0, 0, 512, 128);
      
      labelCtx.font = 'Bold 80px Arial';
      labelCtx.fillStyle = 'white';
      labelCtx.textAlign = 'center';
      labelCtx.fillText(planet.name, 256, 76);
      
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelMaterial = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true,
        opacity: 0.8
      });
      
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(0, radius + labelSize / 2, 0);
      label.scale.set(labelSize * 4, labelSize, 1);
      label.visible = showLabels;
      
      planetGroup.add(label);
    }
    
    // Add event handling
    planetGroup.userData.planet = planet;
    planetGroup.userData.onClick = () => {
      onPlanetSelect(planet.id);
    };
    
    // Add planet to scene and ref
    sceneRef.current.add(planetGroup);
    planetObjectsRef.current.set(planet.id, planetGroup);
  };
  
  // Create constellation connections
  const createConstellationConnections = () => {
    if (!sceneRef.current) return;
    
    // Remove existing connections
    sceneRef.current.children.forEach(child => {
      if (child.name && child.name.startsWith('constellation-')) {
        sceneRef.current?.remove(child);
      }
    });
    
    // Create new connections
    constellations.forEach(constellation => {
      // Get all planets in this constellation
      const constellationPlanets = constellation.planets
        .map(id => planetObjectsRef.current.get(id))
        .filter(p => p !== undefined);
      
      if (constellationPlanets.length < 2) return;
      
      // Create connections between all planets
      for (let i = 0; i < constellationPlanets.length - 1; i++) {
        const planetA = constellationPlanets[i];
        
        for (let j = i + 1; j < constellationPlanets.length; j++) {
          const planetB = constellationPlanets[j];
          
          if (!planetA || !planetB) continue;
          
          // Create line geometry
          const points = [planetA.position, planetB.position];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          
          // Determine line material based on constellation type
          let lineMaterial;
          
          if (constellation.type === 'temporary') {
            // Animated dashed line for temporary
            lineMaterial = new THREE.LineDashedMaterial({
              color: 0xff7043,
              dashSize: 3,
              gapSize: 2,
              linewidth: 1
            });
          } else if (constellation.type === 'custom') {
            // Glowing line for custom
            lineMaterial = new THREE.LineBasicMaterial({
              color: 0x71c4ef,
              linewidth: 2,
              transparent: true,
              opacity: 0.7
            });
          } else {
            // Basic line for others
            lineMaterial = new THREE.LineBasicMaterial({
              color: 0xffffff,
              linewidth: 1,
              transparent: true,
              opacity: 0.3
            });
          }
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.name = `constellation-${constellation.id}-${i}-${j}`;
          sceneRef.current.add(line);
        }
      }
    });
  };
  
  return (
    <div className="w-full h-[80vh] relative bg-[#0c0c1d] rounded-2xl overflow-hidden">
      {/* Three.js container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0"
      />
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/30 text-white border-white/20 backdrop-blur-md hover:bg-black/40"
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.z = Math.max(10, cameraRef.current.position.z - 5);
            }
          }}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/30 text-white border-white/20 backdrop-blur-md hover:bg-black/40"
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.z = Math.min(200, cameraRef.current.position.z + 5);
            }
          }}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/30 text-white border-white/20 backdrop-blur-md hover:bg-black/40"
          onClick={() => {
            if (cameraRef.current && controlsRef.current) {
              gsap.to(cameraRef.current.position, { 
                x: 0, 
                y: 30, 
                z: 50, 
                duration: 1.5 
              });
              gsap.to(controlsRef.current.target, { 
                x: 0, 
                y: 0, 
                z: 0, 
                duration: 1.5 
              });
            }
          }}
        >
          <Compass className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`${showLabels ? 'bg-blue-600/50' : 'bg-black/30'} text-white border-white/20 backdrop-blur-md hover:bg-black/40`}
          onClick={() => setShowLabels(!showLabels)}
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Search bar */}
      <div className="absolute top-4 left-4 z-10 w-64">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input 
            placeholder="행성이나 주제 검색..." 
            className="pl-9 bg-black/30 text-white border-white/20 backdrop-blur-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Create planet button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button 
          onClick={onCreatePlanet} 
          className="bg-[#3e9bff] text-white hover:bg-[#3e9bff]/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 행성 만들기
        </Button>
      </div>
      
      {/* Filter badges */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
        <Badge 
          className="bg-[#3e9bff] text-white cursor-pointer hover:bg-[#3e9bff]/80"
        >
          전체
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white cursor-pointer backdrop-blur-md"
        >
          내 행성
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white cursor-pointer backdrop-blur-md"
        >
          인기 행성
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white cursor-pointer backdrop-blur-md"
        >
          최근 활동
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-white flex items-center gap-1"
        >
          <Filter className="h-3 w-3" />
          <span className="text-xs">필터</span>
        </Button>
      </div>
      
      {/* Hovered planet tooltip */}
      {hoveredPlanet && (
        <div 
          className="absolute z-20 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-none animate-fade-in"
          style={{ 
            left: 100,
            top: 100
          }}
        >
          <h3 className="font-bold text-white mb-1">{hoveredPlanet.name}</h3>
          <p className="text-blue-300 text-sm mb-2">{hoveredPlanet.description.substring(0, 100)}{hoveredPlanet.description.length > 100 ? '...' : ''}</p>
          
          <div className="flex gap-4 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{hoveredPlanet.members} 멤버</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge className="h-4 px-1.5 text-[10px]">
                {hoveredPlanet.stage === 'asteroid' && '소행성'}
                {hoveredPlanet.stage === 'planet' && '표준 행성'}
                {hoveredPlanet.stage === 'gasGiant' && '가스 거인'}
                {hoveredPlanet.stage === 'star' && '항성'}
              </Badge>
            </div>
          </div>
        </div>
      )}
      
      {/* Animation styles */}
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
};

export default ThreeUniverseMap;
