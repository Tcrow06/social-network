import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), AuthModule, UsersModule],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [PostsService],
})
export class PostsModule { }
