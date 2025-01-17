import { use, useEffect, useState } from "react";
import { Left } from "./left-side";
import { Right } from "./right-side";
import { IBillProduct, IProduct, IUser } from "@/types/backend.d";
import axios from "axios";
import IBillTab from "./interfaces/bill";

interface IProps {
    data: {
        user: IUser | null;
        setUser: React.Dispatch<React.SetStateAction<IUser | null | undefined>>;
    }
}

export default function BillScreen(props: IProps) {

    const defaultBillTab: IBillTab = { id: -1, isModify: false };
    const [productOnBill, setProductOnBill] = useState<IProduct[]>([]);
    const initialQuantities = Array<number>(productOnBill.length).fill(1);
    const [quantities, setQuantities] = useState(initialQuantities);
    const [bills, setBills] = useState<IBillTab[]>([defaultBillTab]); // -1 means a virtual bill is using to calculate the total
    const [currentBill, setCurrentBill] = useState<number>(0);


    useEffect(() => {
        console.log(bills);
        console.log(currentBill);

        // Gọi API lấy dữ liệu của bill hiện tại
        if (!!bills[currentBill] && bills[currentBill].id !== -1) {
            axios
                .get(`${process.env.API_URL}/v1/bill/${bills[currentBill].id}/get-products`)
                .then((res) => {
                    console.log(res.data);
                    const products: IBillProduct[] = res.data.products;
                    const tempProductOnBill: IProduct[] = [];
                    const tempQuantities: number[] = [];
                    const fetchProductPromises = products.map((billProduct: IBillProduct) => {
                        return axios
                            .get(`${process.env.API_URL}/v1/product/${billProduct.product_id}`)
                            .then((res) => {
                                tempProductOnBill.push(res.data);
                                tempQuantities.push(billProduct.quantity);
                            })
                            .catch((error) => {
                                console.error(`Error fetching product ${billProduct.product_id}:`, error);
                            });
                    });
                    Promise.all(fetchProductPromises)
                        .then(() => {
                            setProductOnBill(tempProductOnBill);
                            setQuantities(tempQuantities);
                        })
                        .catch((error) => {
                            console.error("Error fetching products:", error);
                        });
                })
                .catch((error) => {
                    console.error(`Error fetching bill ${bills[currentBill].id} products:`, error);
                });
        } else {
            // Khi mở bill mới hoặc mở sang bill có id -1 (virtual bill)
            setProductOnBill([]);
        }
    }, [currentBill, bills.map(bill => bill.id).join(",")]); // Chỉ theo dõi danh sách id



    return (
        <div className="h-[96vh] ">
            <Left data={{ productOnBill, setProductOnBill, quantities, setQuantities, bills, setBills, currentBill, setCurrentBill }} />
            <Right data={{ productOnBill, setProductOnBill, quantities, setQuantities, bills, setBills, currentBill, setCurrentBill, user: props.data.user, setUser: props.data.setUser }} />
        </div>
    )
}