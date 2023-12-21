import { Request, Response } from "express";
import { assertDefined } from "../util/assertDefined";
import Post from "../models/Post";



export const upVote = async (req: Request, res: Response) => {
    const { postId } = req.params; 
    const { userId } = req;
    assertDefined(userId);

    const post = await Post.findById(postId)

    if(!post){
        return res.status(404).json({
            message: 'Post not found with ID: ' + postId
        })
    }

    post.upVote(userId)

    const upVotedPost = await post.save();

    return res.status(200).json(upVotedPost);
}

export const downVote = async (req: Request, res: Response) => {
    const { postId } = req.params; 
    const { userId } = req;
    assertDefined(userId);

    const post = await Post.findById(postId)

    if(!post){
        return res.status(404).json({
            message: 'Post not found with ID: ' + postId
        })
    }

    post.upVote(userId)

    const downVotedPost = await post.save();

    return res.status(200).json(downVotedPost);
}