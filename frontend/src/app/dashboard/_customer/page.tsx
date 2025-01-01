import { IBill, IBillProduct, IUser } from "@/types/backend.d";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface IProp {
    data: {
        user: IUser | null | undefined;
        setUser: React.Dispatch<React.SetStateAction<IUser | null | undefined>>;
    };
}

export default function CustomerPage(props: IProp) {
    const [bills, setBills] = useState<IBill[]>([]);
    const [billData, setBillData] = useState<any[]>([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const res = await axios.get(
                    `${process.env.API_URL}/v1/bill/${props.data.user?.id}/get-bills`
                );
                setBills(res.data);
                const billPromises = res.data.map(async (bill: IBill) => {
                    const [productsRes, totalPriceRes] = await Promise.all([
                        axios.get(`${process.env.API_URL}/v1/bill/${bill.id}/get-products`),
                        axios.get(`${process.env.API_URL}/v1/bill/${bill.id}/total-price`)
                    ]);
                    const detailedProducts = await Promise.all(
                        productsRes.data.products.map(async (product: IBillProduct) => {
                            const res = await axios.get(`${process.env.API_URL}/v1/product/${product.product_id}`);
                            return { ...product, name: res.data.name, price: res.data.price };
                        })
                    );
                    return {
                        id: bill.id,
                        date: bill.date,
                        notes: bill.notes,
                        status: bill.status,
                        total: totalPriceRes.data,
                        products: detailedProducts
                    };
                });
                const billData = await Promise.all(billPromises);
                setBillData(billData);
            } catch (error) {
                console.error(error);
            }
        };

        if (props.data.user) {
            fetchBills();
        }
    }, [props.data.user]);

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Customer Bills</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {billData.length > 0 && billData.map((bill) => (
                    <Card key={bill.id} className="bg-white shadow-md rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">{new Date(bill.date).toLocaleString('vi-VN')}</CardTitle>
                            <CardDescription className="text-gray-500">{bill.status === 'SETTLED' ? 'Đã thanh toán' : 'Chưa thanh toán'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2">{bill.notes}</p>
                            <p className="font-bold text-lg mb-4 text-green-700">
                                Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bill.total)}
                            </p>
                            <div>
                                {bill.products.map((product: any) => (
                                    <div key={product.id} className="border-t border-gray-200 py-2">
                                        {/* <p>ID sản phẩm: {product.product_id}</p> */}
                                        <p>Tên sản phẩm: {product.name}</p>
                                        <p>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                        <p>Số lượng: {product.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
