import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        const storedUser = localStorage.getItem('user');
        let loggedInUser = null;
        if (storedUser) {
            try {
                loggedInUser = JSON.parse(storedUser);
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
            }
        }

        if (!loggedInUser) {
            alert("Please login first to place an order!");
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        const customerName = loggedInUser.name || loggedInUser.username || "Guest User";
        const customerEmail = loggedInUser.email || "guest@goeazymart.com";
        const customerPhone = loggedInUser.phone || "N/A";
        const customerAddress = loggedInUser.address || "N/A";
        const date = new Date().toISOString().split("T")[0];
        const totalAmount = getCartTotal() || 0;
        
        let itemsStr = cartItems.map(item => {
            let desc = `${item.name} x ${item.quantity}`;
            let details = [];
            if (item.selectedGrade) details.push(item.selectedGrade);
            if (item.selectedQty) details.push(item.selectedQty);
            if (item.selectedPacking) details.push(item.selectedPacking);
            if (details.length > 0) {
                desc += ` (${details.join(' - ')})`;
            }
            return desc;
        }).join(', ');

        let nextId = `order-${Date.now()}`;
        try {
            const ordersRef = ref(db, 'orders');
            const ordersSnap = await get(ordersRef);
            if (ordersSnap.exists()) {
                const existingOrders = ordersSnap.val();
                const keys = Object.keys(existingOrders);
                let maxNum = 0;
                keys.forEach(k => {
                    const match = k.match(/order-(\d+)/);
                    if (match) {
                        const num = parseInt(match[1], 10);
                        if (num > maxNum) maxNum = num;
                    }
                });
                nextId = `order-${maxNum + 1}`;
            } else {
                nextId = "order-1";
            }

            const newOrder = {
                id: nextId,
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                date,
                items: itemsStr,
                status: 'pending',
                totalAmount: totalAmount,
                image: cartItems[0]?.image || "",
                itemsList: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image || "",
                    selectedGrade: item.selectedGrade || 'Standard',
                    selectedSize: item.selectedQty || 'N/A',
                    selectedPackaging: item.selectedPacking || ''
                }))
            };

            await set(ref(db, `orders/${nextId}`), newOrder);
            console.log("Successfully saved order to Firebase:", newOrder);
        } catch (err) {
            console.error("Failed to save order to Firebase:", err);
        }

        const WHATSAPP_NUMBER = "+918939396612";
        let message = `🛒 *New Order Request (Cart)*%0A%0A`;
        
        cartItems.forEach((item, index) => {
            const subtotalVal = item.price ? (parseFloat(item.price) * item.quantity).toFixed(1) : null;
            const priceVal = subtotalVal ? `₹${subtotalVal}` : "Negotiable";
            message += `*${index + 1}. ${item.name}*%0A`;
            if (item.selectedGrade) message += `🔹 *Grade/Variant:* ${item.selectedGrade}%0A`;
            if (item.selectedQty) message += `📏 *Quantity/Size:* ${item.selectedQty}%0A`;
            if (item.selectedPacking) message += `📦 *Packing:* ${item.selectedPacking}%0A`;
            message += `🔢 *Qty:* ${item.quantity}%0A`;
            message += `💰 *Subtotal:* ${priceVal}%0A%0A`;
        });

        let totalStr = totalAmount > 0 ? `₹${totalAmount.toFixed(1)}` : "Negotiable";
        message += `💰 *Total Amount:* ${totalStr}%0A`;
        message += `%0A👤 *Customer Details:*%0A`;
        message += `👤 *Name:* ${customerName}%0A`;
        message += `📞 *Phone:* ${customerPhone}%0A`;
        message += `📧 *Email:* ${customerEmail}%0A`;
        message += `📍 *Address:* ${customerAddress}%0A`;
        message += `%0A🚀 Please share more details.`;

        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappURL, "_blank");

        clearCart();
    };

    if (cartItems.length === 0) {
        return (
            <>
                <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
                    <div className="py-5">
                        <div className="display-1 mb-4">🛒</div>
                        <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
                        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary px-5 py-2">
                            Start Shopping
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="cart-page bg-light min-vh-100 py-4 py-md-5">
                <div className="container">
                    {/* Existing Row/Grid Content */}
                    <div className="row g-4">
                        {/* ... (rest of the cart items and summary) */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 fw-bold">Shopping Cart ({cartItems.length})</h4>
                                    <button 
                                        className="btn btn-link text-danger text-decoration-none p-0 small"
                                        onClick={clearCart}
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                                <div className="card-body p-0">
                                    {/* Desktop View: Table */}
                                    <div className="table-responsive d-none d-md-block">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-4 border-0">Product</th>
                                                    <th className="border-0">Price</th>
                                                    <th className="border-0 text-center">Quantity</th>
                                                    <th className="border-0 text-end pe-4">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item, index) => (
                                                    <tr key={`${item.id}-${index}`}>
                                                        <td className="ps-4 py-3">
                                                            <div className="d-flex align-items-center">
                                                                <img 
                                                                    src={item.image} 
                                                                    alt={item.name} 
                                                                    className="rounded-3 shadow-sm me-3"
                                                                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                                                />
                                                                <div>
                                                                    <h6 className="mb-1 fw-bold">{item.name}</h6>
                                                                    <div className="small text-muted">
                                                                        {item.selectedGrade && <span>{item.selectedGrade}</span>}
                                                                        {item.selectedQty && <span> • {item.selectedQty}</span>}
                                                                        {item.selectedPacking && <span> • {item.selectedPacking}</span>}
                                                                    </div>
                                                                    <button 
                                                                        className="btn btn-link text-danger text-decoration-none p-0 small mt-1"
                                                                        onClick={() => removeFromCart(item.id, item.selectedGrade, item.selectedQty, item.selectedPacking)}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                        <span className="fw-medium">
                                                            ₹ {item.price || 'Negotiable'}
                                                        </span>
                                                    </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <div className="input-group input-group-sm" style={{ width: '100px' }}>
                                                                    <button 
                                                                        className="btn btn-outline-secondary"
                                                                        onClick={() => updateQuantity(item.id, item.selectedGrade, item.selectedQty, item.selectedPacking, item.quantity - 1)}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control text-center border-secondary bg-white" 
                                                                        value={item.quantity}
                                                                        readOnly
                                                                    />
                                                                    <button 
                                                                        className="btn btn-outline-secondary"
                                                                        onClick={() => updateQuantity(item.id, item.selectedGrade, item.selectedQty, item.selectedPacking, item.quantity + 1)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                        <span className="fw-bold">
                                                            {item.price ? `₹ ${(parseFloat(item.price) * item.quantity).toFixed(1)}` : 'Negotiable'}
                                                        </span>
                                                    </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile View: List */}
                                    <div className="d-md-none">
                                        {cartItems.map((item, index) => (
                                            <div key={`${item.id}-${index}`} className="p-3 border-bottom">
                                                <div className="d-flex gap-3">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        className="rounded-3 shadow-sm"
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <h6 className="mb-1 fw-bold pe-2">{item.name}</h6>
                                                            <button 
                                                                className="btn-close small" 
                                                                style={{ fontSize: '0.7rem' }}
                                                                onClick={() => removeFromCart(item.id, item.selectedGrade, item.selectedQty, item.selectedPacking)}
                                                            ></button>
                                                        </div>
                                                        <div className="small text-muted mb-2">
                                                            {item.selectedGrade} • {item.selectedQty}
                                                            {item.selectedPacking && ` • ${item.selectedPacking}`}
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="input-group input-group-sm" style={{ width: '90px' }}>
                                                                <button 
                                                                    className="btn btn-outline-secondary px-2"
                                                                    onClick={() => updateQuantity(item.id, item.selectedGrade, item.selectedQty, item.selectedPacking, item.quantity - 1)}
                                                                >-</button>
                                                                <span className="form-control text-center p-1 bg-white">{item.quantity}</span>
                                                                <button 
                                                                    className="btn btn-outline-secondary px-2"
                                                                    onClick={() => updateQuantity(item.id, item.selectedGrade, item.selectedQty, item.selectedPacking, item.quantity + 1)}
                                                                >+</button>
                                                            </div>
                                                            <span className="fw-bold text-primary">
                                                                {item.price ? `₹ ${(parseFloat(item.price) * item.quantity).toFixed(1)}` : 'Negotiable'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">Order Summary</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="fw-medium">₹ {getCartTotal().toFixed(1)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Shipping</span>
                                        <span className="text-success small">Calculated at checkout</span>
                                    </div>
                                    <hr className="my-3 text-muted opacity-25" />
                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="h5 fw-bold">Total</span>
                                        <span className="h5 fw-bold text-primary">₹ {getCartTotal().toFixed(1)}</span>
                                    </div>
                                    
                                    <button 
                                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold mb-3 shadow-sm"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                    </button>
                                    
                                    <Link to="/products" className="btn btn-outline-secondary w-100 py-2 rounded-3 text-decoration-none">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;
