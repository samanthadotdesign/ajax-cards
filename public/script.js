const mainDiv = document.querySelector('.main-div')
const formDiv = document.querySelector('.form-div')

/* Create login/register form */ 
const loginInput = document.createElement('input');
loginInput.setAttribute('name', 'email')
loginInput.setAttribute('id', 'email')
loginInput.setAttribute('placeholder', 'Email')
formDiv.appendChild(loginInput)

const passwordInput = document.createElement('input');
passwordInput.setAttribute('type', 'password')
passwordInput.setAttribute('id', 'password')
passwordInput.setAttribute('placeholder', 'Password')
formDiv.appendChild(passwordInput)

const loginBtn = document.createElement('button');
loginBtn.innerHTML = 'Login';
formDiv.appendChild(loginBtn)

const signupBtn = document.createElement('button')
signupBtn.innerHTML = 'Sign up'
formDiv.appendChild(signupBtn)

const startBtn = document.createElement('button');
startBtn.innerHTML = 'Start Game';
startBtn.style.display = 'none'; 
mainDiv.appendChild(startBtn);

const dealBtn = document.createElement('button')
dealBtn.innerHTML = 'Deal';
dealBtn.style.display = 'none'; 
mainDiv.appendChild(dealBtn);

/* Post request if user logs in */ 
loginBtn.addEventListener('click', async () => {
  // Hide the form + buttons
  formDiv.style.display = 'none';
  startBtn.style.display = 'block';

  try {
    await axios
      .post('/login', { 
        email: loginInput.value, 
        password: passwordInput.value 
    });
  } catch (error) {
    console.log(error)
  }
})

/* Post request if user signs up */ 
signupBtn.addEventListener('click', () => {
   // Hide the form + buttons
  formDiv.style.display = 'none';
  startBtn.style.display = 'block';

  try { 
    axios
    .post('/signup', { email: loginInput.value, password: passwordInput.value })
    .then( (result) => { console.log(result.data)});
  } catch (error) {
    console.log(error)
  }
})

/* Start button – creates game record in the DB */ 
startBtn.addEventListener('click', () => {
  // POST: manipulating the database
  axios
  .post('/start')
  .then( (result) => {
    // Display current player
    const { email: playerEmail , id: playerId } = result.data.currentPlayer;
    const currentPlayerDisplay = document.createElement('p');
    currentPlayerDisplay.innerHTML = playerEmail;
    mainDiv.appendChild(currentPlayerDisplay)

    // Display opponent
    const { email: oppEmail , id: oppId } = result.data.opponent;
    const opponentDisplay = document.createElement('p');
    opponentDisplay.innerHTML = oppEmail;
    mainDiv.appendChild(opponentDisplay)

    dealBtn.style.display = 'block'
    startBtn.style.display = 'none'
  })
})

/* Deal button  */ 
dealBtn.addEventListener('click', () => {
  axios
  .post('/deal')
  .then( (result) => {
    console.log(result.data)
  })
})