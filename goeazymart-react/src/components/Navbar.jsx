import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Collapse } from 'bootstrap';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebase';
import logo from '../assets/logo.svg';
import { useCart } from '../context/CartContext';

const resolveItemPrice = (productName, variantStr, productsList) => {
  if (!productsList || productsList.length === 0) return null;

  const product = productsList.find(p =>
    p && p.name && p.name.trim().toLowerCase() === productName.trim().toLowerCase()
  );

  if (!product || !product.price) return null;

  let cleanVariant = variantStr ? variantStr.replace(/^\s*\(\s*|\s*\)\s*$/g, '').trim() : '';
  if (!cleanVariant) return null;

  const parts = cleanVariant.split(/\s*[-|]\s*/);
  const grades = Object.keys(product.price);

  let matchedGrade = null;
  let matchedQty = null;

  for (let part of parts) {
    const foundGrade = grades.find(g => g.trim().toLowerCase() === part.trim().toLowerCase());
    if (foundGrade) {
      matchedGrade = foundGrade;
      break;
    }
  }

  if (matchedGrade) {
    const sizes = Object.keys(product.price[matchedGrade]);
    for (let part of parts) {
      const foundSize = sizes.find(s => s.trim().toLowerCase() === part.trim().toLowerCase());
      if (foundSize) {
        matchedQty = foundSize;
        break;
      }
    }

    if (matchedQty) {
      return product.price[matchedGrade][matchedQty];
    }
  }

  for (let grade of grades) {
    const sizes = Object.keys(product.price[grade]);
    for (let size of sizes) {
      const gradeMatch = parts.some(p => p.trim().toLowerCase() === grade.trim().toLowerCase());
      const sizeMatch = parts.some(p => p.trim().toLowerCase() === size.trim().toLowerCase());
      if (gradeMatch && sizeMatch) {
        return product.price[grade][size];
      }
    }
  }

  return null;
};

