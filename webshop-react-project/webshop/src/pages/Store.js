import { Row, Col } from "react-bootstrap"
import { ProductCard } from "../components/ProductCard"
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { PRODUCT_API_BASE_URL } from "../utilities/apiUrls";

const PRODUCTS_QUERY = `
{
  products {
    id
    name
    price
    details {
      material
      cassette
      rim
      tires
      brakes
    }
  }
}
`;

export function Store() {
  const [products, setProducts] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post(PRODUCT_API_BASE_URL, {
      query: PRODUCTS_QUERY,
    }).then(response => {
      setProducts(response.data.products);
      setLoading(false);
      console.log('data from product service: ', response.data);
    }).catch(error => {
      setLoading(false);
      setError(error);
      console.error('Error:', error);
    });
  }, []);

  if (loading) return "Loading...";
  if (error) return `Error: ${error.message}`;
  if (!Array.isArray(products) || products.length === 0) return "No data!";

  return (
    <>
      <h1 className="mb-4">Store</h1>
      <Row md={2} xs={1} lg={3} className="g-3">
        {
          products.map(item => {
            return (
              <Col key={item.id}>
                <ProductCard product={item} imgUrl={`/imgs/${item.id}.jpg`} />
              </Col>
            )
          })
        }
      </Row>
    </>
  )
}
