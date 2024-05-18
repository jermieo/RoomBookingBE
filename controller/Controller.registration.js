import dotenv from "dotenv";
import User from "../models/Model.Sl.js";
import dates from "../models/Model.date.js";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

//Create Registration
export const registerUser = async (req, res) => {
  try {
    const { email, password, type } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    let newregistration = new User({
      email,
      password: hashPassword,
      type,
    });
    const getdata = await User.findOne({
      email: email,
    });
    if (getdata) {
      res
        .status(201)
        .json({ message: "Register failed.., alredy this mail registered" });
    } else {
      await newregistration.save();
      res.status(200).json({
        message: "user registered succefully",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Register failed , Registration internal error" });
  }
};

// Login
export const logins = async (req, res) => {
  try {
    const { email, password, type } = req.body;
    const getdata = await User.findOne({
      email: email,
    });
    if (!getdata) {
      return res.json({ message: "user mail not found", alert: false });
    }

    const passwordMatch = await bcrypt.compare(password, getdata.password);
    if (!passwordMatch) {
      return res.json({ message: "Invalid user password", alert: false });
    }
    const dataSend = {
      _id: getdata._id,
      email: getdata.email,
    };
    const token = jwt.sign({ _id: getdata._id }, process.env.JWT_SECERT);
    res.send({
      message: "Login is successfully",
      alert: true,
      data: dataSend,
      token: token,
    });
  } catch (error) {
    res.json({ error: "Login failed , Login internal error", alert: false });
  }
};
// Booking Form

export const bookingForm = async (req, res) => {
  try {
    const {
      roomeNumber,
      checkInDate,
      checkOutDate,
      classSection,
      price,
      totalPrice,
    } = req.body;

    // Validate dates to allow only current and future dates
    const currentDate = moment().startOf("day");
    const formattedCheckInDate = moment(checkInDate, "YYYY-MM-DD");
    const formattedCheckOutDate = moment(checkOutDate, "YYYY-MM-DD");

    if (
      !formattedCheckInDate.isValid() ||
      !formattedCheckOutDate.isValid() ||
      formattedCheckInDate.isBefore(currentDate) ||
      formattedCheckOutDate.isBefore(currentDate) ||
      formattedCheckInDate.isAfter(formattedCheckOutDate)
    ) {
      return res.status(400).json({
        message:
          "Invalid dates. Please select current or future dates for check-in and check-out.",
      });
    }

    // Check if the room number is already booked for the selected dates
    const existingBooking = await dates.findOne({
      roomeNumber,
      $or: [
        {
          $and: [
            { checkInDate: { $lte: formattedCheckInDate.toDate() } },
            { checkOutDate: { $gte: formattedCheckInDate.toDate() } },
          ],
        },
        {
          $and: [
            { checkInDate: { $lte: formattedCheckOutDate.toDate() } },
            { checkOutDate: { $gte: formattedCheckOutDate.toDate() } },
          ],
        },
        {
          $and: [
            { checkInDate: { $gte: formattedCheckInDate.toDate() } },
            { checkOutDate: { $lte: formattedCheckOutDate.toDate() } },
          ],
        },
      ],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Room already booked for selected dates." });
    }

    let newdateregistration = new dates({
      roomeNumber,
      checkInDate: formattedCheckInDate.toDate(),
      checkOutDate: formattedCheckOutDate.toDate(),
      classSection,
      price,
      totalPrice,
    });

    await newdateregistration.save();
    return res.status(200).json({ message: "Room registered successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Room booking failed due to internal error." });
  }
};
