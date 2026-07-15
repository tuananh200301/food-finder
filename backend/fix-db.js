const { sequelize } = require('./src/config/db');

async function fix() {
  try {
    const [results] = await sequelize.query('SHOW INDEX FROM Users WHERE Key_name != "PRIMARY"');
    const keysToDrop = new Set(results.map(r => r.Key_name));
    
    for (let key of keysToDrop) {
      if (key !== 'PRIMARY') {
        console.log(`Dropping index: ${key}`);
        await sequelize.query(`ALTER TABLE Users DROP INDEX \`${key}\``);
      }
    }
    console.log('Fixed extra keys in Users table.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
fix();
