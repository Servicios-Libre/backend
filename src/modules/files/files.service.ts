import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkPhoto } from '../workerServices/entities/workPhoto.entity';
import { Repository } from 'typeorm';
import { Service } from '../workerServices/entities/service.entity';
import { User } from '../users/entities/users.entity';
import { ExtractPayload } from 'src/helpers/extractPayload.token';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(WorkPhoto)
    private readonly workPhotoRepository: Repository<WorkPhoto>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async uploadCloudinary(file: Express.Multer.File) {
    const uploadPromise: Promise<UploadApiResponse> = new Promise(
      (resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              reject(error);
            } else {
              resolve(result as UploadApiResponse);
            }
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        toStream(file.buffer).pipe(upload);
      },
    );

    const cloudinaryResponse = await Promise.resolve(uploadPromise);
    return cloudinaryResponse.url;
  }

  async uploadWorkPhoto(files: Express.Multer.File[], service_id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: service_id },
      relations: ['work_photos'],
    });
    if (!service) {
      throw new Error('Service not found');
    }

    const urls = await Promise.all(
      files.map((file) => this.uploadCloudinary(file)),
    );

    const photoEntities = urls.map((url) =>
      this.workPhotoRepository.create({ photo_url: url }),
    );

    await this.workPhotoRepository.save(photoEntities);
    service.work_photos.push(...photoEntities);
    await this.serviceRepository.save(service);

    return { message: 'Images uploaded successfully' };
  }

  async uploadUserPic(file: Express.Multer.File, token: string) {
    const payload = ExtractPayload(token);
    const userFound = await this.userRepository.findOneBy({ id: payload.id });
    if (!userFound) {
      throw new Error('User not found');
    }
    const url = await this.uploadCloudinary(file);
    if (!url) {
      throw new Error('Image upload failed');
    }
    userFound.user_pic = url;
    await this.userRepository.save(userFound);
    return { message: 'Image uploaded successfully' };
  }

  async deleteWorkPhoto(service_id: string, workPhoto_id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id: service_id },
      relations: ['work_photos'],
    });
    if (!service) {
      throw new Error('Service not found');
    }

    const photosNumber = service.work_photos.length;
    service.work_photos = service.work_photos.filter((work_photo) => {
      return work_photo.id !== workPhoto_id;
    });

    if (service.work_photos.length === photosNumber)
      throw new NotFoundException('Work Photo not found');
    await this.serviceRepository.save(service);
    return { message: 'Image deleted successfully' };
  }
}
