
import { Routes, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { Store } from "../pages/Store";
import { Home } from "../pages/Home";
import { NavMenu } from "./NavMenu";
import { ShoppingCart } from "../pages/ShoppingCart";
import { Checkout } from "../pages/Checkout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/Login";
import { useAppContext } from "../hooks/useAppContext";

function AppContent() {

    const { customer } = useAppContext();

    return (
        <>
            {
                customer ? (
                    <>
                        <NavMenu />
                        <Container className="mb-4">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/store" element={<Store />} />
                                <Route path="/cart" element={<ShoppingCart />} />
                                <Route
                                    path="/checkout"
                                    element={
                                        <ProtectedRoute >
                                            <Checkout  />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </Container>
                    </>
                ) : (
                    <Login />
                )

            }
        </>

    );
}

export default AppContent;