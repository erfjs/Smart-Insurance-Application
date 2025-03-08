import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
