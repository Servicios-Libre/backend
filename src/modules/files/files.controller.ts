import {
  Controller,
  FileTypeValidator,
  Headers,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Put('/service/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadWorkPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        )
        .addValidator(
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/ }),
        )
        .build({ fileIsRequired: true }),
    )
    files: Express.Multer.File[],
  ) {
    return this.filesService.uploadWorkPhoto(files, id);
  }

  @Post('user')
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserImage(
    @Headers('authorization') token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
            message: 'El archivo debe ser menor a 2MB',
          }),
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadUserPic(file, token);
  }
}
