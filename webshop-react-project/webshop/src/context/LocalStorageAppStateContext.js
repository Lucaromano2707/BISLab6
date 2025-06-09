import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const LocalStorageContext = createContext({});

export function useLocalStorageAppStateContext() {
    return useContext(LocalStorageContext);
}

export function LocalStorageAppStateContext({ children }) {
    // If you want the customer to be saved to local storage, 
    // uncomment this (to preserve the logged in customer state).
    // const [customer, setCustomer] = useLocalStorage('customer', null);
    
    const [customer, setCustomer] = useState(null);

    // Use the customer ID to create unique cartItems key
    const cartItemsKey = customer ? `cartItems_${customer.id}` : null;
    const [cartItems, setCartItems] = useLocalStorage(cartItemsKey, []);

    const login = (customerData) => {
        if (customerData && customerData.id) {
            // Store customer data in local storage
            setCustomer(customerData);

            // Use the customer ID to create unique cartItems key
            const updatedCartItemsKey = `cartItems_${customerData.id}`;

            // Initialize or load cartItems for the customer
            const initialCartItems = localStorage.getItem(updatedCartItemsKey) || '[]';

            // Update cartItems in local storage with the updated key
            setCartItems(JSON.parse(initialCartItems));
        }
    };

    const logout = () => {
        setCustomer(null);
    };

    function addToCartOrIncrementQuantity(newItem) {
        setCartItems(currItems => {
            const itemIndex = currItems.findIndex(itemEntry => itemEntry.item.id === newItem.id);

            if (itemIndex === -1) {
                // Item is not in the cart, so add it with quantity 1
                return [...currItems, { item: newItem, quantity: 1 }];
            }

            // Item is already in the cart, so increment its quantity
            return currItems.map((itemEntry, index) =>
                index === itemIndex ? { ...itemEntry, quantity: itemEntry.quantity + 1 } : itemEntry
            );
        });
    }

    function setItemQuantity(id, value) {
        setCartItems(currItems => {
            const itemIndex = currItems.findIndex(itemEntry => itemEntry.item.id === id);

            if (itemIndex === -1) {
                return null;
            }

            return currItems.map((itemEntry, index) =>
                index === itemIndex ? { ...itemEntry, quantity: value } : itemEntry
            );
        });
    }

    function removeItemFromCart(id) {
        setCartItems(currItems => currItems.filter(itemEntry => itemEntry.item.id !== id));
    }

    function removeAllItemsFromCart() {
        setCartItems([]);
    }

    return (
        <LocalStorageContext.Provider
            value={{
                customer,
                login,
                logout,
                cartItems,
                addToCartOrIncrementQuantity,
                removeItemFromCart,
                setItemQuantity,
                removeAllItemsFromCart
            }}
        >
            {children}
        </LocalStorageContext.Provider>
    );
}
