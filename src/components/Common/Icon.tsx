"use client";
import { Icon, disableCache } from "@iconify/react";

interface Props {
  icon: string;
  className?: string;
}
function IconComponent({ icon, className }: Props) {
  disableCache("all");
  return <Icon {...{ icon, className }} />;
}

export default IconComponent;
