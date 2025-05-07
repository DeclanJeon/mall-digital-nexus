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
          
          const y = positionAttribute.getY(i);
          positionAttribute.setY(i, y + 0.01);
          
          if (y + 0.01 > radius) {
            positionAttribute.setY(i, -radius);
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
        emissive: new
