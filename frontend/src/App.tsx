import "./App.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Router } from "./routes/Router";
import { useState } from "react";
import { defaultLoginResponse, UserContext } from "./contexes/UserContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [user, setUser] = useState(defaultLoginResponse);

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={[user, setUser]}>
          <Router />
        </UserContext.Provider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
