import mongoose from 'mongoose';

const uri = process.env.DATABASE_URL; // Your MongoDB connection string

async function clearDatabase() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Drop the entire database
    await mongoose.connection.dropDatabase();
    console.log("Database 'nestjs_dev' has been cleared.");
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    // Close the Mongoose connection
    mongoose.connection.close();
  }
}

// Call the function to clear the database
if (uri) clearDatabase();
else console.log('No database url');
