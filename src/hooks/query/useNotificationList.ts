import { useQuery } from "@tanstack/react-query"
import { orderService } from "../../services/orderService"

// Notifications list (paged object: { notifications: [...], unread_count }).
// Named *List* to avoid clashing with the realtime `useNotifications` hook.
export const useNotificationList = (token?: string | null) => {
  return useQuery<any>({
    queryKey: ["notifications", token],
    queryFn: () => orderService.getNotifications(token as string),
    enabled: !!token,
    staleTime: 1000 * 30, // 30s
  })
}
