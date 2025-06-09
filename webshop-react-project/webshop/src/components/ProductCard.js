import { Card, Button, ListGroup } from 'react-bootstrap';
import { useAppContext } from '../hooks/useAppContext';
import { CURRENCY_FORMATTER } from '../utilities/currencyFormatter';
import { getItemQuantity } from '../utilities/getItemQuantity';

export function ProductCard({ product, imgUrl }) {
    const { cartItems, addToCartOrIncrementQuantity } = useAppContext();
    const currentQuantity = getItemQuantity(product.id, cartItems);

    return (
        <Card className="h-100">
            <Card.Img
                variant="top"
                src={imgUrl}
                height="220px"
                style={{ objectFit: "cover" }} />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-baseline mb-2">
                    <span style={{ fontSize: '18px' }}>{product.name}</span>
                    <span className='text-muted' style={{ fontSize: '18px' }}>{CURRENCY_FORMATTER.format(product.price)}</span>
                </Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item variant="secondary" className="fw-bold">
                    Specifications
                </ListGroup.Item>
                <ListGroup.Item>Material: {product.details.material}</ListGroup.Item>
                <ListGroup.Item>Cassette: {product.details.cassette}</ListGroup.Item>
                <ListGroup.Item>Rim: {product.details.rim}</ListGroup.Item>
                <ListGroup.Item>Tires: {product.details.tires}</ListGroup.Item>
                <ListGroup.Item>Brakes: {product.details.brakes}</ListGroup.Item>
            </ListGroup>
            <Card.Body className="d-flex flex-column">
                <div className="mt-auto">
                    <Button
                        variant="dark"
                        className='w-100 text-uppercase'
                        onClick={() => addToCartOrIncrementQuantity(product)}
                        disabled={currentQuantity >= 9}>
                        {currentQuantity >= 9 ? "Max Quantity Reached" : "Add To Cart"}
                    </Button>
                </div>
            </Card.Body>

        </Card>
    )
}