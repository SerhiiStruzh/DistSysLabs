import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) {}

    @Post()
    async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) : Promise<InvoiceResponseDto | undefined> {
        return await this.invoicesService.createInvoice(createInvoiceDto.projectId);
    }

    @Get(':invoiceId')
    async getInvoiceById(@Param('invoiceId', ParseIntPipe) invoiceId: number) : Promise<InvoiceResponseDto> {
        return await this.invoicesService.getInvoiceById(invoiceId);
    }

    @Get('/customers/:customerId')
    async getCustomerInvoices(@Param('customerId', ParseIntPipe) customerId: number) : Promise<InvoiceResponseDto[]> {
        return await this.invoicesService.getCustomerInvoices(customerId);
    }
}
