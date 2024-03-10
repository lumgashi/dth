import { Module, Global } from '@nestjs/common';
import { PaginateService } from './paginate.service';

@Global()
@Module({
  controllers: [],
  providers: [PaginateService],
})
export class PaginateModule {}
