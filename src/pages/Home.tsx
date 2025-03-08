import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box textAlign='center' mt={5}>
      <Typography variant='h4' gutterBottom>
        {t("welcome")}
      </Typography>
      <Button
        variant='contained'
        color='primary'
        component={Link}
        to='/form'
        sx={{ m: 1 }}
      >
        {t("apply")}
      </Button>
      <Button
        variant='outlined'
        color='primary'
        component={Link}
        to='/submissions'
        sx={{ m: 1 }}
      >
        {t("viewSubmissions")}
      </Button>
    </Box>
  );
};

export default Home;
