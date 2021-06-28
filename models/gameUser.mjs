export default function initGameUserModel(sequelize, DataTypes) {
  return sequelize.define(
    'gamesUser', 
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      gameId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'games',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      won: {
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
    }
    )
  }