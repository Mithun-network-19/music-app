/**
 * MongoDB Connection Test Script
 * Run this to verify your MongoDB connection
 * Usage: node test-connection.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     MongoDB Connection Test                            ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Hide password in output
const maskedUri = process.env.MONGODB_URI 
  ? process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')
  : 'NOT SET';

console.log('📍 Connection String:', maskedUri);
console.log('🔄 Attempting to connect...\n');

if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set in .env file\n');
  console.log('📝 To fix this:');
  console.log('   1. Open backend/.env file');
  console.log('   2. Add your MongoDB connection string:');
  console.log('      MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/music_db\n');
  process.exit(1);
}

// Set timeout for connection attempt
const timeout = setTimeout(() => {
  console.error('❌ Connection timeout (30 seconds)\n');
  console.log('💡 Troubleshooting tips:');
  console.log('   1. Check your internet connection');
  console.log('   2. Verify MongoDB Atlas IP whitelist (use 0.0.0.0/0)');
  console.log('   3. Confirm username and password are correct');
  console.log('   4. Make sure cluster is active in MongoDB Atlas\n');
  process.exit(1);
}, 30000);

// Attempt connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
})
  .then(() => {
    clearTimeout(timeout);
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ SUCCESS! Connected to MongoDB                     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('📊 Connection Details:');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Port: ${mongoose.connection.port || 'default'}`);
    console.log(`   Ready State: ${mongoose.connection.readyState} (1 = connected)\n`);
    
    // Test database operations
    console.log('🧪 Testing database operations...\n');
    
    mongoose.connection.db.admin().listDatabases()
      .then(result => {
        console.log('✅ Database access verified!');
        console.log(`   Available databases: ${result.databases.length}\n`);
        
        // List collections in current database
        return mongoose.connection.db.listCollections().toArray();
      })
      .then(collections => {
        console.log('📁 Collections in "music_db":');
        if (collections.length === 0) {
          console.log('   (No collections yet - this is normal for a new database)\n');
        } else {
          collections.forEach(col => {
            console.log(`   - ${col.name}`);
          });
          console.log();
        }
        
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║  🎉 All tests passed! Your database is ready!         ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');
        console.log('Next steps:');
        console.log('   1. Start the server: npm run dev');
        console.log('   2. Open admin page: http://localhost:5000/admin.html');
        console.log('   3. Login with: mithun / 142011');
        console.log('   4. Start uploading songs! 🎵\n');
        
        process.exit(0);
      })
      .catch(err => {
        console.error('⚠️  Warning: Could not list collections:', err.message);
        console.log('\nThe connection works, but there might be permission issues.');
        console.log('Make sure your MongoDB user has "readWrite" access.\n');
        process.exit(0);
      });
  })
  .catch((err) => {
    clearTimeout(timeout);
    console.error('╔════════════════════════════════════════════════════════╗');
    console.error('║  ❌ FAILED! Could not connect to MongoDB              ║');
    console.error('╚════════════════════════════════════════════════════════╝\n');
    console.error('📋 Error Details:');
    console.error(`   ${err.message}\n`);
    
    console.log('💡 Common Solutions:\n');
    
    if (err.message.includes('Authentication failed')) {
      console.log('🔑 Authentication Error:');
      console.log('   ✓ Check username and password in .env file');
      console.log('   ✓ Make sure password has no spaces');
      console.log('   ✓ URL-encode special characters in password:');
      console.log('     @ → %40, # → %23, $ → %24, % → %25');
      console.log('   ✓ Try resetting password in MongoDB Atlas\n');
    } 
    else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.log('🌐 Network Error:');
      console.log('   ✓ Check your internet connection');
      console.log('   ✓ Verify the cluster URL is correct');
      console.log('   ✓ Try disabling VPN temporarily');
      console.log('   ✓ Check if firewall is blocking MongoDB\n');
    }
    else if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.log('🔒 IP Whitelist Error:');
      console.log('   ✓ Go to MongoDB Atlas → Network Access');
      console.log('   ✓ Add 0.0.0.0/0 to allow all IPs');
      console.log('   ✓ Wait 1-2 minutes for changes to apply\n');
    }
    else {
      console.log('📖 General Troubleshooting:');
      console.log('   ✓ Read MONGODB_SETUP_GUIDE.md for detailed setup');
      console.log('   ✓ Verify .env file exists and has MONGODB_URI');
      console.log('   ✓ Make sure MongoDB cluster is active');
      console.log('   ✓ Try copying connection string again from Atlas\n');
    }
    
    console.log('📚 Need more help? Check:');
    console.log('   - MONGODB_SETUP_GUIDE.md (in project root)');
    console.log('   - https://docs.mongodb.com/guides/');
    console.log('   - MongoDB Atlas support: https://www.mongodb.com/support\n');
    
    process.exit(1);
  });
