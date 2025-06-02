import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Store, 
  ShoppingBag, 
  Star, 
  Heart, 
  Rocket, 
  Plus,
  Users,
  Globe,
  Shield,
  Sparkles,
  Network,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 피어몰 컨셉에 맞는 디자인 토큰
const peerMallTokens = {
  colors: {
    primary: {
      purple: 'from-purple-600 via-violet-600 to-indigo-600',
      pink: 'from-pink-500 via-rose-500 to-red-500',
      cyan: 'from-cyan-400 via-blue-500 to-indigo-600',
      emerald: 'from-emerald-400 via-teal-500 to-cyan-600'
    },
    governance: {
      i: 'from-amber-400 to-orange-500', // I govern
      you: 'from-blue-400 to-cyan-500', // You govern  
      we: 'from-purple-500 to-pink-500' // We govern
    }
  },
  typography: {
    hero: 'text-5xl md:text-7xl lg:text-8xl font-black tracking-tight',
    subtitle: 'text-xl md:text-2xl lg:text-3xl font-medium',
    body: 'text-lg md:text-xl font-normal'
  },
  effects: {
    glass: 'backdrop-blur-xl bg-white/10 dark:bg-gray-900/20 border border-white/20 dark:border-gray-700/30',
    glow: 'shadow-2xl shadow-purple-500/25 dark:shadow-purple-400/20',
    peer: 'shadow-lg shadow-indigo-500/30 dark:shadow-indigo-400/25'
  }
};

// 피어몰 통계 데이터
const stats = {
  totalPeers: 12847,
  totalMalls: 3429,
  trustedGroups: 847,
  avgTrust: '94.7%'
};

// 거버넌스 컨셉 카드 데이터
const governanceConcepts = [
  {
    title: 'I govern',
    subtitle: '내가 내 세상을',
    description: '자신만의 피어몰을 완전히 자율적으로 운영하세요',
    icon: Crown,
    gradient: peerMallTokens.colors.governance.i,
    features: ['개인 피어몰 생성', '자율적 운영', '콘텐츠 관리']
  },
  {
    title: 'You govern', 
    subtitle: '당신이 당신의 세상을',
    description: '상호 존중과 신뢰 기반의 관계를 형성하세요',
    icon: Users,
    gradient: peerMallTokens.colors.governance.you,
    features: ['추천인 시스템', '신뢰 네트워크', '상호 인증']
  },
  {
    title: 'We govern',
    subtitle: '우리가 우리의 세상을',
    description: '신뢰 그룹으로 함께 성장하는 생태계',
    icon: Network,
    gradient: peerMallTokens.colors.governance.we,
    features: ['집단 지성', '협력 거버넌스', '공동체 발전']
  }
];

// 3D 파티클 컴포넌트
const PeerParticle = ({ index }: { index: number }) => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = Math.random() * 4 + 2;
  const duration = Math.random() * 3 + 2;
  const delay = Math.random() * 2;

  return (
    <motion.div
      className="absolute rounded-full opacity-30"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `linear-gradient(45deg, 
          ${index % 3 === 0 ? '#8B5CF6' : index % 3 === 1 ? '#06B6D4' : '#F59E0B'}, 
          ${index % 3 === 0 ? '#EC4899' : index % 3 === 1 ? '#3B82F6' : '#EF4444'})`
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.sin(index) * 20, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.5, 1],
        rotate: [0, 360, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  );
};

// 신뢰 네트워크 시각화 컴포넌트
const TrustNetwork = () => {
  const nodes = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    x: 50 + 40 * Math.cos((i * 2 * Math.PI) / 7),
    y: 50 + 40 * Math.sin((i * 2 * Math.PI) / 7)
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* 연결선 */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((targetNode, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="url(#trustGradient)"
              strokeWidth="0.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          ))
        )}
        
        {/* 노드 */}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="1.5"
            fill="url(#nodeGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
        
        {/* 그라디언트 정의 */}
        <defs>
          <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default function PeerMallHeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  // 스크롤 기반 애니메이션
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <motion.section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30"
      style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
    >
      {/* 배경 그라디언트 메시 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-cyan-600/5 to-pink-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      {/* 3D 파티클 시스템 */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <PeerParticle key={i} index={i} />
        ))}
      </div>

      {/* 신뢰 네트워크 배경 */}
      <TrustNetwork />

      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* 피어몰 로고/브랜드 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center space-x-3 mb-8"
          >
            {/* <div className={cn(
              "w-16 h-16 rounded-2xl bg-gradient-to-br",
              peerMallTokens.colors.primary.purple,
              "flex items-center justify-center shadow-2xl shadow-purple-500/30"
            )}>
              <Globe className="w-8 h-8 text-white" />
            </div> */}
            {/* <div className="text-left">
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                PeerMall
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Peer-to-Peer Marketplace
              </p>
            </div> */}
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.h1 
            className={cn(
              "font-black leading-[0.9] max-w-5xl mx-auto",
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            )}
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #F59E0B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            I govern
            <br />
            <span className="text-gray-800 dark:text-gray-200">You govern</span>
            <br />
            <span 
              style={{
                background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              We govern
            </span>
          </motion.h1>

          {/* 서브타이틀 */}
          <motion.p 
            className={cn(
              peerMallTokens.typography.subtitle,
              "text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            )}
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            모든 제품이 이야기가 되고, 
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent font-bold">
              모든 연결이 관계가 되는
            </span> PeerMall
          </motion.p>

          {/* 거버넌스 컨셉 카드 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16"
            initial={{ opacity: 0, y: 80 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {governanceConcepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                className={cn(
                  "p-8 rounded-3xl",
                  peerMallTokens.effects.glass,
                  "border-2 border-transparent hover:border-white/30 transition-all duration-500"
                )}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={isHeroInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${concept.gradient} flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                  <concept.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {concept.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      {concept.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {concept.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {concept.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 text-sm bg-white/20 dark:bg-gray-800/50 rounded-full text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-purple-400 dark:border-purple-500 rounded-full flex justify-center backdrop-blur-sm">
          <motion.div
            className="w-1 h-3 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
