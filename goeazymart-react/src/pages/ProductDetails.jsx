import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ProductDetails.css';

import { useCart } from '../context/CartContext';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase';

const ProductDetails = () => {
    const { addToCart } = useCart();
    const { productId, variantName } = useParams();
    const { products, categories, loading } = useProducts();

    const decodedVariant = decodeURIComponent(variantName || "");

    const product = products.find(p => p.id === productId);

    const selectedVariantData = product?.variants?.find(
        v => v.name === decodedVariant
    );

    const navigate = useNavigate();

    const WHATSAPP_NUMBER = "+918939396612";

    const getCategoryImage = (catId) => {
        const category = categories.find(c => c.id === catId);
        return category?.image;
    };

    const getPrice = () => {
        if (!product || !product.price) return null;

        // Find matching grade/variant key (case-insensitive & trimmed)
        const gradeKey = Object.keys(product.price).find(
            k => k.trim().toLowerCase() === (selectedGrade || "").trim().toLowerCase()
        );
        
        if (!gradeKey) return null;

        const gradePrices = product.price[gradeKey];
        
        // Find matching quantity/size key (case-insensitive & trimmed)
        const qtyKey = Object.keys(gradePrices).find(
            k => k.trim().toLowerCase() === (selectedQty || "").trim().toLowerCase()
        );

        return qtyKey ? gradePrices[qtyKey] : null;
    };

    const defaultImages = [
        getCategoryImage(product?.cat),
        getCategoryImage(product?.cat),
        getCategoryImage(product?.cat)
    ];

    const images = product
        ? (product.variants
            ? selectedVariantData?.images || [selectedVariantData?.image]
            : (product.images?.length ? product.images : defaultImages))
        : [];
    const banner = product?.banner || images[0];

    // ✅ STATES
    const [selectedGrade, setSelectedGrade] = useState(() => {
        if (decodedVariant) return decodedVariant;
        if (product?.variants && product.variants.length > 0) return product.variants[0].name;
        return product?.grades?.[0];
    });

    const [selectedQty, setSelectedQty] = useState(() => {
        if (selectedVariantData) return selectedVariantData.options?.[0]?.size;
        if (product?.variants && product.variants.length > 0) return product.variants[0].options?.[0]?.size;
        return product?.quantities?.[0];
    });

    const [selectedPacking, setSelectedPacking] = useState(() => {
        if (selectedVariantData) return selectedVariantData.options?.[0]?.packing?.[0];
        if (product?.variants && product.variants.length > 0) return product.variants[0].options?.[0]?.packing?.[0];
        return null;
    });

    const [selectedImage, setSelectedImage] = useState(() => images[0]); // correct

    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewImage, setReviewImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pauseSlider, setPauseSlider] = useState(false);
    const [showZoomPreview, setShowZoomPreview] = useState(false);
    const thumbRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (thumbRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = thumbRef.current;
            setCanScrollLeft(scrollLeft > 2);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
        }
    };

    useEffect(() => {
        if (!product) return;
        const timer = setTimeout(checkScroll, 100);
        window.addEventListener('resize', checkScroll);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timer);
        };
    }, [images, selectedImage, product]);

    useEffect(() => {
        if (product && product.name) {
            document.title = decodedVariant 
                ? `${product.name} - ${decodedVariant} | Goeazymart`
                : `${product.name} | Goeazymart`;
        }
    }, [product, decodedVariant]);

    const scrollThumbnails = (direction) => {
        if (thumbRef.current) {
            const scrollAmount = 200;
            thumbRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 350);
        }
    };

    useEffect(() => {
        if (!product) return;
        if (product.variants) {
            setSelectedGrade(decodedVariant);

            const firstSize = selectedVariantData?.options?.[0];
            setSelectedQty(firstSize?.size);

            setSelectedPacking(firstSize?.packing?.[0]); // 👈 ADD THIS
        } else {
            setSelectedGrade(product.grades?.[0]);
            setSelectedQty(product.quantities?.[0]);
        }

        setSelectedImage(images[0]);

    }, [productId, variantName, product]);

    useEffect(() => {
        if (!product || !images || images.length === 0 || showModal) return;

        let index = 0;

        const interval = setInterval(() => {
            if (pauseSlider) return; // ⛔ pause

            index = (index + 1) % images.length;
            setSelectedImage(images[index]);
        }, 5000);

        return () => clearInterval(interval);
    }, [images, showModal, pauseSlider, product]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    let relatedProducts = [];

    if (product) {
        if (product.variants) {
            // Show other variants of the SAME product
            relatedProducts = product.variants
                .filter(v => v.name !== decodedVariant)
                .map(v => ({
                    id: product.id,
                    name: v.name,
                    image: v.image || v.images?.[0],
                    isVariant: true,
                    cat: product.cat
                }));
        } else {
            // Regular products: show same category
            relatedProducts = products
                .filter(p => p.cat === product.cat && p.id !== product.id);
        }

        relatedProducts = relatedProducts
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }

    // ✅ ACTIONS
    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: selectedImage,
            selectedGrade,
            selectedQty,
            selectedPacking,
            price: getPrice()
        };

        addToCart(cartItem);
        alert(`${product.name} added to cart! 🛒`);
    };

    const handleOrderNow = async () => {
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
        const totalAmount = getPrice() ? parseFloat(getPrice()) : 0;
        
        let itemsStr = product.name;
        if (product.variants) {
            itemsStr += ` (${selectedGrade} - ${selectedQty} - ${selectedPacking})`;
        } else {
            itemsStr += ` (${selectedGrade} - ${selectedQty})`;
        }

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
                image: selectedImage,
                itemsList: [{
                    name: product.name,
                    quantity: 1,
                    price: getPrice() || 0,
                    image: selectedImage || "",
                    selectedGrade: selectedGrade || 'Standard',
                    selectedSize: selectedQty || 'N/A',
                    selectedPackaging: selectedPacking || ''
                }]
            };

            await set(ref(db, `orders/${nextId}`), newOrder);
            console.log("Successfully saved order to Firebase:", newOrder);
        } catch (err) {
            console.error("Failed to save order to Firebase:", err);
        }

        const priceVal = getPrice();
        const priceStr = priceVal ? `₹${priceVal}` : "Negotiable";

        let message = `🛒 *New Order Request*%0A%0A`;

        message += `📦 *Product:* ${product.name}%0A`;

        if (product.variants) {
            message += `🔹 *Type:* ${selectedGrade}%0A`;
            message += `📏 *Size:* ${selectedQty}%0A`;

            message += `📦 *Packing:* ${selectedPacking}%0A`;
            message += `💰 *Price:* ${priceStr}%0A`;
        } else {
            message += `🔹 *Grade:* ${selectedGrade}%0A`;
            message += `📏 *Quantity:* ${selectedQty}%0A`;
            message += `💰 *Price:* ${priceStr}%0A`;
        }

        message += `%0A👤 *Customer Details:*%0A`;
        message += `👤 *Name:* ${customerName}%0A`;
        message += `📞 *Phone:* ${customerPhone}%0A`;
        message += `📧 *Email:* ${customerEmail}%0A`;
        message += `📍 *Address:* ${customerAddress}%0A`;

        message += `%0A🚀 Please share more details.`;

        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

        window.open(whatsappURL, "_blank");
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReviewImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleSubmitReview = () => {
        const newReview = {
            name: "You",
            rating: reviewRating,
            comment: reviewText,
            image: previewImage,
            date: new Date().toISOString().split("T")[0]
        };

        console.log(newReview);
        alert("Review Submitted ✅");

        // reset
        setReviewText("");
        setReviewRating(5);
        setReviewImage(null);
        setPreviewImage(null);
    };



    if (loading) return <div className="text-center py-5">Loading...</div>;

    if (!product) {
        return <h2 className="text-center mt-5">Product not found</h2>;
    }

    return (
        <div className="product-details container-fluid px-3 px-md-4 px-lg-5 py-3 py-md-4">
            <div className="mb-3">
                <Link
                    to={product.variants ? `/product/${product.id}` : `/products/${product.cat}`}
                    className="back-btn text-decoration-none"
                >
                    ← Back
                </Link>
            </div>

            <div className="product-main-grid">
                {/* 1. IMAGE SECTION */}
                <div className="image-section-wrapper">
                    <div className="image-section d-flex flex-column align-items-center">
                        <div className="main-image-container text-center">
                            <div
                                className="zoom-wrapper "
                                onMouseEnter={() => setShowZoomPreview(true)}
                                onMouseLeave={() => setShowZoomPreview(false)}
                            >

                                {/* LEFT IMAGE */}
                                <div
                                    className="zoom-container"
                                    style={{ backgroundImage: `url(${selectedImage})` }}
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();

                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;

                                        const preview = document.querySelector('.zoom-preview');
                                        if (preview) {
                                            preview.style.backgroundPosition = `${x}% ${y}%`;
                                        }
                                    }}
                                    onClick={() => {
                                        const index = images.indexOf(selectedImage);
                                        setCurrentIndex(index);
                                        setShowModal(true);
                                    }}
                                ></div>

                                {/* RIGHT SIDE ZOOM */}
                                {showZoomPreview && (
                                    <div
                                        className="zoom-preview"
                                        style={{
                                            backgroundImage: `url(${selectedImage})`,
                                        }}
                                    ></div>
                                )}
                            </div>
                        </div>

                        <div className="thumbnail-slider-container w-100 position-relative mt-3">
                            {canScrollLeft && (
                                <button className="thumb-arrow left-arrow" onClick={() => scrollThumbnails('left')}>❮</button>
                            )}
                            
                            <div 
                                className="thumbnail-row d-flex gap-2" 
                                ref={thumbRef} 
                                onScroll={checkScroll}
                                style={{ 
                                    overflowX: 'auto', 
                                    scrollBehavior: 'smooth', 
                                    scrollbarWidth: 'none', 
                                    msOverflowStyle: 'none' 
                                }}
                            >
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="thumb"
                                        onClick={() => {
                                            setSelectedImage(img);
                                            setCurrentIndex(index);

                                            // ⛔ pause slider
                                            setPauseSlider(true);

                                            // ⏱️ resume after 10 sec
                                            setTimeout(() => {
                                                setPauseSlider(false);
                                            }, 5000);
                                        }}
                                        className={`thumbnail-img ${selectedImage === img ? 'active' : ''}`}
                                        style={{ width: '65px', height: '65px', flexShrink: 0, cursor: 'pointer', objectFit: 'cover' }}
                                    />
                                ))}
                            </div>

                            {canScrollRight && (
                                <button className="thumb-arrow right-arrow" onClick={() => scrollThumbnails('right')}>❯</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. INFO SECTION */}
                <div className="info-section">
                    <h1 className="h2 mb-3">{product.icon} {product.name}</h1>

                    <p className="desc text-muted mb-4">
                        {product.description || "Premium quality product for export."}
                    </p>

                    {/* GRADE */}
                    {product.variants ? (
                        <>
                            {/* TYPE (already selected from previous page) */}
                            <div className="mb-3">
                                <h3 className="h6 fw-bold">Type</h3>
                                <p className="text-primary fw-bold">{selectedGrade}</p>
                            </div>

                            {/* SIZE */}
                            <div className="options mb-4">
                                <h3 className="h6 fw-bold mb-2">Size</h3>
                                <div className="option-list d-flex gap-2 flex-wrap">
                                    {selectedVariantData?.options?.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={`btn btn-outline-secondary ${selectedQty === opt.size ? "active-grade" : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedQty(opt.size);

                                                // 👇 update packing also
                                                setSelectedPacking(opt.packing?.[0]);
                                            }}
                                        >
                                            {opt.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PACKING */}
                            <div className="mb-4">
                                <h3 className="h6 fw-bold mb-2">Packing</h3>

                                <div className="option-list d-flex gap-2 flex-wrap">
                                    {selectedVariantData?.options
                                        ?.find(o => o.size === selectedQty)
                                        ?.packing?.map((p, i) => (
                                            <button
                                                key={i}
                                                className={`btn btn-outline-secondary ${selectedPacking === p ? "active-grade" : ""
                                                    }`}
                                                onClick={() => setSelectedPacking(p)}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            <h2 className="price text-danger mb-4">
                                ₹ {getPrice() || "Negotiable"}
                            </h2>
                        </>
                    ) : (
                        <>
                            {/* EXISTING RICE LOGIC */}
                            <div className="options mb-4">
                                <h3 className="h6 fw-bold mb-2">Grade</h3>
                                <div className="option-list d-flex gap-2 flex-wrap">
                                    {product.grades?.map((grade, i) => (
                                        <button
                                            key={i}
                                            className={`btn btn-outline-secondary ${selectedGrade === grade ? 'active-grade' : ''}`}
                                            onClick={() => setSelectedGrade(grade)}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="options mb-4">
                                <h3 className="h6 fw-bold mb-2">Quantity</h3>
                                <div className="option-list d-flex gap-2 flex-wrap">
                                    {product.quantities?.map((qty, i) => (
                                        <button
                                            key={i}
                                            className={`btn btn-outline-secondary ${selectedQty === qty ? 'active-grade' : ''}`}
                                            onClick={() => setSelectedQty(qty)}
                                        >
                                            {qty}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <h2 className="price text-danger mb-4">
                                ₹ {getPrice() || "Negotiable"}
                            </h2>
                        </>
                    )}

                    {/* BUTTONS */}
                    <div className="action-buttons d-flex gap-3 mb-4">
                        <button className="cart-btn btn flex-grow-1" onClick={handleAddToCart}>
                            🛒 Add to Cart
                        </button>

                        <button className="order-btn btn flex-grow-1" onClick={handleOrderNow}>
                            ⚡ Order Now
                        </button>
                    </div>

                    {/* HIGHLIGHTS */}
                    <div className="highlights mb-4">
                        <h3 className="h6 fw-bold mb-2">About this item</h3>
                        <ul className="list-unstyled">
                            {product.highlights?.map((item, i) => (
                                <li key={i} className="mb-1">• {item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* SPECIFICATIONS */}
                    <div className="specs">
                        <h3 className="h6 fw-bold mb-2">Product Details</h3>
                        <table className="table table-sm table-borderless">
                            <tbody>
                                {Object.entries(product.specifications || {}).map(([k, v]) => (
                                    <tr key={k}>
                                        <td className="label fw-bold text-secondary" style={{ width: '40%' }}>{k}</td>
                                        <td>{(k === 'ShelfLife' && selectedVariantData?.shelfLife) ? selectedVariantData.shelfLife : v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. RELATED PRODUCTS */}
                <div className="related-section mt-4 w-100">
                    <h3 className="mb-3">Similar Products</h3>

                    <div className="row g-3">
                        {relatedProducts.map((item) => (
                            <div key={item.id} className="col-6 col-sm-4 col-md-3">
                                <div
                                    className="related-card text-center cursor-pointer"
                                    onClick={() => {
                                        if (item.isVariant) {
                                            navigate(`/product/${item.id}/${encodeURIComponent(item.name)}`);
                                        } else if (item.variants) {
                                            navigate(`/product/${item.id}`);
                                        } else {
                                            navigate(`/product/${item.id}/details`);
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={item.image || item.banner || getCategoryImage(item.cat)}
                                        alt={item.name}
                                        className="img-fluid rounded mb-2"
                                        style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                                    />
                                    <p className="small">{item.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. REVIEWS SECTION */}
                <div className="reviews-section mt-4 w-100">
                    <h3 className="mb-3">Customer Reviews</h3>

                    {/* ⭐ STAR RATING */}
                    <div className="star-rating mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= reviewRating ? 'filled' : ''}`}
                                onClick={() => setReviewRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    {/* Comment */}
                    <textarea
                        className="form-control mb-2"
                        placeholder="Write your review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />

                    {/* 📸 Image Upload */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mb-2"
                    />

                    {/* Preview */}
                    {previewImage && (
                        <img src={previewImage} className="review-preview mb-2" />
                    )}

                    <button className="btn btn-primary" onClick={handleSubmitReview}>
                        Submit Review
                    </button>

                    {/* ✅ DISPLAY REVIEWS */}
                    <div className="mt-4">
                        {product.reviews?.map((review, index) => (
                            <div key={index} className="review-card mb-3 p-3">

                                <div className="d-flex justify-content-between">
                                    <strong>{review.name}</strong>
                                    <span className="review-date">{review.date}</span>
                                </div>

                                <div className="rating">
                                    {"⭐".repeat(review.rating)}
                                </div>

                                <p>{review.comment}</p>

                                {/* 📸 Show Image */}
                                {review.image && (
                                    <img src={review.image} className="review-image" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="image-modal">
                    <span className="close-btn" onClick={() => setShowModal(false)}>✖</span>

                    <button className="arrow left" onClick={prevImage}>❮</button>

                    <img
                        src={images[currentIndex]}
                        className="modal-image"
                        alt="preview"
                    />

                    <button className="arrow right" onClick={nextImage}>❯</button>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;