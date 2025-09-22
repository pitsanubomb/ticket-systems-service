import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controllet";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'TicketNotifyJob',
        }),
        BullModule.registerQueue({
            name: 'TicketSlaJob',
        }),
    ],
    controllers:[AdminController],
    providers:[AdminService]
})

export class AdminModule {}