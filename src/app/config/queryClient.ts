import { QueryClient } from "@tanstack/react-query";

export const QueryClientConfig = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed requests 2 times
      staleTime: 5 * 60 * 1000, // 5 minutes - data dianggap fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache time (dulu cacheTime)
      refetchOnWindowFocus: false, // Don't refetch saat app focus
      refetchOnReconnect: true, // Refetch saat internet reconnect
    },
    mutations: {
      retry: 1, // Retry failed mutations 1 time
    },
  },
});