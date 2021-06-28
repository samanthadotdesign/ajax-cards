import db from './models/index.mjs';

// import your controllers here
import initUserController from './controllers/user.mjs';
import initGameController from './controllers/game.mjs';

export default function bindRoutes(app) {
  // initialize the controller functions here
  // pass in the db for all callbacks
  const UserController = initUserController(db)
  const GameController = initGameController(db)

  // On page load, render the page
  app.get('/', (req, res) => { res.render('login') }) ;

  // When user clicks on the login button
  app.post('/login', UserController.login)
  app.post('/signup', UserController.signup)

  app.post('/start', GameController.start)
  app.post('/deal', GameController.deal)

}
