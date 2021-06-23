// Make sure that the random number is not 0 
const randomNumber = (max) => Math.floor(Math.random() * max + 1) 

export default function initGameController(db) {
  const start = async (req, res) => {
    const { userId } = req.cookies;

    // Get all players
    // order: db.sequelize.random() -> to get random index from all players
    
    // Get random player from the DB 
    try {
      const userCount = await db.User.count();
      let randomId = randomNumber(userCount);

      if (randomId != userId) {
        console.log('random id', randomId)
        const opponent = await db.User.findByPk(randomId)
        res.send({ opponent })
        
      } else {
        // Get a new randomId until the randomId is not the userId
        randomNumber(userCount);
      }

    } catch (error) {
      console.log(error)
      res.sendStatus(403, error)
    }
    
  }
  return { start }
}