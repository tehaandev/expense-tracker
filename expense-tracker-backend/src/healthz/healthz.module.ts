import { Module } from '@nestjs/common';
import { HealthzService } from './healthz.service';
import { HealthzController } from './healthz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [HealthzController],
  providers: [HealthzService],
})
export class HealthzModule {}
