import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent, // تایپ جدید
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { fetchFormStructure, submitForm } from "../api/formApi";
import DynamicForm from "../components/DynamicForm/DynamicForm";
import { FormList, FormStructure } from "../components/DynamicForm/types";

const FormPage: React.FC = () => {
  const { control, handleSubmit, watch, reset, setValue } = useForm({
    mode: "onChange",
  });
  const [forms, setForms] = useState<FormList>([]);
  const [selectedForm, setSelectedForm] = useState<FormStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // بارگذاری اولیه فرم‌ها
  useEffect(() => {
    const loadForms = async () => {
      try {
        const formList = await fetchFormStructure(); // اصلاح‌شده
        if (!Array.isArray(formList) || formList.length === 0) {
          throw new Error("هیچ فرمی از API دریافت نشد");
        }
        console.log("فرم‌های دریافت‌شده:", formList);
        setForms(formList);
        setSelectedForm(formList[0]);
      } catch (err) {
        setError("خطا در بارگذاری فرم‌ها");
        console.error(err);
      }
    };
    loadForms();
  }, []);

  // لود دیتای ذخیره‌شده از localStorage
  useEffect(() => {
    if (selectedForm) {
      const savedData = localStorage.getItem(
        `formDraft_${selectedForm.formId}`
      );
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach((key) => {
          setValue(key, parsedData[key], { shouldDirty: true });
        });
      }
    }
  }, [selectedForm, setValue]);

  // ذخیره real-time تغییرات توی localStorage
  useEffect(() => {
    const subscription = watch((data, { name }) => {
      if (selectedForm && name) {
        const currentData = watch();
        localStorage.setItem(
          `formDraft_${selectedForm.formId}`,
          JSON.stringify(currentData)
        );
        console.log(`ذخیره‌شده برای ${selectedForm.formId}:`, currentData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedForm]);

  const onSubmit = async (data: any) => {
    try {
      await submitForm(data);
      alert(t("submitSuccess"));
      localStorage.removeItem(`formDraft_${selectedForm?.formId}`);
      reset({
        ...Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
      });
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
