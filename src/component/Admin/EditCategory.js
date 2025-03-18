// src/pages/EditCategory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:9999/categories/${id}`)
      .then(response => {
        setName(response.data.name);
      })
      .catch(error => {
        console.error('Error fetching category:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCategory = { name };

    axios.put(`http://localhost:9999/categories/${id}`, updatedCategory)
      .then(response => {
        if (response.status === 200) {
          toast.success("Category updated successfully!");
        } else {
          toast.error("Failed to update category!");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error("Failed to update category!");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Edit Category</h2>
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
        <button type="submit" className="btn btn-success">Update Category</button>
        <Link to="/manage/categories" className="btn btn-secondary ml-2">Cancel</Link>
      </form>
    </div>
  );
};

export default EditCategory;
