import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class ResponseDto<TData> {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty()
  data: TData;
}

interface ClassConstructor<T = any> {
  new (...args: any[]): T;
}

export const AiAssistantApiResponse = (
  model: ClassConstructor,
  array = false,
) => {
  if (model) {
    const data = array
      ? {
          type: 'array',
          items: {
            $ref: getSchemaPath(model),
          },
        }
      : { $ref: getSchemaPath(model) };

    return applyDecorators(
      ApiExtraModels(model),
      ApiExtraModels(ResponseDto),
      // ApiCreatedResponse({
      //   schema: {
      //     allOf: [
      //       { $ref: getSchemaPath(ResponseDto) },
      //       {
      //         properties: {
      //           status: {
      //             type: 'number',
      //             example: 201,
      //           },
      //           message: {
      //             type: 'string',
      //             example: 'success',
      //           },
      //           data,
      //         },
      //       },
      //     ],
      //   },
      // }),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ResponseDto) },
            {
              properties: {
                status: {
                  type: 'number',
                  example: 200,
                },
                message: {
                  type: 'string',
                  example: 'success',
                },
                data,
              },
            },
          ],
        },
      }),
    );
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              status: {
                type: 'number',
                example: 200,
              },
              message: {
                type: 'string',
                example: 'success',
              },
            },
          },
        ],
      },
    }),
  );
};
