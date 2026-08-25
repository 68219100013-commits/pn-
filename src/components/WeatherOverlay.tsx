import React, { useMemo } from 'react';
import { InGameTime, WeatherState } from '../types';
import { TIME_OF_DAY_LABELS } from '../data/weatherData';

interface WeatherOverlayProps {
  weather: WeatherState;
  time: InGameTime;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ weather, time }) => {
  // Generate random rain streaks with stable memoization
  const rainDrops = useMemo(() => {
    const drops = [];
    const count = weather.type === 'thunderstorm' ? 55 : 32;
    for (let i = 0; i < count; i++) {
      drops.push({
        id: i,
        left: `${(i * 1.8 + Math.sin(i * 99) * 20 + 100) % 100}%`,
        delay: `${(i * 0.05) % 0.8}s`,
        duration: weather.type === 'thunderstorm' ? `${0.45 + (i % 5) * 0.04}s` : `${0.75 + (i % 6) * 0.06}s`,
        opacity: 0.35 + (i % 4) * 0.15,
        length: 24 + (i % 5) * 12,
      });
    }
    return drops;
  }, [weather.type]);

  // Generate pollen/petals for breeze
  const petals = useMemo(() => {
    const list = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        id: i,
        left: `${(i * 5.5 + 2) % 96}%`,
        delay: `${(i * 0.6) % 6}s`,
        duration: `${5 + (i % 4) * 1.5}s`,
        size: 10 + (i % 4) * 4,
        isLeaf: i % 2 === 0,
      });
    }
    return list;
  }, []);

  // Generate stars for night
  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 36; i++) {
      list.push({
        id: i,
        left: `${(i * 2.7 + 5) % 95}%`,
        top: `${(i * 2.1 + 3) % 40}%`,
        delay: `${(i * 0.25) % 3}s`,
        size: 2 + (i % 3),
        opacity: 0.4 + (i % 3) * 0.3,
      });
    }
    return list;
  }, []);

  // Time of Day Base Ambient Tint
  const timeTone = TIME_OF_DAY_LABELS[time.timeOfDay]?.bgTone || 'from-transparent to-transparent';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none transition-colors duration-1000"
    >
      {/* 1. Ambient Time-of-day Color Filter */}
      <div className={`absolute inset-0 bg-gradient-to-b ${timeTone} transition-all duration-1000`} />

      {/* 2. Night Sky & Starfield */}
      {time.timeOfDay === 'night' && (
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply">
          {stars.map((star) => (
            <div
              key={`star-${star.id}`}
              className="absolute rounded-full bg-white animate-star-twinkle"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
                boxShadow: '0 0 6px 1px rgba(255,255,255,0.8)',
              }}
            />
          ))}
          {/* Subtle Moon in the night corner */}
          <div className="absolute top-14 right-10 w-16 h-16 rounded-full bg-amber-100/20 blur-md pointer-events-none" />
          <div className="absolute top-16 right-12 text-3xl select-none opacity-70 filter drop-shadow-[0_0_12px_rgba(254,240,138,0.8)]">
            🌙
          </div>
        </div>
      )}

      {/* 3. Sunny Shimmer & Golden Sun Rays */}
      {weather.type === 'sunny' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Radial Warm Glow from Top Right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-300/30 via-orange-300/15 to-transparent blur-3xl animate-sun-glow" />

          {/* Shimmering Sun Ray streaks */}
          <div
            className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-25"
            style={{
              background:
                'conic-gradient(from 180deg at 50% 50%, rgba(251,191,36,0.2) 0deg, transparent 25deg, rgba(251,191,36,0.3) 50deg, transparent 75deg, rgba(251,191,36,0.25) 120deg, transparent 180deg, rgba(251,191,36,0.35) 240deg, transparent 360deg)',
              animation: 'sunGlow 30s linear infinite',
            }}
          />

          {/* Floating warm dust motes */}
          <div className="absolute top-20 right-28 text-amber-500/40 text-xl animate-pulse">✨</div>
          <div className="absolute top-44 right-60 text-amber-400/30 text-sm animate-pulse" style={{ animationDelay: '1s' }}>
            ☀️
          </div>
          <div className="absolute top-32 left-1/3 text-amber-300/30 text-xs animate-pulse" style={{ animationDelay: '2s' }}>
            ✨
          </div>
        </div>
      )}

      {/* 4. Rainy Streaks & Water Atmosphere */}
      {(weather.type === 'rainy' || weather.type === 'thunderstorm') && (
        <div className="absolute inset-0">
          {/* Rain Tint */}
          <div className="absolute inset-0 bg-slate-900/10 backdrop-contrast-95" />

          {/* Rain Streaks */}
          {rainDrops.map((drop) => (
            <div
              key={`rain-${drop.id}`}
              className={weather.type === 'thunderstorm' ? 'animate-rain-fast' : 'animate-rain'}
              style={{
                position: 'absolute',
                left: drop.left,
                top: '-30px',
                width: weather.type === 'thunderstorm' ? '2px' : '1.5px',
                height: `${drop.length}px`,
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0), rgba(186,230,253,0.7) 70%, rgba(224,242,254,0.95))',
                opacity: drop.opacity,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                borderRadius: '999px',
              }}
            />
          ))}

          {/* Soft Ground Mist */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sky-200/15 to-transparent animate-mist" />
        </div>
      )}

      {/* 5. Thunderstorm Lightning & Flash */}
      {weather.type === 'thunderstorm' && (
        <div className="absolute inset-0 bg-white animate-lightning pointer-events-none" />
      )}

      {/* 6. Breeze / Pollen Drift */}
      {weather.type === 'breeze' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-emerald-500/[0.03]" />
          {petals.map((item) => (
            <div
              key={`petal-${item.id}`}
              className="absolute select-none pointer-events-none"
              style={{
                left: item.left,
                top: '-20px',
                fontSize: `${item.size}px`,
                animation: `floatPollen ${item.duration} ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              {item.isLeaf ? '🍃' : '🌸'}
            </div>
          ))}
        </div>
      )}

      {/* 7. Moonlit Magic Glow */}
      {weather.type === 'moonlit' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-indigo-950/15" />
          {/* Floating magic particles */}
          <div className="absolute top-1/4 left-1/4 text-indigo-300/40 text-lg animate-pulse">✨</div>
          <div className="absolute top-1/3 right-1/4 text-purple-300/40 text-sm animate-pulse" style={{ animationDelay: '1.5s' }}>
            🔮
          </div>
          <div className="absolute top-2/3 left-1/2 text-cyan-200/30 text-xs animate-pulse" style={{ animationDelay: '0.8s' }}>
            ✦
          </div>
        </div>
      )}
    </div>
  );
};
