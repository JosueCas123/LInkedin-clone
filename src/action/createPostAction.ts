"use server"

import { AddPostRequest } from "@/app/api/post/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { create } from 'domain';


 const createPostAction = async (formData:FormData) => {
    const user = await currentUser();

    if (!user) {
        throw new Error('User not found');
    }

    const postInput = formData.get('postInput') as string;
    const image = formData.get('image') as File;
    let imageUrl : string | undefined;
    
    // define user
    const userDB:IUser = {

        userId: user.id,
        userImage:user.imageUrl,
        firstName:user.firstName || '',
        lastName:user.lastName || '',
    }

    try {
        if (image.size > 0) {
         
    
          
        } else {
          const body:AddPostRequest = {
            user: userDB,
            text: postInput,
            };
            
        await Post.create(body);
        }
      } catch (error: any) {
        throw new Error("Failed to create post", error);
      }
    
}





export default createPostAction;