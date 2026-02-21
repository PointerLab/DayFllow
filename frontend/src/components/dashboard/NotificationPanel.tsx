import React from "react";
import { Bell, CheckCircle2, CircleAlert, Clock4 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type NotificationTone = "info" | "success" | "warning";

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  tone?: NotificationTone;
  read?: boolean;
}

interface NotificationPanelProps {
  title?: string;
  items: DashboardNotification[];
}

const toneClasses: Record<NotificationTone, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

const toneIcon = (tone: NotificationTone) => {
  if (tone === "success") return CheckCircle2;
  if (tone === "warning") return CircleAlert;
  return Bell;
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  title = "Notifications",
  items,
}) => {
  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          {unreadCount}
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new notifications.</p>
        ) : (
          items.map((item) => {
            const tone = item.tone ?? "info";
            const Icon = toneIcon(tone);
            return (
              <div
                key={item.id}
                className="rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}
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
          })
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
