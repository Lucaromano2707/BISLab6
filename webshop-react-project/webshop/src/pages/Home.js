import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <header className="text-center">
                <h1>Welcome to BikeStore!</h1>
                <p className="lead">Explore the World on Two Wheels</p>
            </header>

            <section className="mt-5">
                <h2 className="text-center">Discover Our Bikes</h2>
                <p className="text-center">Find the perfect bike for your next adventure.</p>
                <Row className="mt-4">
                    <Col md={4}>
                        <Card className="bg-light">
                            <Card.Body>
                                <Card.Title className="text-primary">🚴‍♂️ Road Bikes</Card.Title>
                                <Card.Text>Explore our collection of road bikes designed for speed and endurance.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="bg-light">
                            <Card.Body>
                                <Card.Title className="text-success">🚵‍♀️ Mountain Bikes</Card.Title>
                                <Card.Text>Conquer the trails with our rugged and reliable mountain bikes.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="bg-light">
                            <Card.Body>
                                <Card.Title className="text-warning">⚡ Electric Bikes</Card.Title>
                                <Card.Text>Experience effortless riding with our cutting-edge electric bikes.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </section>

            <div className='mt-4 text-center'>
                <Button style={{ width: '18rem' }}
                    variant='dark text-uppercase'
                    onClick={() => navigate("/store")} >
                    Explore Now
                </Button>
            </div>
        </Container>
    );
};

