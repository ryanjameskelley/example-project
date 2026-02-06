import { useState } from "react";
import { Avatar, AvatarImage } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { Separator } from "../atoms/Separator";
import {
  ChevronsUpDown,
  LayoutDashboard,
  Sparkles,
  UsersRound,
  Ticket,
  Inbox,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  PanelRight,
  LucideIcon,
  Route,
} from "lucide-react";

export interface SidebarNavigationItem {
  id: string;
  icon?: LucideIcon;
  label: string;
  translationKey?: string; // Optional translation key for i18n
  path?: string;
  children?: SidebarNavigationItem[];
  badge?: string | number;
  emoji?: string;
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

export interface AppSidebarProps {
  activePage?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void | Promise<void>;
  user?: SidebarUser;
  navigationItems?: SidebarNavigationItem[];
  showMessagingSection?: boolean;
  messagingItems?: SidebarNavigationItem[];
  teamChannels?: SidebarNavigationItem[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onCreateTeamChannel?: (data: {
    name: string;
    description: string;
    participants: string[];
    isPublic: boolean;
  }) => void | Promise<void>;
  availableUsers?: { id: string; name: string; email?: string; avatar?: string }[];
  customDashboardContent?: React.ReactNode;
  isRightPanelOpen?: boolean;
  onToggleRightPanel?: () => void;
}

const DEFAULT_USER: SidebarUser = {
  name: "Tea",
  email: "m@example.com",
};

const DEFAULT_NAVIGATION: SidebarNavigationItem[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    translationKey: "navigation.dashboard",
    path: "/dashboard",
  },
  { id: "ai", icon: Sparkles, label: "Ask AI", translationKey: "navigation.ai", path: "/ai" },
  { id: "contacts", icon: UsersRound, label: "Contacts", translationKey: "navigation.contacts", path: "/contacts" },
  { id: "tickets", icon: Ticket, label: "Tickets", translationKey: "navigation.tickets", path: "/tickets" },
  { id: "journeys", icon: Route, label: "Journeys", translationKey: "navigation.journeys", path: "/journeys" },
];

const DEFAULT_MESSAGING_ITEMS: SidebarNavigationItem[] = [
  { id: "inbox", label: "Inbox", translationKey: "navigation.inbox", badge: 128 },
  { id: "sent", label: "Drafts & Sent", translationKey: "navigation.drafts_sent" },
  { id: "archive", label: "Archive", translationKey: "navigation.archive" },
];

const DEFAULT_TEAM_CHANNELS: SidebarNavigationItem[] = [
  { id: "add-channel", icon: Plus, label: "Add a team channel", translationKey: "navigation.add_team_channel" },
  { id: "tickets-channel", emoji: "📊", label: "Tickets & such", translationKey: "navigation.tickets_channel" },
  { id: "data-channel", emoji: "🍳", label: "Data cleanliness", translationKey: "navigation.data_channel" },
  { id: "service-channel", emoji: "💪", label: "Customer service", translationKey: "navigation.service_channel" },
  { id: "resources-channel", emoji: "📚", label: "Resources", translationKey: "navigation.resources_channel" },
];

export function AppSidebar({
  activePage,
  onNavigate,
  onLogout: _onLogout,
  user = DEFAULT_USER,
  navigationItems = DEFAULT_NAVIGATION,
  showMessagingSection = true,
  messagingItems = DEFAULT_MESSAGING_ITEMS,
  teamChannels = DEFAULT_TEAM_CHANNELS,
  isCollapsed = false,
  onToggleCollapse: _onToggleCollapse,
  className = "",
  onCreateTeamChannel,
  availableUsers: _availableUsers = [],
  customDashboardContent: _customDashboardContent,
  isRightPanelOpen: _isRightPanelOpen = false,
  onToggleRightPanel,
}: AppSidebarProps) {
  const [isMessagingExpanded, setIsMessagingExpanded] = useState(true);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    onNavigate?.(path);
  };

