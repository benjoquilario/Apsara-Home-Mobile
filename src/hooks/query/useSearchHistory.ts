import { useQuery } from "@tanstack/react-query"
import { authService, SearchHistoryItem } from "../../services/authService"

interface UseSearchHistoryOptions {
  token?: string | null
  enabled?: boolean
}

export const useSearchHistory = ({
  token,
  enabled = true,
}: UseSearchHistoryOptions) => {
  return useQuery<SearchHistoryItem[]>({
    queryKey: ["search-history", token],
    queryFn: async () => {
      if (!token) throw new Error("Token is required")
      return authService.getSearchHistory(token)
    },
    enabled: !!token && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
