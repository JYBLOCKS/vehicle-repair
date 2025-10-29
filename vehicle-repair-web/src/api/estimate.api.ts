export type EstimateStatus =
  | "pending"
  | "approved"
  | "in_progress"
  | "completed"
  | "canceled";

export interface EstimateItemCreate {
  kind: "labor" | "part";
  description: string;
  quantity: number;
  unit_price: number;
  unit_cost?: number | null;
}

export interface EstimateCreate {
  vehicle_id: string;
  status?: EstimateStatus;
  customer_notes?: string | null;
  internal_notes?: string | null;
  validity_days?: number;
  tax_percent?: number;
  discount_amount?: number;
  items: EstimateItemCreate[];
}

export interface EstimateOut extends Omit<EstimateCreate, "items"> {
  id: string;
  created_by_id?: string | null;
  items: (EstimateItemCreate & { id: string })[];
  subtotal: number;
  tax_amount: number;
  total: number;
}

const baseUrl =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

export const listEstimates = async (
  accessToken: string
): Promise<EstimateOut[]> => {
  const res = await fetch(`${baseUrl}/estimates/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`List estimates failed: ${res.status}`);
  }
  return (await res.json()) as EstimateOut[];
};

export const createEstimate = async (
  payload: EstimateCreate,
  accessToken: string
): Promise<EstimateOut> => {
  const res = await fetch(`${baseUrl}/estimates/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Create estimate failed: ${res.status}`);
  }
  return (await res.json()) as EstimateOut;
};
