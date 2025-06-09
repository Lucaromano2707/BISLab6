
import { Navigate } from "react-router-dom"
import { useAppContext } from "../hooks/useAppContext";
import { isCartEmpty } from "../utilities/isCartEmpty";

export const ProtectedRoute = ({ children }) => {
    const { cartItems } = useAppContext();
    const cartEmpty = isCartEmpty(cartItems);

    if (cartEmpty) {
        return <Navigate to="/store" />;
    }

    return children;
};