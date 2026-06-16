import { useQuery } from "@tanstack/react-query"
import { productService } from "../../services/productService"

interface UseSearchRecommendationsOptions {
  token?: string | null
  limit?: number
  enabled?: boolean
}

// Module-level (not a render path) so Math.random is fine here. Shuffling at the
// fetch layer keeps consumers' render pure and re-randomizes order per refetch.
function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export const useSearchRecommendations = ({
  token,
  limit = 12,
  enabled = true,
}: UseSearchRecommendationsOptions) => {
  return useQuery<any[]>({
    queryKey: ["search-recommendations", token, limit],
    queryFn: async () => {
      if (!token) throw new Error("Token is required")
      const data = await productService.getSearchRecommendations(token, limit)
      return shuffle(data)
    },
    enabled: !!token && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
