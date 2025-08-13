 

import { BrowserRouter, Routes, Route } from "react-router-dom";
import TabsContainer from "./components/TabsContainer";
import ResolveDuplicates from "./components/ResolveDuplicates";

function App() {
  return (
    <>
      <BrowserRouter>
     
        <Routes>
          <Route path="/" element={<TabsContainer />} />
       
          <Route path="/resolve-duplicates" element={<ResolveDuplicates />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
