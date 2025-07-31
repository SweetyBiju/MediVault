import axios from "axios";

const OPENFDA_KEY = process.env.OPENFDA_API_KEY;
const OPENFDA_BASE = "https://api.fda.gov/drug";

export async function getDrugLabelByIngredient(ingredient, limit = 2) {
  const query = `openfda.substance_name:"${encodeURIComponent(ingredient)}"`;
  const url = `${OPENFDA_BASE}/label.json?search=${query}&limit=${limit}&api_key=${OPENFDA_KEY}`;
  try {
    const { data } = await axios.get(url);
    return data.results || [];
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
}
