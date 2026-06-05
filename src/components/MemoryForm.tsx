/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { MemoryPoint, TravelCategory } from '../types';
import { TRAVEL_CATEGORIES } from '../data';
import { 
  X, 
  MapPin, 
  Tag, 
  Calendar, 
  Heart, 
  Cloud, 
  Lock, 
  Eye, 
  Trash2, 
  Camera, 
  Check, 
  RefreshCw,
  Sparkles,
  Award,
  Globe,
  Compass,
  FileText
} from 'lucide-react';

interface MemoryFormProps {
  pointToEdit: MemoryPoint | null; // Null means Add mode
  initialCoords: { lat: number; lng: number; locationName: string } | null;
  onSave: (point: Omit<MemoryPoint, 'createdAt'>) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: '开心' },
  { emoji: '😌', label: '平静' },
  { emoji: '🧗', label: '踏实' },
  { emoji: '🍜', label: '满足' },
  { emoji: '🌧️', label: '怀旧' },
  { emoji: '🌊', label: '忘忧' },
  { emoji: '💖', label: '感动' },
];

const WEATHER_OPTIONS = [
  { emoji: '☀️', label: '晴朗' },
  { emoji: '☁️', label: '多云' },
  { emoji: '🌧️', label: '细雨' },
  { emoji: '❄️', label: '瑞雪' },
  { emoji: '💨', label: '有风' },
  { emoji: '🌫️', label: '薄雾' },
];

