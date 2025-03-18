import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Form, Button, FormControl } from "react-bootstrap";
import '../component/User/UserStyle/Product.css';

function Product() {
  const [listProduct, setListProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [cateID, setCateID] = useState(0);
  const [sortOption, setSortOption] = useState("best-sellers");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = cateID
          ? `http://localhost:9999/products/?category=${cateID}`
          : `http://localhost:9999/products`;

        const response = await axios.get(url);
        let searchResult = [];

        //filter cate
        if (cateID === 0) {
          searchResult = response.data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        } else {
          searchResult = response.data.filter(p => p.category === cateID && p.title.toLowerCase().includes(search.toLowerCase()));
        }

        searchResult = sortProducts(searchResult);
        setListProduct(searchResult);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [cateID, search, sortOption]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:9999/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCateID(Number(e.target.value));
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortProducts = (products) => {
    switch (sortOption) {
      case "low-high":
        return products.sort((a, b) => a.price - b.price);
      case "high-low":
        return products.sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };


  const cardItem = (item) => {
    return (
      <Col xs={12} sm={6} md={4} className="d-flex align-items-stretch" key={item.id}>
        <div className={`card my-3}`} style={{width: "100%"}}>
          <div className="position-relative card-image-wrapper">
            <NavLink to={`/products/${item.id}`}>
              <img
                src={item.image}
                className="card-img-top"
                alt={item.title}
                style={{height: "250px", objectFit: "contain"}}
              />
            </NavLink>
          </div>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-muted">{item.title}</h5>
            <p className="card-text text-muted" style={{fontSize: "20px"}}>{categories.find(c => c.cateid === item.category)?.name}</p>
            <p className="card-text text-muted fw-bold">${item.price}</p>
            <NavLink
              to={`/products/${item.id}`}
              className="btn btn-dark mt-auto"
            >
              Buy Now
            </NavLink>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <Container fluid className="py-5">
      <Row>
        <Col lg={3} className="mb-4">
          <div className="category-sidebar">
            <h5>Category</h5>
            <ul className="list-unstyled">
              <li className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="category"
                  id="category0"
                  value={0}
                  checked={cateID === 0}
                  onChange={handleCategoryChange}
                />
                <label className="form-check-label" htmlFor="category0">
                  All Categories
                </label>
              </li>
              {categories.map((category) => (
                <li className="form-check" key={category.cateid}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    id={`category${category.cateid}`}
                    value={category.cateid}
                    checked={cateID === category.cateid}
                    onChange={handleCategoryChange}
                  />
                  <label className="form-check-label" htmlFor={`category${category.cateid}`}>
                    {category.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col lg={9}>
          <div className="product-toolbar d-flex flex-wrap justify-content-between align-items-center mb-4">
            

            <div className="d-flex flex-wrap">
              <FormControl type="text" placeholder="Search" style={{width:'500px'}} value={search} onChange={handleSearchChange} />
            </div>

            <div className="sort-options d-flex flex-wrap">
              <label>Sort by:</label>
              <Form.Select value={sortOption} onChange={handleSortChange} className="me-2 mb-2 mb-md-0">
                <option value="best-sellers">Best Sellers</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </Form.Select>
            </div>
            
          </div>
          
          <Row className="product-grid">{listProduct.map(cardItem)}</Row>
          
        </Col>
      </Row>
    </Container>
  );
}

export default Product;
