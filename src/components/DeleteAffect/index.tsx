import { useRef } from "react";
import Modal from "../Common/Modal";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import Button from "../Common/Button";

interface Props {
  onClose: () => void;
  selected: string;
  title?: string;
}
function DeleteAffect({ onClose, selected, title }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);
  return (
    <Modal ref={modalRef} className="w-[90%]  md:w-[50rem]">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            {!!title && <h4 className="text-xl font-bold">Delete {title}</h4>}
            <p className="text-sand-9">
              Are you sure to delete user{" "}
              <span className="text-lg font-bold">
                &ldquo; {selected} &rdquo;
              </span>
              ? All of these following related items will be deleted.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-xl rounded-full hover:bg-sand-3 active:bg-sand-4"
          >
            <Icon icon="material-symbols:close-rounded" />
          </button>
        </div>
        <h4 className="text-sand-12"></h4>
        <h3 className="text-lg font-bold">Summary</h3>
        <ul className="list-disc list-inside">
          <li>Semester : 6</li>
          <li>Courses : 3</li>
          <li>Sections : 6</li>
          <li>Submissions : 125</li>
        </ul>
        <h3 className="text-lg font-bold">Objects</h3>
        <ul className="list-disc list-inside">
          <li>
            Semester : 9999/s
            <ul className="pl-8 list-disc list-inside">
              <li>
                Section : CS113 Computer Programming [9999/s] Sec:Test
                <ul className="pl-8 list-disc list-inside">
                  <li>
                    test1
                    <ul className="pl-8 list-disc list-inside">
                      <li>test2</li>
                      <li>test3</li>
                      <li>test4</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="flex gap-2 p-4 border-t">
        <Button className="w-full font-bold bg-red-9 text-sand-2 hover:bg-red-10">
          Confirm
        </Button>
        <Button
          onClick={onClose}
          className="w-full border hover:bg-sand-4 border-sand-6"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteAffect;
