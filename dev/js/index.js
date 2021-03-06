const form = document.getElementById('form')

const task = document.getElementById('task')

const date = document.getElementById('date')

const message = document.getElementById('message')

const radioRed = document.getElementById('red')
const radioOrange = document.getElementById('orange')
const radioGreen = document.getElementById('green')

const taskList = document.getElementById('task-list')

const MILLISECONDS_OF_A_SECOND = 1000;
const MILLISECONDS_OF_A_MINUTE = MILLISECONDS_OF_A_SECOND * 60;
const MILLISECONDS_OF_A_HOUR = MILLISECONDS_OF_A_MINUTE * 60;
const MILLISECONDS_OF_A_DAY = MILLISECONDS_OF_A_HOUR * 24

let REMAINING_DAYS
let REMAINING_HOURS
let REMAINING_MINUTES
let REMAINING_SECONDS

let arrLocalstorage = []
let arrLocalstorageUnique = []

function addZero(i) {
    if(i < 10) i = '0' + i
    return i
}

function todayDate() {
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth()+1
    let yyyy = today.getFullYear()

    dd = addZero(dd)
    mm = addZero(mm)

    return yyyy+'-'+mm+'-'+dd
}

// Countdown
function countdown(date) {
    const NOW = new Date()
    const DURATION = new Date(date) - NOW
    REMAINING_DAYS = Math.floor(DURATION / MILLISECONDS_OF_A_DAY);
    REMAINING_HOURS = Math.floor((DURATION % MILLISECONDS_OF_A_DAY) / MILLISECONDS_OF_A_HOUR);
    REMAINING_MINUTES = Math.floor((DURATION % MILLISECONDS_OF_A_HOUR) / MILLISECONDS_OF_A_MINUTE);
    REMAINING_SECONDS = Math.floor((DURATION % MILLISECONDS_OF_A_MINUTE) / MILLISECONDS_OF_A_SECOND);
}

//Create task list in html
function list() {
    for(let item = 0; item<localStorage.length; item++) {
        arrLocalstorage.push(localStorage.key(item))
        arrLocalstorageUnique = [...new Set(arrLocalstorage)]
        arrLocalstorageUnique.sort()
    }
    for(let itemLocalstorage of arrLocalstorageUnique) {
        if(!document.getElementById('countdown-live'+arrLocalstorageUnique.indexOf(itemLocalstorage))) {
            countdown(new Date(JSON.parse(localStorage.getItem(itemLocalstorage)).date))
            taskList.innerHTML += `<div class="main__item main__color-${JSON.parse(localStorage.getItem(itemLocalstorage)).priority}"><span><i class="fas fa-thumbtack"></i></span><span>${JSON.parse(localStorage.getItem(itemLocalstorage)).task}</span><span id="countdown-live${arrLocalstorageUnique.indexOf(itemLocalstorage)}">${REMAINING_DAYS}D ${REMAINING_HOURS}H ${REMAINING_MINUTES}M ${REMAINING_SECONDS}S</span><span class="delete" id="${itemLocalstorage}"><i class="fas fa-trash-alt"></i></span></div>`
        }
    }
}

//Update countdown
function countdownUpdate() {
    for(let itemLocalstorage of arrLocalstorageUnique) {
        countdown(new Date(JSON.parse(localStorage.getItem(itemLocalstorage)).date))
        document.getElementById('countdown-live'+arrLocalstorageUnique.indexOf(itemLocalstorage)).innerText = `${REMAINING_DAYS}D ${REMAINING_HOURS}H ${REMAINING_MINUTES}M ${REMAINING_SECONDS}S`
    }
}

//Data validation and task creation
form.addEventListener('submit', (e) => {
    e.preventDefault()
    if(task.value === '' || task.value === null || task.value === undefined) {
        e.preventDefault()
        message.innerText = 'Tienes que rellenar el campo de la tarea'
    } else {
        message.innerText = ''

        if(radioRed.checked === false && radioOrange.checked === false && radioGreen.checked === false) {
            e.preventDefault()
            message.innerText = 'Tienes que seleccionar un color de prioridad'
        } else {
            message.innerText = ''

            if (date.value === '' || date.value === null || date.value === undefined) {
                e.preventDefault()
                message.innerText = 'Tienes que seleccionar una fecha'
            } else {
                message.innerText = ''

                if (date.value <= todayDate()) {
                    e.preventDefault()
                    message.innerText = 'La fecha tiene que ser posterior a hoy'
                } else {
                    message.innerText = ''

                    let key = Date.now()
                    const tasks = {
                        task: task.value,
                        priority: form.priority.value,
                        date: date.value
                    }
                    localStorage.setItem(key, JSON.stringify(tasks))
                    countdown(date.value)
                    list()
                    form.reset()
                    location.reload()
                }
            }
        }
    }
})

setInterval(countdown, MILLISECONDS_OF_A_SECOND)
setInterval(countdownUpdate, MILLISECONDS_OF_A_SECOND)
list()

const remove = document.querySelectorAll('.delete')

//Delete task
for(let i = 0; i<localStorage.length; i++) {
    remove[i].addEventListener('click', () => {
        localStorage.removeItem(remove[i].id)
        location.reload()
    })
}
