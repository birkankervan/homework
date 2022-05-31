import express from 'express'
import teamMembers from './data/data.js'

const makeid = () => {
  return Math.floor(Math.random() * 1000000000)
}

const PORT = process.env.PORT || 3000
const app = express()

let response = {}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))

app.get('/api/team', (req, res) => {
  const { s } = req.query
  if (s) {
    const searchResult = teamMembers.filter(
      (member) =>
        member.name
          .toLocaleLowerCase('tr-TR')
          .includes(s.toLocaleLowerCase('tr-TR')) ||
        member.surname
          .toLocaleLowerCase('tr-TR')
          .includes(s.toLocaleLowerCase('tr-TR')) ||
        member.title
          .toLocaleLowerCase('tr-TR')
          .includes(s.toLocaleLowerCase('tr-TR'))
    )

    if (searchResult.length) {
      response = {
        statusCode: 200,
        status: true,
        members: searchResult,
        message: 'Success',
      }
    } else {
      response = {
        statusCode: 404,
        status: false,
        members: [],
        message: 'Not Found',
      }
    }

    return res.send(response)
  }

  response = {
    statusCode: 200,
    status: true,
    members: teamMembers || [],
    message: 'Success',
  }
  res.send(response)
})

app.get('/api/team/:id', (req, res) => {
  const id = req.params.id
  const searchResult = teamMembers.find((member) => member.id == id)

  if (searchResult) {
    response = {
      statusCode: 200,
      status: true,
      member: searchResult,
      message: 'Success',
    }
    res.send(response)
  } else {
    response = {
      statusCode: 404,
      status: false,
      member: [],
      message: 'ID Not Found!',
    }
  }
})

app.put('/api/team/:id', (req, res) => {
  const id = req.params.id
  const index = teamMembers.findIndex((member) => member.id == id)
  if (index === -1) {
    response = {
      statusCode: 404,
      status: false,
      member: [],
      message: 'ID not found.',
    }
    return res.send(response)
  }
  const updatedMember = { ...teamMembers[index], ...req.body }

  response = {
    statusCode: 200,
    status: true,
    member: teamMembers[index],
    message: 'Success',
  }

  teamMembers[index] = updatedMember
  res.status(200).json(response)
})

app.delete('/api/team/:id', (req, res) => {
  const id = req.params.id
  const index = teamMembers.findIndex((member) => member.id == id)

  if (index === -1) {
    response = {
      statusCode: 404,
      status: false,
      member: [],
      message: 'ID not found.',
    }
    return res.send(response)
  }
  teamMembers.splice(index, 1)
  response = {
    statusCode: 200,
    status: true,
    member: [],
    message: 'Member removed',
  }
  res.status(200).json(response)
})

app.post('/api/team', (req, res) => {
  const newMember = {
    id: makeid(),
    ...req.body,
  }

  teamMembers.push(newMember)
  response = {
    statusCode: 200,
    status: true,
    member: newMember,
    message: 'Member added',
  }
  res.status(200).json(response)
})

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found')
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
