import {dbConnect} from "../../../lib/dbConnect";
import UserModel from "../../../model/User.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    const userId = session.user._id;

    try {
        const deletedMessage = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { messages: { _id: params.messageid } } },
            { new: true }
        );

        if(!deletedMessage) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