export default function MemoryForm({
  pointToEdit,
  initialCoords,
  onSave,
  onDelete,
  onCancel,
}: MemoryFormProps) {
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [lat, setLat] = useState(30.0);
  const [lng, setLng] = useState(120.0);
  const [category, setCategory] = useState<TravelCategory>('other');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState<string[]>([]);
  const [mood, setMood] = useState('😊');
  const [weather, setWeather] = useState('☀️');
  const [privacyStatus, setPrivacyStatus] = useState<'private' | 'public'>('private'); // Always private by default
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state on load/change
  useEffect(() => {
    if (pointToEdit) {
      setTitle(pointToEdit.title);
      setLocationName(pointToEdit.locationName);
      setDate(pointToEdit.date);
      setLat(pointToEdit.lat);
      setLng(pointToEdit.lng);
      setCategory(pointToEdit.category);
      setNotes(pointToEdit.notes);
      setTags(pointToEdit.tags);
      setRating(pointToEdit.rating);
      setImages(pointToEdit.images);
      setMood(pointToEdit.mood || '😊');
      setWeather(pointToEdit.weather || '☀️');
      setPrivacyStatus(pointToEdit.privacyStatus || 'private');
    } else if (initialCoords) {
      setTitle('');
      setLocationName(initialCoords.locationName);
      setDate(new Date().toISOString().split('T')[0]);
      setLat(initialCoords.lat);
      setLng(initialCoords.lng);
      setCategory('other');
      setNotes('');
      setTags([]);
      setRating(5);
      setImages([]);
      setMood('😊');
      setWeather('☀️');
      setPrivacyStatus('private');
    }
  }, [pointToEdit, initialCoords]);

  // Image Upload compressor helper
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const loadedBase64s: string[] = [];
    let processedCount = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Standard quality JPEG mapping
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          loadedBase64s.push(compressedBase64);
          processedCount++;

          if (processedCount === files.length) {
            setImages((prev) => [...prev, ...loadedBase64s]);
            setIsCompressing(false);
          }
        };
      };
      reader.readAsDataURL(file as any);
    });
  };

  // Tag helper
  const handleAddTag = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanedTag = tagInput.trim().replace(/^#/, '');
      if (cleanedTag && !tags.includes(cleanedTag)) {
        setTags((prev) => [...prev, cleanedTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('请记录此段回忆的标题');
      return;
    }
    if (!locationName.trim()) {
      alert('请填写一个所属地标名称');
      return;
    }

    onSave({
      id: pointToEdit ? pointToEdit.id : Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      locationName: locationName.trim(),
      date,
      lat: Number(lat),
      lng: Number(lng),
      category,
      notes: notes.trim(),
      tags,
      images,
      rating,
      mood,
      weather,
      privacyStatus,
    });
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] text-black dark:text-white rounded-t-[30px] sm:rounded-3xl max-h-full overflow-y-auto flex flex-col font-sans select-none border-0">
      
      {/* 1. iOS Glass Header bar */}
      <div className="bg-slate-100/40 dark:bg-zinc-800/20 p-5 shrink-0 border-b border-slate-200/40 dark:border-zinc-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#007AFF] animate-pulse" />
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              记录一段回忆
            </h1>
            <p className="text-[10px] text-[#8E8E93]">Apple Journal style • 我的心意日记</p>
          </div>
        </div>
        
        <button
          onClick={onCancel}
          className="text-[#8E8E93] hover:text-slate-600 p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* 2. Apple Maps Styled Location Interactive Mini-Card */}
        <div className="p-3 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-100 dark:border-zinc-800/40 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#007AFF]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-widest block mb-0.5">足点标记</span>
            <input
              type="text"
              required
              placeholder="西湖山水岸"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full text-xs font-bold bg-transparent outline-none border-none border-b border-transparent focus:border-slate-300 dark:focus:border-zinc-700 text-slate-800 dark:text-zinc-100 p-0"
            />
          </div>
        </div>

        {/* 3. Lined Notebook Title Entry */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">回忆标题</span>
          <input
            type="text"
            required
            placeholder="今天，发生了什么美妙的事？"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-black bg-transparent border-b border-slate-200 dark:border-zinc-800 focus:border-[#007AFF] dark:focus:border-[#0A84FF] outline-none py-1.5 transition-colors placeholder:text-slate-350 dark:placeholder:text-zinc-600 text-slate-900 dark:text-white"
          />
        </div>

        {/* 4. Elegant Date and category picks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">纪念日</span>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-[#2C2C2E] border border-transparent dark:border-zinc-800 rounded-xl outline-none text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100/50"
              />
              <Calendar className="absolute left-2.5 top-3 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">足印分类</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TravelCategory)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#2C2C2E] border border-transparent dark:border-zinc-800 rounded-xl outline-none text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100/50"
            >
              {TRAVEL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Mood Selector pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">心中情绪</span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
            {MOOD_OPTIONS.map((opt) => {
              const isSelected = mood === opt.emoji;
              return (
                <button
                  key={opt.emoji}
                  type="button"
                  onClick={() => setMood(opt.emoji)}
                  className={`px-3 py-2 rounded-xl border text-xs shrink-0 font-bold flex items-center gap-1.5 transition-all snap-center ${
                    isSelected
                      ? 'bg-[#007AFF]/10 border-transparent text-[#007AFF] shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-800 border-transparent text-slate-750 dark:text-zinc-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Weather options */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">晴雨天气</span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
            {WEATHER_OPTIONS.map((opt) => {
              const isSelected = weather === opt.emoji;
              return (
                <button
                  key={opt.emoji}
                  type="button"
                  onClick={() => setWeather(opt.emoji)}
                  className={`px-3 py-2 rounded-xl border text-xs shrink-0 font-bold flex items-center gap-1.5 transition-all snap-center ${
                    isSelected
                      ? 'bg-[#5856D6]/15 border-transparent text-[#5856D6]'
                      : 'bg-slate-50 dark:bg-zinc-800 border-transparent text-slate-750 dark:text-zinc-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Privacy status selection toggler */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">私密可见度</span>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-100 dark:border-zinc-800/40 rounded-2xl">
            <div className="flex items-center gap-2.5">
              {privacyStatus === 'private' ? (
                <>
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-bold">仅自己可见 (Private)</div>
                    <p className="text-[9px] text-[#8E8E93]">默认安全保险箱隔离隔离</p>
                  </div>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-[#007AFF]" />
                  <div>
                    <div className="text-xs font-bold">公开可见 (Public)</div>
                    <p className="text-[9px] text-[#8E8E93]">展示在您的足影地图上</p>
                  </div>
                </>
              )}
            </div>

            {/* iOS Toggler Switch button */}
            <button
              type="button"
              onClick={() => setPrivacyStatus(p => p === 'private' ? 'public' : 'private')}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 outline-none border-none ${
                privacyStatus === 'private' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  privacyStatus === 'private' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 8. Expansive beautiful Dairy Journal Note block */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">岁月日记 · 随笔杂述</span>
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 bg-slate-50/50 dark:bg-[#1E1E1F] focus-within:ring-2 focus-within:ring-[#007AFF]/25 transition-all">
            <textarea
              placeholder="书写这一刻发生的人和故事、心情与收获吧。在这个属于你的数字足迹记忆本里，属于你的每一秒都有立足之地..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="w-full text-xs sm:text-sm leading-relaxed bg-transparent outline-none border-none text-slate-800 dark:text-zinc-200 resize-none placeholder:text-[#8E8E93]"
            />
          </div>
        </div>

        {/* 9. Tags entry */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5">书签标签 (按 Enter 添加)</span>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-[#2C2C2E] border border-transparent dark:border-zinc-800 rounded-2xl min-h-12 items-center">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#007AFF]/10 dark:bg-zinc-800 text-[#007AFF] px-2 py-0.5 rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="hover:scale-110 text-[#007AFF] rounded-full p-0.5 transition-transform"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <div className="flex-1 flex min-w-[80px] items-center">
              <span className="text-xs text-slate-400 pl-1">#</span>
              <input
                type="text"
                placeholder="添加标签"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full text-xs bg-transparent outline-none py-0.5 text-slate-800 dark:text-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* 10. Apple Photos insert uploader */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-[#8E8E93] tracking-wider pl-0.5 text-slate-400">影像备忘相册网格</span>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 bg-slate-150">
                <img
                  src={img}
                  alt={`mem-img-${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 duration-200 transition-all"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-650 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {images.length < 8 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-[#007AFF] flex flex-col items-center justify-center gap-1 bg-slate-50 dark:bg-[#1C1C1E] text-[#8E8E93] hover:text-[#007AFF] transition-all cursor-pointer disabled:opacity-50"
              >
                {isCompressing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 opacity-70" />
                    <span className="text-[8px] font-bold">选择图片 ({images.length}/8)</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Silent Lat LNG coords block */}
        <div className="flex justify-between items-center text-[10px] text-[#8E8E93] font-mono p-1">
          <span>{lat.toFixed(5)}°N</span>
          <span>{lng.toFixed(5)}°E</span>
        </div>

        {/* Save/delete controls bar */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800/40">
          {pointToEdit && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('您确定要彻底删除这段心爱的日记记忆吗？原路销毁，无处寻找。')) {
                  onDelete(pointToEdit.id);
                }
              }}
              className="flex items-center gap-1 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-650 rounded-2xl text-xs font-black transition-colors shrink-0 border-none"
            >
              <Trash2 className="w-4 h-4" />
              <span>整编销毁</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-white text-xs py-3 rounded-2xl font-bold transition-all border-none"
          >
            返回
          </button>

          <button
            type="submit"
            className="flex-1 bg-[#007AFF] text-white text-xs py-3 rounded-2xl font-black shadow-md hover:opacity-95 text-center cursor-pointer border-none"
          >
            封存日记
          </button>
        </div>

      </form>
    </div>
  );
}
