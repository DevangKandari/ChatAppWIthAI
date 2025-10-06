import React from "react";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { UserProvider } from "./context/user.context";
function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
