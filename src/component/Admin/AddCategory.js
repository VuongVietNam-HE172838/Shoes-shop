// src/pages/AddCategory.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCategory = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCategory = {
      cateid: Date.now(),
      name,
    };

    try {
      const response = await axios.post('http://localhost:9999/categories', newCategory, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201 || response.status === 200) {
        toast.success("Category added successfully!");
        setName('');
      } else {
        toast.error("Failed to add category!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add category!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Add Category</button>
        <Link to="/manage/categories" className="btn btn-secondary ml-2">Cancel</Link>
      </form>
    </div>
  );
};

export default AddCategory;
