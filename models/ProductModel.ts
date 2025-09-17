import {MediaModel} from "./MediaModel";

export class ProductModel {
    id?: number;
    createdAt?: string;
    description?: string;
    isArchived?: true;
    medias?: MediaModel[];
    name?: string;
    price?: number;
    thumbnail?: MediaModel;
    updatedAt?: string;
}

export interface IProductModel {
    id?: number;
    createdAt?: string;
    description?: string;
    isArchived?: true;
    medias?: MediaModel[];
    name?: string;
    price?: number;
    thumbnail?: MediaModel;
    updatedAt?: string;
}
