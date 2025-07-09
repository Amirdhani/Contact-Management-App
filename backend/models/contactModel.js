import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  email: { type: String, unique: true },
  phone: String,
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;