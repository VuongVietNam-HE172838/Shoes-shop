import React from 'react';

const Footer = () => {
    return (
      <footer className="footer" style={{backgroundColor:'black'}}>
        <div className="footer-container">

          <div className="footer-column">
            </div>

          <div className="footer-column">
            <h2 className="footer-title" style={{color:'white'}}>2ndHandNike</h2>
            <form className="footer-form">
              <input type="email" placeholder="Enter Your Email*" style={{marginRight:'10px'}} required />
              <button type="submit">Subscribe</button>
            </form>
            <p className="footer-text">Get monthly updates and free resources.</p>
          </div>

          <div className="footer-column">
            </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;