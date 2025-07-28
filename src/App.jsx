import Header from "./components/Header";
import QRScanner from "./components/QRScanner";
 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TabsContainer from "./components/TabsContainer";

function App() {
  return (
    <>
      <BrowserRouter>
        
        <Header />
        <Routes>
          <Route path="/" element={<TabsContainer />} />
          <Route path="/scan-qr" element={<QRScanner />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
