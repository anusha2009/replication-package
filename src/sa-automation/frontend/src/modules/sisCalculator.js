import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Box
} from "@mui/material";

const DIMENSIONS = ["Technical-Economic", "Technical-Environmental", "Technical-Social"];

export default function SISCalculator() {
  const [decision, setDecision] = useState("");
  const [decisionData, setDecisionData] = useState([]);
  const [dimension, setDimension] = useState(DIMENSIONS[0]);
  const [qas, setQAs] = useState([]);
  const [qaData, setQAData] = useState([]);
  const [priorities, setPriorities] = useState({});
  const [impacts, setImpacts] = useState({});
  const [sisScore, setSisScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/design-decisions/validated")
      .then((res) => res.json())
      .then((data) => setDecisionData(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/qa/validated")
      .then((res) => res.json())
      .then(setQAData)
      .finally(() => setLoading(false));
  }, []);

  const decisions = decisionData.map(d => d.decision);

  const getDimensionQAs = (qas, dimension) => {
    const from = [];
    const to = [];
    qas.forEach(qa => {
      const match = qaData.find(q => q.quality_attribute === qa);
      if (match) {
        match.sustainability_dimension.forEach(dim => {
          if (dim === dimension.split("-")[0] && !from.includes(qa)) {
            from.push(qa);
          }
          if (dim === dimension.split("-")[1] && !to.includes(qa)) {
            to.push(qa);
          }
        });
      }
    });
    return { from, to };
  };

  useEffect(() => {
    if (decision) {
      const selected = decisionData.find(d => d.decision === decision);
      const qaList = selected?.impacted_quality_attributes || [];
      setQAs(qaList);

      const initial = {};
      qaList.forEach(qa => {
        initial[qa] = 1;
      });
      setPriorities(initial);
      setImpacts({});
      setSisScore(null);
    }
  }, [decision]);

  const handlePriorityChange = (qa, value) => {
    setPriorities({ ...priorities, [qa]: parseFloat(value) || 0 });
  };

  const handleImpactChange = (from, to, value) => {
    const key = `${from}->${to}`;
    setImpacts(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const { from, to } = getDimensionQAs(qas, dimension);
    const matrix = {};

    from.forEach(f => {
      matrix[f] = {};
      to.forEach(t => {
        const key = `${f}->${t}`;
        const val = impacts[key];
        matrix[f][t] = val !== undefined ? String(val) : "-";
      });
    });

    const payload = {
      dmatrices: {
        [decision]: {
          [dimension]: matrix
        }
      },
      priorities
    };

    fetch("/sis/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        const score = data.sis_scores?.[decision];
        setSisScore(score);
      });
  };

  return (
    <Container sx={{ mt: 12 }}>
      <Typography variant="h5" gutterBottom></Typography>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel>Design Decision</InputLabel>
        <Select value={decision} onChange={(e) => setDecision(e.target.value)}>
          {decisions.map(d => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {decision && (
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Sustainability Dimension</InputLabel>
          <Select value={dimension} onChange={(e) => setDimension(e.target.value)}>
            {DIMENSIONS.map(dim => (
              <MenuItem key={dim} value={dim}>{dim}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {qas.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>QA Priorities</Typography>
          <Paper sx={{ mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Quality Attribute</strong></TableCell>
                  <TableCell><strong>Priority</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qas.map((qa) => (
                  <TableRow key={qa}>
                    <TableCell>{qa}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={priorities[qa]}
                        onChange={(e) => handlePriorityChange(qa, e.target.value)}
                        inputProps={{ step: "any" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Typography variant="h6" sx={{ mt: 3 }}>
            DMatrix: {dimension}
          </Typography>
          <Paper sx={{ mt: 2, overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong></strong></TableCell>
                  {getDimensionQAs(qas, dimension).to.map(to => (
                    <TableCell key={to} align="center"><strong>{to}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {getDimensionQAs(qas, dimension).from.map(from => (
                  <TableRow key={from}>
                    <TableCell><strong>{from}</strong></TableCell>
                    {getDimensionQAs(qas, dimension).to.map(to => (
                      <TableCell key={to} align="center">
                        <TextField
                          type="number"
                          value={impacts[`${from}->${to}`] || ""}
                          onChange={(e) => handleImpactChange(from, to, e.target.value)}
                          size="small"
                          inputProps={{ style: { width: "60px" }, step: "any" }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Box mt={3} display="flex" alignItems="center" gap={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit and Calculate SIS
            </Button>
            {sisScore !== null && (
              <Typography variant="subtitle1">
                SIS Score ({dimension}): <strong>{sisScore}</strong>
              </Typography>
            )}
          </Box>
        </>
      )}
    </Container>
  );
}
