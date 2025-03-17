import { initializeDatabase } from '../src/Firebase/initializeDatabase.js';

console.log('Starting database initialization...');

initializeDatabase()
  .then(() => {
    console.log('Database initialization completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }); 