/**
 * Maps room / category names to lucide icon names (registered in
 * src/components/ui/Icon.tsx). Keyword-based so it works for the dynamic,
 * API-driven category list, with a safe fallback. Used by the Home and Shop
 * circle strips.
 */

export function getRoomIcon(name: string): string {
  const n = (name || "").toLowerCase()
  if (n.includes("bed")) return "bed"
  if (n.includes("kitchen")) return "cooking-pot"
  if (n.includes("living")) return "sofa"
  if (n.includes("outdoor") || n.includes("garden")) return "trees"
  if (n.includes("study") || n.includes("office")) return "briefcase"
  if (n.includes("dining")) return "utensils"
  if (n.includes("laundry")) return "washing-machine"
  if (n.includes("bath")) return "bath"
  return "home-outline"
}

export function getCategoryIcon(name: string): string {
  const n = (name || "").toLowerCase()
  // Electronics / gadgets — check before generic "accessory"/"home" matches.
  if (
    n.includes("mobile") ||
    n.includes("phone") ||
    n.includes("gadget") ||
    n.includes("electronic") ||
    n.includes("tablet") ||
    n.includes("laptop") ||
    n.includes("computer")
  )
    return "smartphone"
  if (n.includes("audio") || n.includes("headphone") || n.includes("sound"))
    return "headphones"
  // Automotive
  if (
    n.includes("auto") ||
    n.includes("car ") ||
    n === "car" ||
    n.includes("vehicle") ||
    n.includes("motor") ||
    n.includes("detailing")
  )
    return "car"
  // Furniture / seating / sleeping
  if (n.includes("sofa") || n.includes("couch")) return "sofa"
  if (n.includes("chair") || n.includes("seating")) return "armchair"
  if (n.includes("bed") || n.includes("mattress")) return "bed"
  if (n.includes("light") || n.includes("lamp")) return "lamp"
  if (n.includes("kitchen") || n.includes("cook")) return "cooking-pot"
  if (n.includes("dining") || n.includes("tablew")) return "utensils"
  if (n.includes("bath") || n.includes("shower")) return "bath"
  if (n.includes("laundry") || n.includes("wash")) return "washing-machine"
  if (
    n.includes("storage") ||
    n.includes("cabinet") ||
    n.includes("shelf") ||
    n.includes("wardrobe")
  )
    return "package"
  if (
    n.includes("outdoor") ||
    n.includes("garden") ||
    n.includes("patio") ||
    n.includes("plant")
  )
    return "sprout"
  if (n.includes("appliance") || n.includes("fridge") || n.includes("refrig"))
    return "refrigerator"
  if (n.includes("office") || n.includes("desk")) return "briefcase"
  // Lifestyle / apparel / wellness
  if (
    n.includes("fashion") ||
    n.includes("apparel") ||
    n.includes("clothing") ||
    n.includes("wear")
  )
    return "shirt"
  if (n.includes("sport") || n.includes("fitness") || n.includes("gym"))
    return "dumbbell"
  if (n.includes("baby") || n.includes("kids") || n.includes("toy"))
    return "baby"
  if (n.includes("pet")) return "paw-print"
  if (
    n.includes("beauty") ||
    n.includes("cosmetic") ||
    n.includes("health") ||
    n.includes("wellness") ||
    n.includes("personal care")
  )
    return "sparkles"
  // Groceries / household essentials
  if (
    n.includes("grocery") ||
    n.includes("food") ||
    n.includes("essential") ||
    n.includes("supply") ||
    n.includes("household")
  )
    return "shopping-basket"
  // Services / repairs / tools
  if (
    n.includes("service") ||
    n.includes("repair") ||
    n.includes("install") ||
    n.includes("tool") ||
    n.includes("hardware")
  )
    return "wrench"
  // Living / general home furnishing
  if (n.includes("living") || n.includes("furnitur")) return "sofa"
  if (n.includes("decor") || n.includes("accent") || n.includes("art"))
    return "sparkles"
  if (n.includes("book") || n.includes("stationery") || n.includes("school"))
    return "book"
  // Generic fallback — a shopping bag reads as "products" far better than a grid.
  return "shopping-bag"
}
