import Codemirror from "@/codemirror";
import { addUserTheme } from "@/codemirror/theme";
import Button from "@/components/Common/Button";
import Modal from "@/components/Common/Modal";
import Toast from "@/components/Common/Toast";
import { trpc } from "@/helpers";
import { TRPCClientError } from "@trpc/client";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface Props {
  sectionId: number;
}

function AddUser({ sectionId }: Props) {
  const [value, setValue] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ctx = trpc.useContext();
  const addStudent = trpc.sections.addUsersToSection.useMutation();

  const handleAddStudent = async () => {
    try {
      setIsSubmitting(true);
      setIsError(false);
      await addStudent.mutateAsync({
        emails: value.split("\n"),
        sectionId,
      });
      toast.custom((t) => (
        <Toast
          {...t}
          msg="Added Users to this section successfully"
          type="success"
        />
      ));
      setIsShow(false);
      ctx.sections.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        setIsError(true);
        toast.custom((t) => <Toast {...t} msg={errMsg} type="error" />);
      }
    }
    setIsSubmitting(false);
  };

  const handleFileUpload = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setValue(text.trim());
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleFileUpload,
      accept: {
        "text/csv": [".csv"],
      },
    });

  return (
    <>
      <Button
        onClick={() => setIsShow(true)}
        icon="solar:user-plus-rounded-line-duotone"
        className="m-2 shadow text-sand-1 active:bg-sand-11 bg-sand-12"
      >
        Add Student
      </Button>

      <Modal
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        title="Add Student"
        className="md:w-[40rem] flex flex-col gap-4"
      >
        <div>
          <Codemirror
            autoFocus
            theme={addUserTheme}
            value={value}
            onChange={(value) => setValue(value)}
            height="20rem"
            className={clsx(
              "overflow-hidden text-sm border rounded-md",
              isError ? "border-red-500" : "border-sand-6"
            )}
          />
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <div className="w-full h-[0.5px] bg-sand-9"></div>
          <h4>or</h4>
          <div className="w-full h-[0.5px] bg-sand-9"></div>
        </div>

        <div
          {...getRootProps()}
          className={clsx(
            "flex justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer",

            isDragReject
              ? "border-red-9 text-red-9"
              : isDragActive
              ? "border-lime-9 text-lime-11"
              : "border-sand-6 text-sand-11"
          )}
        >
          <input {...getInputProps()} />
          {isDragReject
            ? "This file is not CSV"
            : isDragActive
            ? "You can now drop the file here"
            : "Click or Drop a CSV file here"}
        </div>

        <Button
          onClick={handleAddStudent}
          disabled={isSubmitting}
          icon="solar:user-plus-rounded-line-duotone"
          className="shadow text-sand-1 active:bg-sand-11 bg-sand-12 disabled:bg-sand-8 disabled:text-sand-1"
        >
          Add User
        </Button>
      </Modal>
    </>
  );
}

export default AddUser;
