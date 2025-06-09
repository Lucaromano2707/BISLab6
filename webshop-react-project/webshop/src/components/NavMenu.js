import { Nav, Container, Navbar, Button, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { IoIosCart } from "react-icons/io";
import { useAppContext } from '../hooks/useAppContext';
import { getCartQuantity } from '../utilities/getCartQuantity';

export function NavMenu() {

    const { cartItems, logout } = useAppContext();
    const quantity = getCartQuantity(cartItems);

    return (
        <Navbar className='mb-3' sticky="top" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand to="/home" as={NavLink}>BikeStore</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link to="/home" as={NavLink}>Home</Nav.Link>
                    <Nav.Link to="/store" as={NavLink}>Store</Nav.Link>
                </Nav>
                <Nav className="me-2">
                    <Nav.Link as={Button} variant="link" onClick={() => logout()} className="me-2">Logout</Nav.Link>
                    <div className="d-flex align-items-center">
                        <div style={{ borderRight: "1px solid #fff", height: "1.7rem", marginRight: "10px" }}></div>
                    </div>
                </Nav>

                <Nav.Link to="/cart" as={NavLink}>
                    <Button
                        style={{ width: "2.5rem", height: "2.5rem", position: "relative" }}
                        variant="outline-light"
                        className="rounded-circle">
                        <IoIosCart size={22} style={{ marginLeft: -5 }} />
                        {
                            quantity !== 0 &&
                            <Badge
                                className="rounded-circle"
                                bg="danger"
                                text="light"
                                style={{
                                    width: "1.2rem",
                                    height: "1.2rem",
                                    position: "absolute",
                                    bottom: 0,
                                    right: -10,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                {quantity}
                            </Badge>
                        }
                    </Button>
                </Nav.Link>
            </Container>
        </Navbar>
    )
}