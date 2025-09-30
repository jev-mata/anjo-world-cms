import { useState } from "react";

function ProjectItem({ groupcontent, handleDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const confirmAndDelete = (e) => {
    if (inputValue === groupcontent.title) {
      handleDelete(e, groupcontent.id);
      setShowConfirm(false);
      setInputValue("");
    } else {
      alert("Title does not match. Please type it exactly.");
    }
  };

  return (
    <div>
      {/* Delete button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 mx-1 text-gray-100 bg-red-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Delete
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Type <span className="font-bold">{groupcontent.title}</span> to
              confirm deletion.
            </p>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring focus:ring-red-300"
              placeholder="Enter title here..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectItem;
