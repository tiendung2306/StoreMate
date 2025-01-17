import { CirclePlus, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import IBillTab from "./interfaces/bill";


interface IProp {
    data: {
        bills: IBillTab[];
        setBills: React.Dispatch<React.SetStateAction<IBillTab[]>>;
        currentBill: number;
        setCurrentBill: React.Dispatch<React.SetStateAction<number>>;
    }
}

export function BillTab(prop: IProp) {

    const [isCloseBillDialogOpen, setIsCloseBillDialogOpen] = useState(false);

    const newBill = () => {
        prop.data.setBills((prevBills: IBillTab[]) => {
            const newBills = [...prevBills];
            const defaultBillTab: IBillTab = { id: -1, isModify: false };
            newBills.push(defaultBillTab); // make a new virtual bill
            prop.data.setCurrentBill(newBills.length - 1);
            return newBills;
        });
    }

    const closeBill = (index: number) => {
        if (prop.data.bills.length === 1) {
            prop.data.setBills([]);
            newBill();
            return;
        }

        prop.data.setBills((prevBills: IBillTab[]) => {
            const newBills = [...prevBills];
            newBills.splice(index, 1);
            return newBills;
        });

        if (index === prop.data.currentBill) {
            const newIndex = index === 0 ? 0 : index - 1;
            prop.data.setCurrentBill(newIndex);
        }
    }

    const closeTabBill = (index: number) => {
        if (!prop.data.bills[index].isModify) {
            closeBill(index);
        }
        else {
            setIsCloseBillDialogOpen(true);
        }
    }

    // Effect to set the current bill to the last bill if the bills array changes
    useEffect(() => {
        if (prop.data.bills.length > 0 && prop.data.currentBill >= prop.data.bills.length) {
            prop.data.setCurrentBill(prop.data.bills.length - 1);
        }
    }, [prop.data.bills, prop.data.currentBill]);

    return (
        <ScrollArea className="w-[50%]">
            <div className="flex flex-row w-full max-w-full ">
                {prop.data.bills.map((bill: IBillTab, index: number) => {
                    return (
                        <div key={index}
                            className={"flex items-center justify-between py-1 pl-2 pr-1 min-w-[12vh] w-[12vh] max-w-[12vh] h-[100%] mb-1 rounded-lg mr-1 cursor-pointer" + (index === prop.data.currentBill ? " bg-gray-400" : "")}
                            style={{ boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset", flexShrink: 0 }}
                        >
                            <span className="w-full truncate"
                                onClick={() => {
                                    prop.data.setCurrentBill(index);
                                }}>Bill_{bill.id !== -1 ? bill.id : "draft"}</span>
                            <X className="size-4 justify-end" onClick={() => closeTabBill(index)} />
                            <AlertDialog open={isCloseBillDialogOpen} onOpenChange={setIsCloseBillDialogOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure to close this bill?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently close your bill and not save any of your changes.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => closeBill(index)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )
                })}

                <div className="cursor-pointer py-1" onClick={() => newBill()}><CirclePlus /></div>
            </div>
            <ScrollBar className="bg-gray-300 max-h-4" orientation="horizontal" />
        </ScrollArea>
    );
}
