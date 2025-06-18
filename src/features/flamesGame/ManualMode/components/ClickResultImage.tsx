import { FlamesResult } from '../../flames.types';
import { getResultData } from '../../resultData';

interface ClickResultImageProps {
  name1: string;
  name2: string;
  result: FlamesResult | string; // Allow any string for "In Progress"
}

export default function ClickResultImage({ name1, name2, result }: ClickResultImageProps) {
  // Handle "In Progress" state
  const isInProgress = result === 'In Progress';
  const resultData = isInProgress ? null : getResultData(result as FlamesResult);
  const IconComponent = resultData?.icon;
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;

  const displayText = isInProgress ? 'Work in Progress' : resultData?.text || result;
  const displayIcon = isInProgress ? '⏳' : (IconComponent ? null : '❤️');

  // Define colors that html2canvas can parse
  const colors = {
    light: {
      bg: '#ffffff',
      text: '#1e293b',
      textSubtle: '#64748b',
      brand: '#f97316', // orange-500
      brandBg: 'rgba(251, 146, 60, 0.2)', // orange-400 with 20% alpha
      brandBorder: 'rgba(251, 146, 60, 0.4)', // orange-400 with 40% alpha
    },
    dark: {
      bg: '#1e293b',
      text: '#f8fafc',
      textSubtle: '#94a3b8',
      brand: '#fb923c', // orange-400
      brandBg: 'rgba(251, 146, 60, 0.2)',
      brandBorder: 'rgba(251, 146, 60, 0.4)',
    },
  };

  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <div
      style={{
        width: '600px',
        padding: '40px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: themeColors.bg,
        color: themeColors.text,
        // Ensure no CSS inheritance that could contain oklch
        margin: 0,
        border: 'none',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ 
        fontSize: '36px', 
        fontWeight: 'bold', 
        marginBottom: '10px', 
        color: themeColors.text,
        textAlign: 'center' as const,
      }}>
        {name1} ❤️ {name2}
      </div>
      <div style={{ 
        fontSize: '24px', 
        color: themeColors.textSubtle, 
        marginBottom: '40px',
        textAlign: 'center' as const,
      }}>
        Your FLAMES Result
      </div>

      <div
        style={{
          padding: '30px',
          borderRadius: '20px',
          textAlign: 'center' as const,
          minWidth: '200px',
          border: `2px solid ${themeColors.brandBorder}`,
          backgroundColor: themeColors.brandBg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ 
          fontSize: '48px', 
          lineHeight: 1,
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {isInProgress ? displayIcon : (IconComponent && <IconComponent color={themeColors.brand} />)}
        </div>
        <div style={{ 
          fontSize: '60px', 
          fontWeight: 'bold', 
          color: themeColors.brand,
          marginBottom: '10px',
          lineHeight: 1,
        }}>
          {isInProgress ? '?' : result}
        </div>
        <div style={{ 
          fontSize: '28px', 
          fontWeight: '500', 
          color: themeColors.text,
          lineHeight: 1.2,
        }}>
          {displayText}
        </div>
      </div>

      <div style={{ 
        marginTop: '40px', 
        fontSize: '16px', 
        color: themeColors.textSubtle,
        textAlign: 'center' as const,
      }}>
        the-flames.com
      </div>
    </div>
  );
}
