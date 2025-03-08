import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Control, Controller, UseFormWatch } from "react-hook-form";

import { Field } from "./types";

interface FieldRendererProps {
  field: Field;
  control: Control<any>;
  watch: UseFormWatch<any>;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  control,
  watch,
}) => {
  const [dynamicOptions, setDynamicOptions] = useState<
    (string | { value: string; label: string })[]
  >([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const dependsOnField = field.dynamicOptions?.dependsOn;
  const dependsOnValue = dependsOnField ? watch(dependsOnField) : undefined;

  useEffect(() => {
    const fetchDynamicOptions = async () => {
      if (field.dynamicOptions && dependsOnField && dependsOnValue) {
        try {
          const response = await axios({
            method: field.dynamicOptions.method || "GET",
            url: `${field.dynamicOptions.endpoint}?${dependsOnField}=${dependsOnValue}`,
          });
          setDynamicOptions(response.data.states || []);
        } catch (error) {
          console.error(`خطا در گرفتن گزینه‌ها برای ${field.id}:`, error);
          setDynamicOptions([]);
        }
      } else {
        setDynamicOptions([]);
      }
    };

    if (dependsOnValue && (isSelectOpen || dynamicOptions.length === 0)) {
      fetchDynamicOptions();
    }
  }, [
    dependsOnValue,
    isSelectOpen,
    dynamicOptions.length,
    field,
    dependsOnField,
  ]);

  if (field.visibility) {
    const visibilityDependsOnValue = field.visibility.dependsOn
      ? watch(field.visibility.dependsOn)
      : undefined;
    if (
      field.visibility.condition === "equals" &&
      visibilityDependsOnValue !== field.visibility.value
    ) {
      return null;
    }
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{
              required: field.required ? "این فیلد الزامی است" : false,
              pattern: field.validation?.pattern
                ? new RegExp(field.validation.pattern)
                : undefined,
            }}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                label={field.label}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin='normal'
              />
            )}
          />
        );
      case "number":
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{
              required: field.required ? "این فیلد الزامی است" : false,
              min: field.validation?.min,
              max: field.validation?.max,
            }}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                type='number'
                label={field.label}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin='normal'
              />
            )}
          />
        );
      case "date":
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required ? "این فیلد الزامی است" : false }}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                type='date'
                label={field.label}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ""}
                fullWidth
                margin='normal'
              />
            )}
          />
        );
      case "select":
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required ? "این فیلد الزامی است" : false }}
            render={({ field: controllerField, fieldState }) => (
              <Box>
                <Select
                  {...controllerField}
                  label={field.label}
                  value={controllerField.value || ""}
                  error={!!fieldState.error}
                  fullWidth
                  displayEmpty
                  sx={{ mt: 2 }}
                  onChange={(e) => controllerField.onChange(e.target.value)}
                  onOpen={() => setIsSelectOpen(true)}
                  onClose={() => setIsSelectOpen(false)}
                >
                  <MenuItem value='' disabled>
                    {field.dynamicOptions && !dynamicOptions.length
                      ? "لطفاً اول کشور را انتخاب کنید"
                      : field.label || "انتخاب کنید"}
                  </MenuItem>
                  {(field.dynamicOptions
                    ? dynamicOptions
                    : field.options || []
                  ).map((option) => {
                    const value =
                      typeof option === "string" ? option : option.value;
                    const label =
                      typeof option === "string" ? option : option.label;
                    return (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
                {fieldState.error && (
                  <Typography color='error' variant='caption'>
                    {fieldState.error.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );
      case "radio":
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required ? "این فیلد الزامی است" : false }}
            render={({ field: controllerField }) => (
              <RadioGroup
                {...controllerField}
                onChange={(e) => controllerField.onChange(e.target.value)}
              >
                <Typography>{field.label}</Typography>
                {(field.options || []).map((option) => {
                  const value =
                    typeof option === "string" ? option : option.value;
                  const label =
                    typeof option === "string" ? option : option.label;
                  return (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={<Radio />}
                      label={label}
                    />
                  );
                })}
              </RadioGroup>
            )}
          />
        );
      case "checkbox":
        return (
          <Controller
            name={field.id}
            control={control}
            defaultValue={[]} // مقدار پیش‌فرض خالی برای چک‌باکس‌ها
            rules={{ required: field.required ? "این فیلد الزامی است" : false }}
            render={({ field: controllerField }) => (
              <Box>
                <Typography>{field.label}</Typography>
                {(field.options || []).map((option) => {
                  const value =
                    typeof option === "string" ? option : option.value;
                  const label =
                    typeof option === "string" ? option : option.label;
                  return (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={(controllerField.value || []).includes(
                            value
                          )} // چک می‌کنیم که آیا این گزینه انتخاب شده است یا نه
                          onChange={(e) => {
                            const newValue = controllerField.value || []; // اگر هیچ مقداری وجود نداشته باشد، آرایه خالی قرار می‌دهیم
                            if (e.target.checked) {
                              controllerField.onChange([...newValue, value]); // اگر چک‌باکس تیک خورده است، آن را به آرایه اضافه می‌کنیم
                            } else {
                              controllerField.onChange(
                                newValue.filter((v: string) => v !== value) // در غیر این صورت از آرایه حذف می‌کنیم
                              );
                            }
                          }}
                        />
                      }
                      label={label}
                    />
                  );
                })}
              </Box>
            )}
          />
        );

      case "group":
        return (
          <Box sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant='h6'>{field.label}</Typography>
            {field.fields?.map((subField) => (
              <FieldRenderer
                key={subField.id}
                field={subField}
                control={control}
                watch={watch}
              />
            ))}
          </Box>
        );
      default:
        return <Typography>نوع فیلد پشتیبانی نمی‌شود: {field.type}</Typography>;
    }
  };

  return renderField();
};

export default FieldRenderer;
