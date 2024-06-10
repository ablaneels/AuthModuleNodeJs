const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors()); // This will enable CORS for all routes
app.use(express.json()); // This line is important

// Your routes go here

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  app.use(cors({
    origin: 'http://localhost:3001' // This will allow requests from 'http://localhost:3001' only
  }));
let users = [];

app.get('/', async (req, res) => {
    res.status(200).send('Hello World');
});

app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send({message: 'User created successfully'});
});

app.post('/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send({message: 'User loged successfully'});
    }
});

app.listen(3000);