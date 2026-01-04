import React from 'react'
import '../styles/blocked.css'

const Welcome = () => {
  const companyName = "Afro Auto Car"
  const companySlogan = "Premium Car Accessories & High-Performance Auto Parts"

  return (
    <div className="blocked-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <a href="#" className="logo">
              <i className="fas fa-car"></i> {companyName}
            </a>
            <nav>
              <ul className="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#brake-calipers">Brake Calipers</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{companyName}</h1>
            <p>Premium Car Accessories & High-Performance Auto Parts for Automotive Enthusiasts Worldwide</p>
            <div className="hero-buttons">
              <a href="#services" className="btn btn-primary">Explore Our Services</a>
              <a href="#contact" className="btn btn-secondary">Get Free Quote</a>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">Premium Automotive Services & Car Accessories</h2>
          <p className="section-subtitle">Professional automotive services and premium car accessories for enhanced vehicle performance and style</p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-car-steering-wheel"></i>
              </div>
              <h3>Premium Steering Wheels & Controls</h3>
              <p>High-quality leather, carbon fiber, and aluminum steering wheels designed for enhanced driving experience, improved grip, and superior comfort. Custom-fit options available for all vehicle models.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-fire"></i>
              </div>
              <h3>Performance Exhaust Systems & Headers</h3>
              <p>High-performance exhaust systems engineered for improved engine efficiency, increased horsepower, enhanced torque, and distinctive sound. Stainless steel construction with lifetime warranty.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-cog"></i>
              </div>
              <h3>Engine Covers & Performance Components</h3>
              <p>Custom engine covers, intake manifolds, and performance components for polished engine bay appearance, improved airflow, and enhanced engine protection. Precision-engineered for optimal fit.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Professional Installation & Maintenance</h3>
              <p>Expert installation services for all premium car accessories with certified technicians, comprehensive warranty coverage, and post-installation support. Mobile service available.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3>Fast Worldwide Shipping & Logistics</h3>
              <p>Express worldwide shipping with real-time tracking, insurance coverage, and customs handling. Free shipping on orders over $500. Same-day processing for in-stock items.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Customer Support & Technical Assistance</h3>
              <p>Round-the-clock expert support team providing technical assistance, product recommendations, installation guidance, and troubleshooting. Multi-language support available.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="brake-calipers" className="brake-calipers">
        <div className="container">
          <div className="brake-content">
            <div className="brake-image">
              <i className="fas fa-brake-system"></i>
            </div>
            <div className="brake-info">
              <h2>High-Performance Brake Calipers & Braking Systems</h2>
              <p>Upgrade your vehicle's braking system with our premium high-performance brake calipers. Engineered using aerospace-grade materials for superior stopping power, enhanced safety, exceptional durability, and improved heat dissipation. Our brake calipers are designed to withstand extreme conditions while providing consistent, reliable performance.</p>
              
              <ul className="brake-features">
                <li>Aerospace-grade materials for maximum durability and performance</li>
                <li>Superior stopping power with enhanced heat dissipation technology</li>
                <li>Universal compatibility with most vehicle models and makes</li>
                <li>Professional installation service with certified technicians</li>
                <li>Comprehensive 3-year warranty with lifetime support</li>
                <li>Custom color options and personalized branding available</li>
                <li>DOT and TÜV certified for safety and compliance</li>
                <li>Lightweight design for improved vehicle performance</li>
              </ul>
              
              <a href="#contact" className="btn btn-primary" style={{marginTop: '20px'}}>Request Brake Caliper Quote</a>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2 className="section-title">Customer Reviews & Testimonials</h2>
          <p className="section-subtitle">Real feedback from satisfied automotive enthusiasts and professionals worldwide</p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">"The brake calipers from Afro Auto Car completely transformed my car's stopping power. The installation was smooth, and the quality is exceptional. I can feel the difference in braking performance immediately. Highly recommended for anyone serious about vehicle safety and performance."</p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <h4>John Davis</h4>
                  <p>Professional Race Driver</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">"Fast shipping and excellent customer service. The performance exhaust system exceeded my expectations and improved my car's performance significantly. The sound is incredible, and the power gains are noticeable. Great value for money!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <h4>Sarah Martinez</h4>
                  <p>Car Enthusiast & Blogger</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">"Premium quality products at competitive prices. Their carbon fiber steering wheels are comfortable, look amazing, and provide excellent grip. The installation service was professional and the fit was perfect. Will definitely shop here again."</p>
              <div className="testimonial-author">
                <div className="author-avatar">MW</div>
                <div className="author-info">
                  <h4>Mike Wilson</h4>
                  <p>Certified Automotive Mechanic</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">"The engine covers are perfectly crafted and fit like a glove. The professional installation service was top-notch, and the attention to detail is impressive. My engine bay now looks like a work of art. Customer support was helpful throughout the process."</p>
              <div className="testimonial-author">
                <div className="author-avatar">AL</div>
                <div className="author-info">
                  <h4>Alex Lee</h4>
                  <p>Classic Car Collector</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Afro Auto Car Today</h3>
              <p>Ready to enhance your driving experience with premium car accessories? Contact our expert team today for personalized advice, custom quotes, and professional recommendations. We're here to help you find the perfect automotive upgrades for your vehicle.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>info@afroautocar.com</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>+1-555-AFRO-CAR (Toll Free)</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <span>24/7 Customer Support Available</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Worldwide Shipping & Service</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Free Shipping on Orders Over $500</span>
                </div>
              </div>
              
              <div className="social-links">
                <a href="https://www.facebook.com/afroautocar" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook"><i className="fab fa-facebook"></i></a>
                <a href="https://www.twitter.com/afroautocar" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter"><i className="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/afroautocar" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://www.linkedin.com/company/afroautocar" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn"><i className="fab fa-linkedin"></i></a>
                <a href="https://www.youtube.com/afroautocar" target="_blank" rel="noopener noreferrer" aria-label="Watch us on YouTube"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Request a Custom Quote</h3>
              <p>Fill out our comprehensive quote form and receive a personalized estimate for your automotive needs. Our experts will provide detailed recommendations based on your vehicle specifications and requirements.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>{companyName}</h4>
              <p>Premium car accessories and high-performance auto parts for automotive enthusiasts worldwide. Quality, performance, and customer satisfaction guaranteed. Leading provider of steering wheels, exhaust systems, brake calipers, and engine components.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Navigation</h4>
              <p><a href="#home">Home</a></p>
              <p><a href="#services">Automotive Services</a></p>
              <p><a href="#brake-calipers">Brake Calipers</a></p>
              <p><a href="#testimonials">Customer Reviews</a></p>
              <p><a href="#contact">Contact Support</a></p>
            </div>
            
            <div className="footer-section">
              <h4>Premium Products</h4>
              <p><a href="#steering-wheels">Steering Wheels</a></p>
              <p><a href="#exhaust-systems">Exhaust Systems</a></p>
              <p><a href="#engine-covers">Engine Covers</a></p>
              <p><a href="#brake-calipers">Brake Calipers</a></p>
              <p><a href="#installation">Professional Installation</a></p>
            </div>
            
            <div className="footer-section">
              <h4>Customer Support</h4>
              <p><a href="#warranty">Warranty Information</a></p>
              <p><a href="#shipping">Shipping & Returns</a></p>
              <p><a href="#returns">Return Policy</a></p>
              <p><a href="#faq">Frequently Asked Questions</a></p>
              <p><a href="#contact">Technical Support</a></p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved. | Premium Car Accessories & High-Performance Auto Parts | Professional Automotive Services Worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Welcome
