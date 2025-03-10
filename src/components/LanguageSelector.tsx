import { FormControl, MenuItem, Select } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng); 
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        displayEmpty
      >
        <MenuItem value='en'>English</MenuItem>
        <MenuItem value='fa'>فارسی</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
