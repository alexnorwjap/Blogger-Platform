import { Container } from 'inversify';
import { AuthRepoImpl } from './features/auth/database/authRepoImpl';
import { DeviceQueryRepository } from './features/device/repository/deviceQueryRepository';
import { AuthService } from './features/auth/service/authService';
import { AuthQueryRepoImpl } from './features/auth/database/authQueryRepoImpl';
import { AuthController } from './features/auth/router/authController';
import { JwtService } from './features/auth/adapter/jwtService';
import { EmailAdapter } from './features/auth/adapter/emailAdapter';
import { BcryptService } from './features/auth/adapter/bcryptService';
import { BlogService } from './features/blog/service/blogService';
import { BlogRepositoryImpl } from './features/blog/db/blogRepositoryImpl';
import { BlogQueryRepositoryImpl } from './features/blog/db/blogQueryRepositoryImpl';
import { BlogController } from './features/blog/router/blogController';
import { PostRepositoryImpl } from './features/post/database/repositories/PostRepositoryImpl';
import { PostQueryRepositoryImpl } from './features/post/database/repositories/PostQueryRepositoryImpl';
import { PostService } from './features/post/service/postService';
import { PostController } from './features/post/router/postController';
import { CommentsRepositoryImpl } from './features/comments/database/commentsRepoImpl';
import { CommentsQueryRepoImpl } from './features/comments/database/commentsQueryRepoImpl';
import { CommentsService } from './features/comments/service/commentsService';
import { CommentsController } from './features/comments/router/commentsController';
import { DeviceRepository } from './features/device/repository/deviceRepository';
import { DeviceService } from './features/device/service/deviceService';
import { DeviceController } from './features/device/router/deviceController';
import { UsersRepoImpl } from './features/users/infrastructure/db/repositories/UsersRepoImpl';
import { UsersQueryRepoImpl } from './features/users/infrastructure/db/repositories/UsersQueryRepoImpl';
import { UsersService } from './features/users/service/userService';
import { UsersController } from './features/users/infrastructure/routes/userController';
import { RequestLogRepositoryImpl } from './features/request-log/database/repository/RequestLogRepositoryImpl';
import { QueryRequestLogRepositoryImpl } from './features/request-log/database/repository/QueryRequestLogRepositoryImpl';
import { RequestLogService } from './features/request-log/service/RequestLogService';
import { LikeRepoImpl } from './features/like/dataabase/likeRepoImpl';
import { LikeService } from './features/like/likeService';
import { CommentsQueryService } from './features/comments/service/commentsQueryService';

const container: Container = new Container();

// Adapters
container.bind(JwtService).toSelf();
container.bind(BcryptService).toSelf();
container.bind(EmailAdapter).toSelf();

// Auth Features
container.bind(AuthRepoImpl).toSelf();
container.bind(AuthQueryRepoImpl).toSelf();
container.bind(AuthService).toSelf();
container.bind(AuthController).toSelf();

// Device Features
container.bind(DeviceRepository).toSelf();
container.bind(DeviceQueryRepository).toSelf();
container.bind(DeviceService).toSelf();
container.bind(DeviceController).toSelf();

// Blog Features
container.bind(BlogRepositoryImpl).toSelf();
container.bind(BlogQueryRepositoryImpl).toSelf();
container.bind(BlogService).toSelf();
container.bind(BlogController).toSelf();

// Post Features
container.bind(PostRepositoryImpl).toSelf();
container.bind(PostQueryRepositoryImpl).toSelf();
container.bind(PostService).toSelf();
container.bind(PostController).toSelf();

// Comments Features
container.bind(CommentsRepositoryImpl).toSelf();
container.bind(CommentsQueryRepoImpl).toSelf();
container.bind(CommentsQueryService).toSelf();
container.bind(CommentsService).toSelf();
container.bind(CommentsController).toSelf();

// Users Features
container.bind(UsersRepoImpl).toSelf();
container.bind(UsersQueryRepoImpl).toSelf();
container.bind(UsersService).toSelf();
container.bind(UsersController).toSelf();

// Request Log Features
container.bind(RequestLogRepositoryImpl).toSelf();
container.bind(QueryRequestLogRepositoryImpl).toSelf();
container.bind(RequestLogService).toSelf();

// Like Features
container.bind(LikeRepoImpl).toSelf();
container.bind(LikeService).toSelf();

export default container;
