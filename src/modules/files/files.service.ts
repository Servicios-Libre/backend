import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkPhoto } from '../workerServices/entities/workPhoto.entity';
import { Repository } from 'typeorm';
import { Service } from '../workerServices/entities/service.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(WorkPhoto)
    private readonly workPhotoRepository: Repository<WorkPhoto>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}
  async uploadServiceImage(file: Express.Multer.File, service_id: string) {
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

    const newWorkPhoto = this.workPhotoRepository.create({
      photo_url: cloudinaryResponse.url,
    });
    await this.workPhotoRepository.save(newWorkPhoto);
    const service = await this.serviceRepository.findOne({
      where: { id: service_id },
      relations: ['work_photos'],
    });
    service?.work_photos.push(newWorkPhoto);
    await this.serviceRepository.save(service!);

    return { message: 'Image uploaded successfully' };
  }
}
