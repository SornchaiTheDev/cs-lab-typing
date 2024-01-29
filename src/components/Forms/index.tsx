import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Select from "./Select";
import Search from "./Search";
import Checkbox from "./Checkbox";
import type { z, ZodEffects, ZodObject } from "zod";
import TextArea from "./TextArea";
import Button from "~/components/Common/Button";
import clsx from "clsx";
import SinglePicker from "./DatePicker/SinglePicker";
import type { SearchValue } from "~/types";
import DateTimePicker from "./DatePicker/DateTimePicker";

interface ConfirmBtn {
  title: string;
  icon?: string;
  className?: string;
  isLoading?: boolean;
}

type BaseField<T> = {
  label: keyof T;
  title: string;
  optional?: boolean;
  value?: string | string[] | Date | boolean | SearchValue[];
  disabled?: boolean;
  conditional?: (data: string) => boolean;
  children?: EachField<T>;
};

type GeneralField<T> = BaseField<T> & {
  type: "text" | "textarea" | "checkbox" | "date" | "dateTime";
};

type SearchField<T> = BaseField<T> & {
  type: "single-search" | "multiple-search";
  queryFn: (value: string) => Promise<SearchValue[]>;
  canAddItemNotInList?: boolean;
};

type StaticSearchField<T> = BaseField<T> & {
  type: "static-search";
  options: SearchValue[];
  canAddItemNotInList?: boolean;
};

type SelectField<T> = BaseField<T> & {
  type: "select";
  options: string[];
  emptyMsg?: string;
};

export type EachField<T> =
  | GeneralField<T>
  | SearchField<T>
  | SelectField<T>
  | StaticSearchField<T>;

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
      fields.map((field) => {
        if (["single-search", "multiple-search"].includes(field.type)) {
          return [field.label, (field.value as SearchValue[]) ?? []];
        }
        return [field.label, field.value ?? undefined];
      })
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
                options={(field.options as string[]) ?? []}
                title={field.title}
                value={value ?? ""}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                disabled={field.disabled || isSubmitting}
                emptyMsg={field.emptyMsg ?? ""}
              />
            )}
          />
        );

      case "static-search":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <Search
                isLoading={isLoading}
                title={field.title}
                value={value as SearchValue[]}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                disabled={field.disabled || isSubmitting}
                options={field.options}
                canAddItemNotInList={field.canAddItemNotInList ?? false}
                multiple
                isStatic
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
              <Search
                queryFn={field.queryFn}
                isLoading={isLoading}
                title={field.title}
                value={value as SearchValue[]}
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
              <Search
                queryFn={field.queryFn}
                isLoading={isLoading}
                title={field.title}
                value={value as SearchValue[]}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
                canAddItemNotInList={field.canAddItemNotInList}
                disabled={field.disabled || isSubmitting}
                multiple
              />
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                isLoading={isLoading}
                key={field.label as string}
                label={field.label as string}
                title={field.title}
                value={value ?? false}
                onChange={onChange}
                disabled={field.disabled || isSubmitting}
              />
            )}
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
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <SinglePicker
                title={field.title}
                value={value as Date}
                onChange={onChange}
                isError={!!errors[field.label]}
                error={errors[field.label]?.message as string}
                optional={field.optional}
              />
            )}
          />
        );
      case "dateTime":
        return (
          <Controller
            key={field.label as string}
            control={control}
            name={field.label as string}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
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
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit as SubmitHandler<{
          [x: string]: string | number | string[] | Date;
        }>
      )}
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
