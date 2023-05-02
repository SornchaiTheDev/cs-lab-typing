import Input from "@/components/Common/Input";
import { Icon } from "@iconify/react";
import PasswordRequirement from "@/components/CreateAdminAccount/PasswordRequirement";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateAdminAccountSchemna,
  type TCreateAdminAccount,
} from "@/forms/CreateAdminAccount";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

function CreateAdmin() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TCreateAdminAccount>({
    resolver: zodResolver(CreateAdminAccountSchemna),
  });

  const handleCreateAccount = async (formData: TCreateAdminAccount) => {
    const { username, password, email } = formData;

    // Simulate API POST
    await new Promise((res, rej) =>
      setTimeout(() => {
        res("success");
      }, 5000)
    );
    // BACKEND TODO
    router.replace("/cms/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4 px-4 lg:px-0 roboto">
      <div className="p-4 m-flex flex-col gap-2 w-[40rem] max-w-full bg-white shadow-md rounded-lg">
        <h4 className="text-2xl font-bold text-center">Setup Admin Account</h4>
        <form onSubmit={handleSubmit(handleCreateAccount)}>
          <Input
            title="Username"
            className="my-2"
            label="username"
            error={errors.username && errors.username.message}
            isError={errors.username !== undefined}
            register={register}
          />

          <Input
            title="Email"
            type="email"
            placeholder="johndoe@mail.com"
            className="my-2"
            error={errors.email && errors.email.message}
            isError={errors.email !== undefined}
            label="email"
            register={register}
          />

          <Input
            title="Password"
            type="password"
            placeholder="••••••••••••"
            className="my-2"
            label="password"
            register={register}
          />
          <PasswordRequirement password={watch("password") ?? ""} />

          <Input
            title="Confirm Password"
            type="password"
            placeholder="••••••••••••"
            className="my-2"
            error={errors.confirmPassword && errors.confirmPassword.message}
            isError={errors.confirmPassword !== undefined}
            label="confirmPassword"
            register={register}
          />

          <button
            className="flex items-center justify-center w-full h-12 gap-4 py-3 mt-4 rounded-lg bg-sand-12 text-sand-1 disabled:bg-sand-3 disabled:cursor-not-allowed disabled:text-sand-12"
            disabled={!isValid}
          >
            {isSubmitting ? (
              <Icon icon="line-md:loading-twotone-loop" className="text-lg" />
            ) : (
              <>
                <Icon icon="solar:pen-linear" className="text-lg" />
                Create Account
              </>
            )}
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
