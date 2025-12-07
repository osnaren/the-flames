import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FLAMES Game - Free Online Relationship Compatibility Calculator';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {/* FLAMES letters */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {['F', 'L', 'A', 'M', 'E', 'S'].map((letter, i) => (
            <div
              key={letter}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: [
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                ][i],
                color: '#fff',
                fontSize: '48px',
                fontWeight: 'bold',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '16px',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          FLAMES Game
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#a0aec0',
            marginBottom: '32px',
          }}
        >
          Discover Your Relationship Compatibility
        </div>

        {/* Description badges */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
          }}
        >
          {['Free to Play', 'Instant Results', 'Share with Friends'].map((text) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                fontSize: '18px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#718096',
          fontSize: '18px',
        }}
      >
        <span>theflames.app</span>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
