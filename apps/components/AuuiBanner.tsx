export function AuuiBanner({ galleryUrl }: { galleryUrl: string }) {
  return (
    <div style={{
      all: 'initial',
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.5',
      boxSizing: 'border-box',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <span style={{ all: 'initial', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
        <span style={{ all: 'initial', fontSize: '18px', lineHeight: '1' }}>🎨</span>
        <span style={{ all: 'initial', color: 'white', fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>AUUI Prototype</span>
      </span>
      <a
        href={galleryUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          all: 'initial',
          color: 'white',
          textDecoration: 'none',
          padding: '4px 12px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 500,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          cursor: 'pointer',
          display: 'inline-block',
          lineHeight: '1.5',
          boxSizing: 'border-box',
        }}
      >
        Edit in AUUI →
      </a>
    </div>
  );
}
