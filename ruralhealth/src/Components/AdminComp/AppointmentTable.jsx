import styled from "styled-components";
import { useState, useEffect } from "react";
import { ref, onValue, remove, update, get, push } from 'firebase/database';
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

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #095D7E;
    box-shadow: 0 0 0 2px rgba(9, 93, 126, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  margin-left: 10px;
  font-size: 14px;
  background-color: white;
  color: #000000;

  &:focus {
    outline: none;
    border-color: #095D7E;
    box-shadow: 0 0 0 2px rgba(9, 93, 126, 0.1);
  }

  option {
    color: #000000;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        // Get all patients
        const patientsRef = ref(database, 'rhp/patients');
        const patientsSnapshot = await get(patientsRef);
        const patientsData = patientsSnapshot.val();

        if (!patientsData) {
          setAppointments([]);
          setLoading(false);
          return;
        }

        // Collect all appointments from each patient
        const allAppointments = [];
        for (const [patientId, patient] of Object.entries(patientsData)) {
          if (patient.appointments) {
            const appointment = {
              id: patientId,
              patientId,
              patientName: `${patient.personalInfo?.firstName || ''} ${patient.personalInfo?.lastName || ''}`,
              patientEmail: patient.contactInfo?.email || 'N/A',
              patientPhone: patient.contactInfo?.phoneNumber || 'N/A',
              appointmentDate: patient.appointments.appointmentDate,
              appointmentTime: patient.appointments.appointmentTime,
              description: patient.appointments.description || 'No description',
              status: patient.appointments.status || 'pending',
              createdAt: patient.appointments.createdAt,
              cancelledAt: patient.appointments.cancelledAt
            };
            allAppointments.push(appointment);
          }
        }

        // Sort appointments by date
        allAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        setAppointments(allAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
        try {
            const appointmentRef = ref(database, `rhp/patients/${appointmentId}/appointments`);
            await update(appointmentRef, {
                status: 'cancelled',
                cancelledAt: new Date().toISOString()
            });
            toast.success('Appointment cancelled successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Refresh the page after successful cancellation
            window.location.reload();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error('Failed to cancel appointment', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
        try {
            // Delete the appointment
            const appointmentRef = ref(database, `rhp/patients/${appointmentId}/appointments`);
            await remove(appointmentRef);

            // Update patient's next appointment to null
            const patientRef = ref(database, `rhp/patients/${appointmentId}`);
            await update(patientRef, {
                'registrationInfo.nextAppointment': null
            });

            // Create a deletion record for tracking
            const deletionRef = ref(database, 'rhp/appointmentDeletions');
            await push(deletionRef, {
                patientId: appointmentId,
                deletedAt: new Date().toISOString(),
                deletedBy: 'admin' // You can replace this with actual admin ID if available
            });

            toast.success('Appointment deleted successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Refresh the page after successful deletion
            window.location.reload();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            toast.error('Failed to delete appointment. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingMessage>Loading appointments...</LoadingMessage>;
  }

  return (
    <div>
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </FilterSelect>
      </FilterContainer>

      {filteredAppointments.length === 0 ? (
        <EmptyMessage>No appointments found</EmptyMessage>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Patient Name</Th>
                <Th>Contact Info</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <Tr key={appointment.id}>
                  <Td>{appointment.patientName}</Td>
                  <Td>
                    <div>Email: {appointment.patientEmail}</div>
                    <div>Phone: {appointment.patientPhone}</div>
                  </Td>
                  <Td>{new Date(appointment.appointmentDate).toLocaleDateString()}</Td>
                  <Td>{appointment.appointmentTime}</Td>
                  <Td>{appointment.description}</Td>
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
      )}
    </div>
  );
} 