import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9999/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl); // Save temporary URL for preview
      setImageName(selectedFile.name); // Save image name
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Find max ID
      const response = await axios.get('http://localhost:9999/products');
      const data = response.data;
      const maxId = Math.max(0, ...data.map(product => parseInt(product.id))) + 1;

      // Add new product
      const newProduct = {
        id: maxId.toString(),
        title,
        price: Number(price),
        description,
        category: Number(category),
        quantity: Number(quantity),
        image: imageName
      };

      const postResponse = await axios.post('http://localhost:9999/products', newProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (postResponse.status === 201 || postResponse.status === 200) {
        toast.success("Product added successfully!");
        // Reset form
        setTitle('');
        setPrice('');
        setDescription('');
        setCategory('');
        setQuantity('');
        setPreviewImage('/img/posts/image_null.png');
        setImageName('');
      } else {
        toast.error("Failed to add product!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add product!");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add New Product</h2>
      <Form onSubmit={handleSubmit} className="p-4 border rounded add-product-form">
        <Row>
          <Col md={6}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cate) => (
                  <option key={cate.cateid} value={cate.cateid}>
                    {cate.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formImage" className="text-center">
              <Form.Label>Image</Form.Label>
              <div className="preview-image">
                {previewImage === null || !imageName ? (
                  <div className="image-placeholder">Choose an image</div>
                ) : (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="create-post-image-preview"
                  />
                )}
                <br />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="inputImage"
                />
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={imageName}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setImageName("");
                      setPreviewImage(null);
                    } else {
                      setPreviewImage(e.target.value);
                      setImageName(e.target.value);
                    }
                  }}
                  className="inputImage"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="text-center">
          <Button variant="primary" type="submit" className="mr-2">
            Add Product
          </Button>
          <Link to="/manage/product" className="btn btn-secondary link-cancel">
            Cancel
          </Link>
        </div>
      </Form>
    </Container>
  );
};

export default AddProduct;
