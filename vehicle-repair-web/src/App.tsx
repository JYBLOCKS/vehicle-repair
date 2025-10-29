import { MoreVert } from "@mui/icons-material";
import {
  Box,
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
} from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { NavBar } from "./components";
import { rows } from "./dummydata";

function App() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [status, setStatus] = useState<
    "pending" | "approved" | "in_progress" | "completed" | "canceled" | ""
  >("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .filter(
                    (item) =>
                      status === "" || item.status.toLowerCase() === status
                  )
                  .map((row) => (
                    <TableRow
                      key={row.owner_name}
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
                        {(
                          row.status[0].toUpperCase() + row.status.slice(1)
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
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Stack>
    </Box>
  );
}

export default App;
