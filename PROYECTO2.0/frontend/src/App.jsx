import React from "react";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
