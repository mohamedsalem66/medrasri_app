import {zoneTypeEnum} from "./Static";

export class AddressModel {
      id?: string;
      name?: string;
      formattedAddress?: string;
      latitude: number;
      longitude: number;
      isDefault?: boolean;
      tel?: string;
      zoneType?: zoneTypeEnum;
      customLocality?: string;
      isTmp?: boolean;
      description?:string;
      title?: string;
      route?: string;
      buildingNumber?: number;
      buildingName?: string;
      ranchNumber?: number;
      ranchName?: string;
      farmNumber?: number;
      farmName?: string;
}
