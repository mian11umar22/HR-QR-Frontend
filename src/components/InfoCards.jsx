export default function InfoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
      {/* QR Code Format */}
      <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="font-semibold text-sm sm:text-base mb-1">
          QR Code Format
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Each QR code follows the format:
          <br />
          <code className="text-blue-600 break-all">
            http://localhost:5000/qr/[Unique-code]
          </code>
        </p>
      </div>

      {/* Database Storage */}
      <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="font-semibold text-sm sm:text-base mb-1">
          Database Storage
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          All QR codes are stored in MongoDB Atlas with full tracking and
          verification capabilities.
        </p>
      </div>
    </div>
  );
}
