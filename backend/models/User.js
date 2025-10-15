const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash
  age: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  bodyType: { type: String },
  bmiHistory: [
    {
      date: { type: String },
      value: { type: Number }
    }
  ],
  schedules: [
    {
      date: { type: String },
      title: { type: String },
      goal: { type: String },
      startTime: { type: String },
      endTime: { type: String },
      note: { type: String },
      priority: { type: String },
      completed: { type: Boolean, default: false },
      savedToProgress: { type: Boolean, default: false },
      exercisesCount: { type: Number, default: 1 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
