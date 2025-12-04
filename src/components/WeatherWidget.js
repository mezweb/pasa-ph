'use client';

import { useState, useEffect } from 'react';

export default function WeatherWidget({ destination = 'Tokyo' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock weather data (in production, use real weather API)
    const mockWeatherData = {
      'Tokyo': { temp: 18, condition: 'Cloudy', icon: '☁️', high: 22, low: 14 },
      'New York': { temp: 12, condition: 'Rainy', icon: '🌧️', high: 15, low: 8 },
      'Los Angeles': { temp: 24, condition: 'Sunny', icon: '☀️', high: 28, low: 18 },
      'London': { temp: 10, condition: 'Foggy', icon: '🌫️', high: 13, low: 7 },
      'Singapore': { temp: 30, condition: 'Humid', icon: '🌤️', high: 32, low: 26 },
      'Seoul': { temp: 8, condition: 'Cold', icon: '❄️', high: 11, low: 3 },
      'Dubai': { temp: 28, condition: 'Hot', icon: '🔥', high: 35, low: 22 },
      'Sydney': { temp: 22, condition: 'Clear', icon: '🌞', high: 26, low: 18 }
    };

    // Simulate API delay
    setTimeout(() => {
      setWeather(mockWeatherData[destination] || mockWeatherData['Tokyo']);
      setLoading(false);
    }, 500);
  }, [destination]);

  if (loading) {
    return (
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #eaeaea',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#999' }}>Loading weather...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '8rem',
        opacity: 0.2
      }}>
        {weather.icon}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '0.85rem',
          opacity: 0.9,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>🌍</span>
          <span>Weather in {destination}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '12px'
        }}>
          <div style={{ fontSize: '4rem' }}>
            {weather.icon}
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>
              {weather.temp}°C
            </div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
              {weather.condition}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.3)',
          fontSize: '0.85rem'
        }}>
          <div>
            <div style={{ opacity: 0.8 }}>High</div>
            <div style={{ fontWeight: 'bold' }}>{weather.high}°C</div>
          </div>
          <div>
            <div style={{ opacity: 0.8 }}>Low</div>
            <div style={{ fontWeight: 'bold' }}>{weather.low}°C</div>
          </div>
        </div>

        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '6px',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          💡 Pack accordingly for your trip!
        </div>
      </div>
    </div>
  );
}
