import Header from "./components/Header";
import QRScanner from "./components/QRScanner";
import StepperForm from "./components/StepperForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<StepperForm />} />
          <Route path="/scan-qr" element={<QRScanner />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
