import "./App.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Router } from "./routes/Router";
import { UserProvider } from "./contexts/UserContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Router />
        </UserProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
