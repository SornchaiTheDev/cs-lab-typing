import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Select from "./Select";
import SingleSearch from "./Search/SingleSearch";
import MultipleSearch from "./Search/MultipleSearch";
import Checkbox from "./Checkbox";
import type { z, ZodEffects, ZodObject } from "zod";
import TextArea from "./TextArea";
import Button from "~/components/Common/Button";
import clsx from "clsx";
import SinglePicker from "./DatePicker/SinglePicker";

interface ConfirmBtn {
  title: string;
  icon?: string;
  className?: string;
  isLoading?: boolean;
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
  value?: string | string[] | Date;
  disabled?: boolean;
};

interface Props<T> {
  onSubmit: (formData: T) => Promise<void>;
  schema: ZodEffects<ZodObject<any>> | ZodObject<any>;
  fields: EachField<T>[];
  confirmBtn?: ConfirmBtn;
  isLoading?: boolean;
}

function Forms<T>({
  onSubmit,
  schema,
  fields,
  confirmBtn,
  isLoading,
}: Props<T>) {
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: Object.fromEntries(
      fields.map((field) => [field.label, field.value ?? ""])
    ) as z.infer<typeof schema>,
  });

  const render = (field: EachField<T>) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            isLoading={isLoading}
            key={field.label as string}
            register={register}
            label={field.label as string}
            title={field.title}
            optional={field.optional}
            isError={!!errors[field.label]}
            error={errors[field.label]?.message as string}
            disabled={field.disabled || isSubmitting}
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
                isLoading={isLoading}
                options={field.options ?? []}
                title={field.title}
                value={value as string}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                disabled={field.disabled || isSubmitting}
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
                isLoading={isLoading}
                datas={field.options ?? []}
                title={field.title}
                value={(value as string) ?? ""}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                canAddItemNotInList={field.canAddItemNotInList}
                disabled={field.disabled || isSubmitting}
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
                isLoading={isLoading}
                datas={field.options ?? []}
                title={field.title}
                value={[...(value as string)]}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                canAddItemNotInList={field.canAddItemNotInList}
                disabled={field.disabled || isSubmitting}
              />
            )}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            isLoading={isLoading}
            key={field.label as string}
            label={field.label as string}
            register={register}
            title={field.title}
            disabled={field.disabled || isSubmitting}
          />
        );
      case "textarea":
        return (
          <TextArea
            isLoading={isLoading}
            key={field.label as string}
            label={field.label as string}
            title={field.title}
            register={register}
            optional={field.optional}
            disabled={field.disabled || isSubmitting}
          />
        );

      case "date":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <SinglePicker
                title="Start Date"
                value={value as Date}
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
      onSubmit={
        void handleSubmit(
          onSubmit as SubmitHandler<{
            [x: string]: string | number | string[] | Date;
          }>
        )
      }
      className="flex flex-col gap-2"
    >
      {fields.map((field) => {
        const renderItem = [render(field)];
        if (
          field.children &&
          field.conditional &&
          field.conditional(watch(field.label as string) as string)
        ) {
          renderItem.push(render(field.children));
        }
        return renderItem;
      })}
      {confirmBtn && (
        <Button
          disabled={!isValid || !isDirty || isSubmitting}
          isLoading={confirmBtn.isLoading}
          icon={confirmBtn.icon}
          className={clsx(
            "bg-sand-12 text-sand-1 shadow active:bg-sand-11",
            confirmBtn.className ?? "mt-4 w-full py-2"
          )}
        >
          {confirmBtn.title}
        </Button>
      )}
    </form>
  );
}

export default Forms;
