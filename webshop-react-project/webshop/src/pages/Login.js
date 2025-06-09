
import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../hooks/useAppContext';
import { CUSTOMER_API_BASE_URL } from '../utilities/apiUrls';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';

export function Login() {
    const [customerId, setCustomerId] = useState('');
    const [found, setFound] = useState(null);
    const { login } = useAppContext();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (customerId === '') {
            return;
        }

        try {
            const response = await axios.get(`${CUSTOMER_API_BASE_URL}/${customerId}`);
            const data = response.data;
            console.log('data from customer service: ', data);
            login(data);
            setFound(true);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Handle specific error for user not found
                setFound(false);
                console.error('Customer not found');
            }
            // Handle other errors (e.g., network issues)
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: '#f8f9fa' }}>
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ marginTop: '-150px' }}>
                {found === false ? (
                    <Alert variant='danger' className="mb-4" style={{ width: '500px' }}>
                        A customer with the entered customer ID could not be found.
                        Please enter a valid number or contact the store manager!
                    </Alert>
                ) : null}

                <Card style={{ width: '550px', fontSize: '1.3rem', border: '0.85px solid #343a40', borderRadius: '10px' }}>
                    <Card.Body>
                        <Card.Title className='mb-4'>
                            To access our product offerings and begin shopping,
                            please enter your unique customer ID!
                        </Card.Title>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label>Customer ID</Form.Label>
                                <Form.Control
                                    placeholder="Enter your customer ID"
                                    style={{ border: '1px solid #343a40' }}
                                    value={customerId}
                                    onChange={(e) => setCustomerId(e.target.value)}
                                />
                            </Form.Group>

                            <div className="text-center">
                                <Button
                                    variant="dark text-uppercase"
                                    type="submit"
                                    style={{ width: '150px' }}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
