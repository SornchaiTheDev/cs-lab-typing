import Codemirror from "~/codemirror";
import { addUserLightTheme, addUserDarkTheme } from "~/codemirror/theme";
import Button from "~/components/Common/Button";
import Modal from "~/components/Common/Modal";
import { trpc } from "~/utils";
import { TRPCClientError } from "@trpc/client";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { callToast } from "~/services/callToast";
import useTheme from "~/hooks/useTheme";
import { motion, useAnimation } from "framer-motion";
import { Icon } from "@iconify/react";

interface Props {
  sectionId: string;
  onAdded: () => void;
}

const UserHint = () => {
  const [isHover, setIsHover] = useState(false);
  const control = useAnimation();

  const variants = {
    visible: { opacity: 1 , display : "block" },
    hidden: { opacity: 0, display : "none" },
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isHover) {
      control.start("visible");
    } else {
      timeout = setTimeout(() => {
        control.start("hidden");
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [isHover, control]);
  return (
    <div className="relative z-50">
      <Icon
        className="text-2xl text-sand-12"
        icon="solar:question-circle-bold-duotone"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      />
      <motion.div
        initial="hidden"
        variants={variants}
        animate={control}
        className="absolute min-w-[16rem] top-8 overflow-x-auto rounded-lg border border-yellow-6  bg-yellow-3 p-2 text-yellow-12"
      >
        <h4 className="text-lg font-bold">Example format </h4>
        <p className="leading-snug">
          <span className="font-bold underline">Teacher</span> <br />
          john@ku.th
          <br />
          <span className="font-bold underline">Student</span> <br />
          6510405814 <br />
          <span className="font-bold underline">POSN Student</span> <br />
          posn001
        </p>
      </motion.div>
    </div>
  );
};

function AddUser({ sectionId, onAdded }: Props) {
  const [value, setValue] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ctx = trpc.useContext();
  const addStudent = trpc.sections.addUsersToSection.useMutation();
  const { theme } = useTheme();

  const handleAddStudent = async () => {
    try {
      setIsSubmitting(true);
      setIsError(false);
      await addStudent.mutateAsync({
        studentIds: value.split("\n"),
        sectionId,
      });
      callToast({
        msg: "Added Users to this section successfully",
        type: "success",
      });
      setIsShow(false);
      setValue("");
      ctx.sections.invalidate();
      onAdded();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        setIsError(true);
        callToast({ msg: errMsg, type: "error" });
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

  const handleOnClose = () => {
    setIsShow(false);
    setValue("");
    setIsError(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsShow(true)}
        icon="solar:user-plus-rounded-line-duotone"
        className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
      >
        Add Student
      </Button>

      <Modal
        isOpen={isShow}
        onClose={handleOnClose}
        title="Add Student"
        afterTitle={<UserHint />}
        className="flex flex-col gap-4 md:w-[40rem]"
      >
        <div>
          <Codemirror
            autoFocus
            theme={theme === "light" ? addUserLightTheme : addUserDarkTheme}
            value={value}
            onChange={(value) => setValue(value)}
            height="20rem"
            className={clsx(
              "overflow-hidden rounded-md border text-sm",
              isError ? "border-red-500" : "border-sand-6"
            )}
          />
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <div className="h-[0.5px] w-full bg-sand-9"></div>
          <h4>or</h4>
          <div className="h-[0.5px] w-full bg-sand-9"></div>
        </div>

        <div
          {...getRootProps()}
          className={clsx(
            "flex cursor-pointer justify-center rounded-lg border-2 border-dashed p-4",

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
          className="bg-sand-12 text-sand-1 shadow active:bg-sand-11 disabled:bg-sand-8 disabled:text-sand-1"
        >
          Add User
        </Button>
      </Modal>
    </>
  );
}

export default AddUser;
