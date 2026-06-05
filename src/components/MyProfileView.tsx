/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { MemoryPoint, TravelBackup } from '../types';
import { 
  ShieldCheck, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Key, 
  Eye, 
  ChevronRight, 
  Sliders, 
  Grid, 
  Info,
  Database,
  CloudLightning,
  Sun,
  Moon,
  Github,
  Globe,
  Camera,
  Map,
  User,
  Check
} from 'lucide-react';

interface MyProfileViewProps {
  points: MemoryPoint[];
  onImportBackup: (points: any[]) => void;
  onRestoreSeeds: () => void;
  onClearAll: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function MyProfileView({
  points,
  onImportBackup,
  onRestoreSeeds,
  onClearAll,
  darkMode,
  setDarkMode,
}: MyProfileViewProps) {
  // Nickname State
  const [nickname, setNickname] = useState(() => localStorage.getItem('SETTING_NICKNAME') || '私密足印旅人');
  const [isEditingName, setIsEditingName] = useState(false);

  // iOS Toggles backing states
  const [defaultVisibility, setDefaultVisibility] = useState(() => localStorage.getItem('SETTING_DEFAULT_VISIBILITY') || 'private');
  const [locationFuzzing, setLocationFuzzing] = useState(() => localStorage.getItem('SETTING_LOCATION_FUZZING') === 'true');
  const [hideShareCoords, setHideShareCoords] = useState(() => localStorage.getItem('SETTING_HIDE_SHARE_COORDS') === 'true');
  const [localEncryption, setLocalEncryption] = useState(() => localStorage.getItem('SETTING_LOCAL_ENCRYPTION') !== 'false');
  const [cloudSync, setCloudSync] = useState(() => localStorage.getItem('SETTING_CLOUD_SYNC') === 'true');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'err'>('idle');

  // Trigger localStorage syncs
  useEffect(() => {
    localStorage.setItem('SETTING_NICKNAME', nickname);
  }, [nickname]);

  useEffect(() => {
    localStorage.setItem('SETTING_DEFAULT_VISIBILITY', defaultVisibility);
  }, [defaultVisibility]);

  useEffect(() => {
    localStorage.setItem('SETTING_LOCATION_FUZZING', String(locationFuzzing));
  }, [locationFuzzing]);

  useEffect(() => {
    localStorage.setItem('SETTING_HIDE_SHARE_COORDS', String(hideShareCoords));
  }, [hideShareCoords]);

  useEffect(() => {
    localStorage.setItem('SETTING_LOCAL_ENCRYPTION', String(localEncryption));
  }, [localEncryption]);

  useEffect(() => {
    localStorage.setItem('SETTING_CLOUD_SYNC', String(cloudSync));
  }, [cloudSync]);

  // JSON Export Handler
  const handleExportJSON = () => {
    const backup: TravelBackup = {
      points,
      routes: [],
      version: '1.2.0',
      exportedAt: Date.now(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${nickname}-私密数字足记备份.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Import Handler
  const handleImportJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json || !Array.isArray(json.points)) {
          throw new Error('格式校验失败');
        }

        onImportBackup(json.points);
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 2500);
      } catch (err) {
        console.error('Import failed:', err);
        setImportStatus('err');
        alert('导入失败，请上传正确的足迹日记备份文件！');
        setTimeout(() => setImportStatus('idle'), 2500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F2F2F7] dark:bg-black overflow-hidden font-sans text-black dark:text-white select-none">
      
      {/* iOS Header Title Bar */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/85 backdrop-blur-2xl px-5 py-4 border-b border-slate-200/40 dark:border-zinc-800/60 shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">设置</h1>
        <span className="text-[10px] font-bold text-[#8E8E93]">iOS Settings style</span>
      </div>

      {/* Settings Scroll content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-hide pb-12">
        
        {/* 1. Cupertino iCloud profile summary card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 flex items-center gap-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md">
            旅
          </div>
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={12}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  className="bg-slate-100 dark:bg-zinc-850 px-2 py-0.5 rounded-md text-sm font-bold text-slate-900 dark:text-white outline-none"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="text-xs text-[#007AFF] font-bold"
                >
                  确定
                </button>
              </div>
            ) : (
              <h2 
                onClick={() => setIsEditingName(true)}
                className="text-base font-black text-slate-950 dark:text-white leading-tight flex items-center gap-1.5 cursor-pointer hover:opacity-85"
                title="点击修改昵称"
              >
                <span>{nickname}</span>
                <span className="text-[10px] text-[#007AFF] bg-[#007AFF]/5 px-1.5 py-0.5 rounded-md font-bold">编辑</span>
              </h2>
            )}
            <p className="text-[11px] text-[#8E8E93] truncate mt-1">Apple ID、iCloud、媒体与私人足印日记</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
        </div>

        {/* 2. Group 1: Privacy Settings */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-wider pl-4">隐私与安全 (Privacy & Security)</span>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl divide-y divide-slate-100/60 dark:divide-zinc-800 p-0 shadow-xs">
            
            {/* Row 1: Default privacy */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-[#007AFF] text-white flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold leading-tight block">默认可见度</span>
                  <span className="text-[9px] text-[#8E8E93] mt-0.5">封存新写照时默认的最初私密可见等级</span>
                </div>
              </div>
              
              <select
                value={defaultVisibility}
                onChange={(e) => setDefaultVisibility(e.target.value)}
                className="text-xs font-bold text-[#007AFF] bg-transparent outline-none border-none cursor-pointer"
              >
                <option value="private">仅自己可见</option>
                <option value="public">公开可见</option>
              </select>
            </div>

            {/* Row 2: Location fuzzing */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-purple-500 text-white flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold leading-tight block">地理位置模糊化</span>
                  <span className="text-[9px] text-[#8E8E93] mt-0.5">自动针对周边物理坐标添加 200m 轻微随机噪点干扰</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setLocationFuzzing(!locationFuzzing)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none border-none ${
                  locationFuzzing ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  locationFuzzing ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Row 3: Hide Coords */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold leading-tight block">分享时隐藏高精经纬度</span>
                  <span className="text-[9px] text-[#8E8E93] mt-0.5">将日记公开分享时裁剪掉精确 GPS 精细数字</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setHideShareCoords(!hideShareCoords)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none border-none ${
                  hideShareCoords ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  hideShareCoords ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* 3. Group 2: Data Encryption & storage */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-wider pl-4">数据与存储 (Data & Sync)</span>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl divide-y divide-slate-100/60 dark:divide-zinc-800 p-0 shadow-xs">
            
            {/* Local Encryption */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold leading-tight block">安全密匙本地隔空锁</span>
                  <span className="text-[9px] text-[#8E8E93] mt-0.5">使用底层 AES 核心针对本地 localStorage 保险库上锁</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setLocalEncryption(!localEncryption)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none border-none ${
                  localEncryption ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  localEncryption ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Cloud Sync */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-[#5856D6] text-white flex items-center justify-center shrink-0">
                  <CloudLightning className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold leading-tight block">分布式 WebDAV 云同步</span>
                  <span className="text-[9px] text-[#8E8E93] mt-0.5">支持自建 WebDAV 网盘、坚果云一键双向安全同步</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setCloudSync(!cloudSync)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none border-none ${
                  cloudSync ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  cloudSync ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* 4. Group 3: Display preference */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-wider pl-4">显示与地图 (Display Panel)</span>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl divide-y divide-slate-100/60 dark:divide-zinc-800 p-0 shadow-xs">
            
            {/* Theme switcher */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold leading-tight block">深色模式 (Night/Dark Theme)</span>
                  <span className="text-[9px] text-[#8E8E93] mt-0.5">自适应随系统转换深浅两色毛玻璃视觉风格</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none border-none ${
                  darkMode ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  darkMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* 5. Group 4: Backups importer controls */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-wider pl-4">足印象箱物理备份</span>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 space-y-4 shadow-xs">
            <span className="text-[10px] text-[#8E8E93] font-bold block">
              已存储 {points.length} 篇加密日记。备份不包含外部网络图床开销，导出为自解压 .json 规范格式。
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-center">
              {/* Backups trigger */}
              <button
                onClick={handleExportJSON}
                className="p-3 bg-[#007AFF] text-white rounded-xl shadow-xs flex flex-col items-center justify-center gap-1.5 shrink-0 border-none cursor-pointer"
              >
                <Download className="w-4.5 h-4.5" />
                <span>备份本地数据</span>
              </button>

              {/* Import Backups trigger */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-xl flex flex-col items-center justify-center gap-1.5 shrink-0 border-none cursor-pointer"
              >
                {importStatus === 'success' ? (
                  <>
                    <Check className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                    <span className="text-emerald-500">导入成功</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4.5 h-4.5" />
                    <span>恢复本地备份</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </div>

            {/* Seeds restoration & Clean all block */}
            <div className="flex items-center justify-between text-[11px] font-bold pt-2.5 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('重载演示包将向本地再增加 7 篇大理、丽江、昆明、故宫与长城的官方旅行回忆写画。是否继续导入？')) {
                    onRestoreSeeds();
                  }
                }}
                className="text-[#007AFF] flex items-center gap-1 border-none bg-transparent cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>重载演示记忆包</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('警告：一键清空将永久抹掉所有已上传的心爱图片、日记随写、心情天气打标等核心坐标，请您预先进行「备份本地数据」操作。确定继续一键销毁吗？')) {
                    onClearAll();
                  }
                }}
                className="text-red-540 hover:text-red-700 flex items-center gap-1 border-none bg-transparent cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>一键清空日记</span>
              </button>
            </div>

          </div>
        </div>

        {/* 6. Group 5: About and metadata */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-wider pl-4">关于本产品</span>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 space-y-3.5 text-xs text-slate-800 dark:text-zinc-300 shadow-xs">
            
            <div className="flex items-center gap-2">
              <span className="text-xl">📔</span>
              <div>
                <h4 className="font-extrabold text-[#007AFF]">数字足印地图日记</h4>
                <p className="text-[10px] text-[#8E8E93] font-medium leading-tight">私密 • 轻量 • 情感化个人回忆本</p>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-[#8E8E93] font-light">
              本网络日记应用完全运行于您的本地，旨在让你的回忆有一个温暖的立足点。所有的故事、看过的风景、拥抱过的晚风与照片，皆妥帖在专属沙盘数据库中生生不息。
            </p>

            <div className="flex items-center justify-between text-[10px] text-[#8E8E93] pt-1.5 border-t border-slate-100 dark:border-zinc-800">
              <span className="flex items-center gap-0.5 font-bold">
                🔒 本地加密保险盒 v1.2.0
              </span>
              <span>2026 版权所有</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
