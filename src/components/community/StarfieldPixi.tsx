// src/components/community/StarfieldPixi.tsx
import React, { useRef, useEffect, memo, useLayoutEffect } from 'react';
import * as PIXI from 'pixi.js';

// --- 데이터 인터페이스 ---
interface StarData {
  sprite: PIXI.Sprite;
  z: number;
  baseX: number;
  baseY: number;
  initialAlpha: number;
  flickerSpeed: number;
  flickerAmount: number;
  initialScale: number;
}

interface ShootingStarData {
  sprite: PIXI.Graphics;
  vx: number;
  vy: number;
  life: number;
  rotationSpeed: number;
  lastUpdateTime?: number; // 선택적 속성으로 추가
}

interface ParticleData {
  sprite: PIXI.Sprite;
  vx: number;
  vy: number;
  initialX: number; // baseX, baseY 대신 사용
  initialY: number; // baseX, baseY 대신 사용
  zFactor: number;
  alphaDecay: number;
}

// --- 컴포넌트 Props ---
interface StarfieldPixiProps {
  mapOffset: { x: number; y: number };
  zoomLevel: number;
  starCount?: number;
  shootingStarFrequency?: number;
  particleCount?: number;
  worldSize?: { width: number; height: number };
  appSizeVersion?: number;
  backgroundColor?: PIXI.ColorSource;
  baseStarSize?: number;
}

