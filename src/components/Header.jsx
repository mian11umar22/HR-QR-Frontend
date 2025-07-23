import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-100 shadow p-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
      <h1 className="text-xl font-semibold text-gray-800 text-center md:text-left">
        QR PDF Generator
      </h1>

      <div className="flex flex-col md:flex-row gap-2">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto"
        >
          Home
        </button>
        <button
          onClick={() => navigate("scan-qr")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition w-full md:w-auto"
        >
          Scan QR
        </button>
        
      </div>
    </header>
  );
}
