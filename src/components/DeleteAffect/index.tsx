import Modal from "../Common/Modal";
import { Icon } from "@iconify/react";
import Button from "../Common/Button";
import { ChangeEvent, useState } from "react";

interface Props {
  onClose: () => void;
  selected: string;
  type: "course" | "section" | "task" | "lab" | "user";
  onDelete: () => void;
}
function DeleteAffect({ onClose, selected, onDelete, type }: Props) {
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  return (
    <Modal onClose={onClose} className="w-[90%]  md:w-[40rem] max-h-[90%]">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold capitalize">Delete {type}</h4>
              <p className="text-sand-9">
                Are you sure to delete {type}{" "}
                <span className="text-lg font-bold">
                  &ldquo; {selected} &rdquo;
                </span>
                ? All of these following related items will be deleted
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-xl rounded-full hover:bg-sand-3 active:bg-sand-4"
            >
              <Icon icon="material-symbols:close-rounded" />
            </button>
          </div>
          <div className="overflow-auto whitespace-nowrap">
            <h3 className="mt-2 text-lg font-bold">Summary</h3>
            <ul className="list-disc list-inside">
              <li>Semester : 6</li>
              <li>Courses : 3</li>
              <li>Sections : 6</li>
              <li>Submissions : 125</li>
            </ul>
            <h3 className="mt-2 text-lg font-bold">Objects</h3>

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
                          <ul className="pl-8 list-disc list-inside">
                            <li>test2</li>
                            <ul className="pl-8 list-disc list-inside">
                              <li>
                                {" "}
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Harum, ea necessitatibus
                                facere aliquam consequuntur earum explicabo sit
                                ipsam facilis commodi, maxime sequi quisquam
                                quos neque hic molestiae suscipit esse rerum.
                              </li>
                              <ul className="pl-8 list-disc list-inside">
                                <li>
                                  {" "}
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit. Harum, ea necessitatibus
                                  facere aliquam consequuntur earum explicabo
                                  sit ipsam facilis commodi, maxime sequi
                                  quisquam quos neque hic molestiae suscipit
                                  esse rerum.
                                </li>

                                <li>
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit. Harum, ea necessitatibus
                                  facere aliquam consequuntur earum explicabo
                                  sit ipsam facilis commodi, maxime sequi
                                  quisquam quos neque hic molestiae suscipit
                                  esse rerum.
                                </li>
                              </ul>
                            </ul>
                          </ul>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4 border-t">
        <input
          value={confirmMsg}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setConfirmMsg(e.target.value)
          }
          className="w-full p-2 border rounded-md outline-none border-sand-6 bg-sand-1"
          placeholder={`Type "${selected}" to confirm`}
        />
        <Button
          disabled={confirmMsg !== selected}
          onClick={onDelete}
          className="w-full font-bold bg-red-9 text-sand-2 hover:bg-red-10"
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteAffect;
