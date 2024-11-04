import {dbConnect}  from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
export async function POST(request) {

    await dbConnect();

    const { username, content } = await request.json();

     console.log(username, content);
    try{

        const user = await UserModel.findOne({ username }).exec();// Check if the user exists

        if (!user) {
            
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessages) {

            return Response.json(
                { message: 'User is not accepting messages', success: false },
                { status: 403 } // 403 Forbidden status
            );

        }

        const newMessage = { content, createdAt: new Date() };

        // Push the new message to the user's messages array
        user.messages.push(newMessage);

        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 200 }
        );

    }catch(error){

        return Response.json(
            { message: 'Error sending 33 message', success: false },
            { status: 500 }
        );

        }
    }

    