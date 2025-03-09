import React, { useEffect, useState } from "react";
import { Controller, Control, UseFormWatch } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import { Field } from "./types";
import axios from "axios";

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
    setDynamicOptions([]);
  }, [field.id]);

  useEffect(() => {
    const fetchDynamicOptions = async () => {
      if (field.dynamicOptions && dependsOnField && dependsOnValue) {
        try {
          const response = await axios({
            method: field.dynamicOptions.method || "GET",
            url: `${field.dynamicOptions.endpoint}?${dependsOnField}=${dependsOnValue}`,
          });
          console.log(`گزینه‌های دریافت‌شده برای ${field.id}:`, response.data);
          setDynamicOptions(response.data.states || []);
        } catch (error) {
          console.error(`خطا در گرفتن گزینه‌ها برای ${field.id}:`, error);
          setDynamicOptions([]);
        }
      }
    };

    if (dependsOnValue && (isSelectOpen || dynamicOptions.length === 0)) {
      fetchDynamicOptions();
    }
  }, [dependsOnValue, isSelectOpen, field]);

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
                ? {
                    value: new RegExp(field.validation.pattern),
                    message: "فرمت اشتباه است",
                  }
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
              min: field.validation?.min
                ? {
                    value: field.validation.min,
                    message: `حداقل مقدار ${field.validation.min} است`,
                  }
                : undefined,
              max: field.validation?.max
                ? {
                    value: field.validation.max,
                    message: `حداکثر مقدار ${field.validation.max} است`,
                  }
                : undefined,
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
                      ? "لطفاً اول وابستگی را انتخاب کنید"
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
            render={({ field: controllerField, fieldState }) => (
              <Box>
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
                {fieldState.error && (
                  <Typography color='error' variant='caption'>
                    {fieldState.error.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );
      case "checkbox":
        return (
          <Controller
            name={field.id}
            control={control}
            defaultValue={[]}
            rules={{
              validate: field.required
                ? (value) =>
                    (Array.isArray(value) && value.length > 0) ||
                    "حداقل یک گزینه را انتخاب کنید"
                : undefined,
            }}
            render={({ field: controllerField, fieldState }) => (
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
                          )}
                          onChange={(e) => {
                            const newValue = controllerField.value || [];
                            if (e.target.checked) {
                              controllerField.onChange([...newValue, value]);
                            } else {
                              controllerField.onChange(
                                newValue.filter((v: string) => v !== value)
                              );
                            }
                          }}
                        />
                      }
                      label={label}
                    />
                  );
                })}
                {fieldState.error && (
                  <Typography color='error' variant='caption'>
                    {fieldState.error.message}
                  </Typography>
                )}
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
