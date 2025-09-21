import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq'; 
import { Injectable, Logger } from "@nestjs/common";
import { Job } from 'bullmq';

@Processor('TicketNotifyJob')
@Injectable()
export class TicketProcessor extends WorkerHost {
    private Logger = new Logger('Notification Processor Que')
    async process(job: Job): Promise<void> {
        const jobId = job.id;
        const {ticketId, title, priority, status, type} = job.data;

        this.Logger.log(`Process notification job ${jobId}`);

        // Mock Fail case logger fail
        if(Math.random() <= 0.5) {
            this.Logger.error(`Can't Notification job ${jobId} with process ${type}`);
            throw new Error(`Mock fail send Notification case`);
        }

        const defaultLogMessage = `[JOBID: ${jobId}] Notification sent successfully ${type} ticket title: ${title} priority: ${priority} and status: ${status}`

        switch (job.name) {
            case 'CREATE':
                this.Logger.log(defaultLogMessage);  

            case 'READ':
                this.Logger.log(`${defaultLogMessage} where ticketId: ${ticketId}`)
            
            case 'UPDATE':
                this.Logger.log(`${defaultLogMessage} where ticketId: ${ticketId}`);

            case 'DELETE':
                this.Logger.log(`${defaultLogMessage} where ticketId: ${ticketId}`)
        }

    }
}