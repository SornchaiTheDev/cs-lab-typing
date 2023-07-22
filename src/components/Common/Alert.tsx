import Modal from "./Modal";
import Button from "./Button";

interface Props {
  type: "student" | "lab";
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function Alert({ isOpen, onConfirm, onCancel, type }: Props) {
  const capitalizeType = type[0]?.toUpperCase() + type.slice(1);
  return (
    <Modal
      {...{ isOpen }}
      title={`Remove ${capitalizeType}`}
      description={`Are you sure to remove this ${capitalizeType}?`}
      onClose={onCancel}
      className="flex max-h-[90%] flex-col md:w-[30rem]"
    >
      <div className="mt-10 flex gap-2">
        <Button
          onClick={onConfirm}
          className="flex-1 bg-red-9 text-sand-1 hover:bg-red-10 text-sand-12"
        >
          Remove
        </Button>
        <Button onClick={onCancel} className="flex-1 hover:bg-sand-4 text-sand-12">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export default Alert;
