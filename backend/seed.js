import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import State from './models/stateModel.js';


// Load environment variables so we can access your MONGO_URI
dotenv.config();

const seedDatabase = async () => {
    try {
        // 1. Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅ Database connected successfully.');

        // 2. Read the JSON file
        // fs.readFileSync reads the file from your hard drive
        const statesData = JSON.parse(
            fs.readFileSync('./data/states.json', 'utf-8')
        );

        // 3. Insert the data safely
        let addedCount = 0;

        for (const state of statesData) {
            // Check if the state already exists to prevent duplicate errors
            const existingState = await State.findOne({ name: state.name });

            if (!existingState) {
                await State.create(state);
                console.log(`+ Added: ${state.name}`);
                addedCount++;
            } else {
                console.log(`>> Skipped: ${state.name} (Already exists)`);
            }
        }

        console.log(`\n Seeding Complete! Added ${addedCount} new states.`);

        // 4. Disconnect and close the script
        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error seeding data:');
        console.error(error);
        process.exit(1);
    }
};

// Run the function
seedDatabase();