import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#050608',
        padding: '48px 0 28px 0',
        marginTop: '60px',
        color: 'var(--text-secondary, #9da2b4)',
        fontSize: '0.85rem'
      }}
    >
      <div className="site-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '32px'
          }}
        >
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
              Cine<span style={{ color: 'var(--accent, #e5a93b)' }}>Vault</span>
            </span>
            <p style={{ maxWidth: '420px', marginTop: '10px', lineHeight: 1.6, color: '#717686' }}>
              High-definition cinema streaming index and encrypted offline media cache. All media is hosted via decentralized third-party nodes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Navigation</strong>
              <Link to="/" style={{ color: '#9da2b4', textDecoration: 'none' }}>Home</Link>
              <Link to="/?type=movie" style={{ color: '#9da2b4', textDecoration: 'none' }}>All Movies</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Legal & Trust</strong>
              <span style={{ color: '#717686', cursor: 'pointer' }}>DMCA Notice</span>
              <span style={{ color: '#717686', cursor: 'pointer' }}>Terms of Service</span>
              <span style={{ color: '#717686', cursor: 'pointer' }}>Privacy Policy</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            color: '#525766',
            fontSize: '0.78rem'
          }}
        >
          <span>© {new Date().getFullYear()} CineVault Media Network. All rights reserved.</span>
          <span>Disclaimer: CineVault does not store physical media files on its servers.</span>
        </div>
      </div>
    </footer>
  );
};