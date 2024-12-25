import { use, useEffect, useState } from "react";
import { Left } from "./left-side";
import { Right } from "./right-side";
import { IBillProduct, IProduct } from "@/types/backend.d";
import axios from "axios";

export default function BillScreen() {

    const [productOnBill, setProductOnBill] = useState<IProduct[]>([]);
    const initialQuantities = Array<number>(productOnBill.length).fill(1);
    const [quantities, setQuantities] = useState(initialQuantities);
    const [bills, setBills] = useState<number[]>([-1]); // -1 means a virtual bill is using to calculate the total
    const [currentBill, setCurrentBill] = useState<number>(0);


    useEffect(() => {
        console.log(bills);
        console.log(currentBill);
        //goi api lay ra du lieu cua bill hien tai
        if (!!bills[currentBill] && bills[currentBill] !== -1) { // se bi undefined neu minh xoa billtab di va bills da cap nha nhung currentBill thi chua(do setState la bat dong bo)
            axios.get(`${process.env.API_URL}/v1/bill/${bills[currentBill]}/get-products`)
                .then(res => {
                    console.log(res.data);
                    const products: IBillProduct[] = res.data.products;
                    const tempProductOnBill: IProduct[] = [];
                    const tempQuantities: number[] = [];
                    const fetchProductPromises = products.map((billProduct: IBillProduct) => {
                        return axios.get(`${process.env.API_URL}/v1/product/${billProduct.product_id}`)
                            .then(res => {
                                tempProductOnBill.push(res.data);
                                tempQuantities.push(billProduct.quantity);
                            })
                            .catch(error => {
                                console.error(`Error fetching product ${billProduct.product_id}:`, error);
                            });
                    });
                    Promise.all(fetchProductPromises)
                        .then(() => {
                            setProductOnBill(tempProductOnBill);
                            setQuantities(tempQuantities);
                        })
                        .catch(error => {
                            console.error('Error fetching products:', error);
                        });
                })
                .catch(error => {
                    console.error(`Error fetching bill ${bills[currentBill]} products:`, error);
                });
        } else {
            setProductOnBill([]);
        }
    }, [currentBill, bills]);


    return (
        <div className="h-[96vh] ">
            <Left data={{ productOnBill, setProductOnBill, quantities, setQuantities, bills, setBills, currentBill, setCurrentBill }} />
            <Right data={{ productOnBill, setProductOnBill, quantities, setQuantities, bills, setBills, currentBill, setCurrentBill }} />
        </div>
    )
}