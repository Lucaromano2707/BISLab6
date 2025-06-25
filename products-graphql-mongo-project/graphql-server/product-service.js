const http = require('http');
const { graphql } = require('graphql');
const schemas = require('./graphql-schemas');
const productSchema = schemas.productSchema;
const MongoClient = require('mongodb').MongoClient;

const dburl = 'mongodb://database:27017';
//const dburl = 'mongodb://localhost:27017';

// DB-Verbindung
const connectToDB = async () => {
    try {
        const client = await MongoClient.connect(dburl);
        console.log('Connected to the database');
        return client;
    } catch (error) {
        console.error('Failed to connect to the db', error);
    }
};

// Root-Objekt mit Resolver-Funktionen:
const root = {

    // Query um ein bestimmtes Produkt abzufragen
    product: async ({ id }) => {
        const client = await connectToDB();
        const db = client.db('productdb');
        const productsColl = db.collection('products');
        const product = await productsColl.findOne({ id: id });
        await client.close();
        return product;
    },

    // Query, um alle Produkte aus der mongoDB zu holen und als Liste zurückzugeben
    products: async () => {
        const client = await connectToDB();
        const db = client.db('productdb');
        const productsColl = db.collection('products');
        const products = await productsColl.find({}).toArray();
        return products;
    },

    // Query, um Produkte eines bestimmten Herstellers zu finden
    productsByProducer: async ({ producer }) => {
        const client = await connectToDB();
        const db = client.db('productdb');
        const productsColl = db.collection('products');
        const products = await productsColl.find({ producer: producer }).toArray();
        await client.close();
        return products;
    },

    // Query, um Produkte anhand eines Namens zu finden
    productsByName: async ({ name }) => {
        const client = await connectToDB();
        const db = client.db('productdb');
        const productsColl = db.collection('products');
        const products = await productsColl.find({ name: name }).toArray();
        await client.close();
        return products;
    },

    // Mutation, um ein neues Produkt in die mongoDB einzufügen
    addProduct: async ({ input }) => {
        const newProduct = input;
        const client = await connectToDB();
        const db = client.db('productdb');
        const productsColl = db.collection('products');
        await productsColl.insertOne(newProduct);
        await client.close();
        return newProduct;
    },

    // Mutation, um über ID ein bestimmtes Produkt zu löschen
    deleteProduct: async (id) => {
        const proId = id.id;
        const client = await connectToDB();
        const db = client.db('productdb');
        const productsColl = db.collection('products');
        const deleted = await productsColl.findOneAndDelete({ id: proId });
        await client.close();
        return deleted.value;
    }
};

// Ausgelagerte Methode zum Senden der Response
const sendHttpResponse = (response, code, type, body) => {
    response.writeHead(code, {
        'Content-Type': type,
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true'
    });
    response.end(body);
}

// HTTP-Server für Port 8081
http.createServer(function (req, res) {

    // CORS einbinden (Aufgabe 6)
    if (req.method === 'OPTIONS') {
        // Preflight-Anfrage beantworten
        sendHttpResponse(res, 200, 'application/json', '')
        return;
    }

    // Anfragen mit POST (GraphQL erlaubt nur POST)
    if (req.method === 'POST') {
        let body = '';

        // Ankommende Teile der Request zusammenbauen
        req.on('data', chunk => body += chunk);

        // Letztes Teil ist angekommen
        req.on('end', async function () {

            // Query vom Client in JSON parsen
            const { query } = JSON.parse(body);

            // Schema (andere Datei), Query (vom Client) und Root (mit Resolvern) einbinden
            const result = await graphql({schema: productSchema, source: query, rootValue: root});

            // Data entfernen - Start
            let responseBody;

            // Wenn introspection oder kein data → einfach komplett weitergeben
            if (!result.data || query.includes('__schema') || query.includes('__type')) {
                responseBody = JSON.stringify(result);
            } else {
                const [key, value] = Object.entries(result.data)[0];
                responseBody = JSON.stringify({ [key]: value ?? {} });
            }
            // Data entfernen - Ende

            // An ausgelagerte Methode weitergeben
            sendHttpResponse(res, 200, 'application/json', responseBody);
        });
        return;
    }
    
    // Andere Anfragen, die GraphQL nicht erlaubt
    sendHttpResponse(res, 405, 'text/plain', 'Method Not Allowed');
    
}).listen(8081, () => {
    console.log('Server läuft auf Port 8081');
});