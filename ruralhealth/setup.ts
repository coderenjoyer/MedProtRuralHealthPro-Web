import { setupDatabase } from './src/Firebase/setupDatabase';

console.log('Starting database setup...');
setupDatabase().then(() => {
  console.log('Database setup completed!');
  process.exit(0);
}).catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
}); 