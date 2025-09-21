import { collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, doc } from "firebase/firestore"
import { db } from "./firebase"
import type { CartItem, Purchase } from "@/types/cart"
import type { Product } from "@/types/product"

const CART_COLLECTION = "cart"
const PURCHASES_COLLECTION = "purchases"

export async function addToCart(userId: string, product: Product): Promise<void> {
  // Check if item already exists in cart
  const q = query(collection(db, CART_COLLECTION), where("userId", "==", userId), where("productId", "==", product.id))

  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    // Update quantity if item exists
    const existingItem = querySnapshot.docs[0]
    const currentQuantity = existingItem.data().quantity || 1
    await updateDoc(existingItem.ref, {
      quantity: currentQuantity + 1,
      updatedAt: new Date(),
    })
  } else {
    // Add new item to cart
    const cartItem = {
      userId,
      productId: product.id,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      },
      quantity: 1,
      addedAt: new Date(),
    }

    await addDoc(collection(db, CART_COLLECTION), cartItem)
  }
}

export async function removeFromCart(userId: string, productId: string): Promise<void> {
  const q = query(collection(db, CART_COLLECTION), where("userId", "==", userId), where("productId", "==", productId))

  const querySnapshot = await getDocs(q)
  querySnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })
}

export async function updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await removeFromCart(userId, productId)
    return
  }

  const q = query(collection(db, CART_COLLECTION), where("userId", "==", userId), where("productId", "==", productId))

  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    const cartItemDoc = querySnapshot.docs[0]
    await updateDoc(cartItemDoc.ref, {
      quantity,
      updatedAt: new Date(),
    })
  }
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  // Use simple query to avoid index requirements
  const q = query(collection(db, CART_COLLECTION), where("userId", "==", userId))

  const querySnapshot = await getDocs(q)
  const items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CartItem[]
  
  // Sort in memory instead of in Firestore
  return items.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
}

export async function clearCart(userId: string): Promise<void> {
  const q = query(collection(db, CART_COLLECTION), where("userId", "==", userId))

  const querySnapshot = await getDocs(q)
  querySnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })
}

export async function createPurchase(
  userId: string, 
  cartItems: CartItem[], 
  paymentDetails?: {
    paymentMethod: string
    paymentId: string
    orderId: string
    signature: string
  }
): Promise<string> {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const purchase: Omit<Purchase, "id"> = {
    buyerId: userId,
    items: cartItems,
    totalAmount,
    status: paymentDetails ? "completed" : "pending", // Complete if payment details provided
    createdAt: new Date(),
    completedAt: paymentDetails ? new Date() : undefined,
    paymentDetails, // Store payment information
  }

  const docRef = await addDoc(collection(db, PURCHASES_COLLECTION), purchase)

  // Update product status to "sold" for each purchased item
  for (const item of cartItems) {
    const productRef = doc(db, "products", item.productId)
    await updateDoc(productRef, {
      status: "sold",
      updatedAt: new Date(),
      soldAt: new Date(),
      buyerId: userId, // Track who bought it
    })
  }

  // Clear cart after successful purchase
  await clearCart(userId)

  return docRef.id
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  // Use simple query to avoid index requirements
  const q = query(collection(db, PURCHASES_COLLECTION), where("buyerId", "==", userId))

  const querySnapshot = await getDocs(q)
  const purchases = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Purchase[]
  
  // Sort in memory instead of in Firestore
  return purchases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
