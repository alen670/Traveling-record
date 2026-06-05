/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryPoint } from '../types';
import { TRAVEL_CATEGORIES } from '../data';
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  Shield, 
  Heart, 
  Cloud, 
  Lock, 
  Globe, 
  Edit3, 
  Trash2, 
  MoreHorizontal, 
  ChevronUp, 
  ChevronDown, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  CloudFog,
  Award
} from 'lucide-react';

interface BottomSheetProps {
  point: MemoryPoint | null;
  onClose: () => void;
  onEdit: (point: MemoryPoint) => void;
  onDelete: (id: string) => void;
}

export default function BottomSheet({
  point,
  onClose,
  onEdit,
  onDelete,
}: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<'half' | 'full'>('half');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Auto reset state on point change
  useEffect(() => {
    if (point) {
      setSheetState('half');
      setShowMoreMenu(false);
    }
  }, [point]);

  // Prevent body scroll when fully expanded on mobile
  useEffect(() => {
    if (point && sheetState === 'full') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [point, sheetState]);

  if (!point) return null;

  const categoryConfig = TRAVEL_CATEGORIES.find((c) => c.value === point.category) || TRAVEL_CATEGORIES[TRAVEL_CATEGORIES.length - 1];

  const toggleSheetState = () => {
    if (sheetState === 'half') {
      setSheetState('full');
    } else {
      setSheetState('half');
    }
  };

  const getWeatherIcon = (emoji: string) => {
    switch (emoji) {
      case '☀️': return <Sun className="w-4 h-4 text-amber-500 animate-[spin_20s_linear_infinite]" />;
      case '🌧️': return <CloudRain className="w-4 h-4 text-blue-500" />;
      case '❄️': return <CloudSnow className="w-4 h-4 text-sky-400" />;
      case '💨': return <Wind className="w-4 h-4 text-teal-400" />;
      case '🌫️': return <CloudFog className="w-4 h-4 text-zinc-400" />;
      default: return <Cloud className="w-4 h-4 text-slate-450" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-end justify-center pointer-events-none">
        
        {/* iOS subtle dynamic overlay background - Only active when half or full */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: sheetState === 'full' ? 0.4 : 0.15 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black backdrop-blur-[1px] pointer-events-auto"
        />

        {/* Sliding Apple-style Card Sheet */}
        <motion.div
          id="apple-bottom-sheet"
          className={`relative w-full max-w-lg bg-white/94 dark:bg-[#1C1C1E]/94 backdrop-blur-2xl rounded-t-[30px] border-t border-slate-200/40 dark:border-zinc-800 shadow-2xl flex flex-col pointer-events-auto transition-all duration-300 ${
            sheetState === 'full' 
              ? 'h-[88vh] md:h-[82vh]' 
              : 'h-[48vh]'
          } pb-safe-bottom`}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        >
          {/* Top iOS drag handle block */}
          <div 
            onClick={toggleSheetState}
            className="w-full flex flex-col items-center pt-3 pb-2 shrink-0 cursor-pointer touch-none hover:bg-slate-550/5 dark:hover:bg-zinc-800/20 rounded-t-[30px] select-none"
          >
            {/* Minimalist Pill Drag Bar */}
            <div className="w-10 h-1 bg-slate-300 dark:bg-zinc-700 rounded-full transition-colors" />
          </div>

          {/* Core Status & Actions Toolbar Row */}
          <div className="flex items-center justify-between px-6 py-2 border-b border-slate-100 dark:border-zinc-800/60 shrink-0">
            {/* iOS Styled Privacy Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-full text-[10px] font-bold">
              {point.privacyStatus === 'public' ? (
                <>
                  <Globe className="w-3 h-3 text-indigo-500" />
                  <span>公开可见</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>仅自己可见</span>
                </>
              )}
            </div>

            {/* Clean Rounded iOS Icon buttons */}
            <div className="flex items-center gap-2 relative">
              <button
                onClick={toggleSheetState}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                title={sheetState === 'full' ? '收起为半屏' : '展开全文'}
              >
                {sheetState === 'full' ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronUp className="w-4.5 h-4.5" />}
              </button>

              {/* More Actions Dropdown selector */}
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                title="更多操作"
              >
                <MoreHorizontal className="w-4.5 h-4.5" />
              </button>

              {/* Circular iOS close x */}
              <button
                onClick={onClose}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-white rounded-full transition-colors"
                title="关闭"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Apple-style actions context modal */}
              <AnimatePresence>
                {showMoreMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMoreMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-44 bg-white/95 dark:bg-[#2C2C2E]/95 backdrop-blur-xl border border-slate-200/40 dark:border-zinc-800 rounded-2xl shadow-xl p-1.5 z-50 flex flex-col"
                    >
                      <button
                        onClick={() => {
                          setShowMoreMenu(false);
                          onEdit(point);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-left text-xs text-slate-800 dark:text-white font-semibold transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-[#007AFF]" />
                        <span>修编足迹日记</span>
                      </button>
                      
                      <div className="h-px bg-slate-100 dark:bg-zinc-850 my-1" />
                      
                      <button
                        onClick={() => {
                          setShowMoreMenu(false);
                          if (window.confirm('您确定要彻底删除这段心爱的回忆日记吗？此操作不可撤销。')) {
                            onDelete(point.id);
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-left text-xs text-red-650 dark:text-red-400 font-semibold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>彻底删除回忆</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Primary text stream & photos */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
            
            {/* Header Content Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-lg">{categoryConfig.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8E8E93] px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded-md">
                  {categoryConfig.label}
                </span>
                {point.mood && (
                  <span className="text-[10px] text-slate-700 dark:text-zinc-300 font-bold bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    心情: {point.mood}
                  </span>
                )}
                {point.weather && (
                  <span className="text-[10px] text-slate-700 dark:text-zinc-300 font-bold bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    天气: {point.weather}
                  </span>
                )}
              </div>
              
              <h1 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                {point.title}
              </h1>
            </div>

            {/* Geographical details banner */}
            <div className="flex flex-wrap gap-4 py-2 text-xs text-[#8E8E93] dark:text-[#8E8E93] border-b border-slate-100 dark:border-zinc-800/40">
              <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-zinc-800/40 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-[#007AFF]" />
                <span className="font-semibold text-slate-800 dark:text-zinc-250">{point.date}</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-zinc-800/40 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-semibold text-slate-800 dark:text-zinc-250 truncate max-w-[200px]">{point.locationName}</span>
              </div>
            </div>

            {/* Inline Photos Frame (Apple Photos style grid) */}
            {point.images && point.images.length > 0 && (
              <div className="pt-1.5">
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide snap-x">
                  {point.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-56 h-36 rounded-2xl overflow-hidden shadow-sm shrink-0 snap-center bg-slate-200 dark:bg-zinc-800 border border-slate-100/10"
                    >
                      <img
                        src={img}
                        alt={`media-${idx}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apple Notes Styled Diary block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8E8E93] font-bold uppercase tracking-widest pl-0.5">
                <span>岁月笔记</span>
                {Array.from({ length: Math.min(point.rating, 5) }).map((_, rIdx) => (
                  <span key={rIdx} className="text-amber-400 text-[10px]">★</span>
                ))}
              </div>
              
              <div 
                className={`relative px-4 py-3.5 bg-slate-50 dark:bg-zinc-850 border border-slate-200/40 dark:border-zinc-800/50 rounded-2xl transition-all ${
                  sheetState === 'half' ? 'line-clamp-4 max-h-32 overflow-hidden' : ''
                }`}
              >
                <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap font-light">
                  {point.notes || '这里静静地流淌，并没有刻下回忆的文字。'}
                </p>

                {/* Fade transparent overlay for Half view */}
                {sheetState === 'half' && (
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 dark:from-zinc-850 to-transparent pointer-events-none" />
                )}
              </div>

              {/* Smooth expand bar */}
              {sheetState === 'half' && (
                <div className="flex justify-center pt-1.5">
                  <button
                    onClick={() => setSheetState('full')}
                    className="px-4 py-2 rounded-full border border-slate-200/60 dark:border-zinc-800 text-xs font-bold text-[#007AFF] bg-white dark:bg-zinc-900 shadow-sm transition-all text-center flex items-center gap-1 hover:scale-105"
                  >
                    <span>展开日记全文</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Full information detail elements */}
            {sheetState === 'full' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 pt-1 border-t border-slate-100 dark:border-zinc-800/40"
              >
                {/* Tags block */}
                {point.tags && point.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider pl-0.5">回忆书签</span>
                    <div className="flex flex-wrap gap-1.5">
                      {point.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-bold bg-[#007AFF]/10 dark:bg-zinc-800 text-[#007AFF] dark:text-zinc-200 border border-transparent dark:border-zinc-700 px-2.5 py-1 rounded-full flex items-center gap-0.5"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coordinates footer details */}
                <div className="flex justify-between items-center text-[10px] text-[#8E8E93] font-mono border-t border-slate-100 dark:border-zinc-800/40 pt-3">
                  <span>编号: {point.id.toUpperCase()}</span>
                  <span>坐标: {point.lat.toFixed(5)}°N, {point.lng.toFixed(5)}°E</span>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
