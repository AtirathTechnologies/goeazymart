import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, categories } from '../data/productsData';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
    const { productId, variantName } = useParams();

    const decodedVariant = decodeURIComponent(variantName || "");

    const product = products.find(p => p.id === productId);

    const selectedVariantData = product?.variants?.find(
        v => v.name === decodedVariant
    );

    const navigate = useNavigate();


    const WHATSAPP_NUMBER = "919247485871";

    if (!product) {
        return <h2 className="text-center mt-5">Product not found</h2>;
    }

    // ✅ STATES
    const [selectedGrade, setSelectedGrade] = useState(decodedVariant || product.grades?.[0]);

    const [selectedQty, setSelectedQty] = useState(
        selectedVariantData?.options?.[0]?.size || product.quantities?.[0]
    );

    const [selectedPacking, setSelectedPacking] = useState(null);

    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewImage, setReviewImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pauseSlider, setPauseSlider] = useState(false);
    const [showZoomPreview, setShowZoomPreview] = useState(false);
    // const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
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

    }, [productId, variantName]);


    const getCategoryImage = (catId) => {
        const category = categories.find(c => c.id === catId);
        return category?.image;
    };

    const getPrice = () => {
        return product.price?.[selectedGrade]?.[selectedQty];
    };

    const defaultImages = [
        getCategoryImage(product.cat),
        getCategoryImage(product.cat),
        getCategoryImage(product.cat)
    ];

    const images = product.variants
        ? selectedVariantData?.images || [selectedVariantData?.image]
        : (product.images?.length ? product.images : defaultImages);
    const banner = product.banner || images[0];
    const [selectedImage, setSelectedImage] = useState(images[0]); // correct

    useEffect(() => {
        if (!images || images.length === 0 || showModal) return;

        let index = 0;

        const interval = setInterval(() => {
            if (pauseSlider) return; // ⛔ pause

            index = (index + 1) % images.length;
            setSelectedImage(images[index]);
        }, 5000);

        return () => clearInterval(interval);
    }, [images, showModal, pauseSlider]);

    let relatedProducts = products
        .filter(p => p.cat === product.cat && p.id !== product.id);

    if (relatedProducts.length === 0 && product.variants) {
        // 👉 fallback: show variants as similar
        relatedProducts = product.variants.map((v, i) => ({
            id: product.id,
            name: v.name,
            image: v.image || v.images?.[0],
            isVariant: true
        }));
    }

    relatedProducts = relatedProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    // ✅ ACTIONS
    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: selectedImage,
            grade: selectedGrade,
            quantity: selectedQty,
            price: getPrice()
        };

        console.log("Added to cart:", cartItem);
        alert("Added to Cart ✅");
    };

    const handleOrderNow = () => {
        let message = `🛒 *New Order Request*%0A%0A`;

        message += `📦 *Product:* ${product.name}%0A`;

        if (product.variants) {
            message += `🔹 *Type:* ${selectedGrade}%0A`;
            message += `📏 *Size:* ${selectedQty}%0A`;

            message += `📦 *Packing:* ${selectedPacking}%0A`;
            message += `💰 *Price:* Negotiable%0A`;
        } else {
            message += `🔹 *Grade:* ${selectedGrade}%0A`;
            message += `📏 *Quantity:* ${selectedQty}%0A`;
            message += `💰 *Price:* ₹${getPrice()}%0A`;
        }

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

            <div className="row g-4">
                {/* LEFT - IMAGE SECTION */}
                <div className="col-lg-7 col-md-12">
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
                                    // onMouseEnter={() => setShowZoomPreview(true)}
                                    // onMouseLeave={() => setShowZoomPreview(false)}
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
                                            // backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                                        }}
                                    ></div>
                                )}
                            </div>
                        </div>

                        <div className="thumbnail-row d-flex gap-2 mt-3 flex-wrap justify-content-center">
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
                                    style={{ width: '60px', height: '60px', cursor: 'pointer', objectFit: 'cover' }}
                                />
                            ))}
                        </div>

                        {/* 🔥 RELATED PRODUCTS */}
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

                            {/* ⭐ REVIEWS SECTION */}
                            <div className="reviews-section mt-4 w-100">
                                <h3 className="mb-3">Customer Reviews</h3>


                                {/* Rating */}
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
                            </div>

                            {/* ✅ DISPLAY REVIEWS */}
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

                {/* RIGHT - INFO SECTION */}
                <div className="col-lg-5 col-md-12">
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
                                    Negotiable
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
                                            <td>{v}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;