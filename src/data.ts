/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoryPoint, JourneyRoute, TravelCategory } from './types';

export interface CategoryOption {
  value: TravelCategory;
  label: string;
  icon: string;
  color: string; // Tailwind class
  markerColor: string; // Hex code for Map marker
}

export const TRAVEL_CATEGORIES: CategoryOption[] = [
  {
    value: 'sightseeing',
    label: '人文景点',
    icon: '🏛️',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    markerColor: '#6366f1',
  },
  {
    value: 'food',
    label: '地方美食',
    icon: '🍜',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    markerColor: '#f43f5e',
  },
  {
    value: 'nature',
    label: '自然风光',
    icon: '🏔️',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    markerColor: '#10b981',
  },
  {
    value: 'hotel',
    label: '酒店住宿',
    icon: '🏠',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    markerColor: '#f59e0b',
  },
  {
    value: 'culture',
    label: '民俗体验',
    icon: '🎭',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    markerColor: '#a855f7',
  },
  {
    value: 'transit',
    label: '交通路途',
    icon: '🚗',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    markerColor: '#3b82f6',
  },
  {
    value: 'other',
    label: '随笔杂记',
    icon: '📝',
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    markerColor: '#64748b',
  },
];

export const INITIAL_POINTS: MemoryPoint[] = [
  {
    id: 'yn-1',
    title: '昆明官渡古镇：第一缕滇味',
    date: '2025-05-10',
    lat: 25.0112,
    lng: 102.7538,
    locationName: '昆明官渡古镇',
    notes: '刚下飞机便奔赴此地，尝了一碗热腾腾的古镇小锅米线。金刚塔在斜阳下闪烁着岁月的微光，周遭的老人们低声打着纸牌，满是恬静的生活气息。',
    category: 'food',
    tags: ['米线', '古镇', '昆明'],
    images: [
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400',
    ],
    rating: 5,
    createdAt: 1715313600000,
  },
  {
    id: 'yn-2',
    title: '大理苍山洱海：骑行放空',
    date: '2025-05-12',
    lat: 25.6885,
    lng: 100.2235,
    locationName: '大理洱海生态廊道',
    notes: '租了一辆复古电单车，沿洱海廊道骑行。左手是云雾缠绕的苍山，右手是波光粼粼的无垠碧蓝。微风拂面、心野沉静，在海舌公园的枯木林下坐看斜阳渐渐落山。',
    category: 'nature',
    tags: ['洱海', '苍山', '骑行'],
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400',
    ],
    rating: 5,
    createdAt: 1715486400000,
  },
  {
    id: 'yn-3',
    title: '丽江古城：静听民谣与石板路',
    date: '2025-05-14',
    lat: 26.8722,
    lng: 100.2335,
    locationName: '丽江大研古镇',
    notes: '清晨的古城最是迷人，喧嚣未起，只有洒扫街道的石板声。夜晚去了一家隐秘在巷子深处的民谣小酒馆，点了一杯烈酒，听歌者沙哑地唱着关于远方的民谣。',
    category: 'sightseeing',
    tags: ['丽江', '民谣', '夜生活'],
    images: [
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=400',
    ],
    rating: 4,
    createdAt: 1715659200000,
  },
  {
    id: 'yn-4',
    title: '玉龙雪山：冲刺海拔4680',
    date: '2025-05-15',
    lat: 27.1321,
    lng: 100.1743,
    locationName: '玉龙雪山冰川公园',
    notes: '吸着高纯度氧气踏上了栈道，周围尽是万年不化的冰山。寒风凛冽，阳光却极其暴烈，折射出璀璨的金芒。当终于踏足4680界碑那一刻，仿佛天地都在脚下。',
    category: 'nature',
    tags: ['冰川', '高海拔', '雪山徒步'],
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
    ],
    rating: 5,
    createdAt: 1715745600000,
  },
  {
    id: 'bj-1',
    title: '故宫落雪：重回紫禁城',
    date: '2025-10-01',
    lat: 39.9163,
    lng: 116.3972,
    locationName: '故宫博物院',
    notes: '国庆节当天起个大清早游故宫。朱红的宫墙，金色的琉璃瓦，与远处蔚蓝的晴空呼应。一步一步踏在汉白玉台阶上，感受着沉甸甸的历史回赠。',
    category: 'culture',
    tags: ['故宫', '红墙', '历史'],
    images: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=400',
    ],
    rating: 5,
    createdAt: 1727740800000,
  },
  {
    id: 'bj-2',
    title: '红叶烂漫：十七孔桥长桥落日',
    date: '2025-10-02',
    lat: 39.9984,
    lng: 116.2731,
    locationName: '北京颐和园',
    notes: '这个季节的颐和园层林尽染。余晖透过十七孔桥的洞孔，投洒在平静的昆明湖面上。微冷秋风拂面而来，皇家园林的幽静与阔气在夕晖中显露无遗。',
    category: 'sightseeing',
    tags: ['皇家园林', '十七孔桥', '秋叶'],
    images: [
      'https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&q=80&w=400',
    ],
    rating: 4,
    createdAt: 1727827200000,
  },
  {
    id: 'bj-3',
    title: '八达岭：金秋万里长城',
    date: '2025-10-03',
    lat: 40.3601,
    lng: 116.0245,
    locationName: '八达岭长城',
    notes: '极其震撼的长城体验！站在敌楼上眺望群山，巍峨长城顺着漫山遍野的金色红叶绵延向远方，宛若一条巨龙横亘山岭。感受当年的塞外雄关雄姿！',
    category: 'nature',
    tags: ['长城', '硬汉之旅', '金秋景观'],
    images: [
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=400',
    ],
    rating: 5,
    createdAt: 1727913600000,
  },
];

export const INITIAL_ROUTES: JourneyRoute[] = [
  {
    id: 'route-yn',
    title: '彩云之南·经典山水交响曲',
    description: '涵盖昆明、大理与丽江的黄金路线。高山、碧湖、古道、雪峰一次体验，民谣与雪国相拥。',
    color: '#f43f5e', // rose color
    pointIds: ['yn-1', 'yn-2', 'yn-3', 'yn-4'],
    createdAt: 1715745600000,
  },
  {
    id: 'route-bj',
    title: '帝都秋韵·皇家风华人文行',
    description: '秋高气爽时的北京，故宫博物院的红墙、皇家园林颐和园夕阳配合万里长城奇观，重温华夏历史魅力。',
    color: '#a855f7', // purple color
    pointIds: ['bj-1', 'bj-2', 'bj-3'],
    createdAt: 1727913600000,
  },
];
