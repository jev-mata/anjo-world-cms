import { useState } from "react";
import Edit from "../edit";

export default function Modal({ setProjectSelected, projectSelected }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      // if mouse released outside modal
      if (!e.currentTarget.querySelector(".modal-content").contains(e.target)) {
        setProjectSelected(null);
      }
    }
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <div
        className="relative bg-white w-3/5 h-[80vh] rounded-lg shadow-lg overflow-hidden modal-content"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Close button */}
        <button
          onClick={() => setProjectSelected(null)}
          className="absolute top-3 right-3 z-50 text-2xl text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Scrollable content */}
        <div className="h-full overflow-y-auto px-6 pt-4 pb-6">
          <Edit projectSelected={projectSelected} />
        </div>
      </div>
    </div>
  );
}
