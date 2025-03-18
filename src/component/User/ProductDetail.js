import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import CartContext from "../CartContext";
import Comment from "./Comment";
import "./UserStyle/ProductDetail.css";

const ProductDetail = ({ user, isAuthenticated }) => {
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5 py-3 product-detail-container">
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center mx-auto product-image-container">
          <img 
            src={product.image.startsWith('http') ? product.image : `/assets/images/products/${product.image}`} 
            alt={product.title} 
            className="product-image" 
          />
        </div>
        <div className="col-md-6 d-flex flex-column product-info">
          <h1 className="display-5 fw-bold">{product.title}</h1>
          <hr />
          <h2 className="my-4" style={{textAlign:'left'}}>${product.price}</h2>
          <p className="lead">{product.description}</p>
          <button
            className="btn btn-outline-primary my-5"
            onClick={() => addToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
      <Comment productId={product.id} user={user} isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default ProductDetail;
