import { WeatherState, WeatherType, TimeOfDay } from '../types';

export const WEATHER_CONFIGS: Record<WeatherType, WeatherState> = {
  sunny: {
    type: 'sunny',
    name: 'Clear Sunny',
    thaiName: 'แดดจัดเจิดจ้า',
    icon: '☀️',
    description: 'ท้องฟ้าแจ่มใส แสงแดดส่องกระทบใบพืชอย่างเต็มที่',
    cropBuffDescription: '🌿 สังเคราะห์แสงเต็มกำลัง: อัตราการเจริญเติบโต +35% (ใช้น้ำเร็วขึ้น 1.25x)',
    temperature: 32,
    humidity: 50,
    growthMultiplier: 1.35,
    autoWaterRate: 0,
    waterEvaporationMultiplier: 1.25,
    pestRisk: 1.0,
    magicCropBonus: 1.0,
  },
  rainy: {
    type: 'rainy',
    name: 'Gentle Rain',
    thaiName: 'ฝนตกชุ่มฉ่ำ',
    icon: '🌧️',
    description: 'สายฝนโปรยปรายเพิ่มความชุ่มชื้นแก่ผืนดินและรากพืช',
    cropBuffDescription: '💧 รดน้ำอัตโนมัติ: ดินได้รับน้ำ +1.2%/วินาที ไม่ต้องตักน้ำรดเอง',
    temperature: 24,
    humidity: 90,
    growthMultiplier: 1.15,
    autoWaterRate: 1.2,
    waterEvaporationMultiplier: 0.2,
    pestRisk: 0.5,
    magicCropBonus: 1.1,
  },
  thunderstorm: {
    type: 'thunderstorm',
    name: 'Thunderstorm',
    thaiName: 'พายุฝนฟ้าคะนอง',
    icon: '⛈️',
    description: 'ฟ้าร้องและสายฟ้าฟาด พร้อมฝนตกหนัก มีประจุไนโตรเจนธรรมชาติในสายฝน',
    cropBuffDescription: '⚡ ไนโตรเจนธรรมชาติจากสายฟ้า: รดน้ำอัตโนมัติ +2.5%/วินาที และโตไวขึ้น +20%',
    temperature: 22,
    humidity: 95,
    growthMultiplier: 1.2,
    autoWaterRate: 2.5,
    waterEvaporationMultiplier: 0.1,
    pestRisk: 0.3,
    magicCropBonus: 1.25,
  },
  breeze: {
    type: 'breeze',
    name: 'Pollen Breeze',
    thaiName: 'ลมพัดพริ้ว & เกสรดอกไม้',
    icon: '🍃',
    description: 'สายลมอ่อนพัดพาละอองเกสร ช่วยผสมเกสรและไล่แมลงศัตรูพืช',
    cropBuffDescription: '🛡️ สายลมคุ้มกัน: โอกาสเกิดแมลงศัตรูพืชลดลงเหลือ 0% และประหยัดน้ำ',
    temperature: 26,
    humidity: 60,
    growthMultiplier: 1.1,
    autoWaterRate: 0,
    waterEvaporationMultiplier: 0.9,
    pestRisk: 0,
    magicCropBonus: 1.15,
  },
  moonlit: {
    type: 'moonlit',
    name: 'Moonlit Mist',
    thaiName: 'แสงจันทร์ละมุน & หมอกราตรี',
    icon: '🌙',
    description: 'ค่ำคืนอันเงียบสงบละอองหมอกเคลือบใบ ละอองเวทมนตร์เปล่งประกาย',
    cropBuffDescription: '✨ พลังเวทมนตร์แห่งดวงดาว: พืชตระกูลเวทมนตร์โตไวขึ้น +60% และฟื้นฟูมานา',
    temperature: 20,
    humidity: 80,
    growthMultiplier: 1.0,
    autoWaterRate: 0.3, // dew moisture
    waterEvaporationMultiplier: 0.3,
    pestRisk: 0.4,
    magicCropBonus: 1.6,
  },
};

export const getTimeOfDay = (hours: number): TimeOfDay => {
  if (hours >= 5 && hours < 11) return 'morning';
  if (hours >= 11 && hours < 17) return 'day';
  if (hours >= 17 && hours < 20) return 'sunset';
  return 'night';
};

export const TIME_OF_DAY_LABELS: Record<TimeOfDay, { label: string; icon: string; bgTone: string }> = {
  morning: {
    label: 'รุ่งอรุณ (Morning)',
    icon: '🌅',
    bgTone: 'from-amber-100/30 via-orange-100/10 to-transparent',
  },
  day: {
    label: 'กลางวัน (Daytime)',
    icon: '☀️',
    bgTone: 'from-sky-100/30 via-transparent to-transparent',
  },
  sunset: {
    label: 'พลบค่ำ (Sunset)',
    icon: '🌇',
    bgTone: 'from-orange-400/20 via-pink-400/10 to-transparent',
  },
  night: {
    label: 'ราตรี (Night)',
    icon: '🌌',
    bgTone: 'from-indigo-950/40 via-purple-950/20 to-transparent',
  },
};

export const WEATHER_SCIENCE_FACTS = [
  {
    weather: 'sunny',
    fact: 'แสงแดดให้โฟตอนพลังงานแก่ คลอโรฟิลล์ (Chlorophyll) ในคลอโรพลาสต์ เพื่อเปลี่ยนน้ำและก๊าซ CO₂ ให้กลายเป็นน้ำตาลกลูโคสและออกซิเจน',
  },
  {
    weather: 'rainy',
    fact: 'น้ำฝนตามธรรมชาติมีค่า pH ประมาณ 5.6 ซึ่งมีความเป็นกรดอ่อนๆ เล็กน้อย ช่วยละลายแร่ธาตุในดินให้รากพืชดูดซึมได้ง่ายขึ้น',
  },
  {
    weather: 'thunderstorm',
    fact: 'พลังงานมหาศาลจากฟ้าผ่าสามารถแยกพันธะก๊าซไนโตรเจนในบรรยากาศ (N₂) รวมกับออกซิเจน กลายเป็นไนเตรต (Nitrate) ตกลงมากับน้ำฝน เป็นปุ๋ยไนโตรเจนธรรมชาติชั้นยอด',
  },
  {
    weather: 'breeze',
    fact: 'การไหลเวียนของอากาศช่วยป้องกันความชื้นสะสมที่ผิวดินเกินไป ลดการเจริญเติบโตของเชื้อรา และช่วยพัดพาละอองเกสรตัวผู้ไปสู่เกสรตัวเมีย',
  },
  {
    weather: 'moonlit',
    fact: 'ในเวลากลางคืน ปากใบพืชส่วนใหญ่จะปิดเพื่อลดการคายน้ำ และพืชจะดำเนินกระบวนการหายใจระดับเซลล์ (Cellular Respiration) เพื่อนำน้ำตาลไปซ่อมแซมและเติบโต',
  },
];
