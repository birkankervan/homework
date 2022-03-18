import express from 'express'
import teamMembers from '../data/data.js'

const PORT = 3000
const app = express()

app.get('/team', (req, res) => {
        res.send(teamMembers)
})

app.get('/team/:id', (req, res) => {
        const id = req.params.id
        const searchResult = teamMembers.find((member) => member.id === +id)
        if (searchResult) {
                res.send(searchResult)
        } else {
                res.status(404).send('ID not found.')
        }
})

app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
})
