import React from 'react';

interface DownloadOptionsProps {
  movieTitle: string;
  onSelectDownload: (quality: string) => void;
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  movieTitle,
  onSelectDownload
}) => {
  const downloadTiers = [
    {
      quality: '1080p Full HD',
      resolution: '1920x1080',
      size: '2.14 GB',
      format: 'MKV • x264',
      audio: '6-CH Dolby 5.1',
      badge: 'Popular'
    },
    {
      quality: '4K Ultra HD',
      resolution: '3840x2160',
      size: '6.42 GB',
      format: 'MKV • HEVC x265',
      audio: 'Dolby Atmos 7.1',
      badge: 'Best Quality'
    },
    {
      quality: '720p Mobile HD',
      resolution: '1280x720',
      size: '950 MB',
      format: 'MP4 • Fast Load',
      audio: 'Stereo 2.0',
      badge: 'Fast'
    }
  ];

  return (
    <div
      style={{
        backgroundColor: 'rgba(18, 20, 26, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px',
        marginTop: '20px',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 3px 0' }}>
            Direct High-Speed Mirrors
        </h3>
           <p
           style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #9da2b4)', margin: 0 }}>
  Encrypted, uncapped CDN downloads for {movieTitle}.
           </p>
        </div>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}
        >
          ● Mirrors Online
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {downloadTiers.map(tier => (
          <div
            key={tier.quality}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              flexWrap: 'wrap',
              gap: '10px',
              transition: 'border-color 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(229, 169, 59, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent, #e5a93b)',
                  flexShrink: 0
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {tier.quality}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      color: 'var(--text-secondary, #9da2b4)'
                    }}
                  >
                    {tier.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#717686', marginTop: '2px' }}>
                  {tier.resolution} • {tier.format} • {tier.audio}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9da2b4' }}>
                {tier.size}
              </span>
              <button
                onClick={() => onSelectDownload(tier.quality)}
                style={{
                  backgroundColor: 'var(--accent, #e5a93b)',
                  color: '#08090c',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
