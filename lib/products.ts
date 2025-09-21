import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Product, CreateProductData } from "@/types/product"

const PRODUCTS_COLLECTION = "products"

export async function createProduct(
  productData: CreateProductData,
  sellerId: string,
  sellerName: string,
): Promise<string> {
  try {
    console.log("Creating product with data:", { productData, sellerId, sellerName })
    
    const product = {
      ...productData,
      sellerId,
      sellerName,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active" as const,
    }

    console.log("Product object to save:", product)
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product)
    console.log("Product created successfully:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(productId: string, updates: Partial<CreateProductData>): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId)
  await updateDoc(productRef, {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId)
  await deleteDoc(productRef)
}

export async function getProduct(productId: string): Promise<Product | null> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId)
  const productSnap = await getDoc(productRef)

  if (productSnap.exists()) {
    return {
      id: productSnap.id,
      ...productSnap.data(),
    } as Product
  }

  return null
}

export async function getUserProducts(userId: string): Promise<Product[]> {
  // Use simple query to avoid index requirements
  const q = query(collection(db, PRODUCTS_COLLECTION), where("sellerId", "==", userId))

  const querySnapshot = await getDocs(q)
  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
  
  // Sort in memory instead of in Firestore
  return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getAllProducts(limitCount = 20): Promise<Product[]> {
  try {
    // First try without status filter to see if products exist
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    const querySnapshot = await getDocs(q)
    const allProducts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]

    // Filter for active products in memory instead of Firestore query
    // This avoids potential indexing issues
    return allProducts.filter(product => !product.status || product.status === "active")

  } catch (error) {
    console.error("Error in getAllProducts:", error)
    
    // Fallback: try without any filters
    try {
      const simpleQuery = query(collection(db, PRODUCTS_COLLECTION), limit(limitCount))
      const fallbackSnapshot = await getDocs(simpleQuery)
      return fallbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError)
      return []
    }
  }
}

export async function getProductsByCategory(category: string, limitCount = 20): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where("category", "==", category),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
}

export async function searchProducts(searchTerm: string, limitCount = 20): Promise<Product[]> {
  // Note: This is a basic search. For production, consider using Algolia or similar
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  )

  const querySnapshot = await getDocs(q)
  const allProducts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]

  // Filter by search term in title or description
  return allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

