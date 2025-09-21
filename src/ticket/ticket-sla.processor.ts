import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";

@Processor('TicketSlaJob')
@Injectable()
export class TicketSla extends WorkerHost {
     private Logger = new Logger('Notification Processor Que')
     async process(job: Job): Promise<void> {
         const jobId = job.id;
         const { id } = job.data;

         if(Math.random() <= 0.5) {
            Logger.error(`Can't SLA `)
            throw new Error(`Mock fail SLA task case Ticket ID: ${id}`);
         }

        this.Logger.log(`SLA check completed for Ticket ID: ${id}`);
        
        this.Logger.log(`Successfully add SLA task to ticket to ${jobId}`)
     }
}