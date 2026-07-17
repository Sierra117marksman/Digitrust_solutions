'use client';
import React from 'react';
import { useReminderEngine } from './ReminderProvider';

export default function LeadContextAlert({ leadId }: { leadId: string }) {
  const { activeReminders, completeReminder, snoozeReminder } = useReminderEngine();
  
  const reminder = activeReminders.find(r => r.id === leadId);
  
  if (!reminder) return null;
  
  const isOverdue = reminder.engineState === 'Overdue' || reminder.engineState === 'Critical';

  return (
    <div style={{
      background: isOverdue ? '#fef2f2' : '#f0fdf4',
      border: `1px solid ${isOverdue ? '#f87171' : '#4ade80'}`,
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: isOverdue ? '#b91c1c' : '#166534', fontSize: '14px' }}>
          {isOverdue ? `🔴 OVERDUE: Follow-up was due ${reminder.waitingMinutes}m ago` : '⏰ Reminder: Follow-up due shortly!'}
        </strong>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Scheduled: {new Date(reminder.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => snoozeReminder(leadId, 10)} style={{ flex: 1, padding: '6px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
          Snooze 10m
        </button>
        <button onClick={() => void completeReminder(leadId)} style={{ flex: 1, padding: '6px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
          Mark Completed
        </button>
      </div>
    </div>
  );
}
