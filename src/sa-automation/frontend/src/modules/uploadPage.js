import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  LinearProgress,
  Alert,
  Stack,
  Paper,
  CircularProgress
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [status, setStatus] = useState(null);
  const [extractingQA, setExtractingQA] = useState(false);
  const [extractingDD, setExtractingDD] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus(null);
    setUploaded(false); 
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      setStatus({ type: "success", message: "Upload successful" });
      setUploaded(true);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
      setUploaded(false);
    } finally {
      setUploading(false);
    }
  };

  const handleExtractQA = async () => {
    setExtractingQA(true);
    setStatus(null);
    try {
      const res = await fetch("/qa/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setStatus({ type: "success", message: "QA extraction successful" });
    } catch (err) {
      setStatus({ type: "error", message: "QA extraction failed" });
    } finally {
      setExtractingQA(false);
    }
  };

  const handleExtractDD = async () => {
    setExtractingDD(true);
    setStatus(null);
    try {
      const res = await fetch("/design/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      setStatus({ type: "success", message: "Design Decision extraction successful" });
    } catch (err) {
      setStatus({ type: "error", message: "Design Decision extraction failed" });
    } finally {
      setExtractingDD(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 600 }}>
        Upload Architectural Documents
      </Typography>

      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Supported formats: PDF, DOCX.
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            {file ? file.name : "Choose File"}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          <Button
            variant="contained"
            disabled={!file || uploading}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          {uploading && <LinearProgress />}
          {status && <Alert severity={status.type}>{status.message}</Alert>}

          {uploaded && (
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="success"
                onClick={handleExtractQA}
                disabled={extractingQA}
                startIcon={extractingQA && <CircularProgress size={16} />}
              >
                {extractingQA ? "Extracting..." : "Extract Quality Attributes"}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleExtractDD}
                disabled={extractingDD}
                startIcon={extractingDD && <CircularProgress size={16} />}
              >
                {extractingDD ? "Extracting..." : "Extract Design Decisions"}
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
