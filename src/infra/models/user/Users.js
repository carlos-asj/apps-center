import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Insira um nome']
  },
  email: {
    type: String,
    required: [true, 'Insira um e-mail']
  },
  password: {
    type: String,
    required: [true, 'Insira uma senha']
  }
});

export default mongoose.model("Users", UsersSchema);
// mongoose.model('nome-do-modelo', schema-utilizado)