import {dbConnect} from "../../../lib/dbConnect";
import UserModel from "../../../model/User.js";

export async function POST(request) {
  await dbConnect();

  try{
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    console.log(decodedUsername, code);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();
        
      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: 'Code expired' },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: 'Invalid code' },
        { status: 400 }
      );
    }
  }
  catch (error) {
    console.error('Error during sign-up:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }

}