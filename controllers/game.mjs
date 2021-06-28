// Generate deck of cards
var makeDeck = function () {
  // Initialise an empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName == 1) {
        cardName = 'ace';
      } else if (cardName == 11) {
        cardName = 'jack';
      } else if (cardName == 12) {
        cardName = 'queen';
      } else if (cardName == 13) {
        cardName = 'king';
      }

      // Create a new card with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // Add the new card to the deck
      cardDeck.push(card);

      // Increment rankCounter to iterate over the next rank
      rankCounter += 1;
    }

    // Increment the suit index to iterate over the next suit
    suitIndex += 1;
  }

  // Return the completed card deck
  return cardDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

// Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

/**
 * Compares the two cards to find the winner
 * @param playerOneCard Card object { name, suit, rank}
 * @param playerTwoCard 
 * Returns a string about outcome
 */
const findWinner = (playerOneCard, playerTwoCard) => {
  if (playerOneCard.rank > playerTwoCard.rank) {
    return 'player'
  } else if (playerOneCard.rank < playerTwoCard.rank) {
    return 'opponent'
  } 
  return 'draw'
}


export default function initGameController(db) {
  // Generates a new random player
  const start = async (req, res) => {
    const { userId } = req.cookies;

      try {
        // Get current player
        const currentPlayer = await db.User.findByPk(userId);

        // Get all players
        const allPlayers = await db.User.findAll();

        // Get a random player
        let opponent = await db.User.findOne( {
            order: db.sequelize.random()
        })

        // Make sure that current player is not the randomly selected
        while (currentPlayer.id == opponent.id) {
        // Get random player
          opponent = await db.User.findOne( {
            order: db.sequelize.random()
          })
        }      
        // Every time the game starts, we create a new deck of cards
        const newDeck = shuffleCards(makeDeck())
        const newGame = await db.Game.create({
          // Store the cards inside the gameState
          gameState: { 
            cards: newDeck,
            opponentId: opponent.id,
          }
        })

        // Add this new game + users into the game_users table
        await db.GameUser.create( {
          gameId: newGame.id,
          userId: opponent.id,
        })

        await db.GameUser.create( {
          gameId: newGame.id,
          userId: currentPlayer.id
        })

        // Send the game Id as a cookie so I can store the users later
        res.cookie('gameId', newGame.id)
        res.send({currentPlayer, opponent})
      }
      catch (error) {
        console.log(error)
        res.sendStatus(403, error)
      }
  }
    // Will deal one card to each player and evaluate which player won
  const deal = async (req, res) => {
      const { userId, gameId } = req.cookies;

      try {
        // Get the current game (which has cards + opponent id)
        const game = await db.Game.findOne(
          { where: { id: gameId }}
        )

        const deck = game.gameState.cards;
        const opponent = game.gameState.opponentId;

        // Deal one card to each player
        const playerCard = deck.pop()
        const opponentCard = deck.pop()

        // Compare the cards -> string 'player', 'opponent', 'draw'
        const winnerString = findWinner(playerCard, opponentCard)

        // Record the result in my DB games_users
        // Get hold of all the games with the game id from games_users table
        const bothGames = await db.GameUser.findAll( {
          where: { gameId }
        })

        // For each game_user row, if it is the user id + user won, update true
        // if opponent id + opponent won, update false
        bothGames.forEach( async (gameUser) => {
          // Gets the player's game_user object
          // use == to check for userId without type
          if (gameUser.userId == userId) {
            // If the player wins
            if (winnerString === 'player'){
              gameUser.won = true
            } else {
              gameUser.won = false
            }
          }
          else { 
            if (winnerString === 'opponent') {
              gameUser.won = true
            } else {
              gameUser.won = false
            }
          }
          // Saves the updated keys
          await gameUser.save();
        })

        res.send(winnerString)
      } 
      catch (error) {
        console.log('error evaluating cards', error)
      }
  }

  return { start, deal }
}