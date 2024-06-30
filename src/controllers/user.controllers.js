import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  let { fullname, email, wantSection, haveSection, phoneNumber } = req.body;

  // Check for maximum length
  const maxLength = 250;
  if (
    fullname.length > maxLength ||
    email.length > maxLength ||
    phoneNumber.length > maxLength ||
    haveSection.length > maxLength ||
    (Array.isArray(wantSection) && wantSection.join(',').length > maxLength)
  ) {
    throw new ApiError(400, "Input exceeds maximum length of 250 characters");
  }

  // Trim and convert haveSection to uppercase
  haveSection = haveSection.trim().toUpperCase();

  const phoneregex = /^[6-9]\d{9}$/;
  const emailregex = /^[a-zA-Z0-9._%+-]+@kiit\.ac\.in$/;

  if ([fullname, email, haveSection].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (!(phoneregex.test(phoneNumber))) {
    throw new ApiError(400, "Invalid phone number");
  }

  if (!(emailregex.test(email))) {
    throw new ApiError(400, "Invalid KIIT email address");
  }

  if (!Array.isArray(wantSection) || wantSection.length === 0) {
    throw new ApiError(400, "wantSection needs to be a non-empty array");
  }

  // Validate haveSection format (e.g., 'CSE2')
  const haveSectionRegex = /^[A-Z]+\d+$/;
  if (!haveSectionRegex.test(haveSection)) {
    throw new ApiError(400, "Invalid haveSection format. It should be like 'CSE2'");
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Create new user
  const user = await User.create({
    fullname,
    email,
    wantSection,
    haveSection,
    phoneNumber,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const phoneRegex = /^[6-9]\d{9}$/;
  const { wantSection, phoneNumber } = req.body;

  if (!wantSection || wantSection.length === 0) {
    throw new ApiError(400, "All fields are required");
  }
  
  // Prepare the fields to update
  const updateFields = { wantSection };

  // Conditionally include phoneNumber in the update fields
  if (phoneNumber !== undefined) {
    if(!(phoneRegex.test(phoneNumber))){
      throw new ApiError(400, "Invalid phone number");
    }
    updateFields.phoneNumber = phoneNumber;
  }

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: updateFields,
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

  const getUserSection = asyncHandler(async (req, res) => {
    const { section } = req.params
    if(!section?.trim){
      throw new ApiError(400,"username is missing")
    }

    const user = await User.find({haveSection: section});

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Return the user's sections
  return res.status(200).json(new ApiResponse(200, user, 'User sections retrieved successfully'));
  })
  
  const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const users = await User.find()
      if (!users) {
        throw new ApiError(404, 'No users found');
      }
      return res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
    } catch (error) {
      throw new ApiError(500, 'Server error');
    }
  });

  export {
    registerUser,
    updateAccountDetails,
    getUserSection,
    getAllUsers,
  };