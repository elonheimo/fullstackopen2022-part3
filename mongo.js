const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://fullstack-johannes:${password}@cluster0.qxopv.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv[3]) {
    const name = process.argv[3]
    const number = process.argv[4]

    const note = new Note({
        name: name,
        number : number.toString(),
    })

    note.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('Phonebook:')
    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(`${note.name} ${note.number}`)
        })
        mongoose.connection.close()
    })
}