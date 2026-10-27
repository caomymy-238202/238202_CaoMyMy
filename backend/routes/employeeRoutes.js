
const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const router = express.Router();

// GET /api/employees?search=An
// List employees or search by employee ID / name
router.get("/", async (req, res) => {
  try {
    const search = req.query.search?.trim();

    const filter = search
      ? {
          $or: [
            { employeeId: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const employees = await Employee.find(filter).sort({ employeeId: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// GET /api/employees/:id
// Find by MongoDB ID or employeeId
router.get("/:id", async (req, res) => {
  try {
    const value = req.params.id;

    const employee = mongoose.isValidObjectId(value)
      ? await Employee.findById(value)
      : await Employee.findOne({ employeeId: value });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee" });
  }
});

// POST /api/employees
// Create a new employee: required fields must be supplied
router.post("/", async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;

    if (
      typeof employeeId !== "string" || !employeeId.trim() ||
      typeof fullName !== "string" || !fullName.trim() ||
      typeof email !== "string" || !email.trim()
    ) {
      return res.status(400).json({
        message: "Employee ID, full name, and email are required"
      });
    }

    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Employee ID already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create employee" });
  }
});

// PUT /api/employees/:id
// Update only the fields supplied in the request
router.put("/:id", async (req, res) => {
  try {
    const value = req.params.id;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Please provide at least one field to update"
      });
    }

    // Do not allow clients to change MongoDB's internal ID
    delete updates._id;
    delete updates.__v;

    const filter = mongoose.isValidObjectId(value)
      ? { _id: value }
      : { employeeId: value };

    const employee = await Employee.findOneAndUpdate(
      filter,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Employee ID already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to update employee" });
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
  try {
    const value = req.params.id;

    const filter = mongoose.isValidObjectId(value)
      ? { _id: value }
      : { employeeId: value };

    const employee = await Employee.findOneAndDelete(filter);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

module.exports = router;
