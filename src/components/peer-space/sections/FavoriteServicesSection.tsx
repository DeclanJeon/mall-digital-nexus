// FavoriteServicesSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import FavoriteServices from '@/components/features/FavoriteServices';
import { zGenDesignTokens } from '@/styles/designTokens';

export default function FavoriteServicesSection() {
  return (
    <motion.section 
      className={zGenDesignTokens.spacing.section}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-3xl p-8",
            zGenDesignTokens.effects.glass,
            "bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20"
          )}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    나만의 즐겨찾기 ❤️
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    자주 찾는 피어몰들을 한눈에 확인하세요
                  </p>
                </div>
              </div>
              <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                개인화됨
              </Badge>
            </div>
            <FavoriteServices />
          </div>
          
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </motion.section>
  );
}