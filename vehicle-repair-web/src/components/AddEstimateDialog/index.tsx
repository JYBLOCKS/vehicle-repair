import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import type { EstimateItemCreate } from "../../api/estimate.api";
import { createEstimate } from "../../api/estimate.api";
import type { VehicleCreate } from "../../api/vehicle.api";
import { createVehicle } from "../../api/vehicle.api";

export default function AddEstimateDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const [vehicle, setVehicle] = useState<VehicleCreate>({
    owner_name: "",
    brand: "",
    model: "",
    year: undefined,
    plate: "",
    mileage: undefined,
    owner_email: "",
    owner_phone: "",
    vin: "",
  });

  const [estimate, setEstimate] = useState({
    customer_notes: "",
    internal_notes: "",
    tax_percent: 13,
    discount_amount: 0,
    validity_days: 7,
  });

  const [item, setItem] = useState<EstimateItemCreate>({
    kind: "part",
    description: "",
    quantity: 1,
    unit_price: 0,
    unit_cost: undefined,
  });

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (!auth?.access_token) throw new Error("Not authenticated");

      const createdVehicle = await createVehicle(
        {
          ...vehicle,
          year: vehicle.year ? Number(vehicle.year) : undefined,
          mileage: vehicle.mileage ? Number(vehicle.mileage) : undefined,
        },
        auth.access_token
      );

      await createEstimate(
        {
          vehicle_id: createdVehicle.id,
          customer_notes: estimate.customer_notes || undefined,
          internal_notes: estimate.internal_notes || undefined,
          tax_percent: Number(estimate.tax_percent) || 0,
          discount_amount: Number(estimate.discount_amount) || 0,
          validity_days: Number(estimate.validity_days) || 7,
          items: [
            {
              ...item,
              quantity: Number(item.quantity),
              unit_price: Number(item.unit_price),
              unit_cost: item.unit_cost ? Number(item.unit_cost) : undefined,
            },
          ],
        },
        auth.access_token
      );

      onCreated();
      onClose();
    } catch (e) {
      console.error(e);
      alert(`Error creating estimate: ${e}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>New Vehicle + Estimate</DialogTitle>
      <DialogContent>
        <Stack direction={{ xs: "column", md: "row" }} gap={3} mt={1}>
          <Box sx={{ flex: 1 }}>
            <Stack gap={1}>
              <TextField
                label="Owner Name"
                value={vehicle.owner_name}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, owner_name: e.target.value }))
                }
                required
              />
              <TextField
                label="Owner Email"
                value={vehicle.owner_email || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, owner_email: e.target.value }))
                }
              />
              <TextField
                label="Owner Phone"
                value={vehicle.owner_phone || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, owner_phone: e.target.value }))
                }
              />
              <TextField
                label="Brand"
                value={vehicle.brand}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, brand: e.target.value }))
                }
                required
              />
              <TextField
                label="Model"
                value={vehicle.model}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, model: e.target.value }))
                }
                required
              />
              <TextField
                label="Year"
                type="number"
                value={vehicle.year ?? ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, year: Number(e.target.value) }))
                }
                inputProps={{ min: 1900, max: 2100 }}
              />
              <TextField
                label="Mileage"
                type="number"
                value={vehicle.mileage ?? ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, mileage: Number(e.target.value) }))
                }
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Plate"
                value={vehicle.plate || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, plate: e.target.value }))
                }
              />
              <TextField
                label="VIN"
                value={vehicle.vin || ""}
                onChange={(e) =>
                  setVehicle((v) => ({ ...v, vin: e.target.value }))
                }
              />
            </Stack>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack gap={1}>
              <TextField
                label="Customer Notes"
                value={estimate.customer_notes}
                onChange={(e) =>
                  setEstimate((s) => ({ ...s, customer_notes: e.target.value }))
                }
                multiline
                minRows={2}
              />
              <TextField
                label="Internal Notes"
                value={estimate.internal_notes}
                onChange={(e) =>
                  setEstimate((s) => ({ ...s, internal_notes: e.target.value }))
                }
                multiline
                minRows={2}
              />
              <TextField
                label="Tax %"
                type="number"
                value={estimate.tax_percent}
                onChange={(e) =>
                  setEstimate((s) => ({
                    ...s,
                    tax_percent: Number(e.target.value),
                  }))
                }
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
              <TextField
                label="Discount Amount"
                type="number"
                value={estimate.discount_amount}
                onChange={(e) =>
                  setEstimate((s) => ({
                    ...s,
                    discount_amount: Number(e.target.value),
                  }))
                }
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                label="Validity Days"
                type="number"
                value={estimate.validity_days}
                onChange={(e) =>
                  setEstimate((s) => ({
                    ...s,
                    validity_days: Number(e.target.value),
                  }))
                }
                inputProps={{ min: 1, max: 60 }}
              />

              <Stack direction={{ xs: "column", md: "row" }} gap={1}>
                <TextField
                  select
                  label="Item Kind"
                  value={item.kind}
                  onChange={(e) =>
                    setItem((it) => ({ ...it, kind: e.target.value as any }))
                  }
                  sx={{ minWidth: 140 }}
                >
                  <MenuItem value="part">Part</MenuItem>
                  <MenuItem value="labor">Labor</MenuItem>
                </TextField>
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(e) =>
                    setItem((it) => ({ ...it, description: e.target.value }))
                  }
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} gap={1}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    setItem((it) => ({
                      ...it,
                      quantity: Number(e.target.value),
                    }))
                  }
                  inputProps={{ min: 0.01, step: 0.01 }}
                />
                <TextField
                  label="Unit Price"
                  type="number"
                  value={item.unit_price}
                  onChange={(e) =>
                    setItem((it) => ({
                      ...it,
                      unit_price: Number(e.target.value),
                    }))
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Unit Cost"
                  type="number"
                  value={item.unit_cost ?? ""}
                  onChange={(e) =>
                    setItem((it) => ({
                      ...it,
                      unit_cost: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
