/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/mongoPerson');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json());

morgan.token('postData', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : ' ');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/api/persons', (request, response, next) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(p => p.toJSON()));
        })
        .catch(error => next(error));
})

app.get('/info', (request, response, next) => {
    Person
        .count({})
        .then(size => {
            response.send(`
               <p>The phonebook has entries for ${size} people</p>
               <p>${new Date().toUTCString()}</p>
            `);
        })
        .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person)
                response.json(person.toJSON());
            else
                response.status(404).end()
        })
        .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error));
})

app.post('/api/persons', (request, response, next) => {
    var receivedPerson = request.body;
    var newPerson = new Person({
        name: receivedPerson.name,
        number: receivedPerson.number
    })
    newPerson
        .save()
        .then(savedPerson =>
            response.status(201).json(savedPerson.toJSON()))
        .catch(error => next(error));

})

app.put('/api/persons/:id', (request, response, next) => {
    var receivedPerson = request.body;
    if (!receivedPerson.name)
        return response.status(400).json({ error: 'Name is missing' })
    if (!receivedPerson.number)
        return response.status(400).json({ error: 'Number is missing' })
    var updatedPerson = {
        name: receivedPerson.name,
        number: receivedPerson.number
    }
    Person
        .findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
        .then(returnedPerson => response.json(returnedPerson.toJSON()))
        .catch(error => next(error));
})
const unknownEndpoint = (request, response, next) => {
    response.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).json({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({error:error.message});
    }
    next(error);
}
app.use(errorHandler);
const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))