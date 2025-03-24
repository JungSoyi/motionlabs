import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MotionlabsTypeOrmModule } from 'src/common/database/typeorm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MotionlabsTypeOrmModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
