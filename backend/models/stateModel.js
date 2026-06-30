import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'State name is required'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required for SEO routing'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'A brief description of the state is required'],
            trim: true,
        },
        coverImage: {
            type: String,
            required: [true, 'Cover image URL is required'],
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Optional: Pre-save middleware to auto-generate a slug if I only want admins to type the name
stateSchema.pre('validate', function () {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().split(' ').join('-');
    }
    
});

const State = mongoose.model('State', stateSchema);

export default State;