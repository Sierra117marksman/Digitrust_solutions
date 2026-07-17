'use client';
import React from 'react';
import { useReminderEngine } from './ReminderProvider';
import { EngineReminder } from './ReminderTypes';

const SingleReminder = ({ r, callNow, snoozeReminder, completeReminder, acknowledgeReminder }: { r: EngineReminder, callNow: (id: string) => void, snoozeReminder: (id: string, mins: number) => void, completeReminder: (id: string) => Promise<void>, acknowledgeReminder: (id: string) => void }) => {
  const isCritical = r.engineState === 'Critical';
  const isOverdue = r.engineState === 'Overdue' || isCritical;
  const isDue = r.engineState === 'Due';
  
  let borderColor = '#3b82f6'; // Upcoming
  if (isDue) borderColor = '#f59e0b';
  if (isOverdue) borderColor = '#ef4444';
  
  let headerText = '⏰ Upcoming Reminder';
  if (isDue) headerText = '⏰ Reminder Due Now';
  if (r.engineState === 'Overdue') headerText = `🔴 OVERDUE (${r.waitingMinutes} min)`;
  if (isCritical) headerText = '⚫ CRITICAL BREACH';

  const handleWhatsApp = () => {
    acknowledgeReminder(r.id);
    if (r.subtitle) {
      window.open(`https://wa.me/${r.subtitle.replace(/\D/g, '')}`, '_blank');
    }
  };

  return (
    <div style={{
      background: '#ffffff', borderRadius: '12px', padding: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      borderLeft: `5px solid ${borderColor}`,
      pointerEvents: 'auto',
      animation: isDue ? 'modal-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate' : 'modal-pop 0.3s forwards',
      marginBottom: '12px',
      width: '360px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: isOverdue ? '#ef4444' : '#0f172a', fontSize: '15px', fontWeight: 700 }}>
          {headerText}
        </h4>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
          {new Date(r.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
      
      <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#1e293b', fontSize: '16px' }}>{r.title}</p>
      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#3b82f6', fontWeight: 600 }}>📞 {r.subtitle || 'No phone'}</p>
      
      {r.details && (
        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '13px', color: '#334155', marginBottom: '16px', border: '1px solid #e2e8f0', maxHeight: '80px', overflowY: 'auto' }}>
          <strong>Notes:</strong><br/>
          {r.details}
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button onClick={() => callNow(r.id)} style={{ flex: '1 1 45%', padding: '8px', background: '#2563eb', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>📞 Call Now</button>
        <button onClick={handleWhatsApp} style={{ flex: '1 1 45%', padding: '8px', background: '#10b981', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>💬 WhatsApp</button>
        
        <div style={{ flex: '1 1 100%', display: 'flex', gap: '6px', marginTop: '6px' }}>
          <button onClick={() => snoozeReminder(r.id, 10)} style={{ flex: 1, padding: '8px', background: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>Snooze 10m (Busy)</button>
          <button onClick={() => void completeReminder(r.id)} style={{ flex: 1, padding: '8px', background: '#f1f5f9', color: '#0f172a', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>Done</button>
        </div>
      </div>
    </div>
  );
};

const StackedReminder = ({ activeReminders, callNow, snoozeReminder }: { activeReminders: EngineReminder[], callNow: (id: string) => void, snoozeReminder: (id: string, mins: number) => void }) => {
  return (
    <div style={{
      background: '#ffffff', borderRadius: '12px', padding: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      borderTop: '6px solid #ef4444',
      pointerEvents: 'auto',
      width: '360px'
    }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#ef4444', fontSize: '16px', textAlign: 'center' }}>
        🔴 {activeReminders.length} Follow-ups Due
      </h4>
      <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeReminders.map(r => (
          <div key={r.id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ color: '#0f172a' }}>{r.title}</strong>
              <span style={{ color: '#64748b', fontSize: '12px' }}>
                {new Date(r.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
               <button onClick={() => callNow(r.id)} style={{ flex: 1, padding: '6px', background: '#2563eb', color: 'white', borderRadius: '4px', fontSize: '12px' }}>Call</button>
               <button onClick={() => snoozeReminder(r.id, 10)} style={{ padding: '6px 10px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '12px' }}>Snooze</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ReminderPopup() {
  const { activeReminders, completeReminder, snoozeReminder, callNow, acknowledgeReminder } = useReminderEngine();

  if (activeReminders.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 999999,
      display: 'flex', flexDirection: 'column',
      pointerEvents: 'none' // Let clicks pass through empty space
    }}>
      {activeReminders.length === 1 ? (
        <SingleReminder r={activeReminders[0]} callNow={callNow} snoozeReminder={snoozeReminder} completeReminder={completeReminder} acknowledgeReminder={acknowledgeReminder} />
      ) : (
        <StackedReminder activeReminders={activeReminders} callNow={callNow} snoozeReminder={snoozeReminder} />
      )}
    </div>
  );
}
