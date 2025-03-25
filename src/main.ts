import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerService } from "src/common/swagger/swagger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerService = app.get(SwaggerService);
  swaggerService.setup(app);
  await app.listen(4000);
}
bootstrap();
