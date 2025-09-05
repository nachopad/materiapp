import { DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

export const getSwaggerConfig = () => {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('API MateriApp')
        .setDescription('MateriApp API Documentation')
        .setVersion('1.0')
        .build();

    const theme = new SwaggerTheme();
    const swaggerSetupOptions = {
        customSiteTitle: 'API MateriApp',
        customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
        explorer: true,
        swaggerOptions: {
            operationsSorter: function (a: any, b: any) {
                const order = {
                    get: '0',
                    post: '1',
                    patch: '2',
                    put: '3',
                    delete: '4',
                    head: '5',
                    options: '6',
                    connect: '7',
                    trace: '8',
                };
                return (
                    order[a.get('method')].localeCompare(order[b.get('method')]) || a.get('path').localeCompare(b.get('path'))
                );
            },
        },
    } as SwaggerCustomOptions;

    return {
        swaggerConfig,
        swaggerSetupOptions,
    };
};