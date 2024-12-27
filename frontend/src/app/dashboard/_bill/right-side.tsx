import { Input } from "@/components/ui/input";
import { convertToISO } from "@/lib/utils";
import { IProduct, IUser } from "@/types/backend.d";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { SearchBill } from "./search-bill";
import { useToast } from "@/hooks/use-toast";

interface IProp {
    data: {
        productOnBill: IProduct[];
        setProductOnBill: React.Dispatch<React.SetStateAction<IProduct[]>>;
        quantities: number[];
        setQuantities: React.Dispatch<React.SetStateAction<number[]>>;
        bills: number[];
        setBills: React.Dispatch<React.SetStateAction<number[]>>;
        currentBill: number;
        setCurrentBill: React.Dispatch<React.SetStateAction<number>>;
    }
}

export function Right(prop: IProp) {

    const getCurrentDate = () => {
        var d = new Date(),
            minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes(),
            hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours(),
            ampm = d.getHours() >= 12 ? 'pm' : 'am',
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' ' + hours + ':' + minutes + ampm;

    }

    const [date, setDate] = React.useState(getCurrentDate);


    const { toast } = useToast()

    useEffect(() => {
        const date = getCurrentDate();
        setDate(date);
    }, [])

    useEffect(() => {
        let total = 0;
        for (let i = 0; i < prop.data.productOnBill.length; i++) {
            total += prop.data.productOnBill[i].price * prop.data.quantities[i];
        }
        setTotal(total);
    }, [prop.data.productOnBill, prop.data.quantities])

    const [total, setTotal] = React.useState(100000);
    const [finalTotal, setFinalTotal] = React.useState(0);
    const [isChange, setIsChange] = React.useState(false);
    const discountRef = useRef<HTMLInputElement>(null)
    const taxRef = useRef<HTMLInputElement>(null)
    const customerRef = useRef<HTMLInputElement>(null)
    const changeRef = useRef<HTMLSpanElement>(null)
    const noteRef = useRef<HTMLInputElement>(null)
    const customerPhoneRef = useRef<HTMLInputElement>(null)

    /**
     * Check if the phone number is a valid Vietnamese phone number
     * @param number phone number 
     * @returns true if the phone number is a valid Vietnamese phone number, else false
     */
    function isVietnamesePhoneNumber(number: string) {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
    }

    useEffect(() => {
        const discount = parseFloat(discountRef.current?.value || '0');
        const tax = parseFloat(taxRef.current?.value || '0');
        // console.log(discount, tax);
        const finalTotal = total / 100 * (100 - discount) + tax;
        setFinalTotal(finalTotal);
        if (changeRef.current) {
            const change = (parseFloat(customerRef.current?.value || '0') - finalTotal)
            changeRef.current.innerText = change.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            if (change < 0) {
                changeRef.current.style.color = 'red';
            }
            else {
                changeRef.current.style.color = 'green';
            }
        }
    }, [total, isChange])

    const addBill = async (status: string) => {
        const customerPhone = customerPhoneRef.current?.value;
        let customer: IUser | null = null;
        if (!!customerPhone && isVietnamesePhoneNumber(customerPhone)) {
            try {
                const response = await axios.post(`${process.env.API_URL}/v1/users/add-customer`, {
                    phone: customerPhone,
                });
                customer = response.data;
            } catch (error) {
                console.error("Error adding customer:", error);
                return;
            }
        }

        // console.log(customer);

        const ISODate = new Date(convertToISO(date.substring(4))).toISOString();
        const notes = noteRef.current?.value || "";
        const products = prop.data.productOnBill.map((product, index) => {
            return {
                product_id: product.id,
                quantity: prop.data.quantities[index]
            }
        });

        if (prop.data.bills[prop.data.currentBill] === -1) { //day la hoa don ao, can tao hoa don moi
            axios.post(`${process.env.API_URL}/v1/bill/add-bill`, {
                admin_id: 2,
                customer_id: !!customer ? customer.id : 1,
                date: ISODate,
                notes: notes,
                status: status,
                products: products
            })
                .then(res => {
                    prop.data.setBills((prevBills: number[]) => {
                        const newBills = [...prevBills];
                        newBills[prop.data.currentBill] = res.data.bill.id;
                        return newBills;
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        }
        else {
            axios.put(`${process.env.API_URL}/v1/bill/update-bill`, {
                id: prop.data.bills[prop.data.currentBill],
                admin_id: 2,
                customer_id: !!customer ? customer.id : 1,
                date: ISODate,
                notes: notes,
                status: status,
                products: products
            })
                .then(res => {

                })
                .catch(err => {
                    console.error(err);
                });
        }


    }

    const saveBill = () => {
        addBill('PENDING');
        toast({
            description: "Lưu hóa đơn thành công.",
        })
    }

    const settled = () => {
        addBill('SETTLED');
        toast({
            description: "Thanh toán hóa đơn thành công.",
        })
    }

    const { productOnBill, setProductOnBill, quantities, setQuantities, bills, setBills, currentBill, setCurrentBill } = prop.data;

    return (
        <div className="absolute right-0 top-0 bottom-0 p-6 bg-white rounded-lg shadow-lg" style={{ width: 'calc(100vw * 2 / 7 - 1%)', boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset' }}>
            <div className="text-xl font-bold">Hóa đơn</div>
            <SearchBill data={{ productOnBill, setProductOnBill, quantities, setQuantities, bills, setBills, currentBill, setCurrentBill }}></SearchBill>
            <div className="flex justify-end my-3 text-gray-600 hover:underline cursor-pointer">{date}</div>
            <Input placeholder="Tìm khách hàng" className="mb-4 p-2 border rounded-lg w-full" ref={customerPhoneRef} />
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Giảm giá(%):</span>
                    <Input ref={discountRef} className="inline-block w-28 p-2 border rounded-lg" placeholder="0" onChange={() => setIsChange(!isChange)} />
                </div>
                <div className="flex items-center justify-between">
                    <span>Phí(đ):</span>
                    <Input ref={taxRef} className="inline-block w-28 p-2 border rounded-lg" placeholder="0" onChange={() => setIsChange(!isChange)} />
                </div>
                <div className="flex justify-between font-bold">
                    <span>Tổng tiền thanh toán:</span>
                    <span>{finalTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Khách thanh toán(đ):</span>
                    <Input ref={customerRef} className="inline-block w-28 p-2 border rounded-lg" placeholder="0" onChange={() => setIsChange(!isChange)} />
                </div>
                <div className="flex justify-between">
                    <span className="">Tiền thừa trả khách:</span>
                    <span ref={changeRef} className=""></span>
                </div>
                <div className="h-14">
                    <Input className="h-full" placeholder="Ghi chú" ref={noteRef} />
                </div>
                <div className="flex flex-row space-x-4">
                    <button className="bg-gray-500 text-white px-4 py-4 rounded-lg w-[35%]" onClick={() => saveBill()}>Lưu hóa đơn</button>
                    <button className="bg-green-600 text-white px-4 py-4 rounded-lg flex-grow" onClick={() => settled()}>Thanh toán</button>
                </div>
            </div>
        </div>
    )
}