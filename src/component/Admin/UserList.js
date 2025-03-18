import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Form, FormControl } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:9999/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:9999/users/${id}`)
      .then(response => {
        if (response.status === 200) {
          setUsers(users.filter(user => user.id !== id));
          toast.success('User deleted successfully!');
        } else {
          toast.error('Failed to delete user!');
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user!');
      });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>User List</h2>
      <Form className="mb-3">
        <FormControl
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Link to={`/manage/customer/view/${user.id}`} className="btn btn-warning mr-2" style={{ marginRight: '10px' }}>View</Link>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;
