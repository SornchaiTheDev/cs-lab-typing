import React from "react";
import { type Toast as ToastType, toast } from "react-hot-toast";
import Toast from "~/components/Common/Toast";

interface Props {
  msg: string;
  type: ToastType["type"];
}
export const callToast = ({ msg, type }: Props) => {
  return toast.custom((t) => <Toast {...t} msg={msg} type={type} />);
};
