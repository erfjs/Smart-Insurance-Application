import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { fetchFormStructure, submitForm } from "../api/formApi";
import DynamicForm from "../components/DynamicForm/DynamicForm";
import { FormList, FormStructure } from "../components/DynamicForm/types";

interface FormData {
  [key: string]: any;
}

const FormPage: React.FC = () => {
  const { control, handleSubmit, watch, reset, setValue } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {},
  });
  const [forms, setForms] = useState<FormList>([]);
  const [selectedForm, setSelectedForm] = useState<FormStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // بارگذاری اولیه فرم‌ها
  useEffect(() => {
    const loadForms = async () => {
      try {
        const formList = await fetchFormStructure();
        if (!Array.isArray(formList) || formList.length === 0) {
          throw new Error("هیچ فرمی از API دریافت نشد");
        }
        console.log("فرم‌های دریافت‌شده:", formList);
        setForms(formList);
        setSelectedForm(formList[0]); // فرم پیش‌فرض
      } catch (err) {
        setError("خطا در بارگذاری فرم‌ها");
        console.error(err);
      }
    };
    loadForms();
  }, []);

  // تنظیم defaultValues و لود دیتای ذخیره‌شده از localStorage
  useEffect(() => {
    if (selectedForm) {
      const defaultValues: FormData = {};
      const setDefaultValues = (fields: FormStructure["fields"]) => {
        fields.forEach((field) => {
          if (field.type === "group") {
            setDefaultValues(field.fields || []);
          } else {
            defaultValues[field.id] = field.type === "checkbox" ? [] : "";
          }
        });
      };
      setDefaultValues(selectedForm.fields);

      // لود دیتای ذخیره‌شده از localStorage
      const savedData = localStorage.getItem(
        `formDraft_${selectedForm.formId}`
      );
      let formData = { ...defaultValues };
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        formData = {
          ...defaultValues,
          ...parsedData, // دیتای ذخیره‌شده رو با defaultValues ادغام می‌کنیم
        };
        Object.keys(parsedData).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
            setValue(key, parsedData[key], { shouldDirty: true });
          }
        });
      }
      reset(formData); // فرم رو با دیتای ادغام‌شده ریست می‌کنیم
    }
  }, [selectedForm, setValue, reset]);

  // ذخیره real-time تغییرات توی localStorage
  useEffect(() => {
    const subscription = watch((data, { name }) => {
      if (selectedForm && name) {
        const currentData = watch();
        const filteredData = Object.fromEntries(
          Object.entries(currentData).filter(([key]) =>
            selectedForm.fields.some(
              (field) =>
                field.id === key ||
                (field.type === "group" &&
                  field.fields?.some((subField) => subField.id === key))
            )
          )
        );
        localStorage.setItem(
          `formDraft_${selectedForm.formId}`,
          JSON.stringify(filteredData)
        );
        console.log(`ذخیره‌شده برای ${selectedForm.formId}:`, filteredData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedForm]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!selectedForm) {
      console.error("هیچ فرمی انتخاب نشده");
      return;
    }

    // فقط فیلدهای فرم انتخاب‌شده رو نگه می‌داریم
    const allowedFields = new Set<string>();
    const collectFields = (fields: FormStructure["fields"]) => {
      fields.forEach((field) => {
        if (field.type === "group") {
          collectFields(field.fields || []);
        } else {
          allowedFields.add(field.id);
        }
      });
    };
    collectFields(selectedForm.fields);

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.has(key))
    );

    console.log("دیتای ارسال‌شده به سرور:", filteredData);

    try {
      await submitForm(filteredData);
      alert(t("submitSuccess"));
      localStorage.removeItem(`formDraft_${selectedForm.formId}`);
      reset(
        Object.fromEntries(
          Object.keys(filteredData).map((key) => [
            key,
            Array.isArray(filteredData[key]) ? [] : "",
          ])
        )
      );
    } catch (err) {
      console.error("خطا در ارسال فرم:", err);
      alert(t("submitError"));
    }
  };

  const handleFormChange = (event: SelectChangeEvent) => {
    const formId = event.target.value as string;
    const selected = forms.find((form) => form.formId === formId) || null;
    console.log("فرم انتخاب‌شده:", selected);
    setSelectedForm(selected);
  };

  if (error) return <Typography color='error'>{error}</Typography>;
  if (forms.length === 0) return <Typography>{t("loading")}</Typography>;

  return (
    <Box mt={5}>
      <Typography variant='h5' gutterBottom>
        {t("applyForInsurance")}
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t("selectForm")}</InputLabel>
        <Select
          value={selectedForm?.formId || ""}
          onChange={handleFormChange}
          label={t("selectForm")}
        >
          {forms.map((form) => (
            <MenuItem key={form.formId} value={form.formId}>
              {form.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DynamicForm
            key={selectedForm.formId}
            control={control}
            watch={watch}
            structure={selectedForm}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
          >
            {t("submit")}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default FormPage;
