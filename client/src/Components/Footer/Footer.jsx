import React from 'react' 
import { useAuth } from '../../Context/Auth'
const Footer = () => {
  const [auth, setAuth] = useAuth();
  return (
    <footer className="footer bg-dark text-light mt-5 p-3 ">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <section className="footer-section">
              <h3>About Us</h3>
              <p>An IT Job Board.</p>
            </section>
          </div>
          <div className="col-md-4">
            <section className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: contact@example.com</p>
              <p>Phone: (123) 456-7890</p>
            </section>
          </div>
          <div className="col-md-4">
            <section className="footer-section">
              <h3>Follow Us</h3>
              <p>Stay connected with us on social media.</p>
              {/* Add social media icons or links here */}
            </section>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <section className="footer-section">
              <p>&copy; {new Date().getFullYear()} Beezhive. All rights reserved.</p>
            </section>
          </div>
        </div>
      </div>
      
    </footer>
  )
}

export default Footer