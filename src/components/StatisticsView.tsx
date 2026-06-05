/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MemoryPoint } from '../types';
import { Sparkles, Calendar, MapPin, Camera, Heart, Sun, Film, ChevronRight, X, HeartHandshake, Smile, BookOpen } from 'lucide-react';
import { TRAVEL_CATEGORIES } from '../data';

interface StatisticsViewProps {
  points: MemoryPoint[];
}

export default function StatisticsView({ points }: StatisticsViewProps) {
  const [showReport, setShowReport] = useState(false);
  const [activeReportSlide, setActiveReportSlide] = useState(0);

  if (points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full bg-[#F2F2F7] dark:bg-black text-[#8E8E93] select-none font-sans">
        <div className="bg-white dark:bg-[#1C1C1E] rounded-full p-4.5 mb-3 shadow-xs">
          <Sparkles className="w-10 h-10 text-slate-300 dark:text-zinc-700 animate-pulse" />
        </div>
        <p className="text-xs font-black">静息回忆，静待开启</p>
        <p className="text-[10px] text-[#8E8E93] mt-1 max-w-xs leading-normal">
          这里是您的情感时光机。在大地图上标记足迹并写下心情，这里会自动构筑出专属的苹果健康式「生活能量环」与年度私密纪念报告册。
        </p>
      </div>
    );
  }

  // --- Calculate Metrics ---
  const currentYear = new Date().getFullYear();
  const yearPoints = points.filter(p => !p.date || p.date.startsWith(String(currentYear)));
  const recordsCount = yearPoints.length > 0 ? yearPoints.length : points.length;

  const totalPhotos = points.reduce((acc, p) => acc + (p.images ? p.images.length : 0), 0);
  const uniquePlaces = new Set(points.map(p => p.locationName));
  const placesCount = uniquePlaces.size;

  // Most frequent location
  const locationCounts: { [key: string]: number } = {};
  points.forEach(p => {
    locationCounts[p.locationName] = (locationCounts[p.locationName] || 0) + 1;
  });
  const topLocation = Object.entries(locationCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || '我的回忆港湾';

  // Most common tag
  const tagCounts: { [key: string]: number } = {};
  points.flatMap(p => p.tags || []).forEach(tag => {
    if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  const topTags = Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).slice(0, 3).map(entry => entry[0]);

  // Favorite mood
  const moodCounts: { [key: string]: number } = {};
  points.forEach(p => {
    const m = p.mood || '😊';
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || '😊';

  // Weather distribution
  const weatherCounts: { [key: string]: number } = {};
  points.forEach(p => {
    const w = p.weather || '☀️';
    weatherCounts[w] = (weatherCounts[w] || 0) + 1;
  });
  const topWeather = Object.entries(weatherCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || '☀️';

  // Chrono landmarks
  const sortedPoints = [...points].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const oldestPoint = sortedPoints[0];
  const newestPoint = sortedPoints[sortedPoints.length - 1];

  // --- Apple Activity Rings Percentages (Goal: 12 memories, 20 photos, 8 locations) ---
  const ringMemPct = Math.min((points.length / 15) * 100, 100);
  const ringPicPct = Math.min((totalPhotos / 25) * 100, 100);
  const ringLocPct = Math.min((placesCount / 10) * 100, 100);

  // SVG parameters for rings
  const center = 75;
  const strokeWidth = 10;
  const radius1 = 60; // Outer memory ring
  const radius2 = 46; // Middle photo ring
  const radius3 = 32; // Inner location ring

  const getStrokeDash = (pct: number, r: number) => {
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return { strokeDasharray: `${circ}`, strokeDashoffset: `${offset}` };
  };

  // Heatmap generation: list of past 40 days
  const getHeatmapDays = () => {
    const days = [];
    const now = new Date();
    for (let i = 41; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const hasMemory = points.some(p => p.date === str);
      days.push({ dateStr: str, hasMemory });
    }
    return days;
  };
  const heatmapDays = getHeatmapDays();

  // Storybook report slides contents
  const reportSlides = [
    {
      title: "第一缕微风",
      desc: `回忆的回轮，旋转至第一个地标。在 ${oldestPoint?.date || '过去'} 的那一天，你漫步在 【${oldestPoint?.locationName || '一个角落'}】，并在日记本上盖下了足痕的第一枚钢印——《${oldestPoint?.title || '未命名的故事'}》。从那时起，这道时光的联执开始在地图上绵延。`,
      illustration: "🌬️"
    },
    {
      title: "心安之所，常常伫足",
      desc: `岁月的河床常常带你折返。你最眷恋、打卡次数最多的地标是【${topLocation}】。每当你去到那里时，你的心里最常泛起《${topMood}》的心绪，而在笔记本里，你用 #${topTags.join(' #') || '生活'} 将它永远装帧。`,
      illustration: "📍"
    },
    {
      title: "你留下的生活能量环",
      desc: `今年，你共封存了 ${recordsCount} 篇珍贵的足迹日记，留下了 ${totalPhotos} 张彩色留影。生活本就是由你记住的高光片段拼凑而成的。愿我们继续握笔漫步，去丈量、去相伴、去写下下一个值得被封存的黄昏。`,
      illustration: "🎨"
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7] dark:bg-black overflow-hidden font-sans text-black dark:text-white select-none">
      
      {/* 1. iOS App Title bar */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/85 backdrop-blur-2xl px-5 py-4.5 border-b border-slate-200/40 dark:border-zinc-800/60 shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">回顾</h1>
        <span className="text-[10px] font-bold text-[#8E8E93]">Apple Health style</span>
      </div>

      {/* 2. Main content grids */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        
        {/* Apple Fitness Activity Circular Rings banner card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 border border-slate-100/10 dark:border-zinc-800/40 shadow-xs flex items-center gap-5 justify-between">
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-widest block">生活留影指标</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">我的时光圆环</h2>
            </div>

            {/* Micro indicators items */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-755 dark:text-zinc-300">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="truncate">记日记 ({points.length}/15)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-755 dark:text-zinc-300">
                <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shrink-0" />
                <span className="truncate">相册影集 ({totalPhotos}/25)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-755 dark:text-zinc-300">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">留影地标 ({placesCount}/10)</span>
              </div>
            </div>
          </div>

          {/* Render circular SVG activity rings */}
          <div className="w-28 h-28 flex items-center justify-center shrink-0">
            <svg width="110" height="110" viewBox="0 0 150 150" className="rotate-270">
              {/* Outer Ring 1: Memory points */}
              <circle cx={center} cy={center} r={radius1} stroke="#fda4af" strokeWidth={strokeWidth} fill="transparent" opacity="0.2" />
              <circle cx={center} cy={center} r={radius1} stroke="#f43f5e" strokeWidth={strokeWidth} fill="transparent" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease', ...getStrokeDash(ringMemPct, radius1) }} />

              {/* Middle Ring 2: Photos */}
              <circle cx={center} cy={center} r={radius2} stroke="#bfdbfe" strokeWidth={strokeWidth} fill="transparent" opacity="0.2" />
              <circle cx={center} cy={center} r={radius2} stroke="#007AFF" strokeWidth={strokeWidth} fill="transparent" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease', ...getStrokeDash(ringPicPct, radius2) }} />

              {/* Inner Ring 3: Locations */}
              <circle cx={center} cy={center} r={radius3} stroke="#a7f3d0" strokeWidth={strokeWidth} fill="transparent" opacity="0.2" />
              <circle cx={center} cy={center} r={radius3} stroke="#34d399" strokeWidth={strokeWidth} fill="transparent" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease', ...getStrokeDash(ringLocPct, radius3) }} />
            </svg>
          </div>
        </div>

        {/* Life-oriented warm quotes card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 border border-slate-100/10 dark:border-zinc-800/40 shadow-xs space-y-3">
          <span className="text-[9px] font-black uppercase text-[#8E8E93] tracking-wider block">岁月漫写心照</span>
          
          <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-light space-y-2">
            <p>
              今年，在这个未完待续的年份里，你已经静静留下了 <b className="font-extrabold text-[#007AFF] text-sm">{recordsCount} 段</b> 回忆。
            </p>
            <p className="border-l-2 border-slate-200 dark:border-zinc-700 pl-3 italic py-1 text-slate-500 text-[11px]">
              “日子并不单单流向未来的海，它也会在大地图的微茫星斑里，为你沉淀尘世中的喜怒晴雨。”
            </p>
            <p>
              在这趟心碎与惊喜并存的生活行进中，你的脚步曾常常叩击 <span className="font-semibold text-slate-900 dark:text-zinc-150">【{topLocation}】</span>。在这片足印深处，你的天空常常呈现《<span className="font-semibold">{topWeather}</span>》的天色，伴随着心头那股《<span className="font-semibold">{topMood}</span>》的涟漪。
            </p>
          </div>
        </div>

        {/* Footprint Heatmaps - Activity Dot Grid */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 border border-slate-100/10 dark:border-zinc-800/40 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase text-[#8E8E93] tracking-wider">足迹热力图 (近 6 周行迹)</span>
            <div className="flex items-center gap-1.5 text-[8px] text-[#8E8E93] font-bold">
              <span>静息</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
              <span>标记</span>
            </div>
          </div>

          {/* Dots gird */}
          <div className="flex flex-wrap gap-2 justify-center py-1 bg-slate-50/50 dark:bg-zinc-850/20 p-2 rounded-xl">
            {heatmapDays.map((v, i) => (
              <div
                key={i}
                className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-[7px] font-bold ${
                  v.hasMemory
                    ? 'bg-[#007AFF] text-white shadow-sm scale-110'
                    : 'bg-slate-205 dark:bg-zinc-800 text-transparent'
                }`}
                title={`${v.dateStr}: ${v.hasMemory ? '有印迹' : '无印迹'}`}
              >
                {v.hasMemory && '✔'}
              </div>
            ))}
          </div>
        </div>

        {/* Generate Annual Review Report button */}
        <button
          onClick={() => {
            setActiveReportSlide(0);
            setShowReport(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007AFF] text-white rounded-2xl font-black text-xs shadow-md shadow-[#007AFF]/10 hover:translate-y-[-1px] duration-150 active:scale-98 transition-all cursor-pointer border-none"
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>生成年度足记回忆报告</span>
        </button>

      </div>

      {/* 3. Cinematic Annual slideshow modal overlay */}
      {showReport && (
        <div className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl flex flex-col justify-between p-6 select-none font-sans text-white">
          
          {/* Header toolbar */}
          <div className="flex items-center justify-between py-2 shrink-0 z-50">
            <span className="text-xs font-black text-[#8E8E93] tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
              SLIDE {activeReportSlide + 1} / {reportSlides.length}
            </span>
            
            <button
              onClick={() => setShowReport(false)}
              className="p-1.5 bg-zinc-850 hover:bg-zinc-800 rounded-full text-zinc-100 transition-colors border-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cinematic Slide content viewer */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-sm mx-auto space-y-6">
            <div className="text-7xl animate-bounceSlow select-none">
              {reportSlides[activeReportSlide].illustration}
            </div>

            <div className="space-y-3.5">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                {reportSlides[activeReportSlide].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed font-light">
                {reportSlides[activeReportSlide].desc}
              </p>
            </div>
          </div>

          {/* Footer Slide controls */}
          <div className="py-4 flex items-center justify-between shrink-0 max-w-sm mx-auto w-full gap-4 z-50">
            {activeReportSlide > 0 ? (
              <button
                onClick={() => setActiveReportSlide(p => p - 1)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[#8E8E93] text-xs font-bold rounded-xl outline-none"
              >
                上一步
              </button>
            ) : (
              <div className="w-16 h-8" />
            )}

            {activeReportSlide < reportSlides.length - 1 ? (
              <button
                onClick={() => setActiveReportSlide(p => p + 1)}
                className="flex-1 py-3 bg-[#007AFF] text-white text-xs font-bold rounded-xl hover:opacity-95 cursor-pointer border-none flex items-center justify-center gap-1.5"
              >
                <span>下一步</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowReport(false)}
                className="flex-1 py-3 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer border-none"
              >
                翻阅完毕 • 感谢陪伴
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
