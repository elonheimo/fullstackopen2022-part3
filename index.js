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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})



const randID = () => {
    while (true) {
        let rand = Math.floor(Math.random() * 10000)
        if (!persons.find( person => person.id === rand)) {
            return rand
        }
    }
}

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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})