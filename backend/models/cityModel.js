import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'City name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required for SEO routing'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        state: {
            // This creates the relationship between City and State
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
            required: [true, 'A city must belong to a state'],
        },
        description: {
            type: String,
            required: [true, 'A brief description of the city is required'],
            trim: true,
        },
        coverImage: {
            type: String,
            required: [true, 'Cover image URL is required'],
        }
    },
    {
        timestamps: true,
    }
);

// Compound Index: Ensures that a city name is unique ONLY within its specific state.
// This allows two different states to have a city with the same name, which happens occasionally.
citySchema.index({ name: 1, state: 1 }, { unique: true });

// Pre-save middleware to auto-generate the slug from the city name
citySchema.pre('validate', function () {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().split(' ').join('-');
    }
    
});

const City = mongoose.model('City', citySchema);

export default City;