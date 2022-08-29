const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url  :status :res[content-length] - :response-time ms :body'));

let persons = [
    { name: 'Arto Hellas test', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]

app.get('/info', (req, res) => {
    res.send(`<p> phonebook has info for ${persons.length} people</p>` + `<p>${new Date().toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        console.log('get api/persons', persons)
        res.json(persons)
    })
})



app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log('post body',body)
    
    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    
    if (persons.find( person => person.name === body.name)) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    
    const person = new Person({
        name : body.name,
        number : body.number,
    })
    person.save().then(savedPerson => 
        res.json(savedPerson)
        )
        persons = persons.concat(person) 
        console.log(persons)
    })
    
    app.get('/api/persons/:id', (req, res) => {
        Person.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch( error => {
            next(error)
        })
    })
    
    app.delete('/api/persons/:id', (req, res, next) => {
        Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
    })
    app.put('/api/persons/:id', (req, res, next) => {
        const body = req.body
        const person = {
            name : body.name,
            number : body.number,
    }
    console.log(`delete print ${req.body} ${req.params.id}`)
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(result => {
            res.json(result)
        })
        .catch(error => next(error))
})

//middlewares

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}  

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})