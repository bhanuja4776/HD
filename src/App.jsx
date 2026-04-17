import { AppRouter } from "./router/AppRouter";
import { AppLayout } from "./layouts/AppLayout";
import { AIChatbot } from "./components/AIChatbot";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppLayout>
        <AppRouter />
        <AIChatbot apiUrl="http://localhost:5000/ask" />
      </AppLayout>
    </AuthProvider>
  );
}

export default App;

