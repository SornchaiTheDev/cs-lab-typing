import { trpc } from "~/utils";
import {
  KUStudentSchema,
  type TKUStudentSchema,
} from "~/schemas/KUStudentSchema";
import { NonKUStudent, type TNonKUStudent } from "~/schemas/NonKUSchema";
import { TeacherSchema, type TTeacherSchema } from "~/schemas/TeacherSchema";
import type { EachField } from "~/components/Forms";
import type { ZodEffects, ZodObject } from "zod";
import { callToast } from "~/services/callToast";
import { useEffect, useState } from "react";
import { getNonKUStudentFields } from "~/fields/nonKUStudent";
import type { users } from "@prisma/client";
import { getKUStudentFields } from "~/fields/KUStudent";
import { getTeacherFields } from "~/fields/Teacher";
import { useDeleteAffectStore } from "~/store/deleteAffect";

export type UserType = "KUStudent" | "NonKUStudent" | "Teacher";

interface Props<T> {
  email: string;
  type: T;
  onUpdate: () => void;
}

export type FormSchema<T extends UserType> = T extends "KUStudent"
  ? TKUStudentSchema
  : T extends "NonKUStudent"
  ? TNonKUStudent
  : T extends "Teacher"
  ? TTeacherSchema
  : never;

export function useEditUser<T extends UserType>({
  email,
  type,
  onUpdate,
}: Props<T>) {
  useEffect(() => {
    const isValidUserType = ["KUStudent", "NonKUStudent", "Teacher"].includes(
      type
    );

    if (!isValidUserType) throw new Error("Invalid User Type");
  }, [type]);

  const [_, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  // get user by email
  const user = trpc.users.getUserByEmail.useQuery({
    email,
  });

  // update user function to call trpc mutation
  let updateUser: any;

  switch (type) {
    case "KUStudent":
      updateUser = trpc.users.updateKUStudent.useMutation();
      break;
    case "NonKUStudent":
      updateUser = trpc.users.updateNonKUStudent.useMutation();
      break;
    case "Teacher":
      updateUser = trpc.users.updateTeacher.useMutation();
      break;
  }

  // get schema from user type
  let schema: ZodEffects<ZodObject<any>> | ZodObject<any>;

  switch (type) {
    case "KUStudent":
      schema = KUStudentSchema;
      break;
    case "NonKUStudent":
      schema = NonKUStudent;
      break;
    case "Teacher":
      schema = TeacherSchema;
      break;
    default:
      throw new Error("Invalid user type");
  }

  // get fields from user type
  const [fields, setFields] = useState<EachField<FormSchema<"NonKUStudent">>[]>([]);

  useEffect(() => {
    if (user.isLoading) return;

    console.log(user.data);
    switch (type) {
      case "KUStudent":
        setFields(getKUStudentFields(user.data as users));
        break;
      case "NonKUStudent":
        setFields(getNonKUStudentFields(user.data as users));
        break;
      case "Teacher":
        setFields(getTeacherFields(user.data as users));
        break;
    }
  }, [user.isLoading, user.data, type]);

  // form submit function
  const formSubmit = async (formData: FormSchema<T>) => {
    try {
      await updateUser.mutateAsync(formData);
      setSelectedObj(null);
      callToast({ msg: "Edit users successfully", type: "success" });
      onUpdate();
    } catch (err) {}
  };

  return { schema, fields, user, updateUser, formSubmit };
}
