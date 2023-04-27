import { useRef } from "react";
import Input from "@/components/Input";
import { Icon } from "@iconify/react";
import { checkPassword } from "@/helpers";
import PasswordRequirement from "@/components/CreateAdminAccount/PasswordRequirement";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type FormData } from "@/types/CreateAdminAccount";
import { GetServerSideProps } from "next";

function CreateAdmin() {
  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { pass, requirements } = checkPassword(watch("password") ?? "");
  const isSamePassword = useRef(true);
  const canSubmit =
    watch("username") && watch("password") && watch("confirmPassword") && pass;

  const handleCreateAccount = (formData: FormData) => {
    const { username, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      isSamePassword.current = false;
    }

    // BACKEND TODO
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4 roboto">
      <div className="4 p-4 m-flex flex-col gap-2 w-[40rem] bg-white shadow rounded-lg">
        <h4 className="text-2xl font-bold text-center">Setup Admin Account</h4>
        <form onSubmit={handleSubmit(handleCreateAccount)}>
          <Input
            title="Username"
            className="my-2"
            label="username"
            register={register}
          />

          <Input
            title="Password"
            type="password"
            className="my-2"
            label="password"
            register={register}
          />
          <PasswordRequirement {...requirements} />

          <Input
            title="Confirm Password"
            type="password"
            className="my-2"
            error="Password does not match"
            isError={!isSamePassword.current}
            label="confirmPassword"
            register={register}
          />

          <button
            className="flex items-center justify-center w-full gap-4 py-3 font-medium rounded-lg bg-lime-9 hover:bg-lime-10 disabled:bg-gray-3 disabled:cursor-not-allowed"
            disabled={!canSubmit}
          >
            <Icon icon="solar:pen-linear" className="text-lg" />
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAdmin;

export const getServerSideProps: GetServerSideProps = async () => {
  // BACKEND TODO

  // return {
  //   notFound: true,
  // };
  return {
    props: {},
  };
};
