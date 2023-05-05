import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../Common/Input";
import Select from "../Common/Select";
import Multiple from "../Search/Multiple";
import Checkbox from "../Common/Checkbox";
import { ZodObject, z } from "zod";
import TextArea from "../Common/TextArea";
import Button from "@/components/Common/Button";
import clsx from "clsx";

interface ConfirmBtn {
  title: string;
  icon?: string;
  className?: string;
}

type EachField<T> = {
  label: keyof T;
  title: string;
  type: "select" | "multiple" | "text" | "checkbox" | "textarea";
  optional?: boolean;
  options?: string[];
  conditional?: (data: string) => boolean;
  children?: EachField<T>;
};

interface Props<T> {
  onSubmit: (formData: T) => void;
  schema: ZodObject<any>;
  fields: EachField<T>[];
  confirmBtn?: ConfirmBtn;
}

function Forms<T>({ onSubmit, schema, fields, confirmBtn }: Props<T>) {
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const render = (field: EachField<T>) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            key={field.label as string}
            register={register}
            label={field.label as string}
            title={field.title}
            optional={field.optional}
            isError={!!errors[field.label]}
            error={errors[field.label]?.message as string}
          />
        );
      case "select":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <Select
                options={field.options ?? []}
                title={field.title}
                value={value}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
              />
            )}
          />
        );
      case "multiple":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <Multiple
                datas={field.options ?? []}
                title={field.title}
                value={value ?? []}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
              />
            )}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            key={field.label as string}
            label={field.label as string}
            register={register}
            title={field.title}
          />
        );
      case "textarea":
        return (
          <TextArea
            key={field.label as string}
            label={field.label as string}
            title={field.title}
            register={register}
            optional={field.optional}
          />
        );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<{ [x: string]: any }>)}
      className="flex flex-col gap-2"
    >
      {fields.map((field) => {
        const renderItem = [render(field)];
        if (
          field.children &&
          field.conditional &&
          field.conditional(watch(field.label as string))
        ) {
          renderItem.push(render(field.children));
        }
        return renderItem;
      })}
      {confirmBtn && (
        <Button
          isLoading={false}
          icon={confirmBtn.icon}
          className={clsx(
            "shadow bg-sand-12 text-sand-1 active:bg-sand-11",
            confirmBtn.className ?? "py-3 w-full  mt-4"
          )}
        >
          {confirmBtn.title}
        </Button>
      )}
    </form>
  );
}

export default Forms;
