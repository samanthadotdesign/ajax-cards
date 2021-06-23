const bcrypt = require('bcrypt');
const saltRounds = 12;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userList = [];
    const userArray = ['sam@gmail.com', 'kai@ra.com']

    for (let i=0; i < userArray.length; i += 1) {
      const password = await bcrypt.hash('1234', saltRounds);
      const newUser = { 
        email: userArray[i], 
        password, 
        created_at: new Date(), 
        updated_at: new Date() }
      userList.push(newUser);
    }
    await queryInterface.bulkInsert('users', userList);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  }
};
