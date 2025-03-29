import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerService } from "src/common/swagger/swagger.service";
import { json, urlencoded } from "express";
import { HttpExceptionFilter } from "src/common/filter/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  const swaggerService = app.get(SwaggerService);
  swaggerService.setup(app);
  app.use(json());
  app.use(urlencoded());
  await app.listen(4000);
}
bootstrap();
