import {NotificationType} from './NotificationType';
import {RolesEnum} from "./Static";

export class NotificationDataModel {
    showFor: RolesEnum;
    clientId: number;
    driverId: number;
    type: NotificationType;
    tripId: number;
}