// Debug function to create test products
export async function createTestProducts(): Promise<void> {
  const testProducts = [
    // Electronics & Technology
    {
      title: "MacBook Pro 13-inch (2019)",
      description: "Apple MacBook Pro with Touch Bar, 8GB RAM, 256GB SSD. Great for students and professionals. Minor scratches on bottom but screen is perfect.",
      category: "Electronics",
      price: 899,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "San Francisco, CA",
    },
    {
      title: "iPhone 12 Pro - Gold",
      description: "Unlocked iPhone 12 Pro in beautiful gold color. 128GB storage, no cracks or major damage. Comes with original box and charger.",
      category: "Electronics",
      price: 649,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Austin, TX",
    },
    {
      title: "Samsung Galaxy Watch 4",
      description: "Barely used smartwatch with all original accessories. Perfect for fitness tracking and staying connected.",
      category: "Electronics",
      price: 179,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Seattle, WA",
    },
    {
      title: "Nintendo Switch Console",
      description: "Gaming console with Joy-Con controllers. Some wear on the back but functions perfectly. Great for gaming on the go!",
      category: "Electronics",
      price: 220,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Denver, CO",
    },

    // Clothing & Fashion
    {
      title: "Vintage Levi's Denim Jacket",
      description: "Classic 90s Levi's trucker jacket in medium wash. Authentic vintage piece with perfect fading and character.",
      category: "Clothing",
      price: 68,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Portland, OR",
    },
    {
      title: "Designer Leather Handbag",
      description: "Genuine leather handbag from premium brand. Minimal signs of use, classic black color goes with everything.",
      category: "Clothing",
      price: 145,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Miami, FL",
    },
    {
      title: "Nike Air Jordan Sneakers",
      description: "Retro Air Jordan 1s in good condition. Some creasing but no major damage. Size 10.5 US men's.",
      category: "Clothing",
      price: 120,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Atlanta, GA",
    },

    // Home & Furniture
    {
      title: "Mid-Century Modern Dining Table",
      description: "Beautiful walnut dining table seats 6 people. Authentic 1960s piece with hairpin legs. Some surface scratches add character.",
      category: "Furniture",
      price: 485,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Brooklyn, NY",
    },
    {
      title: "Vintage Persian Rug",
      description: "Hand-woven Persian rug with intricate patterns. 8x10 feet, adds warmth and character to any room.",
      category: "Furniture",
      price: 320,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "San Diego, CA",
    },
    {
      title: "IKEA Standing Desk",
      description: "Adjustable height desk perfect for work from home setup. Minor assembly marks but very functional.",
      category: "Furniture",
      price: 89,
      imageUrl: "/placeholder.jpg",
      condition: "fair" as const,
      location: "Phoenix, AZ",
    },

    // Books & Media
    {
      title: "Harry Potter Complete Book Set",
      description: "All 7 Harry Potter books in hardcover. Great condition with dust jackets. Perfect for collectors or new readers!",
      category: "Books & Media",
      price: 75,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Boston, MA",
    },
    {
      title: "Vinyl Record Collection - Classic Rock",
      description: "25 classic rock vinyl records including Beatles, Led Zeppelin, and Pink Floyd. Some show wear but all play well.",
      category: "Books & Media",
      price: 190,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Nashville, TN",
    },

    // Sports & Recreation
    {
      title: "Road Bike - Trek 2019",
      description: "Carbon fiber road bike in excellent condition. Perfect for commuting or weekend rides. Includes bike computer and lights.",
      category: "Sports & Recreation",
      price: 890,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Boulder, CO",
    },
    {
      title: "Snowboard with Bindings",
      description: "All-mountain snowboard 158cm with Burton bindings. Some base scratches but edges are sharp and ready for the slopes!",
      category: "Sports & Recreation",
      price: 245,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Salt Lake City, UT",
    },

    // Collectibles & Art
    {
      title: "Vintage Camera - Canon AE-1",
      description: "Classic 35mm film camera from the 1980s. Fully functional with 50mm lens. Perfect for film photography enthusiasts.",
      category: "Collectibles",
      price: 165,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Los Angeles, CA",
    },
    {
      title: "Original Framed Artwork",
      description: "Local artist's oil painting of mountain landscape. 24x18 inches, beautifully framed and ready to hang.",
      category: "Collectibles",
      price: 125,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Asheville, NC",
    },

    // Garden & Outdoor
    {
      title: "Weber Gas Grill",
      description: "3-burner gas grill perfect for backyard BBQs. Well-maintained with new grill grates. Includes propane tank and cover.",
      category: "Garden & Outdoor",
      price: 275,
      imageUrl: "/placeholder.jpg",
      condition: "good" as const,
      location: "Dallas, TX",
    },
    {
      title: "Patio Furniture Set",
      description: "4-piece outdoor furniture set with table and chairs. Weather-resistant wicker with comfortable cushions.",
      category: "Garden & Outdoor",
      price: 195,
      imageUrl: "/placeholder.jpg",
      condition: "fair" as const,
      location: "Tampa, FL",
    },

    // Toys & Games
    {
      title: "LEGO Architecture Set Collection",
      description: "5 different LEGO Architecture sets including Statue of Liberty and Empire State Building. All complete with instructions.",
      category: "Toys & Games",
      price: 85,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Minneapolis, MN",
    },
    {
      title: "Board Game Collection",
      description: "15 popular board games including Settlers of Catan, Ticket to Ride, and Azul. All complete and in great condition.",
      category: "Toys & Games",
      price: 145,
      imageUrl: "/placeholder.jpg",
      condition: "excellent" as const,
      location: "Madison, WI",
    }
  ]

  console.log("Starting to create test products...")

  for (const [index, product] of testProducts.entries()) {
    try {
      await createProduct(product, "test-user", "Test User")
      console.log(`Created product ${index + 1}/${testProducts.length}: ${product.title}`)
    } catch (error) {
      console.error(`Failed to create product: ${product.title}`, error)
    }
  }

  console.log(`Successfully created ${testProducts.length} test products!`)
}
