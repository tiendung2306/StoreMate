import { IBillProduct } from "@/types/backend.d";

export default interface IBillTab {
    id: number;
    isModify: boolean;
    billProducts: IBillProduct[];
}