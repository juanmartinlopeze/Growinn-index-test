
import "./App.css";
import AppRouter from "./router/AppRouter";
import { NavBar } from "./components";
import { UserEmpresaProvider } from "./context/UserEmpresaContext";


function App() {
  return (
    <UserEmpresaProvider>
      <NavBar />
      <AppRouter />
    </UserEmpresaProvider>
  );
}

export default App;
