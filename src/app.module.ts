import { Module } from '@nestjs/common';
import { 
    ProfessionalModule 
} from './modules';

@Module({
    imports: [ProfessionalModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
