"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"
import { IBill, IProduct, IUser } from "@/types/backend.d"
import IBillTab from "./interfaces/bill"

interface ISearchBills {
    value: string
    label: string
}

interface IProp {
    data: {
        productOnBill: IProduct[];
        setProductOnBill: React.Dispatch<React.SetStateAction<IProduct[]>>;
        quantities: number[];
        setQuantities: React.Dispatch<React.SetStateAction<number[]>>;
        bills: IBillTab[];
        setBills: React.Dispatch<React.SetStateAction<IBillTab[]>>;
        currentBill: number;
        setCurrentBill: React.Dispatch<React.SetStateAction<number>>;
    }
}

export function SearchBill(prop: IProp) {
    const [open, setOpen] = React.useState(false)
    const [bills, setBills] = React.useState<ISearchBills[]>([])

    let [users, setUsers] = React.useState<IUser[]>([]);
    React.useEffect(() => {
        axios.get(`${process.env.API_URL}/v1/users`, { withCredentials: true })
            .then(res => {
                setUsers(res.data);
            });
    }, []);

    const setBillId = (id: string) => {
        prop.data.setBills((prevBills: IBillTab[]) => {
            const newBills = [...prevBills];
            newBills[prop.data.currentBill].id = parseInt(id);
            return newBills;
        });
    }

    const newBillTab = (id: string) => {
        prop.data.setBills((prevBills: IBillTab[]) => {
            const newBills = [...prevBills];
            const newBillTab: IBillTab = { id: parseInt(id), isModify: false };
            newBills.push(newBillTab);
            prop.data.setCurrentBill(newBills.length - 1);
            return newBills;
        });
    }

    const openNewBill = (id: string) => {
        if (prop.data.bills[prop.data.currentBill].id === -1) {
            setBillId(id);
        }
        else {
            newBillTab(id);
        }
    }

    const findUser = (id: number) => {
        const user = users.find((u: IUser) => u.id === id);
        if (user) {
            return user.name;
        }
        return "";
    }

    const getIdFromLabel = (label: string) => {
        return label.split(" - ")[0];
    }

    React.useEffect(() => {
        if (open) {
            axios.get(`${process.env.API_URL}/v1/bill`)
                .then(res => {
                    const tempBills: ISearchBills[] = [];
                    res.data.forEach((bill: IBill) => {
                        const date = new Date(bill.date).toLocaleString('vi-VN');
                        tempBills.push({ value: bill.id.toString(), label: bill.id + ' - ' + findUser(bill.customer_id) + ' - ' + date });
                    })
                    setBills(tempBills);
                });
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {!!prop.data.bills[prop.data.currentBill] && prop.data.bills[prop.data.currentBill].id !== -1
                        ? bills.find((bill) => {
                            if (!!prop.data.bills[prop.data.currentBill])
                                return bill.value === prop.data.bills[prop.data.currentBill].id.toString();
                            return "";
                        })?.label
                        : "Select bill..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search bill..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No bill found.</CommandEmpty>
                        <CommandGroup className="px-5">
                            {bills.map((bill) => (
                                <CommandItem
                                    key={bill.value}
                                    value={bill.label}
                                    onSelect={(currentValue) => {
                                        openNewBill(getIdFromLabel(currentValue))
                                        setOpen(false)
                                    }}
                                >
                                    {bill.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            !!prop.data.bills[prop.data.currentBill] && prop.data.bills[prop.data.currentBill].id.toString() === bill.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
