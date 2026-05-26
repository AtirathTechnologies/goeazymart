import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ref, get, set, update } from 'firebase/database';
import { db, storage } from '../firebase';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// ==========================================
// 1. GLOBAL HELPER FUNCTIONS & CONSTANTS
// ==========================================

const resizeAndCropImage = (file, targetWidth = 600, targetHeight = 600) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          // Center-crop to fit target aspect ratio
          const targetRatio = targetWidth / targetHeight;
          const imgRatio = img.width / img.height;

          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = img.width;
          let sourceHeight = img.height;

          if (imgRatio > targetRatio) {
            // Image is wider than target aspect ratio
            sourceWidth = img.height * targetRatio;
            sourceX = (img.width - sourceWidth) / 2;
          } else if (imgRatio < targetRatio) {
            // Image is taller than target aspect ratio
            sourceHeight = img.width / targetRatio;
            sourceY = (img.height - sourceHeight) / 2;
          }

          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, targetWidth, targetHeight
          );

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        } catch (e) {
          console.error("Resize and crop failed:", e);
          resolve(event.target.result);
        }
      };
      img.onerror = () => resolve(event.target.result);
      img.src = event.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const PRODUCTS_INITIAL_FORM_STATE = {
  id: '',
  name: '',
  cat: 'rice',
  icon: '🌾',
  banner: '',
  description: '',
  variantsList: [],
  highlightsList: [],
  quantitiesList: [],
  prices: {},
  specificationsList: []
};

const CATEGORIES_INITIAL_FORM_STATE = {
  id: '',
  label: '',
  image: ''
};

const TRACKING_STEPS = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'shipped',
  'out for delivery',
  'delivered',
  'cancelled'
];

const getTrackingStep = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 0;
    case 'confirmed':
      return 1;
    case 'shipped':
      return 2;
    case 'out for delivery':
      return 3;
    case 'delivered':
      return 4;
    default:
      return 0;
  }
};

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

// --- Reusable SidebarContent for Desktop & Mobile ---
const SidebarContent = ({ activeTab, setActiveTab, closeMobileMenu }) => {
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (closeMobileMenu) closeMobileMenu();
  };

  return (
    <div style={{ padding: '20px 10px', flex: 1 }}>
      <button
        onClick={() => handleNavClick('dashboard')}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          borderRadius: '8px',
          background: activeTab === 'dashboard' ? 'rgba(200,151,43,0.15)' : 'none',
          color: activeTab === 'dashboard' ? '#c8972b' : '#a0aec0',
          textAlign: 'left',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px'
        }}
      >
        📊 Dashboard
      </button>
      <button
        onClick={() => handleNavClick('users')}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          borderRadius: '8px',
          background: activeTab === 'users' ? 'rgba(200,151,43,0.15)' : 'none',
          color: activeTab === 'users' ? '#c8972b' : '#a0aec0',
          textAlign: 'left',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px'
        }}
      >
        👥 Users
      </button>
      <button
        onClick={() => handleNavClick('products')}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          borderRadius: '8px',
          background: activeTab === 'products' ? 'rgba(200,151,43,0.15)' : 'none',
          color: activeTab === 'products' ? '#c8972b' : '#a0aec0',
          textAlign: 'left',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px'
        }}
      >
        📦 Products
      </button>
      <button
        onClick={() => handleNavClick('categories')}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          borderRadius: '8px',
          background: activeTab === 'categories' ? 'rgba(200,151,43,0.15)' : 'none',
          color: activeTab === 'categories' ? '#c8972b' : '#a0aec0',
          textAlign: 'left',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px'
        }}
      >
        📁 Categories
      </button>
      <button
        onClick={() => handleNavClick('orders')}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          borderRadius: '8px',
          background: activeTab === 'orders' ? 'rgba(200,151,43,0.15)' : 'none',
          color: activeTab === 'orders' ? '#c8972b' : '#a0aec0',
          textAlign: 'left',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px'
        }}
      >
        🛒 Orders
      </button>
    </div>
  );
};

