import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './admin/users/users.module';
import { PostsModule } from './admin/posts/posts.module';
import { AdminsModule } from './admin/admins/admins.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: `mongodb://localhost:27017`,
                dbName: 'chat-app',
            }),
        }),
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
        AuthModule,
        UsersModule,
        PostsModule,
        AdminsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
