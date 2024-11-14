import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ModalAddGroup = ({ setGroups }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const MySwal = withReactContent(Swal);
  const [previewUrl, setPreviewUrl] = useState(null);
  const formRef = useRef(null);

  const initialFormState = {
    nameGroup: "",
    photoGroup: null,
    descriptionGroup: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setPreviewUrl(null);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("modal_add_group");
    if (isOpen && modalElement) {
      resetForm();
      modalElement.showModal();
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsOpen(false);
    const modalElement = document.getElementById("modal_add_group");
    modalElement.close();

    resetForm();
  };

  const createGroup = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nameGroup", formData.nameGroup);
      formDataToSend.append("descriptionGroup", formData.descriptionGroup);

      if (formData.photoGroup) {
        formDataToSend.append("photoGroup", formData.photoGroup);
      }

      const response = await fetch("/api/groups/create", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.success) {
        setGroups((prevGroups) => [...prevGroups, result.group]);
        handleCloseModal();
        const modal = document.getElementById("modal_add_group");
        if (modal) {
          modal.close();
        }
        await MySwal.fire({
          title: "Success!",
          text: "Group created successfully",
          icon: "success",
          didOpen: () => {
            MySwal.hideLoading();
          },
        });
      } else {
        throw new Error(result.message || "An error occurred");
      }
    } catch (error) {
      await MySwal.fire({
        title: "Error!",
        text: error.message || "Failed to create group",
        icon: "error",
        didOpen: () => {
          MySwal.hideLoading();
        },
      });
      setErrorMessage("Failed to create group");
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const modal = document.getElementById("modal_add_group");
    if (modal) {
      modal.close();
    }

    const result = await MySwal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Don't save",
      didOpen: () => {
        MySwal.hideLoading();
      },
    });

    if (result.isConfirmed) {
      await createGroup();
    } else if (result.isDenied) {
      await MySwal.fire({
        title: "Changes are not saved",
        icon: "info",
        didOpen: () => {
          MySwal.hideLoading();
        },
      });
      handleCloseModal();
    } else {
      modal.showModal();
    }
  };

  return (
    <dialog id="modal_add_group" className="modal" onClose={handleCloseModal}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Add Group</h3>
        <div className="w-full max-w-md space-y-8">
          <form
            ref={formRef}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="inputName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="inputName"
                  name="nameGroup"
                  type="text"
                  required
                  className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Group name"
                  onChange={handleChange}
                  value={formData.nameGroup}
                />
              </div>

              <div>
                <label
                  htmlFor="inputPhoto"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo
                </label>
                <div className="flex items-center mt-1 space-x-4">
                  <div className="flex-shrink-0">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-cover w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="inputPhoto"
                      name="photoGroup"
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="inputDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  id="inputDescription"
                  name="descriptionGroup"
                  type="text"
                  className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Group description"
                  onChange={handleChange}
                  value={formData.descriptionGroup}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleCloseModal}>close</button>
      </form>
    </dialog>
  );
};

export default ModalAddGroup;