// --- AdminSidebar Component (Desktop Only) ---
const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div 
      className="d-none d-md-flex flex-column"
      style={{
        width: '260px',
        background: '#1e222b',
        color: '#fff',
        boxShadow: '4px 0 15px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100
      }}
    >
      <div style={{
        padding: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{
          background: 'var(--gold, #c8972b)',
          color: '#fff',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>G</span>
        <div>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>Goeazymart</h4>
          <span style={{ fontSize: '11px', color: '#c8972b', fontWeight: '600' }}>ADMIN PORTAL</span>
        </div>
      </div>

      <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// --- AdminHeader Component ---
const AdminHeader = ({ activeTab, adminUser }) => {
  return (
    <div 
      className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
      style={{
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '20px'
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#1a202c' }}>
          {activeTab === 'dashboard' && "Admin Dashboard"}
          {activeTab === 'users' && "Users Management"}
          {activeTab === 'products' && "Products Catalog"}
          {activeTab === 'categories' && "Categories Catalog"}
          {activeTab === 'orders' && "Orders Fulfillment"}
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
          Welcome back, <strong style={{ color: '#c8972b' }}>{adminUser?.name || 'System Admin'}</strong>
        </p>
      </div>

      <div className="ms-sm-auto d-flex align-items-center gap-15">
        <span style={{ fontSize: '13px', background: '#edf2f7', padding: '6px 12px', borderRadius: '20px', color: '#4a5568', fontWeight: '500' }}>
          📅 Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

// --- DashboardTab Component ---
const DashboardTab = ({ usersList, productsList, ordersList, categoriesList, setActiveTab }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const statusCounts = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    'out for delivery': 0,
    delivered: 0,
    cancelled: 0
  };

  ordersList.forEach(o => {
    if (!o) return;
    const status = String(o.status || 'pending').toLowerCase();
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    } else {
      statusCounts.pending++;
    }
  });

  const totalOrders = Object.values(statusCounts).reduce((sum, count) => sum + count, 0) ;

  const statusColors = {
    pending: '#f59e0b',
    confirmed: '#d97706',
    shipped: '#3b82f6',
    'out for delivery': '#d4a017',
    delivered: '#10b981',
    cancelled: '#ef4444'
  };

  let accumulatedPercent = 0;
  const donutSegments = Object.entries(statusCounts).map(([status, count]) => {
    const percent = count / totalOrders;
    const strokeLength = percent * 314.16;
    const strokeOffset = 314.16 - strokeLength + accumulatedPercent * 314.16;
    accumulatedPercent += percent;

    return {
      status,
      count,
      percent: (percent * 100).toFixed(1),
      strokeLength,
      strokeOffset,
      color: statusColors[status]
    };
  });

  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const salesData = dates.map(dateStr => {
    const dayOrders = ordersList.filter(o => o && String(o.createdAt || o.date || '').startsWith(dateStr));
    const revenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const count = dayOrders.length;
    const parsedDate = new Date(dateStr);
    const label = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, label, revenue, count };
  });

  const maxRevenue = Math.max(...salesData.map(d => d.revenue), 1000) * 1.15;

  const points = salesData.map((d, i) => {
    const x = i * (420 / 6) + 40;
    const y = 170 - (d.revenue / maxRevenue) * 130;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* 4 Stats Cards Grid */}
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            onClick={() => setActiveTab('users')}
            style={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: '#fff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(42,82,152,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(42,82,152,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(42,82,152,0.15)';
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase' }}>Total Users</span>
            <h3 style={{ margin: '8px 0', fontSize: '32px', fontWeight: '800' }}>{usersList.length}</h3>
            <span style={{ fontSize: '12px' }}>👥 Active customer records</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            onClick={() => setActiveTab('products')}
            style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: '#fff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(56,239,125,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(56,239,125,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(56,239,125,0.15)';
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase' }}>Total Products</span>
            <h3 style={{ margin: '8px 0', fontSize: '32px', fontWeight: '800' }}>{productsList.length}</h3>
            <span style={{ fontSize: '12px' }}>📦 Live items in catalog</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            onClick={() => setActiveTab('categories')}
            style={{
              background: 'linear-gradient(135deg, #8a2387 0%, #e94057 100%, #f27121 100%)',
              color: '#fff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(233,64,87,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(233,64,87,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(233,64,87,0.15)';
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase' }}>Total Categories</span>
            <h3 style={{ margin: '8px 0', fontSize: '32px', fontWeight: '800' }}>{categoriesList.length}</h3>
            <span style={{ fontSize: '12px' }}>📁 Active product categories</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            onClick={() => setActiveTab('orders')}
            style={{
              background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
              color: '#fff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(245,175,25,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(245,175,25,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(245,175,25,0.15)';
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase' }}>Total Orders</span>
            <h3 style={{ margin: '8px 0', fontSize: '32px', fontWeight: '800' }}>{ordersList.length}</h3>
            <span style={{ fontSize: '12px' }}>🛒 Placed customer orders</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart and Donut Share */}
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>📈 Sales & Revenue Analytics</h4>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Daily order revenue trend for the last 7 days</span>
              </div>
              <div style={{ background: 'rgba(212,160,23,0.1)', color: '#b8860b', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px' }}>
                Realtime Sync
              </div>
            </div>

            <div style={{ position: 'relative', height: '200px' }}>
              <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a017" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#d4a017" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#d4a017" floodOpacity="0.25" />
                  </filter>
                </defs>

                <line x1="30" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="105" x2="480" y2="105" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

                {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}
                {linePath && <path d={linePath} fill="none" stroke="#d4a017" strokeWidth="3" filter="url(#shadow)" />}

                {points.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPoint?.dateStr === p.dateStr ? 7 : 4}
                      fill={hoveredPoint?.dateStr === p.dateStr ? '#b8860b' : '#ffffff'}
                      stroke="#d4a017"
                      strokeWidth="3"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}

                {points.map((p, i) => (
                  <text
                    key={i}
                    x={p.x}
                    y="190"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {p.label}
                  </text>
                ))}
              </svg>

              {hoveredPoint && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(hoveredPoint.x / 500) * 100}%`,
                    top: `${(hoveredPoint.y / 200) * 100 - 65}%`,
                    transform: 'translateX(-50%)',
                    background: '#ffffff',
                    border: '1.5px solid #d4a017',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 8px 24px rgba(212,160,23,0.2)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '2px' }}>
                    {hoveredPoint.label}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
                    ₹{hoveredPoint.revenue.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '10px', color: '#b8860b', fontWeight: '700' }}>
                    🛒 {hoveredPoint.count} Order(s)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>📊 Order Status Share</h4>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'block', marginBottom: '20px' }}>Percentage share of all placed orders</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                <svg width="130" height="130" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                  {donutSegments.map((seg, i) => (
                    <circle
                      key={i}
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={hoveredSlice === seg.status ? 17 : 14}
                      strokeDasharray={`${seg.strokeLength} 314.16`}
                      strokeDashoffset={seg.strokeOffset}
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'all 0.25s ease', cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredSlice(seg.status)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  ))}
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Orders</span>
                  <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>{totalOrders}</h4>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                {donutSegments.filter(seg => seg.count > 0).map((seg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      background: hoveredSlice === seg.status ? '#f8fafc' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={() => setHoveredSlice(seg.status)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: seg.color }} />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'capitalize' }}>
                        {seg.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>
                      {seg.percent}% ({seg.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & Recent Users */}
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', height: '100%' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>Recent Orders</h4>
            
            {/* Desktop View Table (visible on md screens and up) */}
            <div className="d-none d-md-block table-responsive">
              <table className="table align-middle" style={{ margin: 0 }}>
                <thead>
                  <tr style={{ color: '#718096', fontSize: '13px' }}>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px' }}>
                  {ordersList.slice(0, 5).map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: '600', color: '#c8972b' }}>{o.id}</td>
                      <td>{o.customerName}</td>
                      <td>{o.items}</td>
                      <td style={{ fontWeight: '600' }}>₹{o.totalAmount}</td>
                      <td>
                        <span className={`badge bg-${o.status === 'Completed' ? 'success' : o.status === 'Shipped' ? 'info' : 'warning'}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Stacked Cards (visible on mobile viewports under md, NO SCROLLING, everything fits perfectly) */}
            <div className="d-block d-md-none" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ordersList.slice(0, 5).map(o => (
                <div 
                  key={o.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #edf2f7',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#c8972b', fontSize: '14px' }}>{o.id}</span>
                    <span className={`badge bg-${o.status === 'Completed' ? 'success' : o.status === 'Shipped' ? 'info' : 'warning'}`} style={{ fontSize: '11px' }}>
                      {o.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4a5568' }}>
                    <span>👤 <strong>{o.customerName}</strong></span>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>₹{o.totalAmount}</span>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#718096', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                    📦 Items: {o.items}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', height: '100%' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>Recent Users</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {usersList.slice(0, 4).map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#edf2f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#4a5568'
                  }}>
                    {(u.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2d3748' }}>{u.name}</h5>
                    <span style={{ fontSize: '12px', color: '#718096', display: 'block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                  </div>
                  <span style={{ fontSize: '11px', background: 'rgba(200,151,43,0.1)', color: '#c8972b', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                    {u.userKey ? (u.userKey.length > 8 ? `${u.userKey.slice(0, 6)}..` : u.userKey) : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- UsersTab Component ---
const UsersTab = ({ usersList }) => {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>Registered Customer Database</h4>
        <span style={{ fontSize: '12px', background: 'rgba(200,151,43,0.1)', color: '#c8972b', padding: '4px 12px', borderRadius: '20px', fontWeight: '700' }}>
          {usersList.length} Users
        </span>
      </div>

      {/* Desktop Table (md and above) */}
      <div className="d-none d-md-block table-responsive">
        <table className="table align-middle" style={{ margin: 0 }}>
          <thead>
            <tr style={{ color: '#718096', fontSize: '13px' }}>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Registered Address</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {usersList.map((u, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '700', color: '#c8972b' }}>{u.userKey || 'N/A'}</td>
                <td style={{ fontWeight: '600' }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td style={{ color: '#4a5568', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {u.address || 'Not Provided'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (below md) */}
      <div className="d-block d-md-none" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {usersList.map((u, index) => (
          <div
            key={index}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #edf2f7',
              background: '#f8fafc'
            }}
          >
            {/* Avatar + Name Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c8972b, #f5af19)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: '#fff',
                fontSize: '17px',
                flexShrink: 0
              }}>
                {(u.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '700', color: '#1a202c', fontSize: '15px' }}>{u.name || 'N/A'}</div>
                <div style={{ fontSize: '11px', color: '#c8972b', fontWeight: '600' }}>{u.userKey || 'N/A'}</div>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#fff', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>Email</div>
                <div style={{ fontSize: '12px', color: '#2d3748', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email || '—'}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>Phone</div>
                <div style={{ fontSize: '12px', color: '#2d3748', fontWeight: '500' }}>{u.phone || '—'}</div>
              </div>
            </div>

            {/* Address */}
            <div style={{ marginTop: '8px', background: '#fff', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>📍 Address</div>
              <div style={{ fontSize: '12px', color: '#4a5568' }}>{u.address || 'Not Provided'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- ProductsTab Component ---
const ProductsTab = ({ productsList, categoriesList = [], onDeleteProduct, onAddProduct, onUpdateProduct }) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState(PRODUCTS_INITIAL_FORM_STATE);
  const [editingProduct, setEditingProduct] = useState(null);

  const getCategoryLabel = (catId) => {
    if (!categoriesList || !Array.isArray(categoriesList)) return catId || 'N/A';
    const found = categoriesList.find(c => c.id === catId);
    return found ? found.label : (catId || 'N/A');
  };

  const getCategoryPhoto = (catId) => {
    if (!categoriesList || !Array.isArray(categoriesList)) return '/categories/rice.jpg';
    const found = categoriesList.find(c => c.id === catId);
    return found && found.image ? found.image : '/categories/rice.jpg';
  };
  const [selectedGradesProduct, setSelectedGradesProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);

  const handleImageUpload = async (e, type = 'banner', index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'banner') {
      setUploading(true);
    } else {
      setUploadingVariantIndex(index);
    }

    try {
      const targetW = type === 'banner' ? 800 : 500;
      const targetH = type === 'banner' ? 400 : 500;
      const processedBase64 = await resizeAndCropImage(file, targetW, targetH);
      const processedBlob = dataURLToBlob(processedBase64);

      try {
        const fileRef = sRef(storage, `products/${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}.jpg`);
        const uploadPromise = uploadBytes(fileRef, processedBlob).then(async (snapshot) => {
          return await getDownloadURL(snapshot.ref);
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Storage Timeout")), 1500)
        );

        const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);

        if (type === 'banner') {
          setProductForm({ ...productForm, banner: downloadURL });
          alert('Product banner uploaded successfully to Storage (resized & optimized)!');
        } else {
          const newList = [...productForm.variantsList];
          newList[index].image = downloadURL;
          setProductForm({ ...productForm, variantsList: newList });
          alert('Variant image uploaded successfully to Storage (resized & optimized)!');
        }
      } catch (storageError) {
        console.warn("Storage upload failed or timed out, falling back to local compressed Base64:", storageError);
        if (type === 'banner') {
          setProductForm({ ...productForm, banner: processedBase64 });
          alert('Product banner compressed, resized & saved locally!');
        } else {
          const newList = [...productForm.variantsList];
          newList[index].image = processedBase64;
          setProductForm({ ...productForm, variantsList: newList });
          alert('Variant image compressed, resized & saved locally!');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process image: ' + err.message);
    } finally {
      setUploading(false);
      setUploadingVariantIndex(null);
    }
  };

  const getPriceSummary = (priceObj) => {
    if (!priceObj || typeof priceObj !== 'object') return 'N/A';
    if (typeof priceObj === 'number') return `₹${priceObj}`;
    try {
      const firstGradeKey = Object.keys(priceObj)[0];
      const firstGradeObj = priceObj[firstGradeKey];
      if (typeof firstGradeObj === 'object' && firstGradeObj !== null) {
        const firstSizeKey = Object.keys(firstGradeObj)[0];
        const priceVal = firstGradeObj[firstSizeKey];
        return `₹${priceVal} (${firstGradeKey} - ${firstSizeKey})`;
      } else if (typeof firstGradeObj === 'number') {
        return `₹${firstGradeObj} (${firstGradeKey})`;
      }
    } catch (e) {
      return 'N/A';
    }
    return 'N/A';
  };

  const getPriceRange = (priceObj) => {
    if (priceObj === undefined || priceObj === null) return 'N/A';
    if (typeof priceObj === 'number') return `₹${priceObj}`;
    if (typeof priceObj === 'string') {
      const num = parseFloat(priceObj);
      return isNaN(num) ? priceObj : `₹${num}`;
    }

    const prices = [];
    const collectPrices = (obj) => {
      if (typeof obj === 'number') {
        prices.push(obj);
        return;
      }
      if (typeof obj === 'string') {
        const num = parseFloat(obj);
        if (!isNaN(num)) {
          prices.push(num);
        }
        return;
      }
      if (obj && typeof obj === 'object') {
        Object.values(obj).forEach(val => collectPrices(val));
      }
    };

    collectPrices(priceObj);

    if (prices.length === 0) return 'N/A';
    if (prices.length === 1) return `₹${prices[0]}`;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `₹${minPrice}`;
    }

    return `₹${minPrice} - ₹${maxPrice}`;
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setProductForm(PRODUCTS_INITIAL_FORM_STATE);
    setShowProductModal(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);

    let parsedVariants = [];
    if (product.variants && Array.isArray(product.variants)) {
      parsedVariants = product.variants.map((v, index) => {
        let matchedImage = '';
        if (typeof v === 'object') {
          matchedImage = v.image || '';
        } else {
          matchedImage = v || '';
        }
        if (!matchedImage && product.images && Array.isArray(product.images)) {
          matchedImage = product.images[index] || '';
        }
        return { name: typeof v === 'object' ? v.name || '' : v, image: matchedImage };
      });
    } else if (product.grades && Array.isArray(product.grades)) {
      parsedVariants = product.grades.map((g, index) => ({
        name: g,
        image: (product.images && Array.isArray(product.images) && product.images[index]) || ''
      }));
    }

    let parsedHighlights = [];
    if (product.highlights) {
      parsedHighlights = Array.isArray(product.highlights) ? [...product.highlights] : product.highlights.split(',').map(h => h.trim()).filter(Boolean);
    }

    let parsedQuantities = [];
    if (product.quantities) {
      parsedQuantities = Array.isArray(product.quantities) ? [...product.quantities] : product.quantities.split(',').map(q => q.trim()).filter(Boolean);
    } else {
      const qtySet = new Set();
      if (product.price && typeof product.price === 'object') {
        Object.values(product.price).forEach(val => {
          if (val && typeof val === 'object') {
            Object.keys(val).forEach(q => qtySet.add(q));
          }
        });
      }
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(v => {
          if (v.options && Array.isArray(v.options)) {
            v.options.forEach(opt => {
              if (opt.size) qtySet.add(opt.size);
            });
          }
        });
      }
      parsedQuantities = Array.from(qtySet);
      if (parsedQuantities.length === 0) {
        parsedQuantities = ['160g'];
      }
    }

    let parsedSpecs = [];
    if (product.specifications && typeof product.specifications === 'object') {
      parsedSpecs = Object.entries(product.specifications).map(([key, value]) => ({
        key: key,
        value: value || ''
      }));
    } else {
      parsedSpecs = [
        { key: 'Origin', value: 'India' },
        { key: 'Packaging', value: 'Standard Bags' },
        { key: 'ShelfLife', value: '12 Months' }
      ];
    }

    setProductForm({
      id: product.id || '',
      name: product.name || '',
      cat: product.cat || 'rice',
      icon: product.icon || '🌾',
      banner: product.banner || '',
      description: product.description || '',
      variantsList: parsedVariants,
      highlightsList: parsedHighlights,
      quantitiesList: parsedQuantities,
      prices: product.price && typeof product.price === 'object' ? JSON.parse(JSON.stringify(product.price)) : {},
      specificationsList: parsedSpecs
    });
    setShowProductModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name) {
      alert('Please fill product name!');
      return;
    }

    const finalPriceObj = {};
    productForm.variantsList.forEach(v => {
      if (v.name) {
        const gradePrices = {};
        productForm.quantitiesList.forEach(q => {
          if (q && productForm.prices && productForm.prices[v.name] && productForm.prices[v.name][q] !== undefined && productForm.prices[v.name][q] !== '') {
            gradePrices[q] = Number(productForm.prices[v.name][q]);
          }
        });
        if (Object.keys(gradePrices).length > 0) {
          finalPriceObj[v.name] = gradePrices;
        }
      }
    });

    const generatedId = productForm.id || `prod_${Date.now()}`;
    const gradesArray = productForm.variantsList.map(v => v.name).filter(Boolean);

    const variantsArray = productForm.variantsList.filter(v => v.name).map(v => {
      const original = editingProduct && editingProduct.variants && Array.isArray(editingProduct.variants)
        ? editingProduct.variants.find(orig => orig.name === v.name)
        : null;

      const optionsArray = productForm.quantitiesList.filter(Boolean).map(q => {
        const originalOpt = original && original.options && Array.isArray(original.options)
          ? original.options.find(opt => opt.size === q)
          : null;

        return {
          size: q,
          packing: originalOpt && originalOpt.packing ? originalOpt.packing : ['Standard']
        };
      });

      return {
        name: v.name,
        image: v.image || `/images/${productForm.cat}/${v.name.toLowerCase().replace(/\s+/g, '_')}.png`,
        images: original && original.images ? original.images : [v.image].filter(Boolean),
        shelfLife: original && original.shelfLife ? original.shelfLife : (productForm.shelfLife || '3 Years'),
        options: optionsArray
      };
    });

    const finalImagesArray = variantsArray.map(v => v.image).filter(Boolean);

    const finalSpecsObj = {};
    productForm.specificationsList.forEach(item => {
      if (item.key && item.key.trim()) {
        finalSpecsObj[item.key.trim()] = item.value || '';
      }
    });

    const includeGrades = !editingProduct || (editingProduct.grades !== undefined);
    const includeVariants = !editingProduct || (editingProduct.variants !== undefined);

    const newProduct = {
      id: generatedId,
      name: productForm.name,
      cat: productForm.cat,
      icon: productForm.icon || '🌾',
      banner: productForm.banner || `/images/${productForm.cat}/${generatedId}_banner.png`,
      description: productForm.description || 'Premium grade agricultural export product.',
      ...(includeGrades ? { grades: gradesArray } : {}),
      images: finalImagesArray,
      ...(includeVariants ? { variants: variantsArray } : {}),
      highlights: productForm.highlightsList.filter(Boolean),
      ...(editingProduct && editingProduct.quantities ? { quantities: productForm.quantitiesList.filter(Boolean) } : {}),
      price: finalPriceObj,
      specifications: finalSpecsObj
    };

    let success = false;
    if (editingProduct) {
      if (onUpdateProduct) {
        success = await onUpdateProduct(newProduct);
      } else {
        success = await onAddProduct(newProduct);
      }
    } else {
      success = await onAddProduct(newProduct);
    }

    if (success) {
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm(PRODUCTS_INITIAL_FORM_STATE);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: '#718096' }}>Total Products: <strong>{productsList.length}</strong></span>
        <button
          onClick={handleAddNewClick}
          style={{
            background: '#c8972b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          ➕ Add New Product
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>

        {/* Desktop Table (md and above) */}
        <div className="d-none d-md-block table-responsive">
          <table className="table align-middle" style={{ margin: 0 }}>
            <thead>
              <tr style={{ color: '#718096', fontSize: '13px' }}>
                <th>Product ID</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Grades / Variants Details</th>
                <th>Price Range</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {productsList.map((p, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600', color: '#718096' }}>{p.id}</td>
                  <td>
                    <img
                      src={(p.images && p.images[0]) || p.banner || getCategoryPhoto(p.cat || p.category)}
                      alt={p.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #edf2f7' }}
                    />
                  </td>
                  <td style={{ fontWeight: '700' }}>{p.name}</td>
                  <td>
                    <span style={{
                      background: '#edf2f7',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#4a5568',
                      textTransform: 'capitalize'
                    }}>
                      {getCategoryLabel(p.cat || p.category)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedGradesProduct(p)}
                      style={{
                        background: '#fef3c7',
                        border: '1px solid #fcd34d',
                        borderRadius: '6px',
                        color: '#b45309',
                        fontSize: '12px',
                        padding: '6px 12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#fde68a'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = '#fef3c7'; }}
                    >
                      📋 Show Grades
                    </button>
                  </td>
                  <td style={{ fontWeight: '700', color: '#c8972b' }}>{getPriceRange(p.price)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditClick(p)}
                        style={{
                          background: 'none',
                          border: '1px solid #c8972b',
                          borderRadius: '4px',
                          color: '#c8972b',
                          fontSize: '12px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        style={{
                          background: 'none',
                          border: '1px solid #e53e3e',
                          borderRadius: '4px',
                          color: '#e53e3e',
                          fontSize: '12px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Product Cards (below md) */}
        <div className="d-block d-md-none" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {productsList.map((p, index) => (
            <div
              key={index}
              style={{
                borderRadius: '14px',
                border: '1px solid #edf2f7',
                background: '#f8fafc',
                overflow: 'hidden'
              }}
            >
              {/* Top row: Image + Name + Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 14px 10px' }}>
                <img
                  src={(p.images && p.images[0]) || p.banner || getCategoryPhoto(p.cat || p.category)}
                  alt={p.name}
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', color: '#1a202c', fontSize: '15px', marginBottom: '4px' }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#edf2f7',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#4a5568',
                      textTransform: 'capitalize',
                      fontWeight: '600'
                    }}>
                      {getCategoryLabel(p.cat || p.category)}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#c8972b' }}>
                      {getPriceRange(p.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom row: ID + action buttons */}
              <div style={{
                borderTop: '1px solid #edf2f7',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>ID: {p.id}</span>
                  <button
                    onClick={() => setSelectedGradesProduct(p)}
                    style={{
                      background: '#fef3c7',
                      border: '1px solid #fcd34d',
                      borderRadius: '6px',
                      color: '#b45309',
                      fontSize: '11px',
                      padding: '4px 8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Grades
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditClick(p)}
                    style={{
                      background: 'rgba(200,151,43,0.08)',
                      border: '1px solid #c8972b',
                      borderRadius: '6px',
                      color: '#c8972b',
                      fontSize: '12px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    style={{
                      background: 'rgba(229,62,62,0.06)',
                      border: '1px solid #e53e3e',
                      borderRadius: '6px',
                      color: '#e53e3e',
                      fontSize: '12px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
          padding: '40px 20px',
          zIndex: 10000
        }}>
          <div style={{
            background: '#fff',
            width: '100%',
            maxWidth: '750px',
            borderRadius: '16px',
            padding: 'clamp(16px, 4vw, 30px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            marginBottom: '40px'
          }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #f7fafc', paddingBottom: '10px' }}>
              {editingProduct ? '✏️ Edit Agricultural Product (Firebase Schema)' : '➕ Add Agricultural Product (Firebase Schema)'}
            </h4>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1121 Basmati Rice"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Category</label>
                    <select
                      value={productForm.cat}
                      onChange={(e) => setProductForm({ ...productForm, cat: e.target.value })}
                      style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', width: '100%', textTransform: 'capitalize' }}
                    >
                      <option value="">-- Select Category --</option>
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label || cat.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Product ID (Unique)</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingProduct}
                      placeholder="e.g. 1121-basmati-rice"
                      value={productForm.id}
                      onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                      style={{
                        padding: '8px 12px',
                        fontSize: '13px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        background: editingProduct ? '#f1f3f5' : '#fff',
                        cursor: editingProduct ? 'not-allowed' : 'text',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Icon Emoji</label>
                    <input
                      type="text"
                      placeholder="e.g. 🌾 or 🥫"
                      value={productForm.icon}
                      onChange={(e) => setProductForm({ ...productForm, icon: e.target.value })}
                      style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568' }}>Product Banner Photo</span>
                    <div className="row g-2">
                      <div className="col-12 col-sm-6">
                        <label style={{ fontSize: '11px', color: '#718096', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Upload Banner Direct</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'banner')}
                          disabled={uploading}
                          style={{ fontSize: '12px', width: '100%' }}
                        />
                        {uploading && <span style={{ fontSize: '11px', color: '#c8972b', fontWeight: '600' }}>⌛ Processing Banner...</span>}
                      </div>
                      <div className="col-12 col-sm-6">
                        <label style={{ fontSize: '11px', color: '#718096', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Or Paste Banner Path/URL</label>
                        <input
                          type="text"
                          placeholder="e.g. /images/rice/1121_banner.png"
                          value={productForm.banner}
                          onChange={(e) => setProductForm({ ...productForm, banner: e.target.value })}
                          style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                        />
                      </div>
                    </div>
                    {productForm.banner && (
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#718096', fontWeight: '600', display: 'block', marginBottom: '2px' }}>Banner Preview:</span>
                        <img
                          src={productForm.banner}
                          alt="banner preview"
                          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #c8972b' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f7fafc', padding: '20px', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚙️ Grades, Highlights & Packs (Variant-Wise)
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568' }}>Grades / Variants List</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {productForm.variantsList.map((v, index) => {
                      const oldName = v.name;
                      return (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#fff', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                          {/* Grade Name + Delete button row */}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#718096' }}>Grade Name</span>
                              <input
                                type="text"
                                placeholder="e.g. Steam"
                                value={v.name}
                                onChange={(e) => {
                                  const newName = e.target.value;
                                  const newList = [...productForm.variantsList];
                                  newList[index].name = newName;

                                  const newPrices = { ...productForm.prices };
                                  if (newPrices[oldName]) {
                                    newPrices[newName] = newPrices[oldName];
                                    delete newPrices[oldName];
                                  } else {
                                    newPrices[newName] = {};
                                  }

                                  setProductForm({
                                    ...productForm,
                                    variantsList: newList,
                                    prices: newPrices
                                  });
                                }}
                                style={{ padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e0', fontWeight: '600', width: '100%' }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newList = productForm.variantsList.filter((_, idx) => idx !== index);
                                const newPrices = { ...productForm.prices };
                                delete newPrices[v.name];
                                setProductForm({ ...productForm, variantsList: newList, prices: newPrices });
                              }}
                              style={{
                                flexShrink: 0,
                                background: 'rgba(229,62,62,0.08)',
                                border: '1px solid #e53e3e',
                                borderRadius: '6px',
                                color: '#e53e3e',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: '6px 10px'
                              }}
                              title="Remove Grade"
                            >
                              🗑️
                            </button>
                          </div>

                          {/* Grade Photo — stacks below grade name always */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#4a5568' }}>Grade Photo</span>
                            <div className="row g-2">
                              <div className="col-12 col-sm-6">
                                <span style={{ fontSize: '9px', color: '#718096', fontWeight: '600', display: 'block', marginBottom: '2px' }}>Upload Photo Direct</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, 'variant', index)}
                                  disabled={uploadingVariantIndex === index}
                                  style={{ fontSize: '11px', width: '100%' }}
                                />
                                {uploadingVariantIndex === index && <span style={{ fontSize: '9px', color: '#c8972b', fontWeight: '600' }}>⌛ Processing...</span>}
                              </div>
                              <div className="col-12 col-sm-6">
                                <span style={{ fontSize: '9px', color: '#718096', fontWeight: '600', display: 'block', marginBottom: '2px' }}>Or Paste Image Path/URL</span>
                                <input
                                  type="text"
                                  placeholder="e.g. /images/rice/1121_steam.png"
                                  value={v.image}
                                  onChange={(e) => {
                                    const newList = [...productForm.variantsList];
                                    newList[index].image = e.target.value;
                                    setProductForm({ ...productForm, variantsList: newList });
                                  }}
                                  style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e0', width: '100%' }}
                                />
                              </div>
                            </div>
                            {v.image && (
                              <img
                                src={v.image}
                                alt="variant preview"
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #c8972b', marginTop: '2px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              💰 Size-wise Prices for {v.name || 'this grade'}
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {productForm.quantitiesList.filter(Boolean).map((q, qIndex) => {
                                const currentPrice = (productForm.prices && productForm.prices[v.name] && productForm.prices[v.name][q]) !== undefined
                                  ? productForm.prices[v.name][q]
                                  : '';
                                return (
                                  <div key={qIndex} style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '110px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '600', color: '#718096' }}>Price ({q})</span>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                      <span style={{ position: 'absolute', left: '8px', fontSize: '12px', color: '#a0aec0', fontWeight: '600' }}>₹</span>
                                      <input
                                        type="number"
                                        step="any"
                                        placeholder="N/A"
                                        value={currentPrice}
                                        onChange={(e) => {
                                          const newPrices = { ...productForm.prices };
                                          if (!newPrices[v.name]) {
                                            newPrices[v.name] = {};
                                          }
                                          newPrices[v.name][q] = e.target.value === '' ? '' : parseFloat(e.target.value);
                                          setProductForm({ ...productForm, prices: newPrices });
                                        }}
                                        style={{ padding: '4px 8px 4px 18px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e0', width: '100%', fontWeight: '600' }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        variantsList: [...productForm.variantsList, { name: '', image: '' }]
                      });
                    }}
                    style={{
                      alignSelf: 'flex-start',
                      background: '#fff',
                      border: '1px dashed #c8972b',
                      color: '#c8972b',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '5px'
                    }}
                  >
                    ➕ Add Grade / Variant
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568' }}>Product Highlights</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {productForm.highlightsList.map((h, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="e.g. Extra long grain (8.2 – 8.4 mm)"
                          value={h}
                          onChange={(e) => {
                            const newList = [...productForm.highlightsList];
                            newList[index] = e.target.value;
                            setProductForm({ ...productForm, highlightsList: newList });
                          }}
                          style={{ flex: 1, padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newList = productForm.highlightsList.filter((_, idx) => idx !== index);
                            setProductForm({ ...productForm, highlightsList: newList });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e53e3e',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        highlightsList: [...productForm.highlightsList, '']
                      });
                    }}
                    style={{
                      alignSelf: 'flex-start',
                      background: '#fff',
                      border: '1px dashed #4a5568',
                      color: '#4a5568',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '5px'
                    }}
                  >
                    ➕ Add Highlight
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568' }}>Available Packing sizes (Quantities)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {productForm.quantitiesList.map((q, index) => (
                      <div key={index} style={{ display: 'flex', gap: '4px', alignItems: 'center', background: '#edf2f7', padding: '4px 8px', borderRadius: '6px' }}>
                        <input
                          type="text"
                          placeholder="5 KG"
                          value={q}
                          onChange={(e) => {
                            const newList = [...productForm.quantitiesList];
                            newList[index] = e.target.value;
                            setProductForm({ ...productForm, quantitiesList: newList });
                          }}
                          style={{ width: '80px', padding: '4px 6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e0', background: '#fff', textAlign: 'center', fontWeight: '600' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newList = productForm.quantitiesList.filter((_, idx) => idx !== index);
                            setProductForm({ ...productForm, quantitiesList: newList });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e53e3e',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '0 2px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProductForm({
                          ...productForm,
                          quantitiesList: [...productForm.quantitiesList, '']
                        });
                      }}
                      style={{
                        background: '#fff',
                        border: '1px dashed #718096',
                        color: '#718096',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ➕ Add Size
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f7fafc', padding: '15px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>Technical Specifications (Dynamic Key-Value)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {productForm.specificationsList.map((spec, index) => (
                    <div key={index} className="row g-2 align-items-center">
                      <div className="col-5 col-sm-5">
                        <input
                          type="text"
                          placeholder="Key (e.g. Brand)"
                          value={spec.key}
                          onChange={(e) => {
                            const newList = [...productForm.specificationsList];
                            newList[index].key = e.target.value;
                            setProductForm({ ...productForm, specificationsList: newList });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e0',
                            background: '#fff',
                            fontWeight: '600'
                          }}
                        />
                      </div>
                      <div className="col-6 col-sm-6">
                        <input
                          type="text"
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) => {
                            const newList = [...productForm.specificationsList];
                            newList[index].value = e.target.value;
                            setProductForm({ ...productForm, specificationsList: newList });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e0',
                            background: '#fff'
                          }}
                        />
                      </div>
                      <div className="col-1 d-flex justify-content-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newList = productForm.specificationsList.filter((_, idx) => idx !== index);
                            setProductForm({ ...productForm, specificationsList: newList });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e53e3e',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '4px',
                            lineHeight: 1
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProductForm({
                      ...productForm,
                      specificationsList: [...productForm.specificationsList, { key: '', value: '' }]
                    });
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    background: '#fff',
                    border: '1px dashed #4a5568',
                    color: '#4a5568',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '5px'
                  }}
                >
                  ➕ Add Specification
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Product Description</label>
                <textarea
                  rows="2"
                  placeholder="Export quality, double polished..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', resize: 'none', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#c8972b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  {editingProduct ? 'Save Changes & Update' : 'Submit & Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  style={{ flex: 1, padding: '12px', background: '#f1f3f5', color: '#495057', border: '1px solid #dee2e6', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGradesProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
          padding: '40px 20px',
          zIndex: 10000
        }}>
          <div style={{
            background: '#fff',
            width: '100%',
            maxWidth: '600px',
            borderRadius: '16px',
            padding: 'clamp(16px, 4vw, 30px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            marginBottom: '40px',
            fontFamily: "'Outfit', sans-serif"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f7fafc', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>
                Grades & Pricing Details
              </h4>
              <button
                onClick={() => setSelectedGradesProduct(null)}
                style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#a0aec0', padding: '0 5px' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#718096', display: 'block', marginBottom: '8px' }}>Product Name:</strong>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c' }}>{selectedGradesProduct.name}</span>
              </div>

              <div>
                <strong style={{ fontSize: '13px', color: '#718096', display: 'block', marginBottom: '8px' }}>Available Grades / Variants:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedGradesProduct.grades && Array.isArray(selectedGradesProduct.grades) && selectedGradesProduct.grades.length > 0 ? (
                    selectedGradesProduct.grades.map((g, i) => (
                      <span key={i} style={{ background: '#fef3c7', color: '#b45309', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        {g}
                      </span>
                    ))
                  ) : selectedGradesProduct.variants && Array.isArray(selectedGradesProduct.variants) && selectedGradesProduct.variants.length > 0 ? (
                    selectedGradesProduct.variants.map((v, i) => (
                      <span key={i} style={{ background: '#fef3c7', color: '#b45309', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        {v.name || v}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#a0aec0', fontSize: '13px', fontStyle: 'italic' }}>No grades defined</span>
                  )}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '13px', color: '#718096', display: 'block', marginBottom: '10px' }}>Detailed Pricing & Quantities:</strong>
                {selectedGradesProduct.price && typeof selectedGradesProduct.price === 'object' ? (
                  <div style={{ border: '1px solid #edf2f7', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', margin: 0 }}>
                      <thead>
                        <tr style={{ background: '#f7fafc', borderBottom: '1px solid #edf2f7', textAlign: 'left' }}>
                          <th style={{ padding: '10px 12px', fontWeight: '600', color: '#4a5568', borderRight: '1px solid #edf2f7' }}>Grade / Variant</th>
                          <th style={{ padding: '10px 12px', fontWeight: '600', color: '#4a5568', borderRight: '1px solid #edf2f7' }}>Size / Packing</th>
                          <th style={{ padding: '10px 12px', fontWeight: '600', color: '#4a5568' }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(selectedGradesProduct.price).map((gradeKey) => {
                          const gradeVal = selectedGradesProduct.price[gradeKey];
                          if (gradeVal && typeof gradeVal === 'object') {
                            const subKeys = Object.keys(gradeVal);
                            return subKeys.map((sizeKey, idx) => (
                              <tr key={`${gradeKey}-${sizeKey}`} style={{ borderBottom: '1px solid #edf2f7' }}>
                                {idx === 0 ? (
                                  <td
                                    rowSpan={subKeys.length}
                                    style={{ padding: '10px 12px', fontWeight: '600', color: '#2d3748', verticalAlign: 'middle', borderRight: '1px solid #edf2f7' }}
                                  >
                                    {gradeKey}
                                  </td>
                                ) : null}
                                <td style={{ padding: '10px 12px', color: '#4a5568', borderRight: '1px solid #edf2f7' }}>{sizeKey}</td>
                                <td style={{ padding: '10px 12px', fontWeight: '700', color: '#c8972b' }}>₹{gradeVal[sizeKey]}</td>
                              </tr>
                            ));
                          } else {
                            return (
                              <tr key={gradeKey} style={{ borderBottom: '1px solid #edf2f7' }}>
                                <td style={{ padding: '10px 12px', fontWeight: '600', color: '#2d3748', borderRight: '1px solid #edf2f7' }}>{gradeKey}</td>
                                <td style={{ padding: '10px 12px', color: '#718096', fontStyle: 'italic', borderRight: '1px solid #edf2f7' }}>Standard</td>
                                <td style={{ padding: '10px 12px', fontWeight: '700', color: '#c8972b' }}>₹{gradeVal}</td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '12px 15px', background: '#f7fafc', borderRadius: '8px', color: '#4a5568', fontSize: '13px', fontWeight: '600' }}>
                    Standard Price: {getPriceSummary(selectedGradesProduct.price)}
                  </div>
                )}
              </div>

              {selectedGradesProduct.specifications && (
                <div>
                  <strong style={{ fontSize: '13px', color: '#718096', display: 'block', marginBottom: '8px' }}>Specifications:</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 15px', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '12px' }}>
                    {Object.entries(selectedGradesProduct.specifications).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096', fontWeight: '500' }}>{key}:</span>
                        <span style={{ color: '#2d3748', fontWeight: '600' }}>{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedGradesProduct(null)}
                style={{
                  padding: '8px 20px',
                  background: '#c8972b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CategoriesTab Component ---
const CategoriesTab = ({ categoriesList, onDeleteCategory, onAddCategory, onUpdateCategory }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState(CATEGORIES_INITIAL_FORM_STATE);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const processedBase64 = await resizeAndCropImage(file, 500, 500);
      const processedBlob = dataURLToBlob(processedBase64);

      try {
        const fileRef = sRef(storage, `categories/${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}.jpg`);
        const uploadPromise = uploadBytes(fileRef, processedBlob).then(async (snapshot) => {
          return await getDownloadURL(snapshot.ref);
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Storage Timeout")), 1500)
        );

        const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);
        setCategoryForm({ ...categoryForm, image: downloadURL });
        alert('Category image uploaded successfully to Storage (resized & optimized)!');
      } catch (storageError) {
        console.warn("Storage upload failed or timed out, falling back to local compressed Base64:", storageError);
        setCategoryForm({ ...categoryForm, image: processedBase64 });
        alert('Image compressed, resized & saved locally!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCategoryForm(CATEGORIES_INITIAL_FORM_STATE);
    setShowCategoryModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditMode(true);
    setCategoryForm({ id: cat.id, label: cat.label, image: cat.image });
    setShowCategoryModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.id || !categoryForm.label || !categoryForm.image) {
      alert('Please fill out all fields!');
      return;
    }

    if (isEditMode) {
      const updatedCategory = {
        id: categoryForm.id.trim().toLowerCase(),
        label: categoryForm.label.trim(),
        image: categoryForm.image.trim()
      };
      const success = await onUpdateCategory(updatedCategory);
      if (success) {
        setShowCategoryModal(false);
        setCategoryForm(CATEGORIES_INITIAL_FORM_STATE);
      }
    } else {
      const newCategory = {
        id: categoryForm.id.trim().toLowerCase(),
        label: categoryForm.label.trim(),
        image: categoryForm.image.trim()
      };
      const success = await onAddCategory(newCategory);
      if (success) {
        setShowCategoryModal(false);
        setCategoryForm(CATEGORIES_INITIAL_FORM_STATE);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: '#718096' }}>Total Categories: <strong>{categoriesList.length}</strong></span>
        <button
          onClick={openAddModal}
          style={{
            background: '#c8972b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          ➕ Add New Category
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        
        {/* Desktop Table (md and above) */}
        <div className="d-none d-md-block table-responsive">
          <table className="table align-middle" style={{ margin: 0 }}>
            <thead>
              <tr style={{ color: '#718096', fontSize: '13px' }}>
                <th>Category ID</th>
                <th>Thumbnail</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {categoriesList.map((cat, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600', color: '#718096' }}>{cat.id}</td>
                  <td>
                    <img
                      src={cat.image || '/categories/rice.jpg'}
                      alt={cat.label}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #edf2f7' }}
                    />
                  </td>
                  <td style={{ fontWeight: '700' }}>{cat.label}</td>
                  <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => openEditModal(cat)}
                      style={{
                        background: 'none',
                        border: '1px solid #c8972b',
                        borderRadius: '4px',
                        color: '#c8972b',
                        fontSize: '12px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      style={{
                        background: 'none',
                        border: '1px solid #e53e3e',
                        borderRadius: '4px',
                        color: '#e53e3e',
                        fontSize: '12px',
                        padding: '4px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Category Cards (below md) */}
        <div className="d-block d-md-none" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {categoriesList.map((cat, index) => (
            <div
              key={index}
              style={{
                borderRadius: '14px',
                border: '1px solid #edf2f7',
                background: '#f8fafc',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 14px 10px' }}>
                <img
                  src={cat.image || '/categories/rice.jpg'}
                  alt={cat.label}
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', color: '#1a202c', fontSize: '15px', marginBottom: '4px' }}>{cat.label}</div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>ID: {cat.id}</span>
                </div>
              </div>
              <div style={{
                borderTop: '1px solid #edf2f7',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                background: '#fff'
              }}>
                <button
                  onClick={() => openEditModal(cat)}
                  style={{
                    background: 'rgba(200,151,43,0.08)',
                    border: '1px solid #c8972b',
                    borderRadius: '6px',
                    color: '#c8972b',
                    fontSize: '12px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  style={{
                    background: 'rgba(229,62,62,0.06)',
                    border: '1px solid #e53e3e',
                    borderRadius: '6px',
                    color: '#e53e3e',
                    fontSize: '12px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {showCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          zIndex: 10000,
          overflowY: 'auto',
          padding: '40px 20px'
        }}>
          <div style={{
            background: '#fff',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '16px',
            padding: 'clamp(16px, 4vw, 30px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #f7fafc', paddingBottom: '10px' }}>
              {isEditMode ? '✏️ Edit Category' : '➕ Add Product Category'}
            </h4>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Category ID (Unique, e.g. textile, spices)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. textile"
                  value={categoryForm.id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                  disabled={isEditMode}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    background: isEditMode ? '#f7fafc' : '#fff',
                    color: isEditMode ? '#a0aec0' : '#2d3748'
                  }}
                />
                {isEditMode && (
                  <span style={{ fontSize: '11px', color: '#a0aec0' }}>Category ID cannot be changed during edit.</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Category Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Textiles & Fabrics"
                  value={categoryForm.label}
                  onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                  style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4a5568' }}>Category Photo</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#718096', fontWeight: '600' }}>Upload Photo Direct</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ fontSize: '12px' }}
                  />
                  {uploading && <span style={{ fontSize: '11px', color: '#c8972b', fontWeight: '600' }}>⌛ Processing Image...</span>}
                </div>

                <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#718096', fontWeight: '600' }}>Or Paste Image URL</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://example.com/category.jpg"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                </div>

                {categoryForm.image && (
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#718096', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Preview:</span>
                    <img
                      src={categoryForm.image}
                      alt="preview"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #c8972b', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#c8972b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  {isEditMode ? '💾 Update Category' : '💾 Save Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  style={{ flex: 1, padding: '12px', background: '#f1f3f5', color: '#495057', border: '1px solid #dee2e6', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- OrdersTab Component ---
const OrdersTab = ({ ordersList, handleStatusChange }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateOrder, setUpdateOrder] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>Active Trades & Quotes</h4>
        
        {/* Desktop Table (md and above) */}
        <div className="d-none d-md-block table-responsive">
          <table className="table align-middle" style={{ margin: 0 }}>
            <thead>
              <tr style={{ color: '#718096', fontSize: '13px' }}>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Items Placed</th>
                <th>Total Price</th>
                <th>Placement Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {ordersList.map((o, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '700', color: '#c8972b' }}>{o.id}</td>
                  <td style={{ fontWeight: '600' }}>{o.customerName}</td>
                  <td>{o.customerEmail}</td>
                  <td>{o.items}</td>
                  <td style={{ fontWeight: '700' }}>₹{(o.totalAmount || 0).toLocaleString()}</td>
                  <td>{o.date}</td>
                  <td>
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      background:
                        o.status?.toLowerCase() === 'delivered'
                          ? '#dcfce7'
                          : o.status?.toLowerCase() === 'shipped'
                            ? '#dbeafe'
                            : o.status?.toLowerCase() === 'out for delivery'
                              ? '#fff8f0'
                              : o.status?.toLowerCase() === 'confirmed'
                                ? '#fef3c7'
                                : o.status?.toLowerCase() === 'cancelled'
                                  ? '#fee2e2'
                                  : '#f1f5f9',
                      color:
                        o.status?.toLowerCase() === 'delivered'
                          ? '#15803d'
                          : o.status?.toLowerCase() === 'shipped'
                            ? '#2563eb'
                            : o.status?.toLowerCase() === 'out for delivery'
                              ? '#d4a017'
                              : o.status?.toLowerCase() === 'confirmed'
                                ? '#d97706'
                                : o.status?.toLowerCase() === 'cancelled'
                                  ? '#dc2626'
                                  : '#475569'
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        style={{
                          background: 'linear-gradient(135deg,#10b981,#059669)',
                          border: 'none',
                          color: '#fff',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 8px 18px rgba(16,185,129,0.25)',
                          transition: '0.3s ease'
                        }}
                      >
                        Track
                      </button>
                      <button
                        onClick={() => {
                          if (!(o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')) {
                            setUpdateOrder(o);
                          }
                        }}
                        disabled={o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled'}
                        style={{
                          background: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                            ? '#cbd5e1'
                            : 'linear-gradient(135deg,#d4a017,#b8860b)',
                          border: 'none',
                          color: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                            ? '#64748b'
                            : '#fff',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                            ? 'not-allowed'
                            : 'pointer',
                          boxShadow: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                            ? 'none'
                            : '0 8px 18px rgba(212,160,23,0.25)',
                          transition: '0.3s ease'
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Order Cards (below md) */}
        <div className="d-block d-md-none" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ordersList.map((o, index) => (
            <div
              key={index}
              style={{
                borderRadius: '14px',
                border: '1px solid #edf2f7',
                background: '#f8fafc',
                overflow: 'hidden'
              }}
            >
              {/* Header: Order ID + Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 14px 10px',
                borderBottom: '1px solid #edf2f7',
                background: '#fff'
              }}>
                <span style={{ fontWeight: '800', color: '#c8972b', fontSize: '15px' }}>{o.id}</span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  background:
                    o.status?.toLowerCase() === 'delivered'
                      ? '#dcfce7'
                      : o.status?.toLowerCase() === 'shipped'
                        ? '#dbeafe'
                        : o.status?.toLowerCase() === 'out for delivery'
                          ? '#fff8f0'
                          : o.status?.toLowerCase() === 'confirmed'
                            ? '#fef3c7'
                            : o.status?.toLowerCase() === 'cancelled'
                              ? '#fee2e2'
                              : '#f1f5f9',
                  color:
                    o.status?.toLowerCase() === 'delivered'
                      ? '#15803d'
                      : o.status?.toLowerCase() === 'shipped'
                        ? '#2563eb'
                        : o.status?.toLowerCase() === 'out for delivery'
                          ? '#d4a017'
                          : o.status?.toLowerCase() === 'confirmed'
                            ? '#d97706'
                            : o.status?.toLowerCase() === 'cancelled'
                              ? '#dc2626'
                              : '#475569'
                }}>
                  {o.status}
                </span>
              </div>

              {/* Body: Customer Details, Items, Amount */}
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Customer:</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>{o.customerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Email:</span>
                  <span style={{ color: '#0f172a', fontWeight: '600', wordBreak: 'break-all' }}>{o.customerEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Items Placed:</span>
                  <span style={{ color: '#0f172a', fontWeight: '600', textAlign: 'right' }}>{o.items}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Placement Date:</span>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>{o.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                  <span style={{ color: '#64748b', fontWeight: '700' }}>Total Price:</span>
                  <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '15px' }}>₹{(o.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{
                borderTop: '1px solid #edf2f7',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                background: '#fff'
              }}>
                <button
                  onClick={() => setSelectedOrder(o)}
                  style={{
                    background: 'linear-gradient(135deg,#10b981,#059669)',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16,185,129,0.15)'
                  }}
                >
                  Track
                </button>
                <button
                  onClick={() => {
                    if (!(o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')) {
                      setUpdateOrder(o);
                    }
                  }}
                  disabled={o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled'}
                  style={{
                    background: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                      ? '#cbd5e1'
                      : 'linear-gradient(135deg,#d4a017,#b8860b)',
                    border: 'none',
                    color: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                      ? '#64748b'
                      : '#fff',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                      ? 'not-allowed'
                      : 'pointer',
                    boxShadow: (o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'cancelled')
                      ? 'none'
                      : '0 4px 10px rgba(212,160,23,0.15)'
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            width: '650px',
            maxWidth: '95%',
            borderRadius: '24px',
            padding: '34px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 70px rgba(0,0,0,0.25)',
            scrollbarWidth: 'thin'
          }}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f1f5f9',
                border: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '15px'
              }}
            >
              ✕
            </button>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>📦 Order Tracking</h2>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
              Order ID :<span style={{ color: '#c8972b', fontWeight: '800' }}> {selectedOrder.id}</span>
            </p>
            <div style={{
              background: '#f8fafc',
              borderRadius: '18px',
              padding: '22px',
              marginTop: '28px',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {[
                ['Customer', selectedOrder.customerName],
                ['Email', selectedOrder.customerEmail],
                ['Items', selectedOrder.items],
                ['Total Amount', `₹${selectedOrder.totalAmount}`],
                ['Order Date', selectedOrder.date],
                ['Status', selectedOrder.status]
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                  <span style={{ color: '#64748b', fontWeight: '700', fontSize: '14px' }}>{label}</span>
                  <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '14px', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
            <h3 style={{ marginBottom: '26px', fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>🚚 Tracking Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
              {(() => {
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

                const steps = [
                  'Order Placed',
                  'Confirmed',
                  'Shipped',
                  'Out for Delivery',
                  'Delivered'
                ];

                if (isCancelled) {
                  const lastActiveIndex = statusMapping[cancelledFromStr] !== undefined 
                    ? statusMapping[cancelledFromStr] 
                    : 0;
                  
                  const displaySteps = steps.slice(0, lastActiveIndex + 1).map((step) => ({
                    label: step,
                    isCompleted: true,
                    isActive: false,
                    isCancelledStep: false
                  }));

                  displaySteps.push({
                    label: 'Cancelled',
                    isCompleted: false,
                    isActive: true,
                    isCancelledStep: true
                  });

                  return displaySteps.map((step, idx) => {
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '18px', minHeight: '78px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: step.isCancelledStep
                              ? '#fee2e2'
                              : 'linear-gradient(135deg,#d4a017,#b8860b)',
                            border: step.isCancelledStep ? '2.5px solid #ef4444' : 'none',
                            color: step.isCancelledStep ? '#ef4444' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: step.isCancelledStep ? '18px' : '15px',
                            boxShadow: step.isCancelledStep
                              ? '0 0 0 6px rgba(239,68,68,0.18)'
                              : 'none',
                            transition: '0.3s ease'
                          }}>
                            {step.isCancelledStep ? '✗' : '✓'}
                          </div>
                          {idx < displaySteps.length - 1 && (
                            <div style={{ width: '3px', flex: 1, background: 'linear-gradient(to bottom,#d4a017,#b8860b)', borderRadius: '20px' }} />
                          )}
                        </div>
                        <div style={{ paddingTop: '8px', width: '100%' }}>
                          <p style={{
                            margin: 0,
                            fontWeight: '800',
                            color: step.isCancelledStep ? '#ef4444' : '#1e293b',
                            fontSize: '16px'
                          }}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  });
                } else {
                  const activeStepIndex = statusMapping[currentStatusStr] !== undefined 
                    ? statusMapping[currentStatusStr] 
                    : 0;

                  return steps.map((step, idx) => {
                    const isCompleted = idx < activeStepIndex;
                    const isActive = idx === activeStepIndex;

                    return (
                      <div key={idx} style={{ display: 'flex', gap: '18px', minHeight: '78px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: isCompleted || isActive
                              ? 'linear-gradient(135deg,#d4a017,#b8860b)'
                              : '#e2e8f0',
                            color: isCompleted || isActive ? '#fff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '15px',
                            boxShadow: isActive
                              ? '0 0 0 6px rgba(212,160,23,0.18)'
                              : 'none',
                            transition: '0.3s ease'
                          }}>
                            {(isCompleted || isActive) ? '✓' : idx + 1}
                          </div>
                          {idx < steps.length - 1 && (
                            <div style={{ width: '3px', flex: 1, background: idx < activeStepIndex ? 'linear-gradient(to bottom,#d4a017,#b8860b)' : '#e2e8f0', borderRadius: '20px' }} />
                          )}
                        </div>
                        <div style={{ paddingTop: '8px', width: '100%' }}>
                          <p style={{
                            margin: 0,
                            fontWeight: isActive ? '800' : '700',
                            color: isActive ? '#b8860b' : '#1e293b',
                            fontSize: '16px'
                          }}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  });
                }
              })()}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                marginTop: '34px',
                padding: '14px',
                background: 'linear-gradient(135deg,#d4a017,#b8860b)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(184,134,11,0.25)',
                transition: '0.3s ease'
              }}
            >
              Close Tracking
            </button>
          </div>
        </div>
      )}

      {updateOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '24px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#ffffff',
            width: '760px',
            maxWidth: '95%',
            borderRadius: '32px',
            padding: '40px',
            position: 'relative',
            boxShadow: '0 40px 80px rgba(212,160,23,0.15), 0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid rgba(212,160,23,0.2)',
            maxHeight: '90vh',
            overflowY: 'auto',
            scrollbarWidth: 'thin'
          }}>
            <button
              onClick={() => setUpdateOrder(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'linear-gradient(135deg, #fff8f0, #fff0e0)',
                border: '1px solid rgba(212,160,23,0.3)',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '18px',
                color: '#b8860b',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg,#d4a017,#b8860b)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.border = '1px solid #d4a017';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #fff8f0, #fff0e0)';
                e.currentTarget.style.color = '#b8860b';
                e.currentTarget.style.border = '1px solid rgba(212,160,23,0.3)';
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Update Order Status
              </h2>
              <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                Order ID: <span style={{ color: '#d4a017', fontWeight: '700' }}>{updateOrder.id}</span>
              </p>
            </div>

            <div style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #d4a017, #b8860b, #d4a017, transparent)',
              margin: '30px 0 32px 0'
            }} />

            <div style={{
              background: 'linear-gradient(135deg, #fffdf9, #fffaf5)',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '32px',
              border: '1px solid rgba(212,160,23,0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Customer</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{updateOrder.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Items</span>
                <span style={{ color: '#1e293b', fontWeight: '700' }}>{updateOrder.items}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Total Amount</span>
                <span style={{ color: '#d4a017', fontWeight: '800', fontSize: '16px' }}>
                  ₹{(updateOrder.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                background: 'rgba(212,160,23,0.1)',
                color: '#b8860b',
                border: '1px solid rgba(212,160,23,0.3)'
              }}>
                Current Status: {updateOrder.status}
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              paddingBottom: '4px'
            }}>
              {STATUS_OPTIONS.map((status) => {
                const isActive = updateOrder.status?.toLowerCase() === status;
                const statusColors = {
                  pending: { bg: '#fff8f0', border: '#fef3c7', text: '#d97706', activeBg: '#d97706' },
                  confirmed: { bg: '#fff8f0', border: '#fef3c7', text: '#d97706', activeBg: '#d97706' },
                  shipped: { bg: '#fff8f0', border: '#fef3c7', text: '#d97706', activeBg: '#b8860b' },
                  'out for delivery': { bg: '#fff8f0', border: '#fef3c7', text: '#d4a017', activeBg: '#d4a017' },
                  delivered: { bg: '#f0fdf4', border: '#dcfce7', text: '#15803d', activeBg: '#15803d' },
                  cancelled: { bg: '#fef2f2', border: '#fee2e2', text: '#dc2626', activeBg: '#dc2626' }
                };
                const colors = statusColors[status] || statusColors.pending;

                return (
                  <button
                    key={status}
                    onClick={() => {
                      const formattedStatus = status === 'out for delivery'
                        ? 'Out for Delivery'
                        : status.charAt(0).toUpperCase() + status.slice(1);
                      handleStatusChange(updateOrder.id, formattedStatus);
                      setUpdateOrder({
                        ...updateOrder,
                        status: formattedStatus
                      });
                      setTimeout(() => {
                        setUpdateOrder(null);
                      }, 400);
                    }}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '20px',
                      border: isActive
                        ? `2px solid ${colors.activeBg}`
                        : `1.5px solid rgba(212,160,23,0.2)`,
                      background: isActive
                        ? `linear-gradient(135deg, ${colors.activeBg}, ${colors.activeBg === '#d97706' ? '#b8860b' : colors.activeBg === '#15803d' ? '#0f6e35' : colors.activeBg === '#d4a017' ? '#b8860b' : '#b91c1c'})`
                        : '#ffffff',
                      color: isActive ? '#ffffff' : colors.text,
                      fontSize: '15px',
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive
                        ? `0 8px 20px rgba(${colors.activeBg === '#d97706' ? '212,160,23' : colors.activeBg === '#15803d' ? '21,128,61' : colors.activeBg === '#d4a017' ? '212,160,23' : '185,28,28'}, 0.25)`
                        : '0 2px 8px rgba(0,0,0,0.02)',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#fffaf0';
                        e.currentTarget.style.border = `1.5px solid rgba(212,160,23,0.5)`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.border = `1.5px solid rgba(212,160,23,0.2)`;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {status === 'confirmed' ? '✓ Confirmed' :
                      status === 'delivered' ? '🚚 Delivered' :
                        status === 'cancelled' ? '✗ Cancelled' :
                          status === 'out for delivery' ? '🚚 Out for Delivery' :
                            status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. MAIN ADMIN PANEL LAYOUT & ORCHESTRATOR
// ==========================================

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [categories, setCategories] = useState({});
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '', onConfirm: null });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser.isAdmin) {
      alert('Access Denied: Admin privileges required.');
      navigate('/');
      return;
    }
    setAdminUser(parsedUser);

    const fetchData = async () => {
      try {
        const ordersRef = ref(db, 'orders');
        let ordersSnap = await get(ordersRef);
        let currentOrdersVal = ordersSnap.exists() ? ordersSnap.val() : {};

        // Automatic clean-up: Remove the default orders if they exist in DB
        let hasDefaultOrders = false;
        const cleanedOrders = { ...currentOrdersVal };
        ['order-1', 'order-2', 'order-3'].forEach(key => {
          if (cleanedOrders[key]) {
            delete cleanedOrders[key];
            hasDefaultOrders = true;
          }
        });

        if (hasDefaultOrders) {
          await set(ordersRef, cleanedOrders);
          setOrders(cleanedOrders);
        } else {
          setOrders(currentOrdersVal);
        }

        const usersSnap = await get(ref(db, 'users'));
        if (usersSnap.exists()) {
          setUsers(usersSnap.val());
        }

        const productsSnap = await get(ref(db, 'products'));
        if (productsSnap.exists()) {
          setProducts(productsSnap.val());
        }

        const categoriesSnap = await get(ref(db, 'categories'));
        if (categoriesSnap.exists()) {
          const raw = categoriesSnap.val();
          const rekeyed = {};
          let needsMigration = false;

          Object.entries(raw).forEach(([key, cat]) => {
            if (cat && cat.id) {
              rekeyed[cat.id] = cat;
              if (key !== cat.id) needsMigration = true;
            }
          });

          if (needsMigration) {
            await set(ref(db, 'categories'), rekeyed);
          }

          setCategories(rekeyed);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading admin dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const snap = await get(ref(db, `orders/${orderId}`));
      const currentOrder = snap.exists() ? snap.val() : {};
      const prevStatus = currentOrder.status || 'pending';

      const updates = { status: newStatus };
      if (newStatus.toLowerCase() === 'cancelled') {
        updates.cancelledFrom = prevStatus;
      }

      await update(ref(db, `orders/${orderId}`), updates);
      setOrders(prev => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          ...updates
        }
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to update order status.');
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const productsArray = Array.isArray(products) ? products : Object.values(products || {});
      const nextIndex = productsArray.length;

      const productRef = ref(db, `products/${nextIndex}`);
      await set(productRef, newProduct);

      if (Array.isArray(products)) {
        setProducts([...products, newProduct]);
      } else {
        setProducts(prev => ({
          ...prev,
          [nextIndex]: newProduct
        }));
      }
      alert('Product Added Successfully!');
      return true;
    } catch (err) {
      console.error(err);
      alert('Failed to add product.');
      return false;
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const productsArray = Array.isArray(products) ? products : Object.values(products || {});
      const index = productsArray.findIndex(p => p && p.id === updatedProduct.id);

      if (index === -1) {
        alert('Product not found in database!');
        return false;
      }

      const productRef = ref(db, `products/${index}`);
      await set(productRef, updatedProduct);

      if (Array.isArray(products)) {
        const updatedList = [...products];
        updatedList[index] = updatedProduct;
        setProducts(updatedList);
      } else {
        setProducts(prev => ({
          ...prev,
          [index]: updatedProduct
        }));
      }
      alert('Product Updated Successfully!');
      return true;
    } catch (err) {
      console.error(err);
      alert('Failed to update product.');
      return false;
    }
  };

  const handleDeleteProduct = async (prodId) => {
    setConfirmDialog({
      show: true,
      message: 'Are you sure you want to delete this product?',
      onConfirm: async () => {
        try {
          const productsArray = Array.isArray(products) ? products : Object.values(products || {});
          const index = productsArray.findIndex(p => p && p.id === prodId);

          if (index === -1) {
            alert('Product not found in database!');
            return;
          }

          const updatedArray = productsArray.filter((_, idx) => idx !== index);
          await set(ref(db, 'products'), updatedArray);

          setProducts(updatedArray);
          alert('Product deleted successfully!');
        } catch (err) {
          console.error(err);
          alert('Failed to delete product.');
        }
      }
    });
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const categoryRef = ref(db, `categories/${newCategory.id}`);
      await set(categoryRef, newCategory);
      setCategories(prev => ({
        ...prev,
        [newCategory.id]: newCategory
      }));
      alert('Category Added Successfully!');
      return true;
    } catch (err) {
      console.error(err);
      alert('Failed to add category.');
      return false;
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      const categoryRef = ref(db, `categories/${updatedCategory.id}`);
      await set(categoryRef, updatedCategory);
      setCategories(prev => ({
        ...prev,
        [updatedCategory.id]: updatedCategory
      }));
      alert('Category Updated Successfully!');
      return true;
    } catch (err) {
      console.error(err);
      alert('Failed to update category.');
      return false;
    }
  };

  const handleDeleteCategory = async (catId) => {
    setConfirmDialog({
      show: true,
      message: 'Are you sure you want to delete this category?',
      onConfirm: async () => {
        try {
          await set(ref(db, `categories/${catId}`), null);
          setCategories(prev => {
            const updated = { ...prev };
            delete updated[catId];
            return updated;
          });
          alert('Category deleted successfully!');
        } catch (err) {
          console.error(err);
          alert('Failed to delete category.');
        }
      }
    });
  };

  const totalRevenue = Object.values(orders).filter(o => o && typeof o === 'object').reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const usersList = Object.values(users).filter(u => u && typeof u === 'object');
  const productsList = Object.values(products).filter(p => p && typeof p === 'object');
  const categoriesList = Object.values(categories).filter(c => c && typeof c === 'object');
  const ordersList = Object.values(orders).filter(o => o && typeof o === 'object');

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f8f9fa',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-md-row"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#f4f6f9',
        fontFamily: "'Outfit', sans-serif",
        color: '#333'
      }}
    >
      {/* Sleek Mobile Header */}
      <div 
        className="d-flex d-md-none justify-content-between align-items-center px-4 py-3" 
        style={{ background: '#1e222b', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{
            background: 'var(--gold, #c8972b)',
            color: '#fff',
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '15px'
          }}>G</span>
          <span style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>Goeazymart Admin</span>
        </div>
        <button 
          onClick={() => setShowMobileSidebar(true)} 
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Drawer (Overlay Offcanvas style) */}
      {showMobileSidebar && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-start'
          }}
          onClick={() => setShowMobileSidebar(false)}
        >
          <div 
            style={{
              width: '260px',
              height: '100%',
              background: '#1e222b',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
              animation: 'slideRight 0.3s ease-out forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes slideRight {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  background: 'var(--gold, #c8972b)',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>G</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>Goeazymart</h4>
                  <span style={{ fontSize: '11px', color: '#c8972b', fontWeight: '600' }}>ADMIN PORTAL</span>
                </div>
              </div>
              <button 
                onClick={() => setShowMobileSidebar(false)} 
                style={{ background: 'none', border: 'none', color: '#a0aec0', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <SidebarContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              closeMobileMenu={() => setShowMobileSidebar(false)} 
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Body */}
      <div 
        className="p-3 p-md-5"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}
      >
        <AdminHeader
          activeTab={activeTab}
          adminUser={adminUser}
        />

        {activeTab === 'dashboard' && (
          <DashboardTab
            usersList={usersList}
            productsList={productsList}
            ordersList={ordersList}
            categoriesList={categoriesList}
            totalRevenue={totalRevenue}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            usersList={usersList}
          />
        )}

        {activeTab === 'products' && (
          <ProductsTab
            productsList={productsList}
            categoriesList={categoriesList}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            categoriesList={categoriesList}
            onDeleteCategory={handleDeleteCategory}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            ordersList={ordersList}
            handleStatusChange={handleStatusChange}
          />
        )}
      </div>

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
    </div>
  );
};

export default AdminPanel;
