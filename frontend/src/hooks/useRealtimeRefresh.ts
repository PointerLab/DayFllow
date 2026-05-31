import { useEffect, useRef } from "react";
import {
  REALTIME_DATA_CHANGED_EVENT,
  type RealtimeDataChangedEvent,
} from "@/hooks/useRealtimeUpdates";

export const useRealtimeRefresh = (
  refresh: (event: RealtimeDataChangedEvent) => void | Promise<void>,
) => {
  const refreshRef = useRef(refresh);
  const latestEventRef = useRef<RealtimeDataChangedEvent | null>(null);
  const refreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    const handleDataChanged = (event: Event) => {
      latestEventRef.current = (event as CustomEvent<RealtimeDataChangedEvent>).detail;
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
      }

      refreshTimerRef.current = window.setTimeout(() => {
        if (latestEventRef.current) {
          void refreshRef.current(latestEventRef.current);
        }
      }, 250);
    };

    window.addEventListener(REALTIME_DATA_CHANGED_EVENT, handleDataChanged);
    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
      }
      window.removeEventListener(REALTIME_DATA_CHANGED_EVENT, handleDataChanged);
    };
  }, []);
};
