import { React, useState } from 'react';
import { Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';
import { useAppContext } from '../hooks/useAppContext';
import { CURRENCY_FORMATTER } from '../utilities/currencyFormatter';
import { getMinRequiredOrderDate } from '../utilities/getMinRequiredOrderDate';
import axios from 'axios';
import { ORDER_API_BASE_URL } from '../utilities/apiUrls';
import { getTotalPrice } from '../utilities/getTotalPrice';

export function Checkout() {
    const { customer, cartItems, removeAllItemsFromCart } = useAppContext();

    const totalPrice = getTotalPrice(cartItems);
    const minDate = getMinRequiredOrderDate();

    const [selectedDate, setSelectedDate] = useState('');
    const [comments, setComments] = useState('');

    const handleCompleteOrder = async () => {
        if (!selectedDate) {
            alert('Please select a required date.');
            return;
        }

        if (totalPrice > customer.creditLimit) {
            alert('The order cannot be processed as it exceeds your credit limit. Please review your order or contact customer support for assistance.');
            return;
        }

        const orderDetails = cartItems.map((itemEntry, index) => ({
            orderNumber: 0,
            // productCode: "bike" + itemEntry.item.id,
            productCode: itemEntry.item.id,
            quantityOrdered: itemEntry.quantity,
            priceEach: itemEntry.item.price,
            orderLineNumber: index + 1,
        }));

        const order = {
            orderNumber: 0,
            orderDate: new Date(),
            requiredDate: new Date(selectedDate),
            shippedDate: new Date(),
            status: 'In Process',
            comments: comments,
            // customerNumber: customer.id.toString(),
            customer: customer.id.toString(),
            orderDetails: orderDetails
        };

        try {
            const response = await axios.post(ORDER_API_BASE_URL, order);
            removeAllItemsFromCart();
            alert('Order placed successfully: ' + response.data);
            console.log(response.data);
        } catch (error) {
            alert(`Error placing the order: ${error.message}`);
        }
    }

    return (
        <>
            <h2 className='mb-4 mt-3'>Checkout</h2>
            <Row>
                <Col md={8}>
                    <Card className='mb-4'>
                        <Card.Header as="h5">Order details</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="formGroupRequiredDate">
                                    <Form.Label>Select required date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        min={minDate}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupComments">
                                    <Form.Label>Comments</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)} />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className='mb-4'>
                        <Card.Header as="h5">Customer Info</Card.Header>
                        <Card.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridId">
                                        <Form.Label>ID</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.id} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.name} />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridContactFirstName">
                                        <Form.Label>Contact first name</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.contactFirstName} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridContactLastName">
                                        <Form.Label>Contact last name</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.contactLastName} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridPhone">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.phone} />
                                    </Form.Group>
                                </Row>

                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className='mb-4'>
                        <Card.Header as="h5">Address Info</Card.Header>
                        <Card.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridStreet">
                                        <Form.Label>Street</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.address.street} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Zip</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.address.zip} />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.address.city} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.address.state} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridCountry">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control readOnly defaultValue={customer.address.country} />
                                    </Form.Group>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card style={{ width: '18rem' }} className='mb-4'>
                        <Card.Header as="h5">Order summary</Card.Header>
                        <ListGroup variant="flush">
                            {cartItems.map((itemEntry, index) => (
                                <ListGroup.Item key={index}>
                                    <Card.Title style={{ fontSize: "18px" }}>{itemEntry.item.name}{" "}
                                        {itemEntry.quantity > 1 && (
                                            <span className="text-muted" style={{ fontSize: ".75rem" }}>
                                                x{itemEntry.quantity}
                                            </span>
                                        )}
                                    </Card.Title>
                                    <Card.Text>Price per piece: {CURRENCY_FORMATTER.format(itemEntry.item.price)}</Card.Text>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                    <Card style={{ width: '18rem' }} className='mb-4'>
                        <Card.Body as="h5">Total {CURRENCY_FORMATTER.format(totalPrice)}</Card.Body>
                    </Card>
                    <Button
                        style={{ width: '18rem' }}
                        variant='dark'
                        className='text-uppercase'
                        onClick={handleCompleteOrder}>
                        Complete order
                    </Button>
                </Col>
            </Row>
        </>
    );

}
