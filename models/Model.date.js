import mongoose from "mongoose";

const dateSchema = new mongoose.Schema({
  roomeNumber: Number,
  checkInDate: Date,
  checkOutDate: Date,
  class1: String,
  price: Number,
  totalPrice: Number,
});

const dates = mongoose.model("dates", dateSchema);

export default dates;
