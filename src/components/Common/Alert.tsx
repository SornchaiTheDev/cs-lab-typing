import { Icon } from "@iconify/react";
import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function Alert({ isOpen, onConfirm, onCancel }: Props) {
  return (
    <Modal
      {...{ isOpen }}
      title={`Delete Student`}
      description="Are you sure to delete this student"
      onClose={onCancel}
      className="flex max-h-[90%] flex-col md:w-[30rem]"
    >
      <div className="mt-10 flex gap-2">
        <Button
          onClick={onConfirm}
          className="flex-1 bg-red-9 text-sand-1 hover:bg-red-10"
        >
          Delete
        </Button>
        <Button onClick={onCancel} className="flex-1 hover:bg-sand-4">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export default Alert;
