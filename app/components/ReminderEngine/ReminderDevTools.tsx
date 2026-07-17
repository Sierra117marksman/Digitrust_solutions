'use client';
import React, { useState } from 'react';
import { useReminderEngine } from './ReminderProvider';

export default function ReminderDevTools() {
  const { activeReminders } = useReminderEngine();
  const [isOpen, setIsOpen] = useState(false);

  // In a real app, only show to admins/devs
  const isDev = process.env.NODE_ENV === 'development' || true; 

  if (!isDev) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '24px', zIndex: 999999,
      background: '#1e293b', color: 'white', padding: '12px', borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      fontFamily: 'monospace', fontSize: '12px',
      width: '300px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: isOpen ? '12px' : '0' }} onClick={() => setIsOpen(!isOpen)}>
        <strong>⚙️ Reminder Engine DevTools</strong>
        <span>{isOpen ? '▼' : '▲'}</span>
      </div>
      
      {isOpen && (
        <>
          <div style={{ marginBottom: '12px', padding: '8px', background: '#0f172a', borderRadius: '4px' }}>
            <div>Active Popups: {activeReminders.length}</div>
            <div style={{ marginTop: '4px' }}>
              {activeReminders.map(r => (
                <div key={r.id} style={{ color: r.engineState === 'Critical' ? '#ef4444' : '#3b82f6' }}>
                  - {r.title} [{r.engineState}]
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>
            Note: To mock triggers, we would inject mock EngineReminders directly into the context state, but since the Provider calculates state internally based on DB timestamps, it&apos;s best to modify a lead&apos;s nextFollowUpAt in the DB to test live flow.
          </div>
        </>
      )}
    </div>
  );
}
