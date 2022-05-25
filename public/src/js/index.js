const notification = document.querySelector('.message')
const dialog = document.querySelector('dialog')
const successMessage = document.querySelector('.success-text')
const submitButton = document.querySelector('#submitButton')
const successBox = document.querySelector('.message-box')
const inputs = document.querySelectorAll('input')
const searchBar = document.querySelector('#search')
searchBar.onkeyup = (e) => {
  search(e.target.value)
}
searchBar.autocomplete = 'off'
successBox.classList.add('d-none')

const clearNotifications = () =>
  setTimeout(() => {
    notification.innerHTML = ''
    successBox.classList.add('d-none')
  }, 3000)

const deleteMember = async (id) => {
  const res = await fetch('/api/team/' + id, { method: 'delete' })
  const data = await res.json()
  const { message } = data
  notification.innerHTML = message
  successBox.classList.remove('d-none')
  clearNotifications()
  loadMembers()
}

const getMember = async (id) => {
  dialog.setAttribute('open', 'true')
  const res = await fetch('/api/team/' + id)
  const data = await res.json()
  const { member } = data

  inputs.forEach((input) => {
    input.value = member[input.name] ?? input.value
  })
  submitButton.setAttribute('onclick', 'updateMember()')
}

const search = async (s) => {
  const res = await fetch('/api/team?s=' + s)
  const data = await res.json()
  const { members, message } = data
  const table = document.querySelector('table')
  const tbody = document.querySelector('tbody')
  if (tbody) {
    table.removeChild(tbody)
  }
  if (members.length) {
    const tableData = members
      .map(
        (member) =>
          `<tr><th>${member.name}</th><th>${member.surname}</th><th>${
            member.birthdate
          }</th><th>${
            member.title
          }</th><th><span class="action" onclick="deleteMember(${member.id.toString()})">Delete</span> - <span class="action" onclick="getMember(${
            member.id
          })">Update</span></th></tr>`
      )
      .join('')

    const htmlObject = document.createElement('tbody')
    htmlObject.innerHTML = tableData
    table.appendChild(htmlObject)
  } else {
    const tableData = `<tr><th><h3 class="search-bar">${message}</h3></th></tr>`
    const htmlObject = document.createElement('tbody')
    htmlObject.innerHTML = tableData
    table.appendChild(htmlObject)
  }
}

const updateMember = async () => {
  const id = inputs[0].value
  let data = {}
  inputs.forEach((input) => {
    if (input.name !== 'id') {
      data = { ...data, [input.name]: input.value }
    }
  })

  const res = await fetch('/api/team/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const updateRes = await res.json()
  const { member } = await updateRes
  if (member) {
    successMessage.style.display = 'block'
    loadMembers()
    setTimeout(() => {
      closeUpdate()
      successMessage.style.display = 'none'
    }, 1000)
  }
}

const closeUpdate = () => {
  dialog.removeAttribute('open')
  submitButton.removeAttribute('onclick')
  inputs.forEach((input) => {
    input.value = ''
  })
}

const loadMembers = async () => {
  const res = await fetch('/api/team')
  const data = await res.json()
  const { members } = data
  const table = document.querySelector('table')
  const tbody = document.querySelector('tbody')
  if (tbody) {
    table.removeChild(tbody)
  }
  const tableData = members
    .map(
      (member) =>
        `<tr><th>${member.name}</th><th>${member.surname}</th><th>${
          member.birthdate
        }</th><th>${
          member.title
        }</th><th><span class="action" onclick="deleteMember(${member.id.toString()})">Delete</span> - <span class="action" onclick="getMember(${
          member.id
        })">Update</span></th></tr>`
    )
    .join('')

  const htmlObject = document.createElement('tbody')
  htmlObject.innerHTML = tableData
  table.appendChild(htmlObject)
}

const addMemberFetch = async () => {
  let data = {}

  inputs.forEach((input) => {
    if (input.name !== 'id') {
      data = { ...data, [input.name]: input.value }
    }
  })
  const res = await fetch('/api/team/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const member = await res.json()
  if (member) {
    successMessage.style.display = 'block'
    loadMembers()
    setTimeout(() => {
      closeUpdate()
      successMessage.style.display = 'none'
    }, 1000)
  }
}

const addMember = async () => {
  dialog.setAttribute('open', 'true')
  submitButton.setAttribute('onclick', 'addMemberFetch()')
  const form = document.querySelector('.form')
  form.children[0].innerHTML = 'New Member Form'
  const idInput = inputs[0]
  idInput.parentElement.style.display = 'none'
}

loadMembers()
