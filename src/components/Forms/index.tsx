import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../Common/Input";
import Select from "../Common/Select";
import Multiple from "../Search/Multiple";
import Checkbox from "../Common/Checkbox";
import { ZodObject, z } from "zod";
import TextArea from "../Common/TextArea";

type EachField<T> = {
  label: keyof T;
  title: string;
  type: "select" | "multiple" | "input" | "checkbox" | "textarea";
  options?: string[];
  conditional?: (data: string) => boolean;
  children?: EachField<T>;
};

interface Props<T> {
  onSubmit: (formData: T) => void;
  schema: ZodObject<any>;
  fields: EachField<T>[];
}

function Forms<T>({ onSubmit, schema, fields }: Props<T>) {
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
      case "input":
        return (
          <Input
            key={field.label as string}
            register={register}
            label={field.label as string}
            title={field.title}
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
                isError={!!errors.type}
                error={errors.type?.message as string}
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
                isError={!!errors.owner}
                error={errors.owner?.message as string}
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
            optional
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
    </form>
  );
}

export default Forms;
