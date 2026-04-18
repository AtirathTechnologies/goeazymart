import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    country: '',
    product: 'Rice & Grains',
    qty: '',
    term: 'FOB',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('form', '').charAt(0).toLowerCase() + id.replace('form', '').slice(1);
    setFormData({ ...formData, [fieldName]: value });
    
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@domain.com)';
      }
    }
    
    // Company validation (optional but if provided, validate)
    if (formData.company.trim() && formData.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters if provided';
    }
    
    // Country validation (optional but if provided, validate)
    if (formData.country.trim() && formData.country.trim().length < 2) {
      newErrors.country = 'Please enter a valid country name';
    }
    
    // Quantity validation (optional)
    if (formData.qty.trim() && isNaN(formData.qty)) {
      newErrors.qty = 'Quantity must be a number';
    } else if (formData.qty.trim() && parseFloat(formData.qty) <= 0) {
      newErrors.qty = 'Quantity must be greater than 0';
    }
    
    // Message validation (optional)
    if (formData.message.trim() && formData.message.trim().length < 5) {
      newErrors.message = 'Message should be at least 5 characters if provided';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      setSubmitMessage({ 
        type: 'error', 
        text: 'Please fix the errors above before submitting.' 
      });
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 5000);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call (replace with actual API endpoint)
    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString()
      };
      
      console.log('Submitting inquiry:', submissionData);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      setSubmitMessage({ 
        type: 'success', 
        text: '✅ Inquiry submitted successfully! Our trade team will contact you within 24 hours.' 
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        company: '',
        email: '',
        country: '',
        product: 'Rice & Grains',
        qty: '',
        term: 'FOB',
        message: ''
      });
      
      setSubmitted(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
        setSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: '❌ Something went wrong. Please try again or contact us directly.' 
      });
      
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="contact-section py-5" id="contact" style={{ background: '#ffffff', color: '#111' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-tag d-inline-flex align-items-center justify-content-center mb-3" style={{
            background: 'rgba(200, 151, 43, 0.1)',
            borderRadius: '50px',
            padding: '5px 20px',
            color: 'var(--gold-light)'
          }}>Get In Touch</div>
          <h2 className="section-title" style={{ color: 'var(--black)' }}>Request a <span style={{ color: 'var(--gold)' }}>Quote</span></h2>
        </div>
        
        <div className="row g-5 align-items-start">
          {/* Left Column - Contact Info */}
          <div className="col-lg-6">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '20px', color: 'var(--gold-light)' }}>Let's Trade Together</h3>
            <p style={{ color: '#555', marginBottom: '30px' }}>Whether you're importing for the first time or scaling your existing supply chain, our team is ready to provide the best commodity pricing and logistics support.</p>
            
            <div className="d-flex align-items-start gap-3 mb-4">
              <div style={{ width: '40px', height: '40px', background: 'rgba(200, 151, 43, 0.12)', border: '1px solid rgba(200, 151, 43, 0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📧</div>
              <div>
                <strong style={{ display: 'block', color: 'var(--gold-light)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>Email</strong>
                <span style={{ color: '#555' }}>trade@goeasymart.com</span>
              </div>
            </div>
            
            <div className="d-flex align-items-start gap-3 mb-4">
              <div style={{ width: '40px', height: '40px', background: 'rgba(200, 151, 43, 0.12)', border: '1px solid rgba(200, 151, 43, 0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📞</div>
              <div>
                <strong style={{ display: 'block', color: 'var(--gold-light)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>WhatsApp / Phone</strong>
                <span style={{ color: '#555' }}>+91 98XXX XXXXX</span>
              </div>
            </div>
            
            <div className="d-flex align-items-start gap-3 mb-4">
              <div style={{ width: '40px', height: '40px', background: 'rgba(200, 151, 43, 0.12)', border: '1px solid rgba(200, 151, 43, 0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📍</div>
              <div>
                <strong style={{ display: 'block', color: 'var(--gold-light)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>Registered Office</strong>
                <span style={{ color: '#555' }}>India (Exporting Worldwide)</span>
              </div>
            </div>
            
            <div className="d-flex align-items-start gap-3 mb-4">
              <div style={{ width: '40px', height: '40px', background: 'rgba(200, 151, 43, 0.12)', border: '1px solid rgba(200, 151, 43, 0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🕐</div>
              <div>
                <strong style={{ display: 'block', color: 'var(--gold-light)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>Business Hours</strong>
                <span style={{ color: '#555' }}>Any Where & Any Time — 24/7</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Form */}
          <div className="col-lg-6">
            <div style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
            }}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Your Name *</label>
                  <input 
                    type="text" 
                    id="formName" 
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                    value={formData.name}
                    onChange={handleChange} 
                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px' }} 
                  />
                  {errors.name && <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>{errors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Company</label>
                  <input 
                    type="text" 
                    id="formCompany" 
                    className={`form-control ${errors.company ? 'is-invalid' : ''}`} 
                    value={formData.company}
                    onChange={handleChange} 
                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px' }} 
                  />
                  {errors.company && <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>{errors.company}</div>}
                </div>
              </div>
              
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Email *</label>
                  <input 
                    type="email" 
                    id="formEmail" 
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                    value={formData.email}
                    onChange={handleChange} 
                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px' }} 
                  />
                  {errors.email && <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>{errors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Country</label>
                  <input 
                    type="text" 
                    id="formCountry" 
                    className={`form-control ${errors.country ? 'is-invalid' : ''}`} 
                    value={formData.country}
                    onChange={handleChange} 
                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px' }} 
                  />
                  {errors.country && <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>{errors.country}</div>}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Product Required</label>
                <select 
                  id="formProduct" 
                  className="form-select" 
                  value={formData.product}
                  onChange={handleChange} 
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px' }}
                >
                  <option>Rice & Grains</option>
                  <option>Spices & Condiments</option>
                  <option>Seeds & Nuts</option>
                  <option>Oils & Dairy</option>
                  <option>Herbal Products</option>
                  <option>Construction Materials</option>
                  <option>Textiles</option>
                </select>
              </div>
              
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Quantity (MT)</label>
                  <input 
                    type="text" 
                    id="formQty" 
                    className={`form-control ${errors.qty ? 'is-invalid' : ''}`} 
                    value={formData.qty}
                    onChange={handleChange} 
                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px' }} 
                  />
                  {errors.qty && <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>{errors.qty}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Trade Term</label>
                  <select 
                    id="formTerm" 
                    className="form-select" 
                    value={formData.term}
                    onChange={handleChange} 
                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px' }}
                  >
                    <option>FOB</option>
                    <option>CIF</option>
                    <option>CFR</option>
                    <option>DDP</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', color: '#555' }}>Message</label>
                <textarea 
                  id="formMessage" 
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`} 
                  value={formData.message}
                  onChange={handleChange} 
                  placeholder="Describe your requirements, packaging preferences, port of loading/destination..." 
                  rows="3" 
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '13px 16px', fontSize: '14px', fontFamily: 'inherit' }}
                ></textarea>
                {errors.message && <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>{errors.message}</div>}
              </div>
              
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-100" 
                style={{ 
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', 
                  color: 'var(--deep)', 
                  fontWeight: 700, 
                  padding: '16px', 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                  transition: 'transform 0.2s ease',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Submitting...' : '📩 Submit Trade Inquiry'}
              </button>
              
              {submitMessage.text && (
                <div className={`text-center mt-3 p-3`} style={{ 
                  color: submitMessage.type === 'success' ? '#28a745' : '#dc3545', 
                  background: submitMessage.type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)', 
                  borderRadius: '10px',
                  fontSize: '14px'
                }}>
                  {submitMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .form-control:focus, .form-select:focus {
          border-color: var(--gold) !important;
          background: rgba(200, 151, 43, 0.06) !important;
          box-shadow: 0 0 0 0.2rem rgba(200, 151, 43, 0.25) !important;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(200, 151, 43, 0.3);
        }
        
        /* Responsive adjustments */
        @media (max-width: 992px) {
          .contact-section .row {
            gap: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          .contact-section [style*="padding: 40px"] {
            padding: 25px !important;
          }
          
          .section-title {
            font-size: 1.75rem !important;
          }
          
          h3[style*="font-family"] {
            font-size: 24px !important;
          }
        }
        
        @media (max-width: 576px) {
          .contact-section [style*="padding: 40px"] {
            padding: 20px !important;
          }
          
          .contact-section .d-flex {
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;