import { Icon } from "@iconify/react";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { schema, TAddAdmin } from "@/types/TAddUser";
import { zodResolver } from "@hookform/resolvers/zod";

function AddUserBtn() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TAddAdmin>({ resolver: zodResolver(schema) });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg outline-none bg-sand-9 hover:bg-sand-10 text-whiteA-12">
          <Icon icon="solar:user-plus-line-duotone" />
          Add New User
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA-7 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve-12 m-0 text-[17px] font-medium">
            Add User
          </Dialog.Title>
          {/* <Dialog.Description className="text-mauve-11 mt-[10px] mb-5 text-[15px] leading-normal">
            jkjk
          </Dialog.Description> */}

          <div className="">
            <Input
              label="username"
              register={register}
              error="Username is required"
              isError={true}
              title="Username"
            />
          </div>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Save changes
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Icon icon="material-symbols:close-rounded" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddUserBtn;
