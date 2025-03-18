import React, { useState } from "react";
import axios from "axios";
import "./AdminStyle/AdminCreateBlog.css";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AdminCreateBlog() {
  const [previewImage, setPreviewImage] = useState("/img/posts/image_null.png");
  const [imageName, setImageName] = useState("");
  const [title, setUpdatedTitle] = useState("");
  const [data, setUpdatedData] = useState("");
  const [brief, setBrief] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl); // Save temporary URL of the image
      setImageName(selectedFile.name); // Save the name of the image
    }
  };

  const handleSaveDataClick = async (e) => {
    e.preventDefault();

    if (title === "" || data === "" || imageName === "") {
      alert("Enter all fields before submit");
      return;
    }

    const blogPost = {
      id: Date.now().toString(),
      title: title,
      data: data,
      brief: brief,
      image: imageName,
      dateCreate: new Date().toISOString(),
      status: true,
    };

    try {
      const response = await axios.post('http://localhost:9999/blog', blogPost, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert("Successfully created the blog post!");
        navigate("/dashboard");
      } else {
        throw new Error("Failed to create the blog post.");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  };

  return (
    <div className="create-post-container">
      <div className="row justify-content-center">
        <div className="col-md-6 title">
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-3"></div>
      </div>
      <div className="row content-container">
        <div className="col-md-9 data">
          <input
            type="text"
            placeholder="Enter brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            required
            className="form-control"
          />
          <ReactQuill
            theme="snow"
            value={data}
            onChange={setUpdatedData}
            placeholder="Write your blog content here..."
            required
            style={{ height: '500px' }}
          />
        </div>
        <div className="col-md-3 sidebar">
          <div className="preview-image">
            {previewImage === "/img/posts/image_null.png" ? (
              <div className="image-placeholder">Choose an image</div>
            ) : (
              <img
                src={previewImage}
                alt="Preview"
                className="create-post-image-preview"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="inputImage"
              required
            />
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageName}
              onChange={(e) => {
                if (e.target.value === "") {
                  setImageName("");
                  setPreviewImage("/img/posts/image_null.png");
                } else {
                  setPreviewImage(e.target.value);
                  setImageName(e.target.value);
                }
              }}
              className="inputImage"
            />
          </div>
          <div className="col-md-3">
            <button onClick={handleSaveDataClick} className="create-post-button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateBlog;
