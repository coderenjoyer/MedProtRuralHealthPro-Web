import { setupUserDatabase } from './src/Firebase/setupUserDatabase';

console.log('Starting user database setup...');
setupUserDatabase().then(() => {
  console.log('User database setup completed!');
  process.exit(0);
}).catch((error) => {
  console.error('User database setup failed:', error);
  process.exit(1);
}); 