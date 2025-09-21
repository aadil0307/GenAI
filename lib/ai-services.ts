import { GoogleGenerativeAI } from '@google/generative-ai'

// OpenRouter Configuration (Primary AI Service)
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Gemini Configuration (Backup)
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

if (!OPENROUTER_API_KEY && !GEMINI_API_KEY) {
  console.warn('No AI API keys configured. AI features will not work properly.')
}

export interface ArtisanProfile {
  name: string
  craftType: string
  experience: string
  location: string
  heritage?: string
  inspiration?: string
  techniques?: string[]
}

export interface ProductDetails {
  title: string
  category: string
  materials: string[]
  techniques: string[]
  timeToMake?: string
  inspiration?: string
}

export interface StoryOptions {
  length: number // target word count
  tone: 'warm' | 'professional' | 'casual' | 'inspiring'
  includeHeritage: boolean
  includeInspiration: boolean
  customPrompt?: string
}

export class AIStoryService {
  private model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" }) || null

  private async callOpenRouter(prompt: string): Promise<string> {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured')
    }

    console.log('🔄 Calling OpenRouter API...')

    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://craftconnect.ai',
        'X-Title': 'CraftConnect - AI Artisan Platform',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    console.log('📡 OpenRouter Response Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ OpenRouter API Error:', errorText)
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ OpenRouter Success:', data.choices?.[0]?.message?.content ? 'Content received' : 'No content')
    return data.choices[0]?.message?.content || ''
  }

  private async callGemini(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API is not configured')
    }

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }

  private async generateContent(prompt: string): Promise<string> {
    console.log('🤖 Starting AI content generation...')
    
    // Try OpenRouter first
    if (OPENROUTER_API_KEY) {
      try {
        console.log('🚀 Attempting OpenRouter API call...')
        const result = await this.callOpenRouter(prompt)
        console.log('✅ OpenRouter success!')
        return result
      } catch (error) {
        console.warn('⚠️ OpenRouter failed, checking Gemini fallback:', error)
      }
    } else {
      console.log('⚠️ OpenRouter API key not configured')
    }

    // Try Gemini fallback only if we have a valid key
    if (this.model && GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        console.log('🔄 Attempting Gemini fallback...')
        const result = await this.callGemini(prompt)
        console.log('✅ Gemini fallback success!')
        return result
      } catch (error) {
        console.error('❌ Gemini fallback also failed:', error)
        throw error
      }
    }

    // If we get here, no valid API keys are configured
    const errorMessage = !OPENROUTER_API_KEY && (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here')
      ? 'No valid AI API keys configured. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your .env.local file.'
      : 'All AI services failed. Please check your API keys and try again.'
    
    throw new Error(errorMessage)
  }

  async generateArtisanStory(profile: ArtisanProfile): Promise<string> {
    const prompt = `
      Create a compelling, authentic story for an artisan with the following details:
      - Name: ${profile.name}
      - Craft: ${profile.craftType}
      - Experience: ${profile.experience}
      - Location: ${profile.location}
      ${profile.heritage ? `- Heritage: ${profile.heritage}` : ''}
      ${profile.inspiration ? `- Inspiration: ${profile.inspiration}` : ''}
      ${(profile.techniques && profile.techniques.length > 0) ? `- Techniques: ${profile.techniques.join(', ')}` : ''}

      Write a 200-300 word story that:
      1. Captures their passion and journey
      2. Explains what makes their craft unique
      3. Connects emotionally with potential customers
      4. Highlights their cultural background or heritage if provided
      5. Uses warm, authentic language that reflects their personality

      Make it personal, inspiring, and marketable without being overly promotional.
    `

    try {
      return await this.generateContent(prompt)
    } catch (error) {
      console.error('Error generating artisan story:', error)
      throw new Error('Failed to generate story: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  async generateCustomArtisanStory(profile: ArtisanProfile, options: StoryOptions): Promise<string> {
    const toneDescriptions = {
      warm: 'warm, personal, and heartfelt with family-oriented language',
      professional: 'confident, expert, and business-focused',
      casual: 'friendly, approachable, and conversational',
      inspiring: 'motivational, uplifting, and aspirational'
    }

    const customPrompt = options.customPrompt || `
      Create a ${options.tone} and engaging story for an artisan with the following details:
      - Name: ${profile.name}
      - Craft: ${profile.craftType}
      - Experience: ${profile.experience}
      - Location: ${profile.location}
      ${options.includeHeritage && profile.heritage ? `- Heritage: ${profile.heritage}` : ''}
      ${options.includeInspiration && profile.inspiration ? `- Inspiration: ${profile.inspiration}` : ''}
      ${(profile.techniques && profile.techniques.length > 0) ? `- Techniques: ${profile.techniques.join(', ')}` : ''}

      Write approximately ${options.length} words in a story that:
      1. Uses a ${toneDescriptions[options.tone]} tone throughout
      2. Captures their passion and journey
      3. Explains what makes their craft unique
      4. Connects emotionally with potential customers
      ${options.includeHeritage ? '5. Highlights their cultural background if provided' : ''}
      ${options.includeInspiration ? '6. Weaves in their sources of inspiration' : ''}
      7. Uses authentic language that reflects their personality

      Make it personal, ${options.tone}, and marketable without being overly promotional.
      Target approximately ${options.length} words.
    `

    try {
      return await this.generateContent(customPrompt)
    } catch (error) {
      console.error('Error generating custom artisan story:', error)
      throw new Error('Failed to generate custom story: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  async generateProductDescription(product: ProductDetails, artisanName: string): Promise<string> {
    const prompt = `
      Create an engaging product description for a handcrafted item:
      - Product: ${product.title}
      - Category: ${product.category}
      - Materials: ${product.materials.join(', ')}
      - Techniques: ${product.techniques.join(', ')}
      - Artisan: ${artisanName}
      ${product.timeToMake ? `- Time to create: ${product.timeToMake}` : ''}
      ${product.inspiration ? `- Inspiration: ${product.inspiration}` : ''}

      Write a 100-150 word description that:
      1. Highlights the craftsmanship and uniqueness
      2. Mentions the materials and techniques used
      3. Connects the piece to the artisan's story
      4. Appeals to customers who value authenticity
      5. Includes emotional appeal and practical details

      Focus on the story behind the piece and what makes it special.
    `

    try {
      return await this.generateContent(prompt)
    } catch (error) {
      console.error('Error generating product description:', error)
      throw new Error('Failed to generate description: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  async generateMarketingCopy(artisanName: string, craftType: string, uniqueSellingPoints: string[]): Promise<{
    headline: string
    tagline: string
    socialMediaBio: string
  }> {
    const prompt = `
      Create marketing copy for an artisan:
      - Name: ${artisanName}
      - Craft: ${craftType}
      - Unique selling points: ${uniqueSellingPoints.join(', ')}

      Generate:
      1. A catchy headline (5-8 words)
      2. A memorable tagline (8-12 words)
      3. A social media bio (50-100 words)

      Make it authentic, professional, and appealing to customers who appreciate handcrafted goods.
      Format as JSON: {"headline": "...", "tagline": "...", "socialMediaBio": "..."}
    `

    try {
      const result = await this.generateContent(prompt)
      
      // Try to parse as JSON, fallback to manual parsing if needed
      try {
        return JSON.parse(result)
      } catch {
        // Manual parsing if JSON parsing fails
        const lines = result.split('\n')
        return {
          headline: lines.find(l => l.includes('headline'))?.split(':')[1]?.replace(/[",]/g, '').trim() || 'Authentic Handcrafted Excellence',
          tagline: lines.find(l => l.includes('tagline'))?.split(':')[1]?.replace(/[",]/g, '').trim() || 'Where tradition meets modern craftsmanship',
          socialMediaBio: lines.find(l => l.includes('socialMediaBio'))?.split(':')[1]?.replace(/[",]/g, '').trim() || `${artisanName} - Master ${craftType} artisan creating unique pieces with passion and tradition.`
        }
      }
    } catch (error) {
      console.error('Error generating marketing copy:', error)
      throw new Error('Failed to generate marketing copy: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  async suggestTags(productTitle: string, category: string, materials: string[]): Promise<string[]> {
    const prompt = `
      Suggest 8-12 relevant tags for this handcrafted product:
      - Title: ${productTitle}
      - Category: ${category}
      - Materials: ${materials.join(', ')}

      Include tags for:
      1. Product type and category
      2. Materials used
      3. Style/aesthetic descriptors
      4. Target occasions or uses
      5. Craftsmanship qualities

      Return as a comma-separated list of single words or short phrases.
    `

    try {
      const result = await this.generateContent(prompt)
      return result.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    } catch (error) {
      console.error('Error generating tags:', error)
      return [category.toLowerCase(), ...materials.map(m => m.toLowerCase()), 'handcrafted', 'artisan', 'unique']
    }
  }

  async generateCraftStoryPrompts(craftType: string): Promise<string[]> {
    const prompt = `
      Generate 5-7 thoughtful questions that would help a ${craftType} artisan tell their story better.
      Focus on:
      1. Their journey into the craft
      2. Unique techniques or materials they use
      3. Cultural or family heritage
      4. Sources of inspiration
      5. What makes their work special
      6. Challenges and rewards of their craft

      Return as a simple list of questions, one per line.
    `

    try {
      const result = await this.generateContent(prompt)
      return result.split('\n').filter(line => line.trim().length > 0 && line.includes('?'))
    } catch (error) {
      console.error('Error generating story prompts:', error)
      return [
        'What first drew you to this craft?',
        'How did you learn your techniques?',
        'What makes your work unique?',
        'Where do you find inspiration?',
        'What\'s the most rewarding part of your craft?'
      ]
    }
  }
}

export const aiStoryService = new AIStoryService()

// Product Description Generation
interface ProductDescriptionParams {
  title: string
  category: string
  condition: string
  price: number
  location?: string
}

export async function generateProductDescription(params: ProductDescriptionParams): Promise<string> {
  const { title, category, condition, price, location } = params
  
  const prompt = `
    Create a compelling, professional product description for an artisan craft item with these details:
    
    Product: ${title}
    Category: ${category}
    Condition: ${condition}
    Price: ₹${price}
    ${location ? `Location: ${location}` : ''}
    
    Write a description that:
    1. Highlights the craftsmanship and artisan skills
    2. Emphasizes the cultural value and authenticity
    3. Describes the quality and condition honestly
    4. Appeals to customers who value handmade, traditional crafts
    5. Mentions the heritage and traditional techniques (general references appropriate for the category)
    6. Is between 100-150 words
    7. Uses warm, inviting language that tells a story
    
    Focus on the artisan's dedication, the time-honored techniques, and what makes this piece special.
    Use phrases like "handcrafted with love," "traditional techniques," "cultural heritage," etc.
    
    Return only the description text, no additional formatting or quotes.
  `

  // Use OpenRouter API directly for product descriptions
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured')
  }

  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CraftConnect'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const description = data.choices?.[0]?.message?.content?.trim()
    
    if (!description) {
      throw new Error('No description generated')
    }

    return description
  } catch (error) {
    console.error('Error generating product description:', error)
    // Fallback description
    return `This beautiful ${category.toLowerCase()} showcases traditional craftsmanship and artisan skills. Handcrafted with attention to detail, this ${title.toLowerCase()} represents the rich cultural heritage of our artisan community. The piece is in ${condition} condition and reflects the time-honored techniques passed down through generations. Each item tells a unique story of dedication, skill, and cultural preservation. Perfect for those who appreciate authentic, handmade crafts that support local artisans and traditional arts.`
  }
}