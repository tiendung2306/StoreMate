import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import AddProduct from "./add-product";
import SearchProduct from "./search-product";
import { Key, useEffect, useState } from "react";
import { IProduct } from "@/types/backend.d";
import axios from 'axios';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast";
import EditProduct from "./edit-product";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export default function ProductScreen() {
    const { toast } = useToast()
    const API_URL = process.env.API_URL;
    const [data, setData] = useState<IProduct[] | null>(null);
    const [isProductChanged, setIsProductChanged] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [priceFrom, setPriceFrom] = useState<number>(0);
    const [priceTo, setPriceTo] = useState<number>(10000000);

    const LIMIT = 10;

    useEffect(() => {
        console.log('fetching data', priceFrom, priceTo)
        let queryPriceTo = priceTo
        if (priceTo === 10000000) {
            queryPriceTo = -1;
        }
        axios.get(`${API_URL}/v1/product/?searchContent=${searchFilter}&priceFrom=${priceFrom}&priceTo=${queryPriceTo}&page=${page - 1}&limit=${LIMIT}`)
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                throw new Error(err);
            });
    }, [isProductChanged, page, searchFilter, priceFrom, priceTo]);

    const priceFormat = (price: number) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    const removeProduct = (product_id: number) => {
        axios.delete(`${API_URL}/v1/product/${product_id}`)
            .then((res) => {
                setIsProductChanged(!isProductChanged);
                toast({
                    variant: "destructive",
                    title: "Đã xóa",
                    description: "Xóa sản phẩm khỏi danh mục sản phẩm thành công!",
                })
            });
    }

    const previousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    const nextPage = () => {
        let queryPriceTo = priceTo
        if (priceTo === 10000000) {
            queryPriceTo = -1;
        }
        axios.get(`${API_URL}/v1/product/?searchContent=${searchFilter}&priceFrom=${priceFrom}&priceTo=${queryPriceTo}&page=${page}&limit=${LIMIT}`)
            .then((res) => {
                if (res.data.length > 0) {
                    setPage(page + 1);
                }
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="w-full h-[96px] flex items-end justify-between">
                <SearchProduct data={{ isProductChanged, setIsProductChanged, searchFilter, setSearchFilter, priceFrom, setPriceFrom, priceTo, setPriceTo }} />
                <AddProduct data={{ isProductChanged, setIsProductChanged }} />
            </div>

            <div className="flex-grow relative">
                <div className="flex flex-wrap">
                    {!!data && data.map((product: IProduct) => {
                        return (
                            <DropdownMenu key={product.id}>
                                <DropdownMenuTrigger asChild>
                                    <div className="w-[calc(100%/5)] p-4 cursor-pointer">
                                        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                                            <div className="text-lg font-semibold h-[7vh] max-h-[7vh] overflow-y-hidden max-w-full">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger className="truncate w-full">{product.name}</TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{product.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                            </div>
                                            <div>
                                                <img src={product.image} alt="product" className="size-36" />
                                            </div>
                                            <div className="text-2xl font-semibold mt-4">{priceFormat(product.price)}</div>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent >
                                    <DropdownMenuItem className="cursor-pointer">Chỉnh sửa sản phẩm</DropdownMenuItem>
                                    <EditProduct data={{ isProductChanged, setIsProductChanged, product }} />
                                    <DropdownMenuItem className="cursor-pointer bg-red-600 text-white" onClick={() => removeProduct(product.id)}>Xóa sản phẩm</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    })}
                </div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious className="cursor-pointer" onClick={() => previousPage()} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink className="cursor-pointer" onClick={() => { setPage(page) }}>{page}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext className="cursor-pointer" onClick={() => nextPage()} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}