import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Button,
  Chip,
  TextField,
  Divider,
  Container
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

export default function DesignDecisions() {
  const [decisions, setDecisions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/design-decisions/validated")
      .then((res) => res.json())
      .then((data) => setDecisions(data))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (index, field, value) => {
    const updated = [...decisions];
    updated[index][field] = value;
    setDecisions(updated);
  };

  const updateQA = (index, value) => {
    const updated = [...decisions];
    updated[index].impacted_quality_attributes = value.split(",").map((qa) => qa.trim());
    setDecisions(updated);
  };

  const saveDesignDecisions = () => {
    setSaving(true);
    fetch("/design-decisions/validated", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(decisions),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
        return res.json();
      })
      .catch((err) => {
        console.error("Save error:", err);
        alert("Failed to save changes.");
      })
      .finally(() => setSaving(false));
  };

  const handleSaveClick = () => {
    saveDesignDecisions();
    setEditIndex(null);
  };

  if (loading) return <Typography>Loading architectural design decisions...</Typography>;

  return (
    <Container sx={{ mt: 12, mb: 12 }}>
      <Typography variant="h5" gutterBottom></Typography>
      <Stack spacing={4}>
        {decisions.map((decision, i) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                {editIndex === i ? (
                  <>
                    <TextField
                      label="Design Decision"
                      fullWidth
                      value={decision.decision}
                      onChange={(e) => updateField(i, "decision", e.target.value)}
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      value={decision.description}
                      onChange={(e) => updateField(i, "description", e.target.value)}
                    />
                    <TextField
                      label="Rationale"
                      fullWidth
                      multiline
                      value={decision.rationale}
                      onChange={(e) => updateField(i, "rationale", e.target.value)}
                    />
                    <TextField
                      label="Supported QAs"
                      fullWidth
                      value={decision.impacted_quality_attributes.join(", ")}
                      onChange={(e) => updateQA(i, e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h6">{decision.decision}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {decision.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Rationale:</strong> {decision.rationale}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1} mb={1}>
                      {decision.impacted_quality_attributes.map((qa, idx) => (
                        <Chip label={qa} key={idx} size="small" />
                      ))}
                    </Stack>
                  </>
                )}
              </Stack>
            </CardContent>
            <CardActions>
              {editIndex === i ? (
                <Button
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Done"}
                </Button>
              ) : (
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setEditIndex(i)}
                >
                  Edit
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
