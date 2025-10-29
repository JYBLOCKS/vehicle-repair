import { Add, MoreVert } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  listEstimates,
  type EstimateOut,
  type EstimateStatus,
} from "./api/estimate.api";
import { getVehicle, type VehicleOut } from "./api/vehicle.api";
import { AddEstimateDialog, NavBar } from "./components";

type Row = {
  owner_name: string;
  brand: string;
  model: string;
  year: number | null;
  mileage: number | null;
  plate: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: EstimateStatus | undefined;
};

function App() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [status, setStatus] = useState<
    "pending" | "approved" | "in_progress" | "completed" | "canceled" | ""
  >("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Row[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(
    () =>
      rows.filter(
        (item) => status === "" || item?.status?.toLowerCase() === status
      ),
    [rows, status]
  );

  const loadData = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (!auth?.access_token) {
        setRows([]);
        return;
      }
      const estimates: EstimateOut[] = await listEstimates(auth.access_token);
      // Fetch all related vehicles in parallel
      const vehicleMap = new Map<string, VehicleOut>();
      await Promise.all(
        estimates.map(async (e) => {
          if (!vehicleMap.has(e.vehicle_id)) {
            const v = await getVehicle(e.vehicle_id, auth.access_token);
            vehicleMap.set(e.vehicle_id, v);
          }
        })
      );
      const tableRows: Row[] = estimates.map((e) => {
        const v = vehicleMap.get(e.vehicle_id)!;
        return {
          owner_name: v.owner_name,
          brand: v.brand,
          model: v.model,
          year: v.year ?? null,
          mileage: v.mileage ?? null,
          plate: v.plate ?? null,
          customer_notes: e.customer_notes ?? null,
          internal_notes: e.internal_notes ?? null,
          subtotal: Number(e.subtotal),
          tax_amount: Number(e.tax_amount),
          total: Number(e.total),
          status: e?.status,
        };
      });
      setRows(tableRows);
    } catch (err) {
      console.error(err);
      setRows([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusFilter = (
    filterStatus:
      | "pending"
      | "approved"
      | "in_progress"
      | "completed"
      | "canceled"
      | ""
  ) => {
    setStatus(filterStatus);
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <NavBar />
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        m={5}
      >
        <Paper sx={{ width: "100%", overflow: "hidden", p: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={1}
          >
            <Typography variant="h6">Estimates</Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              New
            </Button>
          </Stack>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Owner</TableCell>
                  <TableCell align="right">Brand</TableCell>
                  <TableCell align="right">Model</TableCell>
                  <TableCell align="right">Year</TableCell>
                  <TableCell align="right">Mileage</TableCell>
                  <TableCell align="right">Plate</TableCell>
                  <TableCell align="right">Customer Notes</TableCell>
                  <TableCell align="right">Internal Notes</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right">Tax</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Status
                      <IconButton
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                          list: {
                            "aria-labelledby": "basic-button",
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleStatusFilter("")}>
                          None
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("completed")}
                        >
                          Completed
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusFilter("pending")}>
                          Pending
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("in_progress")}
                        >
                          In Progress
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("approved")}
                        >
                          Approved
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusFilter("canceled")}
                        >
                          Canceled
                        </MenuItem>
                      </Menu>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={`${row.owner_name}-${row.brand}-${row.model}-${row.total}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.owner_name}
                      </TableCell>
                      <TableCell align="right">{row.brand}</TableCell>
                      <TableCell align="right">{row.model}</TableCell>
                      <TableCell align="right">{row.year}</TableCell>
                      <TableCell align="right">{row.mileage}</TableCell>
                      <TableCell align="right">{row.plate}</TableCell>
                      <TableCell align="right">{row.customer_notes}</TableCell>
                      <TableCell align="right">{row.internal_notes}</TableCell>
                      <TableCell align="right">{row.subtotal}</TableCell>
                      <TableCell align="right">{row.tax_amount}</TableCell>
                      <TableCell align="right">{row.total}</TableCell>
                      <TableCell align="right">
                        {row.status &&
                          (
                            row.status[0]?.toUpperCase() + row.status?.slice(1)
                          ).replaceAll("_", " ")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <AddEstimateDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onCreated={() => {
              setDialogOpen(false);
              loadData();
            }}
          />
        </Paper>
      </Stack>
    </Box>
  );
}

export default App;
