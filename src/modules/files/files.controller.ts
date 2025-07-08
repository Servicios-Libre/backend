import {
  Controller,
  Delete,
  FileTypeValidator,
  Headers,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('📷 Imágenes')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Post('/service/:id')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadWorkPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.filesService.uploadWorkPhoto(files, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Delete('/service/:id')
  deleteWorkPhotos(
    @Param('id', ParseUUIDPipe) service_id: string,
    @Query('workPhoto_id', ParseUUIDPipe) workPhoto_id: string,
  ) {
    return this.filesService.deleteWorkPhoto(service_id, workPhoto_id);
  }

  @Post('user')
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserImage(
    @Headers('authorization') token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadUserPic(file, token);
  }
}
