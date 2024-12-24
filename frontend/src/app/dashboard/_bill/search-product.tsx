import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useEffect } from "react";
import axios from 'axios';
import { IProduct } from "@/types/backend.d";

interface IProp {
    data: {
        addProductToBill: (product: IProduct) => void;
    }
}

export default function SearchProduct(prop: IProp) {
    const [productList, setProductList] = React.useState<IProduct[]>([]);
    const [focused, setFocused] = React.useState(false)
    const onFocus = () => {
        if (productList.length === 0) search({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
        setFocused(true)
    }
    const onBlur = () => {
        setTimeout(() => {
            setFocused(false);
        }, 100);
    }
    const search = (e: ChangeEvent<HTMLInputElement>) => {
        axios.get(`${process.env.API_URL}/v1/product/search?searchContent=${e.target.value}`)
            .then(res => {
                const products: IProduct[] = [];
                res.data.forEach((product: IProduct) => {
                    products.push(product);
                });
                setProductList(products);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const addProduct = (product: IProduct) => {
        prop.data.addProductToBill(product);
    }

    return (
        <div className="relative">
            <Input className="mx-1 w-full" placeholder="Thêm sản phẩm" onChange={(e) => search(e)} onFocus={onFocus} onBlur={onBlur}></Input>
            {focused ? <div className="absolute bg-gray-100 border left-1 right-0 h-64 overflow-y-auto" style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
                {
                    productList.map((product: IProduct, index: number) => {
                        return <div key={product.id} className="p-2 border-b cursor-pointer hover:bg-slate-300" onClick={() => addProduct(product)}>
                            <div className="inline-block w-[20%]">SP_{product.id}</div>
                            <div className="inline-block w-[80%] truncate">{product.name}</div>
                        </div>
                    })}
            </div> : null}
        </div>
    )
}