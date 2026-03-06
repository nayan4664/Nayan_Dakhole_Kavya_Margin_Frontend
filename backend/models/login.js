import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  password: String
});

// force exact collection name
const Login = mongoose.model("Login", loginSchema, "login");

export default Login;