// AdminPage.js
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Container, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { useCommonContext } from './CommonContext';

const AdminComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Make a GET request to the server
      const response = await fetch('http://localhost:3001/users');

      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response
      const responseJson = await response.json();
      const users = responseJson.filter((user) => user.selectedPersona !== 'Administrator');

      // Set the users state with the data from the server
      setUsers(users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStatusUpdate = async (userId) => {
    try {

      var newStatus = '';

      var user = users.find(user => user.id === userId);
      if(user["status"] === "active"){
        user["status"] = "inactive";
        newStatus = "inactive";
      }else{
        user["status"] = "active";
        newStatus = "active";
      }

      // Implement your updateUserStatus API call
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Update the local state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' , marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Users List
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.selectedPersona}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button sx={{
                      border: '1px solid', // You can customize the border style
                    }}
                    // variant="contained"
                    color={user.status === 'active' ? 'secondary' : 'primary'}
                    onClick={() =>
                      handleStatusUpdate(user.id)
                    }
                  >
                    {user.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const defaultTheme = createTheme();

const Admin = () =>{

  const { commonState} = useCommonContext();

  const memoizedGetIsLoggedIn = React.useCallback(() => {
    return commonState.isLoggedIn;
  }, [commonState.isLoggedIn]);

  React.useEffect(() => {
    memoizedGetIsLoggedIn();
  }, [commonState.isLoggedIn, memoizedGetIsLoggedIn]);

  return (

    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header isLoggedIn={memoizedGetIsLoggedIn} title={commonState.title} sections={commonState.sections} userName={commonState.userName}
        isSubscribed='Subscribe'/>
        <main>
          <AdminComponent/>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Uncover more content by navigating through our posts"
      />
    </ThemeProvider>
  );

}

export default Admin;
