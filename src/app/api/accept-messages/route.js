import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import {dbConnect} from "@/lib/dbConnect";
import UserModel from "@/model/User";
export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        // Update the user's message acceptance status
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            // User not found
            return Response.json(
                {
                    success: false,
                    message: "Unable to find user to update message acceptance status",
                },
                { status: 404 }
            );
        }

        // Return the updated user
        return Response.json({updatedUser,
            success: true,
            message: "Message acceptance status updated successfully"}, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return Response.json(
            { success: false, message: "Error updating user" },
            { status: 500 }
        );
    }
}

