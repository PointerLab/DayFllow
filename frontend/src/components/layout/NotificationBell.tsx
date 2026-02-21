import React from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const NotificationBell: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Open notifications"
        >
          <Bell size={20} className="text-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
        </div>
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No notifications right now.
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
