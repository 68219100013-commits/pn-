import React, { useState } from 'react';
import { InGameTime, WeatherState, WeatherType } from '../types';
import { WEATHER_CONFIGS, TIME_OF_DAY_LABELS, WEATHER_SCIENCE_FACTS } from '../data/weatherData';
import { sounds } from '../utils/audio';
import { CloudRain, Sun, CloudLightning, Wind, Moon, Clock, Sparkles, Droplets, Thermometer, Info, X } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherState;
  time: InGameTime;
  onSetWeather?: (type: WeatherType) => void;
  compact?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  time,
  onSetWeather,
  compact = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const formatTime = (h: number, m: number) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm} น.`;
  };

  const scienceFact =
    WEATHER_SCIENCE_FACTS.find((f) => f.weather === weather.type)?.fact ||
    'สภาพแวดล้อมทั้งแสงแดด ความชื้น และอุณหภูมิ มีผลโดยตรงต่ออัตราการคายน้ำและการสังเคราะห์ด้วยแสงของพืช';

  // Compact Pill for Top Navigation Header
  if (compact) {
    return (
      <>
        <button
          onClick={() => {
            sounds.playPop();
            setShowModal(true);
          }}
          className="cursor-pointer flex items-center gap-1.5 bg-stone-900/5 hover:bg-stone-900/10 border border-stone-300/80 px-2.5 py-1 rounded-xl transition-all shadow-2xs group"
          title="คลิกเพื่อดูพยากรณ์อากาศและผลกระทบต่อพืช"
        >
          <span className="text-sm">{weather.icon}</span>
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-stone-500 font-bold leading-none">
              {formatTime(time.hours, time.minutes)}
            </span>
            <span className="text-[10px] text-stone-800 font-black leading-tight group-hover:text-amber-700">
              {weather.thaiName}
            </span>
          </div>
        </button>

        {showModal && (
          <WeatherDetailsModal
            weather={weather}
            time={time}
            scienceFact={scienceFact}
            onSetWeather={onSetWeather}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // Full In-Camp Weather Banner Card
  return (
    <>
      <div className="bg-white border-2 border-stone-900 rounded-3xl p-4 sm:p-5 shadow-[0_4px_0_0_rgba(28,25,23,1)] relative overflow-hidden">
        {/* Background Weather Tint */}
        <div
          className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none ${
            weather.type === 'sunny'
              ? 'bg-amber-400'
              : weather.type === 'rainy' || weather.type === 'thunderstorm'
              ? 'bg-sky-400'
              : weather.type === 'breeze'
              ? 'bg-emerald-400'
              : 'bg-indigo-500'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Weather and Time Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 border-2 border-stone-900 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {weather.icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-stone-900 text-white font-mono text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  วันที่ {time.day} • {formatTime(time.hours, time.minutes)}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  {TIME_OF_DAY_LABELS[time.timeOfDay]?.label}
                </span>
              </div>

              <h3 className="text-lg font-black text-stone-900 mt-0.5 flex items-center gap-2">
                {weather.thaiName}
                <span className="text-xs font-normal text-stone-500 font-mono">
                  ({weather.temperature}°C • ความชื้น {weather.humidity}%)
                </span>
              </h3>

              <p className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                {weather.cropBuffDescription}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => {
                sounds.playPop();
                setShowModal(true);
              }}
              className="cursor-pointer flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-black text-xs px-3.5 py-2 rounded-xl border-2 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>พยากรณ์ & เรียกฝน</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <WeatherDetailsModal
          weather={weather}
          time={time}
          scienceFact={scienceFact}
          onSetWeather={onSetWeather}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

interface WeatherDetailsModalProps {
  weather: WeatherState;
  time: InGameTime;
  scienceFact: string;
  onSetWeather?: (type: WeatherType) => void;
  onClose: () => void;
}

const WeatherDetailsModal: React.FC<WeatherDetailsModalProps> = ({
  weather,
  time,
  scienceFact,
  onSetWeather,
  onClose,
}) => {
  const weatherOptions: { type: WeatherType; label: string; icon: string; perk: string }[] = [
    { type: 'sunny', label: 'แดดจัด', icon: '☀️', perk: 'โตไว +35%' },
    { type: 'rainy', label: 'ฝนตก', icon: '🌧️', perk: 'รดน้ำอัตโนมัติ' },
    { type: 'thunderstorm', label: 'พายุฟ้าคะนอง', icon: '⛈️', perk: 'รดน้ำไว 2x + ปุ๋ย N' },
    { type: 'breeze', label: 'ลมพัดพริ้ว', icon: '🍃', perk: 'แมลงศัตรูพืช 0%' },
    { type: 'moonlit', label: 'แสงจันทร์', icon: '🌙', perk: 'พืชเวทมนตร์โตไว +60%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-3 border-stone-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-[0_8px_0_0_rgba(28,25,23,1)] relative animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weather.icon}</span>
            <div>
              <h3 className="text-lg font-black text-stone-900">
                ระบบสภาพอากาศ & วิทยาศาสตร์สิ่งแวดล้อม
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                วันที่ {time.day} • เวลา {time.hours.toString().padStart(2, '0')}:
                {time.minutes.toString().padStart(2, '0')} น. ({TIME_OF_DAY_LABELS[time.timeOfDay]?.label})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-xl hover:bg-stone-100 border border-stone-300 text-stone-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Weather Card */}
        <div className="bg-stone-50 border-2 border-stone-900 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{weather.icon}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  สภาพอากาศปัจจุบัน
                </span>
                <h4 className="text-xl font-black text-stone-900">{weather.thaiName}</h4>
                <p className="text-xs text-stone-600 font-medium">{weather.description}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1 text-stone-800 font-mono font-bold text-sm">
                <Thermometer className="w-4 h-4 text-rose-500" />
                {weather.temperature}°C
              </div>
              <div className="flex items-center justify-end gap-1 text-stone-800 font-mono font-bold text-sm">
                <Droplets className="w-4 h-4 text-sky-500" />
                {weather.humidity}%
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-200/80 bg-emerald-50/70 -mx-4 -mb-4 p-3 rounded-b-2xl border-stone-900/10">
            <span className="text-xs font-bold text-emerald-900 block">
              🌾 ผลกระทบต่อแปลงพืช:
            </span>
            <p className="text-xs text-emerald-800 font-medium mt-0.5">
              {weather.cropBuffDescription}
            </p>
          </div>
        </div>

        {/* Agricultural Science Tip */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-black text-amber-900 block">
              💡 ความรู้ชีววิทยาและเกษตรศาสตร์:
            </span>
            <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
              {scienceFact}
            </p>
          </div>
        </div>

        {/* Change Weather / Ritual Switcher */}
        {onSetWeather && (
          <div>
            <span className="text-xs font-black text-stone-800 uppercase tracking-wide block mb-2">
              🔮 พิธีกรรมอธิษฐานเปลี่ยนสภาพอากาศ (ทดลองสภาพแวดล้อม):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {weatherOptions.map((opt) => {
                const isActive = weather.type === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      sounds.playPotionBrew();
                      onSetWeather(opt.type);
                    }}
                    className={`cursor-pointer p-2.5 rounded-xl border-2 transition-all text-left flex flex-col ${
                      isActive
                        ? 'bg-amber-400 border-stone-900 shadow-[0_2px_0_0_rgba(28,25,23,1)] font-black text-stone-950 scale-102'
                        : 'bg-white border-stone-200 hover:border-stone-400 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </div>
                    <span className="text-[10px] text-stone-600 mt-1">{opt.perk}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer bg-stone-900 text-white hover:bg-stone-800 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
