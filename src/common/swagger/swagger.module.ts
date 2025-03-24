import { Module } from '@nestjs/common';
import { SwaggerService } from 'src/common/swagger/swagger.service';

@Module({
  providers: [SwaggerService],
})
export class SwaggerModule {}
