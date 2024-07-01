import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'database/entities/file.entity';
import { Repository } from 'typeorm';
import { UploadFileDto, UploadFileResponseDto } from './dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { awsConfig } from 'src/config/aws-service.config';
import { jwtConfig } from 'src/config/jwt.config';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  private readonly s3Client = new S3Client({
    region: awsConfig.region,
    credentials: {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    },
  });
  async upload(
    id: string,
    data: UploadFileDto,
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    const fileEntity = this.fileRepository.create({
      key: file.originalname,
      agentId: id,
    });
    const newFile = await this.fileRepository.save(fileEntity);

    const fileId = fileEntity.id;
    const pathToSave = `ai-chatbot/${id}/${fileId}`;
    const command = new PutObjectCommand({
      Bucket: awsConfig.bucket,
      Key: pathToSave,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    try {
      await this.s3Client.send(command);
      return new UploadFileResponseDto(newFile);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
