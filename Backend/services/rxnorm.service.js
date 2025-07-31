import axios from "axios";
const RX_BASE = "https://rxnav.nlm.nih.gov/REST";

export async function getRxcuiByName(name) {
  const url = `${RX_BASE}/rxcui.json?name=${encodeURIComponent(name)}`;
  const { data } = await axios.get(url);
  return data?.idGroup?.rxnormId?.[0] || null;
}

export async function getIngredientsByRxcui(rxcui) {
  if (!rxcui) return [];
  const url = `${RX_BASE}/rxcui/${rxcui}/related.json?tty=IN`;
  const { data } = await axios.get(url);
  const groups = data?.relatedGroup?.conceptGroup || [];
  const props = groups.flatMap((g) => g.conceptProperties || []);
  return props.map((p) => ({ name: p.name, rxcui: p.rxcui }));
}

export async function getInteractionsByRxcui(rxcui) {
  if (!rxcui) return null;
  const url = `${RX_BASE}/interaction/interaction.json?rxcui=${rxcui}`;
  const { data } = await axios.get(url);
  return data;
}
