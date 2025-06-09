import { Stack, Button } from 'react-bootstrap';
import { useAppContext } from '../hooks/useAppContext';
import { CartItem } from '../components/CartItem';
import { CURRENCY_FORMATTER } from '../utilities/currencyFormatter';
import { useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { isCartEmpty } from '../utilities/isCartEmpty';
import { getTotalPrice } from '../utilities/getTotalPrice';

export function ShoppingCart() {
    const { cartItems } = useAppContext();
    const totalPrice = getTotalPrice(cartItems);
    const cartEmpty = isCartEmpty(cartItems);
    const navigate = useNavigate();

    return (
        <>
            {
                cartEmpty ?
                    (
                        <div className='text-center mt-3'>
                            <IoCartOutline size={200} />
                            <h2 >Your shopping cart is currently empty.</h2>
                            <Button
                                className='mt-4'
                                style={{ width: '15rem', fontSize: '18px' }}
                                variant='dark text-uppercase'
                                onClick={() => navigate("/store")} >
                                Continue Shopping
                            </Button>

                        </div>
                    ) : (
                        <>
                            <h1>Shopping Cart</h1>
                            <hr className="mt-4 mb-4" />
                            <Stack className='mt-3' gap={3}>
                                {cartItems.map(itemEntry => (
                                    <CartItem key={itemEntry.item.id} itemEntry={itemEntry} />
                                ))}
                            </Stack>
                            <div className="text-end fw-bold fs-5">
                                Total{" "}
                                {CURRENCY_FORMATTER.format(totalPrice)}
                                <div className='mt-2 text-center'>
                                    <Button style={{ width: '13rem', fontSize: '18px' }}
                                        variant='dark text-uppercase'
                                        onClick={() => navigate("/checkout")} >
                                        Checkout
                                    </Button>
                                </div>
                            </div>
                        </>
                    )
            }

        </>

    )
}