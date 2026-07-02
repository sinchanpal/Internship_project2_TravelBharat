import mongoose from 'mongoose';

const touristPlaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tourist place name is required'],
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
            required: [true, 'A tourist place must belong to a state'],
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City',
            required: [true, 'A tourist place must belong to a city'],
        },
        category: [
            {
                type: String,
                enum: ['Heritage', 'Nature', 'Adventure', 'Religious'],
                required: [true, 'At least one category must be selected']
            }
        ],
        description: {
            type: String,
            required: [true, 'Description and historical significance are required'],
            trim: true,
        },
        coverImage: {
            type: String,
            required: [true, 'Cover image URL is required'],
            trim: true,
        },
        bestTimeToVisit: {
            type: String,
            //required: [true, 'Best time to visit is required (e.g., October to March)'],
            trim: true,
        },
        entryFeesAndTimings: {
            type: String,
            //default: 'Free Entry | Open 24 Hours', // Default fallback
            trim: true,
        },
        locationMapLink: {
            type: String,
            //required: [true, 'Google Maps link is required'],
            trim: true,
        },
        images: [
            {
                type: String,
                //required: [true, 'At least one image URL is required for the gallery']
            }
        ],
        nearbyAttractions: [
            {
                type: String,
                trim: true
            }
        ],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Compound Index: Ensures a tourist place name is unique within its specific city
touristPlaceSchema.index({ name: 1, city: 1 }, { unique: true });

// Pre-save middleware to auto-generate the slug from the place name
touristPlaceSchema.pre('validate', function () {
    if (this.name && !this.slug) {
        // Creates a clean URL (e.g., "Tsongmo Lake" -> "tsongmo-lake")
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
});

const TouristPlace = mongoose.model('TouristPlace', touristPlaceSchema);

export default TouristPlace;