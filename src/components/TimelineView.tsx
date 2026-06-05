/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MemoryPoint, TravelCategory } from '../types';
import { TRAVEL_CATEGORIES } from '../data';
import { Search, Calendar, Heart, Cloud, Tag, Lock, Globe, ArrowUpDown, ChevronRight, Fuel, Compass } from 'lucide-react';

interface TimelineViewProps {
  points: MemoryPoint[];
  selectedPointId: string | null;
  onSelectPoint: (id: string | null) => void;
  onEditPoint: (point: MemoryPoint) => void;
  onNavigateToTab: (tab: 'map' | 'timeline' | 'gallery' | 'statistics' | 'profile') => void;
}

type SortOrder = 'newest' | 'oldest';

export default function TimelineView({
  points,
  selectedPointId,
  onSelectPoint,
  onEditPoint,
  onNavigateToTab,
}: TimelineViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Filter & sort points
  const sortedPoints = [...points]
    .filter((point) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = point.title.toLowerCase().includes(query);
        const matchesLocation = point.locationName.toLowerCase().includes(query);
        const matchesNotes = point.notes.toLowerCase().includes(query);
        const matchesTags = point.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesLocation && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      if (selectedCategory !== 'all' && point.category !== selectedCategory) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Group by month
  const groupMemoriesByMonth = () => {
    const groups: { [key: string]: MemoryPoint[] } = {};
    sortedPoints.forEach((point) => {
      const dateObj = new Date(point.date);
      if (isNaN(dateObj.getTime())) {
        const yearMonth = '未知日期';
        if (!groups[yearMonth]) groups[yearMonth] = [];
        groups[yearMonth].push(point);
      } else {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const yearMonth = `${year}年 ${month}月`;
        if (!groups[yearMonth]) groups[yearMonth] = [];
        groups[yearMonth].push(point);
      }
    });
    return Object.entries(groups);
  };

  const groupedTimeline = groupMemoriesByMonth();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7] dark:bg-black overflow-hidden font-sans text-black dark:text-white select-none">
      
      {/* 1. Cupertino Apple Header and Search Controls */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/85 backdrop-blur-2xl p-4 border-b border-slate-200/40 dark:border-zinc-800/60 shrink-0 space-y-3.5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">时间轴</h1>
          
          <button
            onClick={() => setSortOrder((p) => (p === 'newest' ? 'oldest' : 'newest'))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-[#007AFF] cursor-pointer shrink-0 border-none bg-transparent"
            title={sortOrder === 'newest' ? '按时间由远到近排序' : '按时间由近到远排序'}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索日记内容、标题、地标或#标签"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-zinc-800 border-none rounded-xl outline-none focus:bg-slate-200/50 dark:focus:bg-zinc-750 text-slate-900 dark:text-white font-medium"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8E8E93]" />
        </div>

        {/* Categories Scroller row */}
        <div className="flex gap-2.5 overflow-x-auto pb-0.5 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-[10px] shrink-0 font-bold transition-all border-none ${
              selectedCategory === 'all'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
            }`}
          >
            全部 ({points.length})
          </button>
          
          {TRAVEL_CATEGORIES.map((cat) => {
            const count = points.filter((p) => p.category === cat.value).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-[10px] shrink-0 font-bold transition-all border-none flex items-center gap-1 ${
                  selectedCategory === cat.value
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Scroll Area containing Timeline stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {groupedTimeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] text-[#8E8E93]">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-zinc-700 mb-3 animate-[pulse_3s_infinite]" />
            <p className="text-xs font-black">静如秋叶，亦无记忆</p>
            <p className="text-[10px] mt-1 text-[#8E8E93] max-w-xs">尚未录入此类别的时光记录，请点击地图或右下角“+”按钮，记事当下生活情趣</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTimeline.map(([monthLabel, memories]) => (
              <div key={monthLabel} className="space-y-3.5">
                
                {/* Year Month sticky line header */}
                <div className="sticky top-0 bg-[#F2F2F7]/95 dark:bg-black/95 backdrop-blur-md py-1.5 z-10 flex items-center gap-1 px-1.5">
                  <span className="text-xs font-black tracking-wider text-slate-900 dark:text-zinc-200">
                    {monthLabel}
                  </span>
                  <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider bg-slate-205 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                    {memories.length} 篇
                  </span>
                </div>

                {/* Sub list */}
                <div className="space-y-3">
                  {memories.map((point) => {
                    const firstImage = point.images && point.images.length > 0 ? point.images[0] : null;
                    const catConfig = TRAVEL_CATEGORIES.find(c => c.value === point.category) || TRAVEL_CATEGORIES[TRAVEL_CATEGORIES.length - 1];

                    return (
                      <div
                        key={point.id}
                        onClick={() => {
                          onSelectPoint(point.id);
                          onNavigateToTab('map'); // Send back focusing map
                        }}
                        className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-4 border border-slate-100/10 dark:border-zinc-800/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col md:flex-row gap-4 justify-between"
                      >
                        {/* Summary details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-black uppercase text-[#8E8E93]">
                                {point.date}
                              </span>
                              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                              <span className="text-[10px] font-bold text-[#007AFF] bg-[#007AFF]/5 px-2 py-0.5 rounded-md flex items-center gap-1">
                                {catConfig.icon} {point.locationName}
                              </span>
                              {point.privacyStatus === 'private' && (
                                <Lock className="w-3 h-3 text-[#8E8E93]" />
                              )}
                            </div>

                            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                              {point.title}
                            </h3>

                            {point.notes && (
                              <p className="text-[11px] sm:text-xs text-[#8E8E93] leading-relaxed line-clamp-2 md:line-clamp-3 font-light">
                                {point.notes}
                              </p>
                            )}
                          </div>

                          {/* Chips section */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-2 border-t border-slate-100/40 dark:border-zinc-800/40">
                            {point.mood && (
                              <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800/70 px-2 py-0.5 rounded-full">
                                Mood: {point.mood}
                              </span>
                            )}
                            
                            {point.tags && point.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[9px] font-semibold text-[#007AFF] bg-[#007AFF]/10 dark:bg-zinc-805/50 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Collage on right side if image is present */}
                        {firstImage && (
                          <div className="w-full md:w-32 h-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-200 dark:bg-zinc-800">
                            <img
                              src={firstImage}
                              alt="timeline-feature"
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
