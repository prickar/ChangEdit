import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as authController from './controllers/auth';
import * as postsController from './controllers/posts';
import * as commentsController from './controllers/comments';
import validateToken from "./middleware/validateToken";
import * as votesController from './controllers/votes'

const app = express()

app.use(cors());
app.use(express.json());

app.post('/register', authController.register);
app.post('/login', authController.logIn);
app.post('/token/refresh', authController.refreshJWT);
app.get('/profile', validateToken, authController.profile);

app.post('/posts', validateToken, postsController.create);
app.get('/posts', postsController.getAllPosts);
app.get('/posts/:id', postsController.getPost);
app.put("/posts/:id", validateToken, postsController.updatePost);
app.post('/posts/:postId/upVote', validateToken, votesController.upVote);
app.post('/posts/:postId/downVote', validateToken, votesController.downVote);
app.delete('/posts/:postId', validateToken, postsController.deletePost);

app.post('/posts/:postId/comments', validateToken, commentsController.createComment);
app.delete('/posts/:postId/comments/:commentId', validateToken, commentsController.deleteComment);

const mongoURL = process.env.DB_URL;

if (!mongoURL) throw Error('Missing db url');

mongoose.connect(mongoURL)
    .then(() => {
        const port = parseInt(process.env.PORT || '3000');
        app.listen(port, () => {
            console.log('Server listening on port ' + port);
        })
    })