import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto, UpdateProfessionalDto } from './dto';
import { professional } from '@prisma/client';

@Controller()
export class ProfessionalController {

    constructor(private readonly professionalService: ProfessionalService) {}

    @MessagePattern('professional.create.professional')
    create(
        @Payload('createProfessionalDto') createProfessionalDto: CreateProfessionalDto,
    ): Promise<professional> {
        return this.professionalService.create({ data: createProfessionalDto })
    }

    @MessagePattern('professional.find.user')
	findOne(
        @Payload() professional_id: professional['professional_id'],
	): Promise<professional> {
		return this.professionalService.findOneByUnique({
            professionalWhereUniqueInput: { professional_id }
        });
	}

    @MessagePattern('professional.update.professional')
	update(
	    @Payload('professional_id') professional_id: professional['professional_id'],
	    @Payload('updateProfessionalDto') updateProfessionalDto: UpdateProfessionalDto
	): Promise<professional> {

        return this.professionalService.update({
            whereUniqueInput: { professional_id },
            data: updateProfessionalDto
        })
	}
}
