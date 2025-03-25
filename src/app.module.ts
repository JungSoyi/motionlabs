import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MotionlabsTypeOrmModule } from 'src/common/database/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from 'src/common/swagger/swagger.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    MotionlabsTypeOrmModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SwaggerModule,
    PatientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
