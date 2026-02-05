import * as React from "react";
import { AppSidebar, type AppSidebarProps } from "../organisms/AppSidebar";

export interface AppLayoutProps {
  sidebar?: AppSidebarProps;
  children: React.ReactNode;
  className?: string;
  rightPanel?: React.ReactNode;
  isRightPanelOpen?: boolean;
  rightPanelWidth?: number;
  onRightPanelResize?: (width: number) => void;
}

export function AppLayout({ 
  sidebar, 
  children, 
  className = "", 
  rightPanel, 
  isRightPanelOpen = false, 
  rightPanelWidth = 320,
  onRightPanelResize 
}: AppLayoutProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  if (!sidebar) {
    // No sidebar, just render children
    return <div className={`min-h-screen ${className}`}>{children}</div>;
  }

  const sidebarPadding = sidebar.isCollapsed ? "pl-0" : "pl-[254px]";
  const rightPanelPaddingValue = isRightPanelOpen ? rightPanelWidth : 0;

  return (
    <div className={`min-h-screen relative ${className}`}>
      {!sidebar.isCollapsed && (
        <div
          className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 w-[254px]`}
        >
          <AppSidebar {...sidebar} />
        </div>
      )}
      <main 
        className={`${sidebarPadding} min-h-screen w-full ${isDragging ? '' : 'transition-all duration-300'}`}
        style={{ paddingRight: `${rightPanelPaddingValue}px` }}
      >
        {children}
      </main>
      {rightPanel && (
        <>
          <div
            className={`fixed right-0 top-0 h-full bg-background border-l z-40 transition-transform duration-300 ${
              isRightPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ width: `${rightPanelWidth}px` }}
          >
            {rightPanel}
          </div>
          {isRightPanelOpen && onRightPanelResize && (
            <>
              {/* Visual divider line */}
              <div
                className="fixed top-0 h-full bg-border hover:bg-border-hover z-50 pointer-events-none"
                style={{ right: `${rightPanelWidth}px`, width: '0.5px' }}
              />
              {/* Drag handle area */}
              <div
                className="fixed top-0 h-full cursor-col-resize z-50"
                style={{ right: `${rightPanelWidth - 4}px`, width: '8px' }}
                onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                const startX = e.clientX;
                const startWidth = rightPanelWidth;

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = startX - e.clientX;
                  const newWidth = Math.max(200, Math.min(800, startWidth + deltaX));
                  onRightPanelResize(newWidth);
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                  document.body.style.cursor = '';
                  document.body.style.userSelect = '';
                  setIsDragging(false);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
              }}
            />
            </>
          )}
        </>
      )}
    </div>
  );
}