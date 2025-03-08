import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchSubmissions } from "../api/submissionApi";
import SubmissionList from "../components/SubmissionList/SubmissionList";
import { Submission } from "../components/SubmissionList/types";

const SubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const { data, columns } = await fetchSubmissions();
        setSubmissions(data);
        setColumns(columns);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    loadSubmissions();
  }, []);

  return (
    <Box mt={5}>
      <Typography variant='h5' gutterBottom>
        {t("submissions")}
      </Typography>
      <SubmissionList submissions={submissions} columns={columns} />
    </Box>
  );
};

export default SubmissionsPage;
