import React, { useEffect, useState } from "react";

const ModalAddGroup = () => {
  const [formData, setFormData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const modalElement = document.getElementById("modal_add_group");
    if (isOpen && modalElement) {
      modalElement.showModal();
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.success) {
        const modal = document.getElementById("modal_add_group");
        if (modal) {
          modal.close();
          handleCloseModal();
        }

        console.log(result);

        // You can add a success notification here
      } else {
        setErrorMessage(result.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("Failed to create group");
      console.error("Error:", error);
    }
  };

  return (
    <dialog
      id="modal_add_group"
      className="flex items-center justify-center w-8/12 max-w-5xl modal-box"
    >
      <div className=" modal-box">
        <h3 className="text-lg font-bold">Add Group</h3>
        <div className="w-full max-w-md space-y-8">
          <form
            method="dialog"
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="inputName" className="sr-only">
                  Name
                </label>
                <input
                  id="inputName"
                  name="nameGroup"
                  type="nameGroup"
                  required
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="inputObservation" className="sr-only">
                  Description
                </label>
                <input
                  id="inputDescription"
                  name="descriptionGroup"
                  type="descriptionGroup"
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Description"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAddGroup;
