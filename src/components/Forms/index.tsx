import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Select from "./Select";
import SingleSearch from "./Search/SingleSearch";
import MultipleSearch from "./Search/MultipleSearch";
import Checkbox from "./Checkbox";
import { ZodObject, z } from "zod";
import TextArea from "./TextArea";
import Button from "@/components/Common/Button";
import clsx from "clsx";
import SinglePicker from "./DatePicker/SinglePicker";

interface ConfirmBtn {
  title: string;
  icon?: string;
  className?: string;
}

type EachField<T> = {
  label: keyof T;
  title: string;
  type:
    | "select"
    | "single-search"
    | "multiple-search"
    | "text"
    | "checkbox"
    | "textarea"
    | "date";
  optional?: boolean;
  options?: string[];
  canAddItemNotInList?: boolean;
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

      case "single-search":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <SingleSearch
                datas={field.options ?? []}
                title={field.title}
                value={value ?? []}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                canAddItemNotInList={field.canAddItemNotInList}
              />
            )}
          />
        );
      case "multiple-search":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <MultipleSearch
                datas={field.options ?? []}
                title={field.title}
                value={value ?? []}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                canAddItemNotInList={field.canAddItemNotInList}
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

      case "date":
        return (
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <SinglePicker
                title="Start Date"
                value={value}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
              />
            )}
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
