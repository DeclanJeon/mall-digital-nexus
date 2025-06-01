export const zGenDesignTokens = {
  colors: {
    // 🎨 네온 그라디언트 팔레트
    neon: {
      cyan: '#00ffff',
      pink: '#ff00ff',
      purple: '#8b5cf6',
      green: '#00ff88',
      orange: '#ff6b35',
      blue: '#3b82f6',
      yellow: '#fbbf24'
    },
    // 🌙 다크모드 친화적 컬러
    dark: {
      bg: '#0a0a0a',
      surface: '#1a1a1a',
      elevated: '#2a2a2a',
      border: '#3a3a3a',
      text: '#ffffff',
      muted: '#888888'
    },
    // ☀️ 라이트모드 컬러
    light: {
      bg: '#fafafa',
      surface: '#ffffff',
      elevated: '#f8f9fa',
      border: '#e5e7eb',
      text: '#1a1a1a',
      muted: '#6b7280'
    },
    // 🌈 감성적 그라디언트
    gradients: {
      aurora: 'from-purple-400 via-pink-500 to-red-500',
      ocean: 'from-blue-400 via-purple-500 to-pink-500',
      sunset: 'from-orange-400 via-red-500 to-pink-600',
      forest: 'from-green-400 via-blue-500 to-purple-600',
      galaxy: 'from-indigo-900 via-purple-900 to-pink-900',
      neon: 'from-cyan-400 via-purple-500 to-pink-500',
      glass: 'from-white/20 via-white/10 to-transparent',
      energy: 'from-yellow-400 via-orange-500 to-red-600',
      cyber: 'from-green-400 via-cyan-400 to-blue-500',
      dream: 'from-pink-300 via-purple-300 to-indigo-400'
    }
  },
  typography: {
    // 🔥 임팩트 있는 타이포그래피
    hero: 'text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent',
    title: 'text-2xl md:text-3xl font-bold text-gray-900 dark:text-white',
    subtitle: 'text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300',
    body: 'text-sm md:text-base text-gray-600 dark:text-gray-400',
    caption: 'text-xs md:text-sm text-gray-500 dark:text-gray-500',
    label: 'text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'
  },
  spacing: {
    section: 'mb-16 md:mb-24',
    card: 'p-6 md:p-8',
    cardGap: 'gap-6 md:gap-8',
    element: 'mb-4 md:mb-6'
  },
  // 🎭 고급 애니메이션 & 효과
  effects: {
    glass: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
    neon: 'shadow-lg shadow-purple-500/25 border border-purple-500/20',
    glow: 'shadow-2xl shadow-blue-500/20 border border-blue-500/10',
    floating: 'hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out',
    magnetic: 'hover:scale-105 transition-transform duration-300 ease-out',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    wiggle: 'hover:animate-pulse'
  },
  // 🎬 시네마틱 애니메이션
  animations: {
    fadeInUp: {
      initial: { 
        opacity: 0, 
        y: 60,
        transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
      },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
      }
    },
    slideInLeft: {
      initial: { 
        opacity: 0, 
        x: -100,
        transition: { duration: 0.6, ease: "easeOut" }
      },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    },
    scaleIn: {
      initial: { 
        opacity: 0, 
        scale: 0.8,
        transition: { duration: 0.5, ease: "backOut" }
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.5, ease: "backOut" }
      }
    },
    staggerChildren: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    floating: {
      animate: {
        y: [-10, 10, -10],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  }
};