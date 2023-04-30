import { useRef, useState } from "react";
import Modal from "../Common/Modal";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  onClose: () => void;
}
function DeleteAffect({ onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);
  return (
    <Modal ref={modalRef}>
      <h1>YO</h1>
    </Modal>
  );
}

export default DeleteAffect;
