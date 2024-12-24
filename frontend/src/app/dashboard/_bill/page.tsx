import { useState } from "react";
import { Left } from "./left-side";
import { Right } from "./right-side";
import { IProduct } from "@/types/backend.d";


export default function BillScreen() {

    const [productOnBill, setProductOnBill] = useState<IProduct[]>([]);
    const initialQuantities = Array<number>(productOnBill.length).fill(1);
    const [quantities, setQuantities] = useState(initialQuantities);

    return (
        <div className="h-[96vh]">
            <Left data={{ productOnBill, setProductOnBill, quantities, setQuantities }} />
            <Right data={{ productOnBill, setProductOnBill, quantities, setQuantities }} />
        </div>
    )
}