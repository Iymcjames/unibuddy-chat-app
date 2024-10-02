// src/App.tsx
import React from "react";
import "./index.css"; // Ensure to import the Tailwind CSS styles
import Chat from "./components/Chat";

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Chat />
    </div>
  );
};

export default App;
