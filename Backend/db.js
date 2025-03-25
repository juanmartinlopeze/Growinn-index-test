const { Sequelize } = require('sequelize');

// Usa la variable de entorno o pon la URL manualmente
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://innlab_db_test_user:AU33AwxaoeZBCrCjdAWWoYP2NkXfWqdj@dpg-cvh10dvnoe9s73f0hdlg-a/innlab_db_test', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necesario en Render
    }
  },
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('✅ Conectado a PostgreSQL en Render'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

module.exports = sequelize;
