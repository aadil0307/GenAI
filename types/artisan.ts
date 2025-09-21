export interface ArtisanProfile {
  uid: string
  email: string
  username: string
  // Basic info
  firstName?: string
  lastName?: string
  displayName?: string
  
  // Artisan-specific fields
  craftType: string
  experience: string // e.g., "5 years", "Since childhood", "20+ years"
  location: string
  bio?: string
  
  // Storytelling fields
  artisticJourney?: string
  heritage?: string
  inspiration?: string
  techniques?: string[]
  specialties?: string[]
  
  // AI-generated content
  aiGeneratedStory?: string
  marketingHeadline?: string
  tagline?: string
  socialMediaBio?: string
  
  // Media
  profileImage?: string
  portfolioImages?: string[]
  workshopImages?: string[]
  
  // Business info
  businessName?: string
  establishedYear?: number
  website?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    etsy?: string
    pinterest?: string
  }
  
  // Reach analytics
  profileViews?: number
  storyShares?: number
  productsSold?: number
  customerReviews?: number
  averageRating?: number
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  isVerified?: boolean
  featuredArtisan?: boolean
}

export interface CraftCategory {
  id: string
  name: string
  description: string
  subcategories?: string[]
  traditionalTechniques?: string[]
}

export const CRAFT_CATEGORIES: CraftCategory[] = [
  {
    id: "pottery",
    name: "Pottery & Ceramics",
    description: "Handcrafted clay vessels, sculptures, and functional ceramics",
    subcategories: ["Functional Pottery", "Decorative Ceramics", "Sculpture", "Tiles"],
    traditionalTechniques: ["Wheel throwing", "Hand building", "Glazing", "Raku firing"]
  },
  {
    id: "textiles",
    name: "Textiles & Weaving",
    description: "Traditional and contemporary textile arts",
    subcategories: ["Handwoven Fabrics", "Embroidery", "Quilting", "Tapestries"],
    traditionalTechniques: ["Hand weaving", "Block printing", "Natural dyeing", "Hand spinning"]
  },
  {
    id: "jewelry",
    name: "Jewelry & Metalwork",
    description: "Handcrafted jewelry and metal art pieces",
    subcategories: ["Silver Jewelry", "Beadwork", "Wire Wrapping", "Metal Sculpture"],
    traditionalTechniques: ["Silversmithing", "Stone setting", "Engraving", "Filigree"]
  },
  {
    id: "woodwork",
    name: "Woodworking & Carving",
    description: "Furniture, sculptures, and functional wooden items",
    subcategories: ["Furniture", "Wood Sculpture", "Turned Wood", "Decorative Boxes"],
    traditionalTechniques: ["Hand carving", "Joinery", "Wood turning", "Marquetry"]
  },
  {
    id: "leather",
    name: "Leather Crafts",
    description: "Handcrafted leather goods and accessories",
    subcategories: ["Bags & Purses", "Belts", "Wallets", "Decorative Items"],
    traditionalTechniques: ["Hand stitching", "Tooling", "Dyeing", "Embossing"]
  },
  {
    id: "glass",
    name: "Glasswork",
    description: "Blown glass, stained glass, and glass art",
    subcategories: ["Blown Glass", "Stained Glass", "Fused Glass", "Glass Sculpture"],
    traditionalTechniques: ["Glassblowing", "Glass cutting", "Lead came", "Kiln forming"]
  },
  {
    id: "paper",
    name: "Paper Arts",
    description: "Handmade paper, bookbinding, and paper crafts",
    subcategories: ["Handmade Paper", "Bookbinding", "Calligraphy", "Paper Sculpture"],
    traditionalTechniques: ["Paper making", "Letterpress", "Hand binding", "Marbling"]
  },
  {
    id: "fiber",
    name: "Fiber Arts",
    description: "Knitting, crocheting, and fiber-based crafts",
    subcategories: ["Knitted Items", "Crocheted Goods", "Felt Work", "Macrame"],
    traditionalTechniques: ["Hand knitting", "Natural fiber processing", "Wet felting", "Spinning"]
  },
  {
    id: "stone",
    name: "Stone & Sculpture",
    description: "Stone carving, sculpture, and masonry crafts",
    subcategories: ["Stone Sculpture", "Carved Stones", "Decorative Elements"],
    traditionalTechniques: ["Stone carving", "Polishing", "Inlay work", "Relief carving"]
  },
  {
    id: "traditional",
    name: "Traditional Crafts",
    description: "Region-specific traditional handicrafts",
    subcategories: ["Folk Art", "Cultural Crafts", "Heritage Techniques", "Tribal Arts"],
    traditionalTechniques: ["Varies by region", "Ancestral methods", "Cultural patterns"]
  }
]

export interface StorytellingPrompt {
  id: string
  question: string
  category: 'journey' | 'heritage' | 'technique' | 'inspiration' | 'future'
  helpText?: string
}

export interface DigitalReachMetrics {
  profileViews: number
  storyViews: number
  productViews: number
  socialShares: number
  inquiries: number
  sales: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  date: Date
}