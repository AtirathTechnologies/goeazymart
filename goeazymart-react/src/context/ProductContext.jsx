import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productsRef = ref(db, 'products');
        const categoriesRef = ref(db, 'categories');

        const unsubscribeProducts = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // If it's an object (from push()), convert to array
                const productsList = Array.isArray(data) ? data : Object.values(data);
                setProducts(productsList);
            } else {
                setProducts([]);
            }
        });

        const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const categoriesList = Array.isArray(data) ? data : Object.values(data);
                setCategories(categoriesList);
            } else {
                setCategories([]);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeCategories();
        };
    }, []);

    return (
        <ProductContext.Provider value={{ products, categories, loading }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
