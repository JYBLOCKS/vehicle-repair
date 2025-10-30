export interface VehicleCreate {
  owner_name: string;
  owner_phone?: string | null;
  owner_email?: string | null;
  brand: string;
  model: string;
  year?: number | null;
  plate?: string | null;
  vin?: string | null;
  mileage?: number | null;
}

export interface VehicleOut extends VehicleCreate {
  id: string;
}

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const createVehicle = async (
  payload: VehicleCreate,
  accessToken: string
): Promise<VehicleOut> => {
  const res = await fetch(`${baseUrl}/vehicles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Create vehicle failed: ${res.status}`);
  }
  return (await res.json()) as VehicleOut;
};

export const getVehicle = async (
  id: string,
  accessToken: string
): Promise<VehicleOut> => {
  const res = await fetch(`${baseUrl}/vehicles/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Get vehicle failed: ${res.status}`);
  }
  return (await res.json()) as VehicleOut;
};
