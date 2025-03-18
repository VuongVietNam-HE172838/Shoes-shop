import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Button } from "react-bootstrap";
import CartContext from "../CartContext";

function CustomNavbar({ user, setUser, setIsAuthenticated }) {
  const { totalCartItem, clearCart } = useContext(CartContext);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    await clearCart(); // Wait for clearCart to complete
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/"; // Redirect to home page after logout
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" >
      <Container>
        <Navbar.Brand as={Link} to="/" style={{fontSize:'32px'}}>
          2ndHandNike
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {user?.role === "ADMIN" ? (
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/blogs">
              Blogs
            </Nav.Link>

          </Nav>
          <Nav>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                  Hello, {user.username && user.name.firstname}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    View Profile
                  </Dropdown.Item>
                  {user?.role != "ADMIN" ? (
                    <Dropdown.Item as={Link} to="/order">
                      View Order
                    </Dropdown.Item>
                  ) : (
                    <></>
                  )}

                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button variant="outline-light" as={Link} to="/login">
                  <i className="fa fa-sign-in"></i> Login
                </Button>
                <Button
                  variant="outline-light"
                  as={Link}
                  to="/register"
                  className="ms-2"
                  style={{ marginRight: "10px" }}
                >
                  <i className="fa fa-user-plus"></i> Register
                </Button>
              </>
            )}
          </Nav>
          {user?.role !== "ADMIN" ? (
            <Button variant="outline-light" as={Link} to="/cart">
              <i className="fa fa-shopping-cart"></i> Cart({totalCartItem})
            </Button>
          ) : (
            <div></div>
          )}
          <Nav></Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
