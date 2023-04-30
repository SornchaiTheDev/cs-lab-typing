import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import Codemirror from "@/codemirror";
import Button from "../Common/Button";
import { useOnClickOutside } from "usehooks-ts";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import ModalWithButton from "../Common/ModalWithButton";

const addUserTheme = createTheme({
  theme: "light",
  settings: {
    background: "#f9f9f8",
    foreground: "#393a34",
    caret: "#7c3aed",
    selection: "#e8e8e8",
    selectionMatch: "#dbdbd7",
    lineHighlight: "#8a91991a",
    gutterBackground: "#fff",
    gutterForeground: "#8a919966",
  },
  styles: [
    {
      tag: t.comment,
      color: "#999988",
    },
    {
      tag: t.variableName,
      color: "#393a34",
    },
    {
      tag: [t.string, t.special(t.brace)],
      color: "#e3116c",
    },
    {
      tag: t.number,
      color: "#36acaa",
    },
    {
      tag: t.bool,
      color: "#007dfa",
    },
    {
      tag: t.null,
      color: "#0d7ae7",
    },
    {
      tag: t.keyword,
      color: "#00a4db",
    },
    {
      tag: t.operator,
      color: "#393a34",
    },
    {
      tag: t.className,
      color: "#50575e",
    },
    {
      tag: t.definition(t.typeName),
      color: "#00aaff",
    },
    {
      tag: [t.definition(t.propertyName), t.function(t.variableName)],
      color: "#00a4db",
    },
    {
      tag: t.typeName,
      color: "#0080ff",
    },
    {
      tag: t.angleBracket,
      color: "#dd7f27",
    },
    {
      tag: t.tagName,
      color: "#ffae00",
    },
    {
      tag: t.attributeName,
      color: "#ff6600",
    },
  ],
});

interface Props {
  title: string;
  pattern: string;
}
function AddUserBtn({ title, pattern }: Props) {
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
      <ModalWithButton
        title={`Add ${title}`}
        icon="solar:user-plus-rounded-line-duotone"
        className="w-[95%] md:w-[40rem]"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold">Add {title}</h4>
            <p className="text-sand-9">( {pattern} )</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-xl rounded-full hover:bg-sand-3 active:bg-sand-4"
          >
            <Icon icon="material-symbols:close-rounded" />
          </button>
        </div>
        <Codemirror
          autoFocus
          theme={addUserTheme}
          value={value}
          onChange={handleOnChange}
          height="30rem"
          className="overflow-hidden h-[30rem] text-sm border rounded-md border-sand-6"
        />

        <Button
          isLoading={false}
          icon="solar:user-plus-rounded-line-duotone"
          className="w-full shadow bg-sand-12 text-sand-1 active:bg-sand-11"
        >
          Add {addAmount > 1 && `${addAmount}`} {title}
          {addAmount > 1 ? "s" : ""}
        </Button>
      </ModalWithButton>
    </>
  );
}

export default AddUserBtn;
