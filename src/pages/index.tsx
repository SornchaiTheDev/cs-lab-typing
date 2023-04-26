import { toast } from "react-toastify";
import { useState } from "react";
import Input from "@/components/Input";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { checkPassword } from "@/helpers";
import PasswordRequirement from "@/components/CreateAdminAccount/PasswordRequirement";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { pass, requirements } = checkPassword(password);
  return (
    <div className="flex items-center justify-center w-full h-screen ">
      <div className="flex flex-col gap-4 p-4 w-[40rem] bg-white shadow rounded-lg">
        <h4 className="text-2xl font-bold text-center">Setup Admin Account</h4>

        <Input
          label="Username"
          error="ชื่อผู้ใช้ต้องไม่เว้นว่าง"
          isError={false}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div>
          <Input
            label="Password"
            error="รหัสผ่านต้องไม่เว้นว่าง"
            isError={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <PasswordRequirement {...requirements} />

          <Input
            label="Confirm Password"
            error="รหัสผ่านไม่ตรงกัน"
            isError={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
        </div>

        <button className="flex items-center justify-center gap-4 py-3 font-medium rounded-lg bg-lime-9 hover:bg-lime-10">
          <Icon icon="solar:pen-linear" className="text-lg" />
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
