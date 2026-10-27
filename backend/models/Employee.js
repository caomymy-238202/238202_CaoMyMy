
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, "Employee ID is required"],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true
  },
  gender: {
    type: String,
    trim: true
  },
  dateOfBirth: String,
  department: String,
  position: String,
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true
  },
  phone: String,
  hireDate: String,
  status: {
    type: String,
    default: "Active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
