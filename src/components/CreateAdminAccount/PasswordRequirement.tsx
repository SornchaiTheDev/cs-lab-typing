import { Icon } from "@iconify/react";
import clsx from "clsx";
import { checkPassword } from "@/helpers";

interface Props {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

function PasswordRequirement({
  length,
  uppercase,
  lowercase,
  number,
  special,
}: Props) {
  const containUpperLowerNumber = uppercase && lowercase && number;
  return (
    <div className="my-2 text-sm">
      <div className="flex items-center gap-1 align-baseline">
        <Icon
          className={clsx("text-lg", length ? "text-lime-9" : "text-tomato-9")}
          icon={
            length ? "solar:check-circle-linear" : "solar:close-circle-linear"
          }
        />
        <h6>รหัสผ่านมีความยาวมากกว่า 12 ตัวอักษร</h6>
      </div>
      <div className="flex items-center gap-1 align-baseline">
        <Icon
          icon={
            containUpperLowerNumber
              ? "solar:check-circle-linear"
              : "solar:close-circle-linear"
          }
          className={clsx(
            "text-lg",
            containUpperLowerNumber ? "text-lime-9" : "text-tomato-9"
          )}
        />
        <h6>รหัสผ่านประกอบไปด้วย ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข</h6>
      </div>
      <div className="flex items-center gap-1 align-baseline">
        <Icon
          icon={
            special ? "solar:check-circle-linear" : "solar:close-circle-linear"
          }
          className={clsx("text-lg", special ? "text-lime-9" : "text-tomato-9")}
        />
        <h6>
          รหัสผ่านประกอบไปด้วย อักขระพิเศษ (!,@,#,$,%) อย่างน้อย 1 ตัวอักษร
        </h6>
      </div>
    </div>
  );
}

export default PasswordRequirement;
