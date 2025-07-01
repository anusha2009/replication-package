import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  TextField,
  Stack,
  Container,
  Divider,
} from "@mui/material";

export default function ValidatedQA() {
  const [qas, setQAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch("/qa/validated")
      .then((res) => res.json())
      .then(setQAs)
      .finally(() => setLoading(false));
  }, []);

  const updateQA = (index, field, value) => {
    const updated = [...qas];
    updated[index][field] = value;
    setQAs(updated);
  };

  const addDimension = (index) => {
    const updated = [...qas];
    updated[index].sustainability_dimension.push("");
    setQAs(updated);
  };

  const addQA = () => {
    setQAs([
      ...qas,
      {
        stimulus_source: "",
        stimulus: "",
        environment: "",
        artifact: "",
        response: "",
        response_measure: "",
        quality_attribute: "",
        sustainability_dimension: [],
        description: "",
      },
    ]);
    setEditIndex(qas.length);
  };

  const removeQA = (index) => {
    const updated = [...qas];
    updated.splice(index, 1);
    setQAs(updated);
    if (editIndex === index) setEditIndex(null);
  };

  const saveQA = () => {
    setSaving(true);
    fetch("/qa/validated", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qas),
    })
      .then((res) => {
        if (!res.ok) return res.text().then((text) => { throw new Error(text); });
        return res.json();
      })
      .catch((err) => {
        console.error("POST failed:", err.message);
        alert("Save failed: " + err.message);
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <Typography>Loading quality attributes...</Typography>;

  return (
    <Container sx={{ mt: 12, mb: 12 }}>
      <Stack spacing={4}>
        {qas.map((qa, i) => (
          <Card key={i} variant="outlined">
            <CardContent>
              {editIndex === i ? (
                <Stack spacing={2}>
                  <TextField label="Quality Attribute" fullWidth value={qa.quality_attribute} onChange={(e) => updateQA(i, "quality_attribute", e.target.value)} />
                  <TextField label="Stimulus Source" fullWidth value={qa.stimulus_source} onChange={(e) => updateQA(i, "stimulus_source", e.target.value)} />
                  <TextField label="Stimulus" fullWidth value={qa.stimulus} onChange={(e) => updateQA(i, "stimulus", e.target.value)} />
                  <TextField label="Environment" fullWidth value={qa.environment} onChange={(e) => updateQA(i, "environment", e.target.value)} />
                  <TextField label="Artifact" fullWidth value={qa.artifact} onChange={(e) => updateQA(i, "artifact", e.target.value)} />
                  <TextField label="Response" fullWidth value={qa.response} onChange={(e) => updateQA(i, "response", e.target.value)} />
                  <TextField label="Response Measure" fullWidth value={qa.response_measure} onChange={(e) => updateQA(i, "response_measure", e.target.value)} />
                  <TextField label="Description" fullWidth value={qa.description} onChange={(e) => updateQA(i, "description", e.target.value)} />
                  <Typography variant="subtitle1">Sustainability Dimensions</Typography>
                  <Stack spacing={1}>
                    {qa.sustainability_dimension.map((dim, j) => (
                      <TextField
                        key={j}
                        label={`Dimension ${j + 1}`}
                        fullWidth
                        value={dim}
                        onChange={(e) => {
                          const newDims = [...qa.sustainability_dimension];
                          newDims[j] = e.target.value;
                          updateQA(i, "sustainability_dimension", newDims);
                        }}
                      />
                    ))}
                  </Stack>
                  <Button onClick={() => addDimension(i)}>+ Add Dimension</Button>
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="h6">{qa.quality_attribute}</Typography>
                  <Typography variant="body2">{qa.description}</Typography>
                  <Divider />
                  <Typography variant="body2"><strong>Stimulus Source:</strong> {qa.stimulus_source}</Typography>
                  <Typography variant="body2"><strong>Stimulus:</strong> {qa.stimulus}</Typography>
                  <Typography variant="body2"><strong>Environment:</strong> {qa.environment}</Typography>
                  <Typography variant="body2"><strong>Artifact:</strong> {qa.artifact}</Typography>
                  <Typography variant="body2"><strong>Response:</strong> {qa.response}</Typography>
                  <Typography variant="body2"><strong>Response Measure:</strong> {qa.response_measure}</Typography>
                  <Typography variant="body2"><strong>Sustainability Dimensions:</strong> {qa.sustainability_dimension.join(", ")}</Typography>
                </Stack>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setEditIndex(editIndex === i ? null : i)}>
                {editIndex === i ? "Done" : "Edit"}
              </Button>
              <Button size="small" color="error" onClick={() => {
                if (window.confirm("Are you sure you want to remove this QA?")) {
                  removeQA(i);
                }
              }}>
                Remove
              </Button>
            </CardActions>
          </Card>
        ))}
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={addQA}>Add QA</Button>
          <Button variant="contained" onClick={saveQA} disabled={saving}>
            {saving ? "Saving..." : "Save All"}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
