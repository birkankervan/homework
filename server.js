import express from 'express'
import teamMembers from './data/data.js'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/api/team', (req, res) => {
  res.send(teamMembers)
})

app.get('/api/team/:id', (req, res) => {
  const id = req.params.id
  const searchResult = teamMembers.find((member) => member.id == id)

  if (searchResult) {
    res.send(searchResult)
  } else {
    res.status(404).send('ID not found.')
  }
})

app.put('/api/team/:id', (req, res) => {
  const id = req.params.id
  const index = teamMembers.findIndex((member) => member.id == id)
  if (index === -1) {
    return res.status(404).send('ID not found.')
  }

  const updatedMember = { ...teamMembers[index], ...req.body }

  teamMembers[index] = updatedMember
  res.status(200).json(teamMembers[index])
})

app.delete('/api/team/:id', (req, res) => {
  const id = req.params.id
  const index = teamMembers.findIndex((member) => member.id == id)

  if (index === -1) {
    return res.status(404).send('ID not found.')
  }
  teamMembers.splice(index, 1)
  res.status(200).json('Member removed')
})

app.post('/api/team', (req, res) => {
  const newMember = {
    id: teamMembers.length + 1,
    name: req.body.name ?? '',
    surname: req.body.surname ?? '',
    birthdate: req.body.birthdate ?? '',
    title: req.body.title ?? '',
  }
  teamMembers.push(newMember)
  res.redirect(301, '/')
})

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found')
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
