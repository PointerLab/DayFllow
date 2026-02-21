import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, CircleAlert, Clock4 } from "lucide-react";
import {
  fetchDashboardNotifications,
  type DashboardNotificationItem,
} from "@/api/dashboard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const toneClasses: Record<DashboardNotificationItem["tone"], string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

const toneIcon = (tone: DashboardNotificationItem["tone"]) => {
  if (tone === "success") return CheckCircle2;
  if (tone === "warning") return CircleAlert;
  return Bell;
};

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DashboardNotificationItem[]>([]);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchDashboardNotifications();
        setItems(response.items || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open]);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Open notifications"
        >
          <Bell size={20} className="text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
        </div>
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center text-sm text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No notifications right now.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto p-3 space-y-2">
            {items.map((item) => {
              const Icon = toneIcon(item.tone);
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${toneClasses[item.tone]}`}
                    >
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        {!item.read && (
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock4 size={12} />
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
