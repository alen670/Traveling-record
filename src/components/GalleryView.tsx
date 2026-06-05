/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MemoryPoint } from '../types';
import { Camera, Calendar, MapPin, Heart, X, Compass, Navigation } from 'lucide-react';

interface GalleryViewProps {
  points: MemoryPoint[];
  onSelectPoint: (id: string) => void;
  onNavigateToTab: (tab: 'map' | 'timeline' | 'gallery' | 'statistics' | 'profile') => void;
}

type PhotoSegment = 'year' | 'month' | 'all';

export default function GalleryView({
  points,
  onSelectPoint,
  onNavigateToTab,
}: GalleryViewProps) {
  const [segment, setSegment] = useState<PhotoSegment>('all');
  const [previewItem, setPreviewItem] = useState<{
    url: string;
    title: string;
    locationName: string;
    date: string;
    pointId: string;
  } | null>(null);

  // Aggregate all local media assets with parent markers
  const items = points
    .flatMap((point) => {
      return (point.images || []).map((img, imgIdx) => ({
        point,
        url: img,
        key: `${point.id}-${imgIdx}`,
      }));
    })
    .sort((a, b) => new Date(b.point.date).getTime() - new Date(a.point.date).getTime());

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full bg-[#F2F2F7] dark:bg-black text-[#8E8E93] select-none">
        <div className="bg-white dark:bg-[#1C1C1E] rounded-full p-4.5 mb-3 shadow-xs">
          <Camera className="w-10 h-10 text-slate-300 dark:text-zinc-700 animate-pulse" />
        </div>
        <p className="text-xs font-black">影集空空如也</p>
        <p className="text-[10px] text-[#8E8E93] mt-1 max-w-xs leading-normal">
          你还没有创作包含影像的足迹日记。点击地图空白处或右下角“+”按钮拍摄上传，留驻缤纷视界。
        </p>
      </div>
    );
  }

  // Group items by Year or YearMonth
  const getGroupedItems = () => {
    if (segment === 'all') return null;

    const grouped: { [key: string]: typeof items } = {};
    items.forEach((item) => {
      const dateObj = new Date(item.point.date);
      if (isNaN(dateObj.getTime())) {
        const key = '未知时期';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      } else {
        const year = dateObj.getFullYear();
        if (segment === 'year') {
          const key = `${year}年`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        } else {
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const key = `${year}年 ${month}月`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        }
      }
    });

    return Object.entries(grouped);
  };

  const groupedPhotos = getGroupedItems();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7] dark:bg-black overflow-hidden font-sans text-black dark:text-white select-none">
      
      {/* 1. iOS Album Title Navigation Bar & Segmented control */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/85 backdrop-blur-2xl px-5 py-4 border-b border-slate-200/40 dark:border-zinc-800/60 shrink-0 space-y-3.5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">回忆相册</h1>
          <span className="text-[10px] font-bold text-[#8E8E93] bg-slate-100 dark:bg-zinc-850 px-2.5 py-1 rounded-md shrink-0">
            {items.length} 张瞬间
          </span>
        </div>

        {/* Apple Segmented Control */}
        <div className="flex justify-center">
          <div className="bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-xl flex w-full max-w-xs justify-between gap-0.5 text-xs">
            {(['year', 'month', 'all'] as const).map((seg) => (
              <button
                key={seg}
                onClick={() => setSegment(seg)}
                className={`flex-1 py-1.5 rounded-lg font-black transition-all text-center border-none cursor-pointer ${
                  segment === seg
                    ? 'bg-white dark:bg-zinc-700 text-[#007AFF] shadow-sm'
                    : 'text-[#8E8E93] hover:text-slate-700'
                }`}
              >
                {seg === 'year' ? '年' : seg === 'month' ? '月' : '全部'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Photo streaming Grid block */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {segment === 'all' ? (
          /* Plain grid of photos */
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <div
                key={item.key}
                onClick={() => setPreviewItem({
                  url: item.url,
                  title: item.point.title,
                  locationName: item.point.locationName,
                  date: item.point.date,
                  pointId: item.point.id
                })}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-xs hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer bg-slate-250 dark:bg-zinc-800 group"
              >
                <img
                  src={item.url}
                  alt={item.point.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Segmented groups list */
          <div className="space-y-6">
            {groupedPhotos?.map(([label, groupItems]) => (
              <div key={label} className="space-y-2">
                <div className="px-1 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-zinc-200">
                    {label}
                  </span>
                  <span className="text-[9px] text-[#8E8E93] font-bold">
                    {groupItems.length} 张
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {groupItems.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => setPreviewItem({
                        url: item.url,
                        title: item.point.title,
                        locationName: item.point.locationName,
                        date: item.point.date,
                        pointId: item.point.id
                      })}
                      className="relative aspect-square rounded-2xl overflow-hidden shadow-xs hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer bg-slate-250 dark:bg-zinc-800"
                    >
                      <img
                        src={item.url}
                        alt={item.point.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Immersive Overlay Photo view detail Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[4000] bg-black/98 backdrop-blur-2xl flex flex-col justify-between pointer-events-auto select-none font-sans text-white p-4">
          
          {/* Top closing items */}
          <div className="flex items-center justify-between py-2.5 shrink-0 z-50">
            <span className="text-xs font-black tracking-wide text-zinc-100">
              📅 {previewItem.date}
            </span>
            <button
              onClick={() => setPreviewItem(null)}
              className="p-1.5 bg-zinc-850 hover:bg-zinc-800 text-white rounded-full transition-colors cursor-pointer border-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Centered big images viewer */}
          <div className="flex-1 flex items-center justify-center relative p-2 min-h-0 bg-black">
            <img
              src={previewItem.url}
              alt={previewItem.title}
              className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Bottom card actions & title annotations */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl md:max-w-md mx-auto w-full space-y-4 shrink-0 z-50 mt-4">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest pl-0.5">足点回忆</span>
              <h3 className="text-sm font-black text-zinc-100 leading-tight">
                {previewItem.title}
              </h3>
              
              <div className="flex items-center gap-1.5 text-xs text-[#8E8E93]">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="truncate">{previewItem.locationName}</span>
              </div>
            </div>

            {/* Link to center coordinate map actions */}
            <button
              onClick={() => {
                onSelectPoint(previewItem.pointId);
                setPreviewItem(null);
                onNavigateToTab('map'); // Send back map tab
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#007AFF] text-white hover:opacity-95 duration-150 transition-all rounded-xl font-bold text-xs ring-4 ring-[#007AFF]/15 cursor-pointer border-none"
            >
              <Navigation className="w-4 h-4 fill-white shrink-0" />
              <span>在地图上定位此瞬间</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
