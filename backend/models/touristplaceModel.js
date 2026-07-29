import mongoose from 'mongoose';


//? Create a schema specifically for individual reviews ------------------------------------------
const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        profilePic: {
            type: String, // Store profile picture if available
            default: ''
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true

        }
    },
    { timestamps: true } // Automatically adds the date the comment was posted
);

//?------------------------------------------------------------------------------------

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
            type: String,
            required: [true, 'City or nearest town name is required'],
            trim: true,
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
            required: [true, 'Best time to visit is required (e.g., October to March)'],
            trim: true,
        },
        entryFeesAndTimings: {
            type: String,
            default: 'Free Entry | Open 24 Hours', // Default fallback
            trim: true,
        },
        locationMapLink: {
            type: String,
            required: [true, 'Google Maps link is required'],
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
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviews: [reviewSchema], // Embed the review schema here
        averageRating: {
            type: Number,
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true,
    }
);

//Ensures a tourist place name is unique within its specific STATE
touristPlaceSchema.index({ name: 1, state: 1 }, { unique: true });

// Pre-save middleware to auto-generate the slug from the place name
touristPlaceSchema.pre('validate', function () {
    if (this.name && !this.slug) {
        // Creates a clean URL (e.g., "Tsongmo Lake" -> "tsongmo-lake")
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

});

const TouristPlace = mongoose.model('TouristPlace', touristPlaceSchema);

export default TouristPlace;