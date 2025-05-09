import styled from "styled-components";
import { useState, useEffect } from "react";
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: #095D7E;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: white;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #eee;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover {
    background: rgba(9, 93, 126, 0.1);
  }
`;

const ActionButton = styled(motion.button)`
  background-color: ${props => props.$type === 'cancel' ? '#dc3545' : '#6c757d'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;

  &:hover {
    background-color: ${props => props.$type === 'cancel' ? '#c82333' : '#5a6268'};
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.$status) {
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      case 'completed':
        return '#28a745';
      default:
        return '#6c757d';
    }
  }};
  color: ${props => props.$status === 'pending' ? '#000' : '#fff'};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #095D7E;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
`;

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appointmentsRef = ref(database, 'rhp/appointments');
    
    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to array and add the Firebase key as id
        const appointmentsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        // Sort appointments by date
        appointmentsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(appointmentsArray);
      } else {
        setAppointments([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const appointmentRef = ref(database, `rhp/appointments/${appointmentId}`);
        await update(appointmentRef, {
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        });
        toast.success('Appointment cancelled successfully');
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        const appointmentRef = ref(database, `rhp/appointments/${appointmentId}`);
        await remove(appointmentRef);
        toast.success('Appointment deleted successfully');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment');
      }
    }
  };

  if (loading) {
    return <LoadingMessage>Loading appointments...</LoadingMessage>;
  }

  if (appointments.length === 0) {
    return <EmptyMessage>No appointments found</EmptyMessage>;
  }

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>Patient Name</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Service</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <Tr key={appointment.id}>
              <Td>{appointment.patientName}</Td>
              <Td>{new Date(appointment.date).toLocaleDateString()}</Td>
              <Td>{appointment.time}</Td>
              <Td>{appointment.service}</Td>
              <Td>
                <StatusBadge $status={appointment.status}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </StatusBadge>
              </Td>
              <Td>
                {appointment.status === 'pending' && (
                  <ActionButton
                    $type="cancel"
                    onClick={() => handleCancelAppointment(appointment.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </ActionButton>
                )}
                <ActionButton
                  $type="delete"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </ActionButton>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
} 