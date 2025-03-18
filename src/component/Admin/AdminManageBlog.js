import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Table } from "react-bootstrap";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "./AdminStyle/ManageBlog.css";

function AdminManageBlog() {
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/blog")
      .then((response) => {
        setBlogList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching blog list:", error);
      });
  }, []);

  const updateStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    const blogToUpdate = blogList.find((blog) => blog.id === id);
    if (!blogToUpdate) return;

    const updatedBlog = { ...blogToUpdate, status: newStatus };

    axios.put(`http://localhost:9999/blog/${id}`, updatedBlog, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const updatedBlogFromServer = response.data;
        setBlogList((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === id ? updatedBlogFromServer : blog
          )
        );
      })
      .catch((error) => {
        console.error("Error updating blog status:", error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      axios.delete(`http://localhost:9999/blog/${id}`)
        .then(() => {
          setBlogList((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting blog:", error);
        });
    }
  };

  return (
    <Container>
      <h2>Blog List</h2>
      <Button variant="primary" href="/manage/add-blog">Add New</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {blogList.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{format(new Date(blog.dateCreate), 'yyyy-MM-dd')}</td>
              <td>
                <img
                  className="blog-image2"
                  src={process.env.PUBLIC_URL + `/assets/images/blog/${blog.image}`}
                  alt={blog.title}
                  width="100"
                />
              </td>
              <td>
                <Button
                  variant={blog.status ? "success" : "danger"}
                  onClick={() => updateStatus(blog.id, blog.status)}
                >
                  {blog.status ? "Active" : "Inactive"}
                </Button>
              </td>
              <td>
                <Link to={`/manage/blog/edit/${blog.id}`} className="btn btn-info" style={{ color: 'white' }}>Edit</Link>{' '}
                <Button variant="danger" onClick={() => handleDelete(blog.id)} style={{ color: 'white' }}>Delete</Button>{' '}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminManageBlog;
