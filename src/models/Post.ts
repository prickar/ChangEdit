import { Document, Model, Schema, Types, model } from "mongoose";

interface IComment extends Document {
    body: string;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

interface IPost extends Document {
    title: string;
    link?: string;
    body?: string;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    comments: IComment[];
    upVotes: Types.Array<Types.ObjectId>;
    downVotes: Types.Array<Types.ObjectId>;
    score: number; 
}

interface IPostProps {
    comments: Types.DocumentArray<IComment>;
    upVote: (userId: string) => void; 
    downVote: (userId: string) => void; 
}

type IPostModel = Model<IPost, {}, IPostProps>;

const PostSchema = new Schema<IPost, IPostModel> ({
    title: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    body: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [CommentSchema],
    upVotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    downVotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    score: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

PostSchema.method('upVote', async function( this: IPost, userId: string) {
    const userIdObject = new Types.ObjectId(userId);
    if (this.upVotes.includes(userIdObject)) {
        return; 
    } else if (this.downVotes.includes(userIdObject)) {
        this.downVotes.pull(userIdObject);
    }

    this.upVotes.push(userIdObject); 
})

PostSchema.method('downVote', async function( this: IPost, userId: string) {
    const userIdObject = new Types.ObjectId(userId);

    if (this.downVotes.includes(userIdObject)) {
        return; 
    } else if (this.upVotes.includes(userIdObject)) {
        this.upVotes.pull(userId);
    }

    this.downVotes.push(userId); 
})

PostSchema.pre<IPost>('save', function(next) {
    if (this.isModified('upVotes') || this.isModified('downVotes')) {
        this.score = this.upVotes.length - this.downVotes.length; 
    }

    next(); 

})

const Post = model<IPost, IPostModel>('Post', PostSchema);

export default Post;