const express = require('express');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const cors = require("cors"); // importiert cors -> von Aufgabe 6

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: 'http://localhost:3000' })); // allows for web-applications on http://localhost:3000

// Pfad zu Kundendaten
const CUSTOMERS_FILE = './customers.json';

// Kunden einlesen
function loadCustomers() {
    const data = fs.readFileSync(CUSTOMERS_FILE, 'utf8');
    return JSON.parse(data);
}

// Kunden speichern
function saveCustomers(customers) {
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
}

// GET /customers
app.get('/customers', (req, res) => {
    const customers = loadCustomers();
    const { name } = req.query;
    if (name) {
        const filtered = customers.filter(c => c.name.includes(name));
        res.json(filtered);
    } else {
        res.json(customers);
    }
});

// GET /customers/:id
app.get('/customers/:id', (req, res) => {
    const customers = loadCustomers();
    const id = parseInt(req.params.id, 10);

    const customer = customers.find(c => c.id === id);
    if (customer) {
        res.json(customer);
    } else {
        res.status(404).send('Customer not found');
    }
});

// POST /customers
app.post('/customers', (req, res) => {
    const customers = loadCustomers();
    const newCustomer = req.body;
    newCustomer.id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    customers.push(newCustomer);
    saveCustomers(customers);
    
    const resourceUrl = `/customers/${newCustomer.id}`;
    res.status(201)
       .location(resourceUrl)
       .send(resourceUrl);
});

// PUT /customers/:id
app.put('/customers/:id', (req, res) => {
    const idFromPath = parseInt(req.params.id); // ID aus URL
    const customers = loadCustomers();
    const index = customers.findIndex(c => c.id === idFromPath);

    const updatedCustomer = { ...req.body, id: idFromPath }; // ID aus URL überschreibt ID in JSON-Body

    //Kunde gibt es noch nicht
    if (index !== -1) {
        customers[index] = updatedCustomer;
        res.status(201).send('Customer updated');
    } 
    //Kunde mit dieser ID neu angelegt
    else {
        customers.push(updatedCustomer);
        res.status(204).send('Customer created');
    }
    saveCustomers(customers);
});

// DELETE /customers/:id
app.delete('/customers/:id', (req, res) => {
    let customers = loadCustomers();
    const id = parseInt(req.params.id);
    const newCustomers = customers.filter(c => c.id !== id);
    if (newCustomers.length === customers.length) {
        res.status(404).send('Customer not found');
    } else {
        saveCustomers(newCustomers);
        res.status(204).send();
    }
});

//Server starten
app.listen(8083, () => console.log('server listening on 8083/api-docs'));