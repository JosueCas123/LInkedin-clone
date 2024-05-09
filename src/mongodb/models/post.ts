import { IUser } from '@/types/user';
import mongoose, {Schema, Document, models, Model} from 'mongoose'
import { IComment, Comment, ICommentBase } from './comments';
import { comment } from 'postcss';

export interface PostBase {
    user: IUser;
    text: string;
    image?: string;
    comments?:IComment[];
    likes?:string[];

}

export interface IPost extends PostBase, Document {
    createdAt: Date;
    updatedAt: Date;
}



 interface IPostMethods {
    likePost(userId:string):void;
    unlikePost(userId:string):void;
    commentOnPost(comment:ICommentBase):void;
    getAllComments():IComment[];
    removePost():void;
 }



 interface IPostStatics {
    getAllPosts():IPostDocument[];
}

export interface IPostDocument extends IPost, IPostMethods, Document {}
interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const PostSchema = new Schema<IPostDocument>({
    user:{
        userId:{type:String, required:true},
        firstName:{type:String, required:true},
        userImage:{type:String, required:true},
        lastName:{type:String},
    },
    text:{type:String, required:true},
    image:{type:String},
    comments:{type:[Schema.Types.ObjectId], ref:'Comment', default:[]},
    likes:{type:[String]}
},
{
    timestamps:true
}

);

PostSchema.methods.likePost = async function(userId:string){
    try {
        await this.updateOne({$addToSet:{likes:userId}});
    } catch (error) {
        console.log(error);
    }
}

PostSchema.methods.unlikePost = async function(userId:string){
    try {
        await this.updateOne({$pull:{likes:userId}});
    } catch (error) {
        console.log(error);
    }
}

PostSchema.methods.removePost = async function(){
    try {
        
        await this.model('Post').delateOne({_id:this._id})
    } catch (error) {
        console.log(error);
    }
}

PostSchema.methods.commentOnPost = async function(comment:ICommentBase){
    try {
        const newComment = await Comment.create(comment);
        await this.updateOne({$addToSet:{comments:newComment._id}})
    } catch (error) {
        console.log(error);
    }
}

PostSchema.methods.getAllComments = async function(){
    try {
        await this.populate('comments').execPopulate(
            {
                path:'comments',
                options:{sort:{createdAt:-1}}
            }
        );
        return this.comments;
    } catch (error) {
        console.log(error);
    }
}

PostSchema.statics.getAllPosts = async function(){
    try {
        const post = await this.find()
            .sort({createdAt:-1})
            .populate({
                path:'comments',
                options:{sort:{createdAt:-1}}
            })
            .lean(); 

            return post.map((post:IPostDocument)=> ({
                ...post,
                _id: post._id.toString(),
                comments:post.comments?.map((comment:any)=>({
                    ...comment,
                    _id:comment._id.toString()
                }))
            }))
    } catch (error) {
        console.log(error);
    }
}

export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);