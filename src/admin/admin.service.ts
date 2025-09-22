import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class AdminService {
    private Logger = new Logger('ADMIN SERVICES');

    constructor(@InjectQueue('TicketNotifyJob') private readonly ticketNotifyQue: Queue, @InjectQueue('TicketSlaJob') private readonly ticketSlaQue: Queue, ) {}

    async getTicketNotifyMetrics() {
        this.Logger.log('Get Metrics from ticket notify que');
        return await this.ticketNotifyQue.getJobCounts(
            'wait',
            'active',
            'completed',
            'failed',
            'delayed',
            'paused'
        );
    }

    async getTicketSlaMetrics() {
        this.Logger.log('Get Metrics from ticket sla que');
        return await this.ticketSlaQue.getJobCounts(
            'wait',
            'active',
            'completed',
            'failed',
            'delayed',
            'paused'
        )
    }
}