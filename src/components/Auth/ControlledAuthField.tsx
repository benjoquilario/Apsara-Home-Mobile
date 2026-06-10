import React from "react"
import { useController, Control, FieldValues, Path } from "react-hook-form"
import AuthField, { AuthFieldProps } from "./AuthField"

type ControlledAuthFieldProps<T extends FieldValues> = Omit<
  AuthFieldProps,
  "error" | "defaultValue" | "value" | "onChangeText" | "onBlur"
> & {
  control: Control<T>
  name: Path<T>
}

/**
 * react-hook-form binding for AuthField. Uses `useController` so only THIS
 * field re-renders on its own keystrokes — the parent form does not.
 */
export default function ControlledAuthField<T extends FieldValues>({
  control,
  name,
  onFocus,
  ...rest
}: ControlledAuthFieldProps<T>) {
  const { field, fieldState } = useController({ control, name })

  return (
    <AuthField
      {...rest}
      value={field.value ?? ""}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
      onFocus={onFocus}
    />
  )
}
