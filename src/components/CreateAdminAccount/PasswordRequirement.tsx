import { Icon } from "@iconify/react";
import clsx from "clsx";
import { checkPassword } from "@/helpers/index";
interface Props {
  password: string;
}

const Check = ({ isPass, text }: { isPass: boolean; text: string }) => (
  <div className="flex items-center gap-1 align-baseline">
    <Icon
      className={clsx("text-lg", isPass ? "text-lime-9" : "text-tomato-9")}
      icon={isPass ? "solar:check-circle-linear" : "solar:close-circle-linear"}
    />
    <h6 className="capitalize">{text}</h6>
  </div>
);

function PasswordRequirement({ password }: Props) {
  const { requirements } = checkPassword(password);
  const { length, lowercase, number, special, uppercase } = requirements;
  return (
    <div className="my-2 text-sm text-sand-12">
      <Check text="It must contain at least 12 Characters" isPass={length} />
      <Check text="It must contain at least one uppercase" isPass={uppercase} />
      <Check text="It must contain at least one lowercase" isPass={lowercase} />
      <Check text="It must contain at least one number" isPass={number} />
      <Check
        text="It must contain at least one special character (!, @, #, $, %)."
        isPass={special}
      />
    </div>
  );
}

export default PasswordRequirement;
