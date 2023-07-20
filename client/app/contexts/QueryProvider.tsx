import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      // staleTime: Infinity,
      // cacheTime: Infinity,
    },
  },
});

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
