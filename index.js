/* eslint-disable no-console */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json());

morgan.token('postData',(req,res) => req.method === 'POST'? JSON.stringify(req.body):' ');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Sean Evans",
        "number": "040-1234233",
        "id": 3
    }
];
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/info', (request, response) => {
    response.send(`
    <p>The phonebook has entries for ${persons.length} people</p>
    <p>${new Date().toUTCString()}</p>
    `);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    let person = persons.find(p => p.id === id);
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const generateID = () => {
        let id = Math.floor(Math.random() * 10000 + 1)
        return id
    }

    let receivedPerson = request.body;
    if (!receivedPerson.name)
        return response.status(400).json({ error: "name is missing" })
    if (!receivedPerson.number)
        return response.status(400).json({ error: "number is missing" })
    if (persons.findIndex(p=>p.name===receivedPerson.name)!==-1)
        return response.status(400).json({ error: "name must be unique" })
    let newPerson = {
        name: receivedPerson.name,
        number: receivedPerson.number,
        id: generateID()
    }
    persons = persons.concat(newPerson)
    response.status(201).json(newPerson)
})
const PORT = process.env.PORT ||3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))