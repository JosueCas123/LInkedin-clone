import connectDB from "@/mongodb/db";
import { Post, PostBase } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export interface AddPostRequest {

    user: IUser;
    text:string;
    imageUrl?:string | null;

}


export async function POST(request:Request) {
    auth().protect();

    try {
        
        const {user, text, imageUrl}:AddPostRequest = await request.json();
        const postData:PostBase = {
            user,
            text,
            ...(imageUrl && {image:imageUrl})
        
        }
        const post = await Post.create(postData);
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json(
            {error:"An error occurred while connecting to the database. Please try again later."},
            {status:500}
        )
    }
}

export async function GET(request:Request) {
    try {
        await connectDB();
        const post = await Post.getAllPosts();
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json(
            {error:"An error occurred while connecting to the database. Please try again later."},
            {status:500}
        )
    }
}