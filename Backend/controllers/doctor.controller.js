import User from "../models/User.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name specialization");
    console.log("Doctors fetched:", doctors.length);
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors", error: err.message });
  }
};
