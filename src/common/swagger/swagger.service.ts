import { Injectable } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

@Injectable()
export class SwaggerService {
  public setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle("Patient Excel Loader API")
      .setDescription("API documentation for Patient Excel Loader")
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);
  }
}
