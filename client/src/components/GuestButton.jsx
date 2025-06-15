export default function GuestButton({ onContinue }) {
  return (
    <button
      onClick={onContinue}
      className="bg-gray-500 text-white px-4 py-2 rounded"
    >
      Continue as Guest
    </button>
  );
}
