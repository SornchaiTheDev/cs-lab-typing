import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import Codemirror from "@/codemirror";
import Button from "../Common/Button";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  title: string;
}
function AddUserBtn({ title }: Props) {
  const [isShow, setIsShow] = useState(false);
  const [value, setValue] = useState("");
  const addAmount = value
    .split("\n")
    .filter((value) => value.split(",").length === 3).length;
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOnChange = (value: string, viewUpdate: any) => {
    setValue(value);
  };

  const onClose = () => {
    setIsShow(false);
  };

  useOnClickOutside(modalRef, onClose);

  useEffect(() => {
    console.log(
      value.split("\n").filter((value) => value.split(",").length === 3).length
    );
  }, [value]);

  return (
    <>
      <Button
        onClick={() => setIsShow(true)}
        icon="solar:user-plus-rounded-line-duotone"
        className="m-2"
      >
        Add {title}
      </Button>
      {isShow && (
        <div className="fixed top-0 left-0 w-full h-screen bg-sand-12 bg-opacity-30">
          <div
            ref={modalRef}
            className="absolute p-4 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-sand-1 w-[40rem] rounded-md shadow flex flex-col gap-4"
          >
            <h4 className="text-xl font-bold">Add {title}</h4>
            <button className="absolute p-2 text-xl rounded-full top-4 right-4 hover:bg-sand-3 active:bg-sand-4">
              <Icon icon="material-symbols:close-rounded" />
            </button>

            <Codemirror
              value={value}
              onChange={handleOnChange}
              height="30rem"
              className="overflow-hidden text-sm border rounded-md border-sand-6"
            />
            <Button
              isLoading={false}
              icon="solar:user-plus-rounded-line-duotone"
              className="w-full"
            >
              Add {addAmount > 1 && `${addAmount}`} {title}
              {addAmount > 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default AddUserBtn;
