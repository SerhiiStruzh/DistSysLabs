import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvoicesService {
    private readonly PROJECT_FEE_PERCENTAGE: number;
    private readonly MANAGER_FEE_PERCENTAGE: number;

    constructor(private readonly prisma: PrismaService) {
        this.PROJECT_FEE_PERCENTAGE = 0.1;
        this.MANAGER_FEE_PERCENTAGE = 0.03;
    }

    async createInvoice(projectId: number) : Promise<InvoiceResponseDto | undefined> {
        try {

            const totalAmountAndCustomerId: number = await this.prisma.$queryRaw`
            SELECT SUM(di."hourRate" * ptm."hoursWorked"), tcht."customerId"
            FROM "ProjectTeamMember" AS ptm
            JOIN "DeveloperInfo" AS di 
            ON di."userId" = ptm."developerId" 
            JOIN "Project" as proj
            ON proj."id" = ptm."projectId" 
            JOIN "TechnicalTask" as tcht
            ON tcht."id" = proj."taskId"
            WHERE ptm."projectId" = ${projectId}
            GROUP BY tcht."id"
            `;

            const invoice = await this.prisma.invoice.create({
                data: {
                    customerId: totalAmountAndCustomerId[0].customerId,
                    projectId: projectId,
                    amount: totalAmountAndCustomerId[0].sum * (1 + this.PROJECT_FEE_PERCENTAGE + this.MANAGER_FEE_PERCENTAGE)
                }
            });

            return { 
                    id: invoice.id,
                    customerId: invoice.customerId,
                    projectId: invoice.projectId,
                    amount: invoice.amount,
                   };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') throw new NotFoundException('Project not found');
                else if (error.code === 'P2002')  throw new BadRequestException('Invoice already exist');
                else throw new InternalServerErrorException('An unexpected error occurred');
            } else {
                throw new InternalServerErrorException('An unexpected error occurred');
            }
        }
    }

    async getInvoiceById(invoiceId: number) : Promise<InvoiceResponseDto> {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id: invoiceId
            }
        });

        if(!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return { 
                id: invoice.id,
                customerId: invoice.customerId,
                projectId: invoice.projectId,
                amount: invoice.amount,
               };
    }

    async getCustomerInvoices(customerId: number) : Promise<InvoiceResponseDto[]> {
        const invoices = await this.prisma.invoice.findMany({
            where: {
                customerId: customerId
            }
        });

        return invoices.map(invoice => ({
            id: invoice.id,
            customerId: invoice.customerId,
            projectId: invoice.projectId,
            amount: invoice.amount,
        }));
    }
}
