import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}

    @Get('/queues/:name/stats')
    async getMetricsWithQueName(@Param('name') name:string) {
        if(name === 'notification') {
            return await this.adminService.getTicketNotifyMetrics()
        } else if (name === 'sla') {
            return await this.adminService.getTicketSlaMetrics()
        } else {
            throw new BadRequestException(`Ques name is wrong`)
        } 
    }
}