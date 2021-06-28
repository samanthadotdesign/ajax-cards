import bcrypt from 'bcrypt'

export default function initUserController(db) {
  const login = async (req, res ) => {
    const { email, password } = req.body
    console.log('req.body',req.body)
    // If user email exists, then check password 
    // Find instance of user
    try { 
      const user = await db.User.findOne( { where: { email }})

    if (user) {
      // bcrypt.compare(userPassword, dbPassword) to compare  
      // results in a boolean
      const correctPassword = await bcrypt.compare(password, user.password)
      if (correctPassword) {
        // res.cookie doesn't need cookie-parser, normal res object method
        // req.cookie needs cookie-parser
        //  We must terminate the request-response cycle 
        // res.cookie does not terminate 
        res.cookie('userId', user.id);
        res.cookie('loggedIn', 'true');
        res.end();

      } else {
        res.send('incorrect email or password')
      }
    } else {
      res.send('incorrect email or password')
    }
    }
    catch (error) {
      console.log('error logging in', error)
    }
    
  }

  const signup = async (req, res) => {
    const { email, password } = req.body

    try {
      const hashedPassword = await bcrypt.hash(password, 12) 
      // Creating a new user
      await db.User.create( {
        email,
        password: hashedPassword
     })
     res.send('logged in')
    }

    catch (error) {
      console.log('error signing up', error)
      res.send('error')
    }
  }

  return { login, signup }
}