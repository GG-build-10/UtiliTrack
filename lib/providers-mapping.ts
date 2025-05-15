// Define types for our provider mapping
export type UtilityType = "electricity" | "water" | "gas" | "internet" | "phone" | "tv" | "other"

export interface ProviderInfo {
  name: string
  type: UtilityType
  regex?: RegExp // For fuzzy matching provider names
  color: string // For UI consistency
  icon?: string // Optional icon reference
}

// Map of known Croatian service providers to their utility types
export const providersMapping: ProviderInfo[] = [
  // Electricity providers
  {
    name: "HEP",
    type: "electricity",
    regex: /hep|hrvatska elektroprivreda/i,
    color: "blue",
  },
  {
    name: "HEP Elektra",
    type: "electricity",
    regex: /hep elektra|elektra/i,
    color: "blue",
  },
  {
    name: "HEP ODS",
    type: "electricity",
    regex: /hep ods|operator distribucijskog sustava/i,
    color: "blue",
  },

  // Water providers
  {
    name: "Hrvatske vode",
    type: "water",
    regex: /hrvatske vode|vodovod/i,
    color: "teal",
  },
  {
    name: "Vodoopskrba i odvodnja",
    type: "water",
    regex: /vodoopskrba|odvodnja/i,
    color: "teal",
  },
  {
    name: "Zagrebački holding - Vodoopskrba",
    type: "water",
    regex: /zagrebački holding|vodoopskrba/i,
    color: "teal",
  },

  // Gas providers
  {
    name: "Gradska plinara Zagreb",
    type: "gas",
    regex: /gradska plinara|plinara zagreb/i,
    color: "amber",
  },
  {
    name: "Međimurje-plin",
    type: "gas",
    regex: /međimurje-plin|međimurje plin/i,
    color: "amber",
  },
  {
    name: "Plinacro",
    type: "gas",
    regex: /plinacro/i,
    color: "amber",
  },

  // Internet providers
  {
    name: "Hrvatski Telekom",
    type: "internet",
    regex: /hrvatski telekom|ht|t-com|t com/i,
    color: "purple",
  },
  {
    name: "A1",
    type: "internet",
    regex: /a1|vip/i, // A1 was formerly VIP
    color: "purple",
  },
  {
    name: "Iskon",
    type: "internet",
    regex: /iskon/i,
    color: "purple",
  },
  {
    name: "Optima Telekom",
    type: "internet",
    regex: /optima|optima telekom/i,
    color: "purple",
  },

  // Phone providers
  {
    name: "Hrvatski Telekom",
    type: "phone",
    regex: /hrvatski telekom|ht|t-mobile/i,
    color: "pink",
  },
  {
    name: "A1",
    type: "phone",
    regex: /a1|vip/i,
    color: "pink",
  },
  {
    name: "Telemach",
    type: "phone",
    regex: /telemach|tele2/i, // Telemach was formerly Tele2
    color: "pink",
  },

  // TV providers
  {
    name: "Hrvatska Radiotelevizija",
    type: "tv",
    regex: /hrvatska radiotelevizija|hrt|rtv pristojba|pristojba/i,
    color: "red",
  },
]

// Function to identify provider and type from bill text or provider name
export function categorizeProvider(text: string): ProviderInfo | null {
  // Normalize the input text
  const normalizedText = text.trim().toLowerCase()

  // Try to match against our known providers
  for (const provider of providersMapping) {
    if (
      normalizedText.includes(provider.name.toLowerCase()) ||
      (provider.regex && provider.regex.test(normalizedText))
    ) {
      return provider
    }
  }

  // If no match found, return null
  return null
}

// Function to get color based on utility type
export function getUtilityTypeColor(type: UtilityType): string {
  switch (type) {
    case "electricity":
      return "bg-blue-500"
    case "water":
      return "bg-teal-500"
    case "gas":
      return "bg-amber-500"
    case "internet":
      return "bg-purple-500"
    case "phone":
      return "bg-pink-500"
    case "tv":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

// Function to get all providers of a specific type
export function getProvidersByType(type: UtilityType): ProviderInfo[] {
  return providersMapping.filter((provider) => provider.type === type)
}
