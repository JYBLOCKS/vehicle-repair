const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const login = async (email: string, password: string) => {
  try {
    const data = new URLSearchParams();
    data.append("username", email);
    data.append("password", password);

    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as {
      access_token: string;
      token_type: string;
      refresh_token: string;
    };
  } catch (e) {
    throw new Error(`Login Error: ${e}`);
  }
};

export const register = async (
  email: string,
  name: string,
  password: string
) => {
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, name: name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    throw new Error(`Create User Error: ${e}`);
  }
};
