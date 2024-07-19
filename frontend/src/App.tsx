import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReportsScreen from "./screens/ReportsScreen";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReportsScreen />
    </QueryClientProvider>
  );
}

export default App;
