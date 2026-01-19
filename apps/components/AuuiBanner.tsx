import React from 'react';

export function AuuiBanner({ galleryUrl }: { galleryUrl: string }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#6366f1',
      color: 'white',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 9999,
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>🎨</span>
        <span>AUUI Prototype</span>
      </span>
      <a
        href={galleryUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'white',
          textDecoration: 'none',
          padding: '4px 12px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        View in Gallery →
      </a>
    </div>
  );
}
