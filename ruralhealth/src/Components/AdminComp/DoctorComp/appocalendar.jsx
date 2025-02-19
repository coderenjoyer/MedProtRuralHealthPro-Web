import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);

  const events = [
    { id: 1, title: 'John Doe', start: '2025-01-15T09:30:00', end: '2025-01-15T10:00:00', details: 'Check-up', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, title: 'Jane Doe', start: '2025-02-20T10:00:00', end: '2025-02-20T10:30:00', details: 'Routine blood work', email: 'jane@example.com', phone: '987-654-3210' },
    { id: 3, title: 'Mark Brown', start: '2025-03-10T11:00:00', end: '2025-03-10T11:30:00', details: 'Follow-up consultation', email: 'mark@example.com', phone: '555-666-7777' },
    { id: 4, title: 'Emily White', start: '2025-04-05T14:00:00', end: '2025-04-05T14:30:00', details: 'Dental check-up', email: 'emily@example.com', phone: '222-333-4444' },
  ];

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start.toLocaleString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric', 
        hour: 'numeric', minute: '2-digit', hour12: true 
      }),
      details: clickInfo.event.extendedProps.details,
      email: clickInfo.event.extendedProps.email,
      phone: clickInfo.event.extendedProps.phone,
    });
    setOpen(true);
  };

  return (
    <div style={{ 
      position: 'relative', 
      padding: '40px', 
      backgroundColor: '#FFFFFF', 
      minHeight: '100vh', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#333', 
        fontSize: '2.5rem', 
        fontWeight: '600' 
      }}>
        Doctor's Appointment Calendar
      </h1>
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px', 
        margin: '0 auto', 
        backgroundColor: '#FFF', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
        padding: '30px' 
      }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
          }}
          events={events}
          editable={false}
          selectable={true}
          eventClick={handleEventClick}
          eventColor="#4A90E2"
          eventTextColor="#FFFFFF" // Keep event text color as original (white)
          height="800px"
          contentHeight="auto"
        />
      </div>
      
      {open && selectedEvent && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000 
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
            width: '400px', 
            textAlign: 'left'
          }}>
            <h2 style={{ 
              marginBottom: '20px', 
              color: '#444', 
              fontSize: '1.8rem', 
              fontWeight: '600', 
              textAlign: 'center' 
            }}>
              {selectedEvent.title}
            </h2>
            <p style={{ margin: '10px 0', fontSize: '1.1rem', color: '#555' }}>
              <strong>Time:</strong> {selectedEvent.start}
            </p>
            <p style={{ margin: '10px 0', fontSize: '1.1rem', color: '#555' }}>
              <strong>Details:</strong> {selectedEvent.details}
            </p>
            <p style={{ margin: '10px 0', fontSize: '1.1rem', color: '#555' }}>
              <strong>Email:</strong> {selectedEvent.email}
            </p>
            <p style={{ margin: '10px 0', fontSize: '1.1rem', color: '#555' }}>
              <strong>Phone:</strong> {selectedEvent.phone}
            </p>
            <button onClick={() => setOpen(false)} style={{
              marginTop: '20px', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: '#4A90E2', 
              color: '#FFF', 
              cursor: 'pointer', 
              fontSize: '1rem', 
              fontWeight: '500', 
              display: 'block', 
              width: '100%', 
              transition: 'background-color 0.3s ease'
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add global styles to change today's date background color */}
      <style>
        {`
          .fc-day-today {
            background-color: #B2EBF2 !important; /* Light cyan background for today's date */
          }
        `}
      </style>
    </div>
  );
};

export default Calendar;