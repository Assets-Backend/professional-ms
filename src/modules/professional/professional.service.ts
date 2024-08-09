import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProfessionalDto, UpdateProfessionalDto } from './dto';
import { Prisma, PrismaClient, professional } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProfessionalService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('ProfessionalService');

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {
        super();
    }  

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async create(params: {
        data: Prisma.professionalCreateInput
    }): Promise<professional> { 

        const { data } = params

        try {
            return await this.professional.create({ data })
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async findOneByUnique(params: {
        professionalWhereUniqueInput: Prisma.professionalWhereUniqueInput,
        select?: Prisma.professionalSelect
    }): Promise<professional> {

        const {professionalWhereUniqueInput: where, select} = params

        try {
            return await this.professional.findUniqueOrThrow({ where, select })
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async update(params: {
        whereUniqueInput: Prisma.professionalWhereUniqueInput,
        data: Prisma.professionalUpdateInput,
    }): Promise<professional> {

        const { whereUniqueInput: where, data } = params
        const { professional_id: user_id } = where

        try {
            await firstValueFrom(
                this.client.send('auth.update.professional', { 
                    updateProfessionalDto: {...data, user_id } 
                })
            );

            return await this.professional.update({ where, data })
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}
