import { CirclePlus, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface IProp {
    data: {
        bills: number[];
        setBills: React.Dispatch<React.SetStateAction<number[]>>;
        currentBill: number;
        setCurrentBill: React.Dispatch<React.SetStateAction<number>>;
    }
}

export function BillTab(prop: IProp) {

    const newBill = () => {
        prop.data.setBills((prevBills: number[]) => {
            const newBills = [...prevBills];
            newBills.push(-1);// make a new virutal bill
            return newBills;
        });
        prop.data.setCurrentBill(prop.data.bills.length); // tu mo ra cai cuoi cung
    }

    const closeBill = (index: number) => {
        if (prop.data.bills.length === 1) {
            prop.data.setBills([]);
            return;
        }
        prop.data.setBills((prevBills: number[]) => {
            const newBills = [...prevBills];
            newBills.splice(index, 1);
            return newBills;
        });
        if (index === prop.data.currentBill) {
            prop.data.setCurrentBill(prop.data.bills.length - 1);
        }
    }

    return (
        <ScrollArea className="w-[50%]">
            <div className="flex flex-row w-full max-w-full ">
                {prop.data.bills.map((bill: number, index: number) => {
                    return (
                        <div key={index}
                            className="flex items-center justify-between py-1 pl-2 pr-1 min-w-[12vh] w-[12vh] max-w-[12vh] h-[100%] mb-1 rounded-lg mr-1 cursor-pointer"
                            style={{ boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset", flexShrink: 0 }}
                        >
                            <span className="w-full truncate"
                                onClick={() => {
                                    prop.data.setCurrentBill(index)
                                }}>Bill_{bill !== -1 ? bill : "draft"}</span>
                            <X className="size-4 justify-end" onClick={() => closeBill(index)} />
                        </div>

                    )
                })}
                <div className="cursor-pointer py-1" onClick={() => newBill()}><CirclePlus /></div>
            </div >
            <ScrollBar className="bg-gray-300 max-h-4" orientation="horizontal" />
        </ScrollArea>
    )
}