  const renderNavigationItem = (item: SidebarNavigationItem, isChild = false) => {
    const isActive = activePage === item.id;
    const hasChildren = item.children && item.children.length > 0;

    // Handle special case for "add team channel" button
    if (item.id === "add-channel") {
      return (
        <Button
          key={item.id}
          variant="ghost"
          className={`w-full h-${isChild ? "9" : "8"} px-${isChild ? "3" : "2"} py-2 rounded-md ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          onClick={() => onCreateTeamChannel?.({ name: "", description: "", participants: [], isPublic: true })}
          title={isCollapsed ? item.label : ""}
        >
          {item.icon && <item.icon className={`h-4 w-4 text-sidebar-foreground ${!isCollapsed ? "mr-2" : ""}`} />}
          {!isCollapsed && (
            <span className={`text-sm ${isChild ? "font-medium" : ""} text-sidebar-foreground`}>
              {item.label}
            </span>
          )}
        </Button>
      );
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={`w-full h-${isChild ? "9" : "8"} px-${isChild ? "3" : "2"} py-2 rounded-md ${
          isCollapsed ? "justify-center" : "justify-start"
        } ${
          isActive
            ? "bg-[#F5F5F5] text-sidebar-accent-foreground hover:bg-[#F5F5F5] hover:text-sidebar-accent-foreground"
            : ""
        }`}
        onClick={item.path ? () => handleNavigation(item.path!) : hasChildren ? () => {} : undefined}
        onMouseEnter={() => setHoveredItemId(item.id)}
        onMouseLeave={() => setHoveredItemId(null)}
        title={isCollapsed ? item.label : ""}
      >
        {item.icon && <item.icon className={`h-4 w-4 text-sidebar-foreground ${!isCollapsed ? "mr-2" : ""}`} />}
        {item.emoji && !isCollapsed && <span className="mr-2">{item.emoji}</span>}
        {!isCollapsed && (
          <>
            <span className={`text-sm ${isChild ? "font-medium" : ""} text-sidebar-foreground`}>
              {item.label}
            </span>
            {item.badge && <span className="ml-auto text-sm font-medium">{item.badge}</span>}
            {item.id === "ai" && hoveredItemId === "ai" && (
              <button
                className="ml-auto p-1 hover:bg-sidebar-accent rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRightPanel?.();
                }}
                type="button"
              >
                <PanelRight className="h-4 w-4 text-sidebar-foreground" />
              </button>
            )}
            {hasChildren && <MoreHorizontal className="ml-auto h-4 w-4 text-sidebar-foreground" />}
            {item.id === "messaging" &&
              (isMessagingExpanded ? (
                <ChevronDown className="ml-auto h-4 w-4 text-sidebar-foreground" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 text-sidebar-foreground" />
              ))}
          </>
        )}
      </Button>
    );
  };

  return (
    <>
      <div
        className={`absolute left-0 top-0 h-screen bg-sidebar text-sidebar-foreground border-r transition-all duration-300 z-50 ${
          isCollapsed ? "w-16" : "w-[254px]"
        } ${className}`}
      >
        {/* User Section */}
        <div className="px-2 py-2 border-b h-[52px] flex items-center">
          <div
            className={`flex items-center gap-2 p-2 rounded-md w-full ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <div className="flex items-start">
              <Avatar className="h-8 w-8 rounded-lg bg-background">
                <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.name)}`} alt={user.name} />
              </Avatar>
            </div>
            {!isCollapsed && (
              <>
                <div className="flex flex-col justify-center items-start gap-0.5 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground leading-none truncate w-full">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground leading-none truncate w-full">{user.email}</p>
                </div>
                <div className="flex items-center justify-center flex-shrink-0">
                  <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="pt-2 px-2">
          <div className="space-y-1">
            {navigationItems.map((item) => renderNavigationItem(item))}

            {showMessagingSection && (
              <Button
                variant="ghost"
                className={`w-full h-8 px-2 py-2 rounded-md ${isCollapsed ? "justify-center" : "justify-start"}`}
                onClick={() => setIsMessagingExpanded(!isMessagingExpanded)}
                title={isCollapsed ? "Messaging" : ""}
              >
                <Inbox className={`h-4 w-4 text-sidebar-foreground ${!isCollapsed ? "mr-2" : ""}`} />
                {!isCollapsed && (
                  <>
                    <span className="text-sm text-sidebar-foreground">Messaging</span>
                    {isMessagingExpanded ? (
                      <ChevronDown className="ml-auto h-4 w-4 text-sidebar-foreground" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 text-sidebar-foreground" />
                    )}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Messaging Section */}
        {showMessagingSection && isMessagingExpanded && !isCollapsed && (
          <>
            <div className="px-2 py-2">
              <div className="space-y-1">{messagingItems.map((item) => renderNavigationItem(item, true))}</div>
            </div>

            <div className="px-2">
              <Separator />
            </div>

            <div className="px-2 py-2">
              <div className="space-y-1">{teamChannels.map((item) => renderNavigationItem(item))}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}