const Navbar = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const collapseRef = useRef(null);
  const location = useLocation(); // current route
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '', profilePic: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user]);

  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productsList, setProductsList] = useState([]);

  const fetchProductsList = async () => {
    try {
      const snap = await get(ref(db, 'products'));
      if (snap.exists()) {
        const val = snap.val();
        setProductsList(Array.isArray(val) ? val : Object.values(val));
      }
    } catch (e) {
      console.error("Failed to fetch products list:", e);
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '', onConfirm: null });

  const handleCancelOrder = (orderId) => {
    setConfirmDialog({
      show: true,
      message: "Are you sure you want to cancel this order?",
      onConfirm: async () => {
        try {
          const snap = await get(ref(db, `orders/${orderId}`));
          const currentOrder = snap.exists() ? snap.val() : {};
          const prevStatus = currentOrder.status || 'pending';

          await update(ref(db, `orders/${orderId}`), {
            status: 'cancelled',
            cancelledFrom: prevStatus
          });
          alert("Order cancelled successfully! ❌");
          await fetchUserOrders();
          setSelectedOrder(prev => prev ? { ...prev, status: 'cancelled', cancelledFrom: prevStatus } : null);
        } catch (e) {
          console.error("Failed to cancel order:", e);
          alert("Failed to cancel order. Please try again.");
        }
      }
    });
  };

  const fetchUserOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const ordersRef = ref(db, 'orders');
      const snap = await get(ordersRef);
      if (snap.exists()) {
        const allOrders = Object.values(snap.val());
        const myOrders = allOrders.filter(o =>
          o && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()
        );
        myOrders.sort((a, b) => {
          const numA = parseInt(a.id?.replace('order-', ''), 10) || 0;
          const numB = parseInt(b.id?.replace('order-', ''), 10) || 0;
          return numB - numA;
        });
        setUserOrders(myOrders);
      } else {
        setUserOrders([]);
      }
    } catch (e) {
      console.error("Failed to fetch user orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    } else {
      setUserOrders([]);
    }
  }, [user]);

  useEffect(() => {
    if (showOrdersModal) {
      fetchUserOrders();
      fetchProductsList();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showOrdersModal, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Please choose an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          profilePic: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      let userKey = user.userKey;

      // Fallback for legacy users: resolve key by scanning database
      if (!userKey) {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          for (const key in usersData) {
            if (usersData[key] && usersData[key].email && usersData[key].email.toLowerCase() === user.email.toLowerCase()) {
              userKey = key;
              break;
            }
          }
        }
      }

      // Final fallback
      if (!userKey) {
        userKey = user.email.toLowerCase().replace(/\./g, '_');
      }

      const updatedUser = {
        ...user,
        userKey: userKey,
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        profilePic: editForm.profilePic
      };

      await set(ref(db, `users/${userKey}`), updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    setIsEditing(false);
    closeMenu();
    navigate('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    const collapseElement = collapseRef.current;

    if (!collapseElement) return;

    const bsCollapse = Collapse.getInstance(collapseElement);

    if (bsCollapse) {
      bsCollapse.hide();
    } else {
      collapseElement.classList.remove('show');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm">
        <style>{`
        /* Custom Responsive Profile Dropdown and Navbar Alignment */
        @media (max-width: 991px) {
          .navbar-nav {
            align-items: center !important;
            padding: 10px 0;
            gap: 10px;
          }
          
          .profile-dropdown-card {
            position: relative !important;
            top: 10px !important;
            right: auto !important;
            left: auto !important;
            transform: none !important;
            width: 100% !important;
            max-width: 290px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
            border: 1px solid rgba(200, 151, 43, 0.15) !important;
            margin: 0 auto !important;
          }
          
          .nav-item.position-relative {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
        }
      `}</style>
        <div className="container-fluid px-lg-5">

          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to={user?.isAdmin ? "/admin" : "/"} onClick={closeMenu}>
            <img
              src={logo}
              alt="Logo"
              style={{ height: '55px', objectFit: 'contain' }}
            />
            {user?.isAdmin && (
              <span
                style={{
                  marginLeft: '12px',
                  background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 10px rgba(212,160,23,0.25)'
                }}
              >
                Admin Workspace
              </span>
            )}
          </Link>

          {/* Cart Icon (Mobile) */}
          {!user?.isAdmin && (
            <div className="d-flex align-items-center d-lg-none ms-auto me-3">
              <Link className="nav-link position-relative" to="/cart" onClick={closeMenu}>
                <span style={{ fontSize: '1.4rem' }}>🛒</span>
                {getCartCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`navbar-toggler ${!isMenuOpen ? 'collapsed' : ''}`}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="navbarContent"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
            id="navbarContent"
            ref={collapseRef}
          >
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">


              {/* 👉 Show main customer links only when NOT on the Admin Panel page */}
              {location.pathname !== "/admin" && (
                <>
                  {/* 👉 Show Home only when NOT on home page */}
                  {location.pathname !== "/" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/" onClick={closeMenu}>
                        Home
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <Link className="nav-link" to="/products" onClick={closeMenu}>
                      Products
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/markets" onClick={closeMenu}>
                      Markets
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/process" onClick={closeMenu}>
                      How It Works
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/worldmap" onClick={closeMenu}>
                      Reach
                    </Link>
                  </li>

                  {!user?.isAdmin && (
                    <li className="nav-item d-none d-lg-block">
                      <Link className="nav-link position-relative" to="/cart" onClick={closeMenu}>
                        <span style={{ fontSize: '1.2rem' }}>🛒</span>
                        {getCartCount() > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                            {getCartCount()}
                          </span>
                        )}
                      </Link>
                    </li>
                  )}
                </>
              )}



              {user ? (
                <li className="nav-item position-relative" style={{ listStyle: 'none' }}>
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                      setIsEditing(false);
                    }}
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--gold)',
                      border: '2px solid var(--gold)',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: '0 4px 10px rgba(200, 151, 43, 0.25)',
                      transition: 'all 0.3s ease',
                      padding: '0',
                      overflow: 'hidden'
                    }}
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '18px' }}>
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>

                  {showDropdown && (
                    <div
                      className="profile-dropdown-card"
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '55px',
                        width: '320px',
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(200, 151, 43, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        zIndex: '1000'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 style={{ margin: 0, fontWeight: '700', color: 'var(--deep)', fontSize: '16px' }}>Profile Details</h5>
                        <button
                          onClick={() => setShowDropdown(false)}
                          style={{ border: 'none', background: 'none', fontSize: '18px', color: '#888', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>

                      {!isEditing ? (
                        <div>
                          {/* Profile Picture Display */}
                          <div className="text-center mb-3">
                            <div
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--gold)',
                                margin: '0 auto 10px',
                                border: '2px solid var(--gold)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {user.profilePic ? (
                                <img
                                  src={user.profilePic}
                                  alt="Profile"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '32px' }}>
                                  {(user.name || 'U').charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>
                            <strong style={{ color: '#555' }}>User ID:</strong> <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{user.userKey || 'N/A'}</span>
                          </div>
                          <div style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>
                            <strong style={{ color: '#555' }}>Name:</strong> <span style={{ color: '#222' }}>{user.name}</span>
                          </div>
                          <div style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>
                            <strong style={{ color: '#555' }}>Email:</strong> <span style={{ color: '#222' }}>{user.email}</span>
                          </div>
                          <div style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>
                            <strong style={{ color: '#555' }}>Phone:</strong> <span style={{ color: '#222' }}>{user.phone}</span>
                          </div>
                          <div style={{ fontSize: '14px', marginBottom: '15px', textAlign: 'left' }}>
                            <strong style={{ color: '#555' }}>Address:</strong> <span style={{ color: '#222' }}>{user.address || 'Not provided'}</span>
                          </div>

                          <button
                            onClick={() => {
                              setShowOrdersModal(true);
                              setShowDropdown(false);
                            }}
                            className="btn btn-warning btn-sm w-100 mb-3 py-2"
                            style={{
                              fontWeight: '700',
                              borderRadius: '6px',
                              fontSize: '13px',
                              background: 'var(--gold)',
                              border: 'none',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            📦 My Orders ({userOrders.length || 0})
                          </button>

                          <div className="d-flex gap-2">
                            <button
                              onClick={() => setIsEditing(true)}
                              className="btn btn-sm"
                              style={{
                                flex: 1,
                                border: '1px solid var(--gold)',
                                color: 'var(--gold)',
                                fontWeight: '600',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '13px'
                              }}
                            >
                              Edit Profile
                            </button>
                            <button
                              onClick={handleLogout}
                              className="btn btn-sm btn-outline-danger"
                              style={{
                                flex: 1,
                                fontWeight: '600',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '13px'
                              }}
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
                          {/* Profile Picture Uploader */}
                          <div className="text-center mb-3">
                            <div
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: '#eee',
                                margin: '0 auto 8px',
                                border: '2px dashed var(--gold)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}
                            >
                              {editForm.profilePic ? (
                                <img
                                  src={editForm.profilePic}
                                  alt="Uploading Preview"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <span style={{ color: '#888', fontSize: '24px' }}>📷</span>
                              )}
                            </div>
                            <label
                              className="btn btn-sm"
                              style={{
                                border: '1px solid #ccc',
                                fontSize: '11px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                backgroundColor: '#f8f9fa'
                              }}
                            >
                              Choose Photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>

                          <div className="form-group mb-2" style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              required
                              style={{ width: '100%', padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>
                          <div className="form-group mb-2" style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Phone</label>
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              required
                              style={{ width: '100%', padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>
                          <div className="form-group mb-3" style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Address</label>
                            <input
                              type="text"
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              required
                              style={{ width: '100%', padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              type="submit"
                              className="btn btn-sm btn-success"
                              style={{
                                flex: 1,
                                fontWeight: '600',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '13px'
                              }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="btn btn-sm btn-light"
                              style={{
                                flex: 1,
                                fontWeight: '600',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '13px',
                                border: '1px solid #ddd'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={closeMenu}>
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="btn ms-lg-2"
                      to="/signup"
                      onClick={closeMenu}
                      style={{
                        border: '1px solid var(--gold)',
                        color: 'var(--gold)',
                        fontWeight: '600',
                        borderRadius: '8px',
                        padding: '8px 18px'
                      }}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}

              {!user?.isAdmin && (
                <li className="nav-item">
                  <Link
                    className="btn ms-lg-3"
                    to="/contact"
                    onClick={closeMenu}
                    style={{
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                      color: 'var(--deep)',
                      fontWeight: '600',
                      borderRadius: '8px',
                      padding: '8px 18px'
                    }}
                  >
                    Get Quote
                  </Link>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>

      {/* 📦 MY ORDERS MODAL */}
      {showOrdersModal && (
        <div
          className="my-orders-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(15, 15, 15, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 11000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="my-orders-modal-content"
            style={{
              width: '100%',
              maxWidth: '650px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh',
              overflow: 'hidden',
              animation: 'modalZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #edf2f7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontWeight: '800', color: '#1a202c', fontSize: '20px' }}>📦 Order History</h4>
                <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '13px' }}>
                  Manage and view all your placed orders
                </p>
              </div>
              <button
                onClick={() => setShowOrdersModal(false)}
                style={{
                  border: 'none',
                  background: 'rgba(0,0,0,0.05)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#4a5568',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#f7fafc' }}>
              {loadingOrders ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Retrieving your orders...</p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</div>
                  <h5 style={{ fontWeight: '700', color: '#4a5568' }}>No Orders Found</h5>
                  <p className="text-muted small">You haven't placed any orders yet. Start adding items to your cart!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userOrders.map((order) => {
                    const statusLower = order.status?.toLowerCase() || 'pending';
                    const statusColor =
                      statusLower === 'delivered' ? '#48bb78' :
                        statusLower === 'processing' ? '#3182ce' :
                          statusLower === 'cancelled' ? '#e53e3e' :
                            '#dd6b20'; // pending
                    const statusBg =
                      statusLower === 'delivered' ? '#f0fff4' :
                        statusLower === 'processing' ? '#ebf8ff' :
                          statusLower === 'cancelled' ? '#fff5f5' :
                            '#fffaf0';

                    return (
                      <div
                        key={order.id}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          padding: '18px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                        }}
                      >
                        {/* Title Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#2d3748' }}>
                              {order.id?.toUpperCase()}
                            </span>
                            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#a0aec0', fontWeight: '500' }}>
                              {order.date}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              color: statusColor,
                              backgroundColor: statusBg
                            }}
                          >
                            ● {order.status || 'pending'}
                          </span>
                        </div>

                        {/* Items Section */}
                        <div style={{ marginBottom: '12px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid var(--gold)' }}>
                          <span style={{ fontSize: '13px', color: '#4a5568', fontWeight: '600', display: 'block', lineHeight: '1.4' }}>
                            {order.items}
                          </span>
                        </div>

                        {/* Bottom Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #edf2f7' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-outline-warning btn-sm"
                            style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              borderRadius: '6px',
                              padding: '4px 12px',
                              borderColor: 'var(--gold)',
                              color: 'var(--gold)'
                            }}
                          >
                            👁️ View Details
                          </button>
                          <strong style={{ fontSize: '15px', color: order.totalAmount > 0 ? '#b12704' : '#c8972b' }}>
                            {order.totalAmount > 0 ? `₹${parseFloat(order.totalAmount).toFixed(1)}` : 'Negotiable'}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 📋 SELECTED ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="order-details-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 12000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="order-details-modal-content"
            style={{
              width: '100%',
              maxWidth: '550px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh',
              overflow: 'hidden',
              animation: 'modalZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #edf2f7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontWeight: '800', color: '#1a202c', fontSize: '18px' }}>
                  📄 {selectedOrder.id?.toUpperCase()} Details
                </h4>
                <span style={{ fontSize: '12px', color: '#718096' }}>Placed on {selectedOrder.date}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  border: 'none',
                  background: 'rgba(0,0,0,0.05)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#4a5568',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Details Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

              {/* Status Display */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                {(() => {
                  const statusLower = selectedOrder.status?.toLowerCase() || 'pending';
                  const badgeColor =
                    statusLower === 'delivered' ? '#48bb78' :
                      statusLower === 'processing' ? '#3182ce' :
                        statusLower === 'cancelled' ? '#e53e3e' :
                          '#dd6b20'; // pending
                  const badgeBg =
                    statusLower === 'delivered' ? '#f0fff4' :
                      statusLower === 'processing' ? '#ebf8ff' :
                        statusLower === 'cancelled' ? '#fff5f5' :
                          '#fffaf0';
                  return (
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        color: badgeColor,
                        backgroundColor: badgeBg,
                        border: `1px solid ${badgeColor}22`
                      }}
                    >
                      ● {selectedOrder.status || 'pending'}
                    </span>
                  );
                })()}
              </div>


              {/* 📦 Ordered Items List */}
              <div style={{ marginBottom: '24px' }}>
                <h6 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📦 Ordered Products ({selectedOrder.itemsList?.length || selectedOrder.items?.split(', ').length || 1})
                </h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedOrder.itemsList ? (
                    selectedOrder.itemsList.map((item, idx) => {
                      const isNegotiable = !item.price || item.price === 0 || String(item.price).toLowerCase() === 'negotiable';
                      const itemPriceVal = isNegotiable ? 0 : parseFloat(item.price);
                      const itemSubtotal = isNegotiable ? 0 : itemPriceVal * item.quantity;

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            background: '#f8fafc',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div
                            style={{
                              width: '55px',
                              height: '55px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              backgroundColor: '#ffffff',
                              border: '1px solid #edf2f7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ fontSize: '22px' }}>📦</span>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '800', color: '#2d3748', lineHeight: '1.4' }}>
                              {item.name}
                            </h5>
                            <span style={{ fontSize: '11px', color: '#718096', fontWeight: '600', display: 'block' }}>
                              Qty: <span style={{ color: 'var(--gold)', fontWeight: '800' }}>{item.quantity}</span> | Size: {item.selectedSize} | Grade: {item.selectedGrade} {item.selectedPackaging ? `| Pack: ${item.selectedPackaging}` : ''}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: '12px', color: '#718096', display: 'block', fontWeight: '500' }}>
                              {isNegotiable ? '' : `₹${itemPriceVal.toFixed(1)} each`}
                            </span>
                            <strong style={{ fontSize: '14px', color: isNegotiable ? '#c8972b' : '#b12704', fontWeight: '800' }}>
                              {isNegotiable ? 'Negotiable' : `₹${itemSubtotal.toFixed(1)}`}
                            </strong>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback for pre-existing orders
                    selectedOrder.items?.split(', ').map((itemStr, idx) => {
                      const match = itemStr.match(/(.+) x (\d+)(.+)/) || [null, itemStr, '1', ''];
                      const name = match[1]?.trim() || itemStr;
                      const qtyVal = parseInt(match[2]?.trim() || '1', 10);
                      const variant = match[3]?.trim() || '';

                      const singlePrice = resolveItemPrice(name, variant, productsList);
                      const isNegotiable = !singlePrice || singlePrice === 0 || String(singlePrice).toLowerCase() === 'negotiable';
                      const itemPriceVal = isNegotiable ? 0 : parseFloat(singlePrice);
                      const itemSubtotal = isNegotiable ? 0 : itemPriceVal * qtyVal;

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            background: '#f8fafc',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div
                            style={{
                              width: '55px',
                              height: '55px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              backgroundColor: '#ffffff',
                              border: '1px solid #edf2f7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {idx === 0 && selectedOrder.image ? (
                              <img
                                src={selectedOrder.image}
                                alt="First Product"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ fontSize: '22px' }}>📦</span>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '800', color: '#2d3748', lineHeight: '1.4' }}>
                              {name}
                            </h5>
                            <span style={{ fontSize: '11px', color: '#718096', fontWeight: '600', display: 'block' }}>
                              Qty: <span style={{ color: 'var(--gold)', fontWeight: '800' }}>{qtyVal}</span> {variant ? `| Options: ${variant}` : ''}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: '12px', color: '#718096', display: 'block', fontWeight: '500' }}>
                              {isNegotiable ? '' : `₹${itemPriceVal.toFixed(1)} each`}
                            </span>
                            <strong style={{ fontSize: '14px', color: isNegotiable ? '#c8972b' : '#b12704', fontWeight: '800' }}>
                              {isNegotiable ? 'Negotiable' : `₹${itemSubtotal.toFixed(1)}`}
                            </strong>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Tracking Timeline */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid #edf2f7'
                }}
              >
                <h5 style={{ margin: '0 0 16px 0', fontWeight: '800', color: '#1e293b', fontSize: '15px' }}>
                  🚚 Track Your Order
                </h5>

                {(() => {
                  const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                  const currentStatusStr = selectedOrder.status?.toLowerCase() || 'pending';
                  const isCancelled = currentStatusStr === 'cancelled';
                  const cancelledFromStr = (selectedOrder.cancelledFrom || 'pending').toLowerCase();

                  const statusMapping = {
                    'pending': 0,
                    'confirmed': 1,
                    'shipped': 2,
                    'out for delivery': 3,
                    'delivered': 4
                  };

                  const activeStepIndex = isCancelled
                    ? (statusMapping[cancelledFromStr] !== undefined ? statusMapping[cancelledFromStr] : 0)
                    : (statusMapping[currentStatusStr] !== undefined ? statusMapping[currentStatusStr] : 0);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {steps.map((step, idx) => {
                        const isCancelledHere = isCancelled && idx === activeStepIndex;
                        const isCompleted = idx < activeStepIndex;
                        const isActive = idx === activeStepIndex;

                        return (
                          <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isCancelledHere
                                    ? '#fee2e2'
                                    : isCompleted || isActive
                                      ? 'linear-gradient(135deg,#d4a017,#b8860b)'
                                      : '#e2e8f0',
                                  border: isCancelledHere ? '2px solid #ef4444' : 'none',
                                  color: isCancelledHere
                                    ? '#ef4444'
                                    : isCompleted || isActive ? '#fff' : '#94a3b8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '800',
                                  fontSize: isCancelledHere ? '16px' : '12px',
                                  boxShadow: isActive
                                    ? isCancelledHere
                                      ? '0 0 0 4px rgba(239,68,68,0.18)'
                                      : '0 0 0 4px rgba(212,160,23,0.18)'
                                    : 'none',
                                  transition: '0.3s ease'
                                }}
                              >
                                {isCancelledHere ? '✗' : (isCompleted || isActive) ? '✓' : idx + 1}
                              </div>
                              {idx < steps.length - 1 && (
                                <div
                                  style={{
                                    width: '2px',
                                    height: '24px',
                                    background: idx < activeStepIndex
                                      ? 'linear-gradient(to bottom,#d4a017,#b8860b)'
                                      : '#e2e8f0'
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ paddingTop: '5px' }}>
                              <span
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  color: isCancelledHere
                                    ? '#ef4444'
                                    : isActive
                                      ? '#b8860b'
                                      : isCompleted
                                        ? '#2d3748'
                                        : '#94a3b8'
                                }}
                              >
                                {step} {isCancelledHere ? ' (Cancelled)' : ''}
                              </span>
                              
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>


              {/* Customer Details */}
              <div style={{ marginBottom: '20px' }}>
                <h6 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  👤 Delivery & Contact Info
                </h6>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#4a5568' }}><strong style={{ color: '#1a202c' }}>Name:</strong> {selectedOrder.customerName}</div>
                  <div style={{ fontSize: '13px', color: '#4a5568' }}><strong style={{ color: '#1a202c' }}>Phone:</strong> {selectedOrder.customerPhone}</div>
                  <div style={{ fontSize: '13px', color: '#4a5568' }}><strong style={{ color: '#1a202c' }}>Email:</strong> {selectedOrder.customerEmail}</div>
                  <div style={{ fontSize: '13px', color: '#4a5568', lineHeight: '1.4' }}><strong style={{ color: '#1a202c' }}>Address:</strong> {selectedOrder.customerAddress}</div>
                </div>
              </div>

              {/* Total Pricing Summary */}
              <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#4a5568' }}>Total Amount:</span>
                <strong style={{ fontSize: '18px', color: selectedOrder.totalAmount > 0 ? '#b12704' : '#c8972b' }}>
                  {selectedOrder.totalAmount > 0 ? `₹${parseFloat(selectedOrder.totalAmount).toFixed(1)}` : 'Negotiable'}
                </strong>
              </div>

            </div>

            {/* Action Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #edf2f7',
                display: 'flex',
                gap: '12px',
                background: '#f8fafc',
                justifyContent: 'flex-end'
              }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-outline-secondary btn-sm px-4"
                style={{ borderRadius: '6px', fontWeight: '600' }}
              >
                Close
              </button>
              {/* Only show Cancel button if status is NOT delivered and NOT cancelled */}
              {selectedOrder.status?.toLowerCase() !== 'delivered' && selectedOrder.status?.toLowerCase() !== 'cancelled' && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="btn btn-danger btn-sm px-4"
                  style={{ borderRadius: '6px', fontWeight: '700' }}
                >
                  ❌ Cancel Order
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Premium Confirm Dialog Modal */}
      {confirmDialog.show && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999999,
            animation: 'fadeIn 0.25s ease forwards'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '2.5px solid #d4a017',
              borderRadius: '24px',
              padding: '30px',
              width: '420px',
              maxWidth: '90%',
              boxShadow: '0 25px 60px rgba(212,160,23,0.3)',
              textAlign: 'center',
              animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
            }}
          >
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes scaleIn {
                from { transform: scale(0.92); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}</style>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(212,160,23,0.1)',
                color: '#d4a017',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 20px auto'
              }}
            >
              ❓
            </div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>
              Confirm Action
            </h4>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', fontWeight: '600', lineHeight: '1.5' }}>
              {confirmDialog.message}
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmDialog({ show: false, message: '', onConfirm: null })}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#475569',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  setConfirmDialog({ show: false, message: '', onConfirm: null });
                }}
                style={{
                  background: 'linear-gradient(135deg,#d4a017,#b8860b)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 18px rgba(212,160,23,0.3)',
                  transition: '0.2s'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;