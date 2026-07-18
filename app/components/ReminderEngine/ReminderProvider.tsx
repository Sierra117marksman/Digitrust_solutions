'use client';
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ReminderItem, EngineReminder, ReminderEngineAPI } from './ReminderTypes';
import { calculateReminderState, sortReminders } from './ReminderScheduler';
import { loadPreferences, ReminderPreferences } from './ReminderPreferences';
import { playSoftNotificationSound } from './ReminderSound';
import ReminderPopup from './ReminderPopup';
import ReminderDevTools from './ReminderDevTools';

const ReminderContext = createContext<ReminderEngineAPI | null>(null);

export const useReminderEngine = () => {
  const context = useContext(ReminderContext);
  if (!context) throw new Error("useReminderEngine must be used within a ReminderProvider");
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
  items: ReminderItem[];
  onCompleteItem: (id: string) => Promise<void>;
  onOpenItem: (item: ReminderItem) => void;
  contextActiveId?: string | null;
}

export default function ReminderProvider({ children, items, onCompleteItem, onOpenItem, contextActiveId = null }: ProviderProps) {
  const [prefs] = useState<ReminderPreferences>(() => loadPreferences());
  const [snoozed, setSnoozed] = useState<Record<string, number>>({});
  const [acknowledged, setAcknowledged] = useState<Record<string, number>>({});
  const [activeReminders, setActiveReminders] = useState<EngineReminder[]>([]);

  const prevActivesRef = useRef<EngineReminder[]>([]);

  // The core Engine Tick
  useEffect(() => {
    if (!prefs) return;
    
    const tick = () => {
      const nowMs = Date.now();
      
      // In a real app, check working hours here. For now, we process 24/7.
      
      let soundToPlay = false;
      
      const newActives: EngineReminder[] = [];
      
      items.forEach(item => {
        const engineItem = calculateReminderState(
          item, 
          nowMs, 
          prefs, 
          snoozed[item.id], 
          acknowledged[item.id]
        );
        
        const isVisibleState = ['Upcoming', 'Due', 'Overdue', 'Critical'].includes(engineItem.engineState);
        
        if (isVisibleState) {
          // If we are actively editing this item, don't show the global popup
          if (engineItem.id !== contextActiveId) {
            newActives.push(engineItem);
            
            // Check if this just transitioned into a visible state that we haven't seen before
            const previousState = prevActivesRef.current.find(r => r.id === item.id)?.engineState;
            if (!previousState || previousState === 'Scheduled') {
              soundToPlay = true;
            }
          }
        }
      });
      
      const sortedActives = sortReminders(newActives);
      
      // Only set state if it actually changed to prevent infinite loops
      if (JSON.stringify(prevActivesRef.current) !== JSON.stringify(sortedActives)) {
        setActiveReminders(sortedActives);
        prevActivesRef.current = sortedActives;
      }
      
      if (soundToPlay && prefs.soundEnabled) {
        playSoftNotificationSound();
      }
    };

    // Run tick immediately, then every 10 seconds
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, [items, prefs, snoozed, acknowledged, contextActiveId]);

  const acknowledgeReminder = useCallback((id: string) => {
    setAcknowledged(prev => ({ ...prev, [id]: Date.now() }));
  }, []);

  const snoozeReminder = useCallback((id: string, minutes: number) => {
    setSnoozed(prev => ({ ...prev, [id]: Date.now() + minutes * 60000 }));
  }, []);

  const completeReminder = useCallback(async (id: string) => {
    // Optimistic hide
    acknowledgeReminder(id);
    await onCompleteItem(id);
  }, [acknowledgeReminder, onCompleteItem]);

  const callNow = useCallback((id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      onOpenItem(item);
      acknowledgeReminder(id);
    }
  }, [items, onOpenItem, acknowledgeReminder]);

  const api: ReminderEngineAPI = useMemo(() => ({
    activeReminders,
    acknowledgeReminder,
    snoozeReminder,
    completeReminder,
    callNow,
    contextActiveId,
    setContextActiveId: () => {}
  }), [activeReminders, acknowledgeReminder, snoozeReminder, completeReminder, callNow, contextActiveId]);

  return (
    <ReminderContext.Provider value={api}>
      {children}
      <ReminderPopup />
      <ReminderDevTools />
    </ReminderContext.Provider>
  );
}
