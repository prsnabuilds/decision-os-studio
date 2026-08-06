import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Inbox,
  Newspaper,
  ListChecks,
  Users,
  Brain,
  Wallet,
  Upload,
  Mic2,
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Btn, CountBadge, IconBtn, StatusBadge } from "@/components/ds";
import { currentUser, notifications } from "@/data/demo";
import { relativeTime } from "@/lib/format";
import logoOnLight from "@/assets/decisionos-wordmark-dark-text.svg.asset.json";
import logoOnDark from "@/assets/decisionos-wordmark-light-text.svg.asset.json";

const nav = [
  { to: "/home", label: "Home", short: "Home", icon: Home },
  { to: "/inbox", label: "Decision Desk", short: "Desk", icon: Inbox, count: 6, tone: "neutral" as const },
  { to: "/brief", label: "CEO Brief", short: "Brief", icon: Newspaper, count: 5, tone: "danger" as const },
  { to: "/my-work", label: "My Work", short: "My Work", icon: ListChecks },
  { to: "/contacts", label: "People", short: "People", icon: Users },
  { to: "/brain", label: "Company Brain", short: "Brain", icon: Brain },
  { to: "/ledger", label: "Finance", short: "Finance", icon: Wallet },
  { to: "/ingest", label: "Capture", short: "Capture", icon: Upload, count: 5, tone: "neutral" as const },
  { to: "/meetings", label: "Meeting Notes", short: "Notes", icon: Mic2 },
  { to: "/settings", label: "Settings", short: "Settings", icon: SettingsIcon },
];

/* The bottom bar is the primary route set; the drawer holds the same names in full. */
const mobileTabs = nav.slice(0, 4);



export function Wordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const width = size === "lg" ? "w-[164px]" : size === "sm" ? "w-[118px]" : "w-[137px]";
  return (
    <span className="inline-flex items-center">
      <img
        src={logoOnLight.url}
        alt="DecisionOS"
        className={cn(width, "h-auto dark:hidden")}
        draggable={false}
      />
      <img
        src={logoOnDark.url}
        alt="DecisionOS"
        className={cn(width, "hidden h-auto dark:block")}
        draggable={false}
      />
    </span>
  );
}

function useTheme() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Primary">
      {nav.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-body transition-colors duration-150",
              active
                ? "bg-brand-tint text-brand-on-tint font-semibold"
                : "text-secondary-foreground hover:bg-surface-hover",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.count ? <CountBadge count={item.count} tone={item.tone} /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

function UserBlock() {
  return (
    <div className="border-t border-hairline p-4">
      <p className="text-body-strong text-foreground">{currentUser.name}</p>
      <p className="truncate text-small text-tertiary-foreground">{currentUser.email}</p>
      <Btn variant="secondary" size="sm" className="mt-3 w-full" asChild>
        <Link to="/login">Sign Out</Link>
      </Btn>
    </div>
  );
}

function NotificationPopover({ onClose }: { onClose: () => void }) {
  const recent = notifications.slice(0, 7);
  return (
    <div
      className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-hairline bg-surface shadow-md"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="border-b border-hairline px-4 py-3 text-label text-tertiary-foreground">
        Recent Notifications
      </div>
      <ul className="max-h-80 overflow-auto">
        {recent.length === 0 ? (
          <li className="px-4 py-6 text-center text-small text-secondary-foreground">
            You're all caught up.
          </li>
        ) : (
          recent.map((n) => (
            <li key={n.id} className="border-b border-hairline px-4 py-3 last:border-b-0">
              <div className="flex items-center gap-2">
                <StatusBadge kind="neutral">{n.type}</StatusBadge>
                <span className="text-label text-tertiary-foreground">
                  {relativeTime(n.hoursAgo)}
                </span>
              </div>
              <p
                className={cn(
                  "mt-1 text-small",
                  n.unread ? "text-foreground font-semibold" : "text-secondary-foreground",
                )}
              >
                {n.title}
              </p>
            </li>
          ))
        )}
      </ul>
      <div className="border-t border-hairline p-2">
        <Btn variant="tertiary" size="sm" className="w-full" asChild onClick={onClose}>
          <Link to="/notifications">View All</Link>
        </Btn>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { dark, toggle } = useTheme();
  const [drawer, setDrawer] = React.useState(false);
  const [bell, setBell] = React.useState(false);
  const unread = notifications.filter((n) => n.unread).length;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        setBell(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const themeControls = (
    <>
      <IconBtn label="Change Language">
        <Globe className="size-4" />
      </IconBtn>
      <IconBtn label={dark ? "Switch To Light Theme" : "Switch To Dark Theme"} onClick={toggle}>
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </IconBtn>
      <div className="relative">
        <IconBtn label={`Notifications, ${unread} unread`} onClick={() => setBell((b) => !b)}>
          <span className="relative">
            <Bell className="size-4" />
            {unread > 0 ? (
              <span className="absolute -right-2 -top-2 rounded-pill bg-brand px-1.5 text-[10px] font-semibold leading-4 text-on-primary tabular">
                {unread}
              </span>
            ) : null}
          </span>
        </IconBtn>
        {bell ? <NotificationPopover onClose={() => setBell(false)} /> : null}
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-hairline bg-surface lg:flex">
        <div className="p-4">
          <Link to="/inbox" aria-label="DecisionOS home">
            <Wordmark />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <NavList />
        </div>
        <UserBlock />
      </aside>

      {/* Mobile drawer */}
      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-neutral-900/40"
            aria-label="Close navigation"
            onClick={() => setDrawer(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-hairline bg-surface shadow-lg"
          >
            <div className="flex items-center justify-between p-4">
              <Wordmark />
              <IconBtn label="Close Navigation" onClick={() => setDrawer(false)}>
                <X className="size-4" />
              </IconBtn>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <NavList onNavigate={() => setDrawer(false)} />
            </div>
            <UserBlock />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        {/* Desktop header */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-hairline bg-surface/80 px-6 backdrop-blur lg:flex">
          <p className="text-small text-secondary-foreground">
            Signed in as <span className="text-body-strong text-foreground">{currentUser.name}</span>{" "}
            <StatusBadge kind="neutral" className="ml-1.5 align-middle">
              {currentUser.role}
            </StatusBadge>
          </p>
          <div className="flex items-center gap-1">
            <Btn variant="secondary" size="sm" className="mr-2">
              Send Daily Digest
            </Btn>
            {themeControls}
          </div>
        </header>

        {/* Mobile app bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-hairline bg-surface/85 px-4 backdrop-blur lg:hidden">
          <Wordmark size="sm" />
          <div className="flex shrink-0 items-center">{themeControls}</div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-6 sm:px-6 lg:pb-16 lg:pt-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-hairline bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {mobileTabs.map((t) => {
          const active = pathname === t.to || pathname.startsWith(`${t.to}/`);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-center text-label",
                active ? "text-brand" : "text-secondary-foreground",
              )}
            >
              <t.icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="w-full truncate whitespace-nowrap leading-tight">{t.short}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-center text-label text-secondary-foreground"
        >
          <Menu className="size-5 shrink-0" aria-hidden="true" />
          <span className="w-full truncate whitespace-nowrap leading-tight">Menu</span>
        </button>


      </nav>
    </div>
  );
}