const StarfieldPixi: React.FC<StarfieldPixiProps> = ({
  mapOffset,
  zoomLevel,
  starCount = 700,
  shootingStarFrequency = 0.005,
  particleCount = 150,
  worldSize = { width: 7000, height: 5500 },
  appSizeVersion = 0,
  backgroundColor = 0x000003,
  baseStarSize = 1.8,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const tickerRef = useRef<PIXI.Ticker | null>(null);

  const starsDataRef = useRef<StarData[]>([]);
  const shootingStarsDataRef = useRef<ShootingStarData[]>([]);
  const particlesDataRef = useRef<ParticleData[]>([]);

  const starContainerRef = useRef<PIXI.Container | null>(null);
  const shootingStarContainerRef = useRef<PIXI.Container | null>(null);
  const particleContainerRef = useRef<PIXI.Container | null>(null);

  const starTextureRef = useRef<PIXI.Texture | null>(null);
  const particleTextureRef = useRef<PIXI.Texture | null>(null);


  useLayoutEffect(() => {
    let app: PIXI.Application;

    if (canvasContainerRef.current && !appRef.current) {
      app = new PIXI.Application();
      appRef.current = app;

      (async () => {
        try {
          await app.init({
            resizeTo: canvasContainerRef.current!,
            background: backgroundColor,
            antialias: true,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
          });

          if (canvasContainerRef.current) {
            while (canvasContainerRef.current.firstChild) {
              canvasContainerRef.current.removeChild(canvasContainerRef.current.firstChild);
            }
            canvasContainerRef.current.appendChild(app.view);
          }

          starContainerRef.current = new PIXI.Container();
          shootingStarContainerRef.current = new PIXI.Container();
          particleContainerRef.current = new PIXI.Container();

          app.stage.addChild(particleContainerRef.current);
          app.stage.addChild(starContainerRef.current);
          app.stage.addChild(shootingStarContainerRef.current);

          const starGraphics = new PIXI.Graphics().circle(0, 0, baseStarSize * 0.5).fill(0xffffff);
          starTextureRef.current = app.renderer.generateTexture({target:starGraphics});
          starGraphics.destroy();

          const particleGraphics = new PIXI.Graphics().circle(0, 0, baseStarSize * 0.2).fill(0xaaaaff);
          particleTextureRef.current = app.renderer.generateTexture({target:particleGraphics});
          particleGraphics.destroy();

          const newStars: StarData[] = [];
          for (let i = 0; i < starCount; i++) {
            if (!starTextureRef.current) continue;
            const z = Math.random();
            const sprite = new PIXI.Sprite(starTextureRef.current);
            sprite.anchor.set(0.5);
            const randomColorComponent = () => 0.7 + Math.random() * 0.3;
            sprite.tint = new PIXI.Color({ r: randomColorComponent() * 255, g: randomColorComponent() * 255, b: randomColorComponent() * 255 }).toHex();
            
            const initialScale = (1 - z * 0.85) * (baseStarSize / (sprite.texture.width || baseStarSize));
            const initialAlpha = (1 - z * 0.7) * (0.3 + Math.random() * 0.4);

            newStars.push({
              sprite, z,
              baseX: Math.random() * worldSize.width - worldSize.width / 2,
              baseY: Math.random() * worldSize.height - worldSize.height / 2,
              initialAlpha, initialScale,
              flickerSpeed: 0.0015 + Math.random() * 0.003,
              flickerAmount: 0.15 + Math.random() * 0.25,
            });
            starContainerRef.current!.addChild(sprite);
          }
          starsDataRef.current = newStars;

          const newParticles: ParticleData[] = [];
          for (let i = 0; i < particleCount; i++) {
            if (!particleTextureRef.current) continue;
            const sprite = new PIXI.Sprite(particleTextureRef.current);
            sprite.anchor.set(0.5);
            sprite.alpha = 0.05 + Math.random() * 0.15;
            const zFactor = 0.05 + Math.random() * 0.3;

            newParticles.push({
              sprite,
              vx: (Math.random() - 0.5) * 0.1,
              vy: (Math.random() - 0.5) * 0.1,
              initialX: Math.random() * worldSize.width - worldSize.width / 2,
              initialY: Math.random() * worldSize.height - worldSize.height / 2,
              zFactor,
              alphaDecay: 0.0001 + Math.random() * 0.0002,
            });
            particleContainerRef.current!.addChild(sprite);
          }
          particlesDataRef.current = newParticles;

          const ticker = new PIXI.Ticker();
          tickerRef.current = ticker;

          let lastShootingStarSpawnTime = 0; // 유성 생성 타이밍 제어

          ticker.add((time) => {
            const delta = time.deltaTime;
            const elapsedMS = time.elapsedMS; // Ticker의 총 경과 시간 (애니메이션에 사용)
            const currentTickerTime = ticker.lastTime; // Ticker의 현재 시간 (생성 간격 제어에 사용)


            starsDataRef.current.forEach(star => {
              star.sprite.alpha = star.initialAlpha * (1 + Math.sin(elapsedMS * star.flickerSpeed + star.baseX) * star.flickerAmount);
              star.sprite.alpha = Math.max(0.05, Math.min(1, star.sprite.alpha));
            });

            // 유성 생성 (확률 대신 시간 간격 기반으로 변경 고려)
            // 평균 shootingStarFrequency ms 마다 한번 생성 시도
            const spawnInterval = 1 / (shootingStarFrequency || 0.001); // ms
            if (shootingStarContainerRef.current && currentTickerTime - lastShootingStarSpawnTime > spawnInterval * (0.5 + Math.random())) {
                lastShootingStarSpawnTime = currentTickerTime;
                const ssGraphics = new PIXI.Graphics();
                const length = 30 + Math.random() * 70;
                const startAlpha = 0.5 + Math.random() * 0.3;
                ssGraphics.moveTo(0,0).lineStyle({
                  width: 1 + Math.random(),
                  color: 0xFFFFFF,
                  alpha: startAlpha
                } as any).lineTo(length, 0);
                
                const angle = Math.PI / 3 + (Math.random() * Math.PI / 4 - Math.PI / 8);
                ssGraphics.rotation = angle;

                const edge = Math.floor(Math.random() * 4);
                let sx = 0, sy = 0;
                const halfW = worldSize.width / 2;
                const halfH = worldSize.height / 2;

                if (edge === 0) { sx = -halfW - length; sy = Math.random() * worldSize.height - halfH; }
                else if (edge === 1) { sx = halfW + length; sy = Math.random() * worldSize.height - halfH; }
                else if (edge === 2) { sy = -halfH - length; sx = Math.random() * worldSize.width - halfW; }
                else { sy = halfH + length; sx = Math.random() * worldSize.width - halfW; }
                
                ssGraphics.position.set(sx, sy);

                shootingStarsDataRef.current.push({
                    sprite: ssGraphics,
                    vx: Math.cos(angle) * (10 + Math.random() * 10),
                    vy: Math.sin(angle) * (10 + Math.random() * 10),
                    life: 1500 + Math.random() * 1000,
                    rotationSpeed: (Math.random() - 0.5) * 0.01,
                    lastUpdateTime: currentTickerTime, // 초기 업데이트 시간 설정
                });
                shootingStarContainerRef.current.addChild(ssGraphics);
            }

            shootingStarsDataRef.current = shootingStarsDataRef.current.filter(ss => {
                const timeSinceLastUpdate = currentTickerTime - (ss.lastUpdateTime || currentTickerTime);
                ss.sprite.x += ss.vx * (timeSinceLastUpdate / (1000/60)); // delta 프레임 보정
                ss.sprite.y += ss.vy * (timeSinceLastUpdate / (1000/60));
                ss.sprite.rotation += ss.rotationSpeed * (timeSinceLastUpdate / (1000/60));
                ss.life -= timeSinceLastUpdate;
                ss.lastUpdateTime = currentTickerTime; // 현재 시간으로 업데이트
                
                ss.sprite.alpha = Math.max(0, ss.life / 2500);

                if (ss.life <= 0) {
                    ss.sprite.destroy();
                    return false;
                }
                return true;
            });

            particlesDataRef.current.forEach(p => {
                p.sprite.x += p.vx * p.zFactor * delta;
                p.sprite.y += p.vy * p.zFactor * delta;
                p.sprite.alpha -= p.alphaDecay * delta;
                if (p.sprite.alpha <=0) {
                    p.sprite.alpha = 0.05 + Math.random() * 0.15;
                    p.sprite.x = Math.random() * worldSize.width - worldSize.width / 2;
                    p.sprite.y = Math.random() * worldSize.height - worldSize.height / 2;
                }

                const halfW = worldSize.width / 2;
                const halfH = worldSize.height / 2;
                if (p.sprite.x > halfW + 50) p.sprite.x = -halfW - 50;
                else if (p.sprite.x < -halfW - 50) p.sprite.x = halfW + 50;
                if (p.sprite.y > halfH + 50) p.sprite.y = -halfH - 50;
                else if (p.sprite.y < -halfH - 50) p.sprite.y = halfH + 50;
            });
          });
          ticker.start();

        } catch (err) {
          console.error("PixiJS App init or Ticker setup failed:", err);
        }
      })();
    }

    return () => {
      if (tickerRef.current) {
        tickerRef.current.stop();
        tickerRef.current.destroy();
        tickerRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      starsDataRef.current = [];
      shootingStarsDataRef.current = [];
      particlesDataRef.current = [];
      starContainerRef.current = null;
      shootingStarContainerRef.current = null;
      particleContainerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starCount, shootingStarFrequency, particleCount, worldSize.width, worldSize.height, backgroundColor, baseStarSize]);


  useEffect(() => {
    const app = appRef.current;
    const containers = [starContainerRef.current, shootingStarContainerRef.current, particleContainerRef.current];

    if (!app || !app.renderer || !app.stage || containers.some(c => !c)) return;

    const viewWidth = app.screen.width;
    const viewHeight = app.screen.height;
    const viewCenterX = viewWidth / 2;
    const viewCenterY = viewHeight / 2;

    containers.forEach(container => {
        if (container) {
            container.scale.set(zoomLevel);
            container.x = viewCenterX - mapOffset.x * zoomLevel;
            container.y = viewCenterY - mapOffset.y * zoomLevel;
        }
    });

    starsDataRef.current.forEach(starData => {
      const { sprite, baseX, baseY, initialScale } = starData;
      sprite.x = baseX;
      sprite.y = baseY;
      sprite.scale.set(initialScale);
    });
    particlesDataRef.current.forEach(particleData => {
        const { sprite, initialX, initialY } = particleData; // 수정: initialX, initialY 사용
        sprite.x = initialX;
        sprite.y = initialY;
    });

  }, [mapOffset, zoomLevel, baseStarSize, appSizeVersion]);

  useEffect(() => {
    if (appRef.current && appRef.current.renderer && canvasContainerRef.current) {
      appRef.current.renderer.resize(
        canvasContainerRef.current.offsetWidth,
        canvasContainerRef.current.offsetHeight
      );
    }
  }, [appSizeVersion]);

  return <div ref={canvasContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -10, pointerEvents: 'none' }} />;
};

export default memo(StarfieldPixi);