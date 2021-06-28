module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('games_users','won', Sequelize.BOOLEAN)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('games_users', 'won');
  }
};
