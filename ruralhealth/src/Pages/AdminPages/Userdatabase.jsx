"use client";

import styled from "styled-components";
import Sidebar from "../../Components/AdminComp/Sidebar";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { database } from "../../Firebase/firebase";
import { ref, get, update, set } from "firebase/database";
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
  position: relative;
`;

const MainWrapper = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.$isSidebarOpen ? "200px" : "0")};
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #333;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  position: absolute;
  left: 0;

  @media (max-width: 768px) {
    display: block;
  }
`;

const PanelsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  flex-wrap: wrap;
`;

const Panel = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;

const PanelTitle = styled.h3`
  margin: 0 0 25px 0;
  font-size: 20px;
  color: #004b87;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #004b87;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const PasswordSection = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;

  label {
    display: block;
    margin-bottom: 8px;
    text-align: left;
    color: #666;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #004b87;
      box-shadow: 0 0 0 2px rgba(0, 75, 135, 0.1);
    }
  }
`;

const Button = styled.button`
  background-color: #004b87;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #003c6f;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 20px;
  color: #004b87;
  font-size: 18px;
`;

export default function UserDatabase() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [staffUsers, setStaffUsers] = useState([]);
  const [doctorUsers, setDoctorUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from Firebase...');
        const usersRef = ref(database, 'rhp/users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log('Raw Firebase data:', userData);

          const userArray = Object.entries(userData).map(([id, data]) => ({
            id,
            username: id, // Using the key as username
            ...data
          }));

          console.log('Processed user array:', userArray);

          // Filter users by their roles
          const staff = userArray.filter(user => 
            user.role === 'frontdesk'
          );

          const doctors = userArray.filter(user => 
            user.role === 'doctor' || user.role === 'specialist'
          );

          console.log('Filtered Staff:', staff);
          console.log('Filtered Doctors:', doctors);

          setStaffUsers(staff);
          setDoctorUsers(doctors);

        } else {
          console.log('No users found in database, creating default users');
          const defaultUsers = {
            'Staff-FrontDesk': {
              password: 'desk123',
              role: 'frontdesk',
              name: 'Front Desk Staff'
            },
            'Doctor-Physician': {
              password: 'doctor123',
              role: 'doctor',
              name: 'Doctor Physician'
            },
            'Specialist-Dentist': {
              password: 'spec123',
              role: 'specialist',
              name: 'Dental Specialist'
            }
          };

          // Create the users in Firebase
          await set(usersRef, defaultUsers);

          // Convert to array format for state
          const defaultStaff = [{
            id: 'Staff-FrontDesk',
            username: 'Staff-FrontDesk',
            password: 'desk123',
            role: 'frontdesk',
            name: 'Front Desk Staff'
          }];
          
          const defaultDoctors = [
            {
              id: 'Doctor-Physician',
              username: 'Doctor-Physician',
              password: 'doctor123',
              role: 'doctor',
              name: 'Doctor Physician'
            },
            {
              id: 'Specialist-Dentist',
              username: 'Specialist-Dentist',
              password: 'spec123',
              role: 'specialist',
              name: 'Dental Specialist'
            }
          ];

          setStaffUsers(defaultStaff);
          setDoctorUsers(defaultDoctors);
          console.log('Created default users in Firebase');
        }
      } catch (error) {
        console.error('Error fetching/creating users:', error);
        toast.error('Failed to fetch/create users: ' + error.message);
        setStaffUsers([]);
        setDoctorUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePasswordChange = async (userId) => {
    if (!adminPassword || !currentPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    try {
      // First verify admin password
      console.log('Verifying admin credentials...');
      const adminRef = ref(database, 'rhp/users/Staff-Admin');
      const adminSnapshot = await get(adminRef);
      
      if (!adminSnapshot.exists()) {
        console.error('Admin user not found in database');
        toast.error('Admin verification failed');
        return;
      }

      const adminData = adminSnapshot.val();
      if (adminData.password !== adminPassword) {
        console.error('Admin password incorrect');
        toast.error('Admin password is incorrect');
        return;
      }

      // Proceed with user password change
      console.log('Admin verified, updating user password:', userId);
      const userRef = ref(database, `rhp/users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        console.error('User not found in database:', userId);
        toast.error('User not found in database');
        return;
      }

      const userData = userSnapshot.val();
      console.log('Found user data:', userData);
      
      if (userData.password !== currentPassword) {
        console.error('Current password mismatch for user:', userId);
        toast.error('Current password is incorrect');
        return;
      }

      await update(userRef, {
        password: newPassword,
        lastPasswordUpdate: new Date().toISOString()
      });

      console.log('Password updated successfully for user:', userId);
      toast.success('Password updated successfully');
      setCurrentPassword("");
      setNewPassword("");
      setAdminPassword("");
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password: ' + error.message);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Sidebar isOpen={isSidebarOpen} activePage="Userdatabase" />
        <MainWrapper $isSidebarOpen={isSidebarOpen}>
          <LoadingState>Loading user data...</LoadingState>
        </MainWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar isOpen={isSidebarOpen} activePage="Userdatabase" />
      <MainWrapper $isSidebarOpen={isSidebarOpen}>
        <ContentContainer>
          <Header>
            <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </MenuButton>
            <Title>USER MANAGEMENT</Title>
          </Header>

          <PanelsContainer>
            <Panel>
              <PanelTitle>Staff Management</PanelTitle>
              {staffUsers.length === 0 ? (
                <EmptyState>No staff users found</EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>Username</Th>
                      <Th>Role</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffUsers.map((user) => (
                      <tr key={user.id}>
                        <Td>{user.username}</Td>
                        <Td>{user.role || 'Front Desk'}</Td>
                        <Td>
                          <Button onClick={() => setSelectedUser(user)}>
                            Change Password
                          </Button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Panel>

            <Panel>
              <PanelTitle>Doctor Management</PanelTitle>
              {doctorUsers.length === 0 ? (
                <EmptyState>No doctor users found</EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>Username</Th>
                      <Th>Role</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorUsers.map((doctor) => (
                      <tr key={doctor.id}>
                        <Td>{doctor.username}</Td>
                        <Td>{doctor.role}</Td>
                        <Td>
                          <Button onClick={() => setSelectedUser(doctor)}>
                            Change Password
                          </Button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Panel>
          </PanelsContainer>

          {selectedUser && (
            <PasswordSection>
              <PanelTitle>Change Password for {selectedUser.username}</PanelTitle>
              <InputGroup>
                <label>Admin Password</label>
                <input 
                  type="password" 
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <label>Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </InputGroup>
              <Button onClick={() => handlePasswordChange(selectedUser.id)}>
                Update Password
              </Button>
              <Button 
                onClick={() => {
                  setSelectedUser(null);
                  setCurrentPassword("");
                  setNewPassword("");
                  setAdminPassword("");
                }}
                style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
              >
                Cancel
              </Button>
            </PasswordSection>
          )}
        </ContentContainer>
      </MainWrapper>
    </PageContainer>
  );
}
