import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import axios from "axios"
import { useEffect, useState } from "react"

interface IProp {
    data: {
        isProductChanged: boolean,
        setIsProductChanged: (isProductChanged: boolean) => void,
        searchFilter: string,
        setSearchFilter: (searchFilter: string) => void,
        priceFrom: number,
        setPriceFrom: (priceFrom: number) => void,
        priceTo: number,
        setPriceTo: (priceTo: number) => void,
    }
}

export default function SearchProduct(prop: IProp) {

    const [productName, setProductName] = useState('')
    const minPriceFilter = 0;
    const maxSliderPrice = 10000000;
    const [maxPriceFilter, setMaxPriceFilter] = useState(maxSliderPrice);
    const [priceRange, setPriceRange] = useState([minPriceFilter, maxPriceFilter])
    const [resetSlider, setResetSlider] = useState(false);
    const [forceResetSlider, setForceResetSlider] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/v1/product/max-price`)
            .then((res) => {
                const maxPrice = res.data || 1000000;
                const roundedMaxPrice = Math.ceil(maxPrice / 1000000) * 1000000;
                const maxPriceFilter = roundedMaxPrice > maxSliderPrice ? maxSliderPrice : roundedMaxPrice;
                setMaxPriceFilter(maxPriceFilter);
                setPriceRange([minPriceFilter, maxPriceFilter]);
            });
    }, []);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/v1/product/max-price`)
            .then((res) => {
                const maxPrice = res.data || 1000000;
                const roundedMaxPrice = Math.ceil(maxPrice / 1000000) * 1000000;
                const maxPriceFilter = roundedMaxPrice > maxSliderPrice ? maxSliderPrice : roundedMaxPrice;
                setMaxPriceFilter(maxPriceFilter);
                setPriceRange([minPriceFilter, maxPriceFilter]);
                prop.data.setPriceFrom(minPriceFilter);
                prop.data.setPriceTo(maxPriceFilter);
                setForceResetSlider(!forceResetSlider);
            });
    }, [prop.data.isProductChanged]);


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    const resetFilter = () => {
        setResetSlider(true);
        setTimeout(() => {
            setPriceRange([minPriceFilter, maxPriceFilter]);
            setProductName('');
            prop.data.setSearchFilter('');
            prop.data.setPriceFrom(minPriceFilter);
            prop.data.setPriceTo(maxPriceFilter);
            setResetSlider(false);
        }, 0);
    };


    // const searchProduct = () => {
    //     const productName = (document.getElementById('product-name') as HTMLInputElement).value;
    //     const priceFrom = (document.getElementById('priceFrom') as HTMLInputElement).value;
    //     const priceTo = (document.getElementById('priceTo') as HTMLInputElement).value;

    //     prop.data.setSearchFilter(productName);
    //     if (priceFrom !== '') prop.data.setPriceFrom(parseInt(priceFrom));
    //     else prop.data.setPriceFrom(-1);
    //     if (priceTo !== '') prop.data.setPriceTo(parseInt(priceTo));
    //     else prop.data.setPriceTo(-1);
    // }

    return (
        <div className="px-4 w-full max-w-[70%] h-full min-h-full bg-white">
            <div className="flex w-ful h-full items-end relative">
                <div className="bottom-[36px] left-2 italic hover:underline cursor-pointer text-blue-500 absolute"
                    onClick={() => resetFilter()}>
                    Xóa bộ lọc
                </div>
                <div className="w-[50%]">
                    <Input
                        id="product-name"
                        placeholder="Nhập tên sản phẩm"
                        value={productName}
                        autoComplete="off"
                        onChange={(e) => {
                            setProductName(e.target.value)
                            prop.data.setSearchFilter(e.target.value)
                        }}
                    />
                </div>

                <div className="w-[50%] ml-4">
                    <Label className="font-bold">Khoảng giá:</Label>
                    {!resetSlider && (
                        <Slider
                            key={minPriceFilter.toString() + maxPriceFilter.toString() + forceResetSlider.toString()}
                            min={minPriceFilter}
                            max={maxPriceFilter}
                            step={10000}
                            value={priceRange}
                            onValueChange={(newRange) => {
                                setPriceRange(newRange);
                                prop.data.setPriceFrom(newRange[0]);
                                prop.data.setPriceTo(newRange[1]);
                            }}
                            className="mt-2"
                            minStepsBetweenThumbs={0}
                            formatLabel={(value) => {
                                // console.log(value)
                                return value === maxSliderPrice ? `>=${formatPrice(value)}` : formatPrice(value)
                            }}
                        />
                    )}


                    {/* <div className="flex justify-between items-center">
                        <Input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="w-24"
                        />
                        <span className="text-sm text-gray-500">đến</span>
                        <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-24"
                        />
                    </div> */}
                    {/* <div className="flex justify-between text-sm text-gray-500">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                    </div> */}
                </div>
            </div>
        </div>
        // <Dialog>
        //     <DialogTrigger asChild><Button className="bg-blue-500 text-white ml-12" variant={"outline"}>Tìm kiếm</Button></DialogTrigger>
        //     <DialogContent>
        //         <DialogHeader>
        //             <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
        //         </DialogHeader>
        // <div className="grid gap-4 py-4">
        //     <div className="grid grid-cols-4 items-center gap-4">
        //         <Label htmlFor="product-name" className="text-right">
        //             Tên sản phẩm
        //         </Label>
        //         <Input id="product-name" placeholder="Tên sản phẩm" className="col-span-3" value={prop.data.searchFilter} onChange={(e) => { prop.data.setSearchFilter(e.target.value) }} />
        //     </div>
        //     <div className="grid grid-cols-4 items-center gap-4">
        //         <Label htmlFor="price" className="text-right">
        //             Giá(vnđ)
        //         </Label>
        //         <div className="col-span-3 flex items-center gap-4">
        //             <Label htmlFor="priceFrom" className="text-right">Từ</Label>
        //             <Input id="priceFrom" placeholder="0" className="w-full" value={prop.data.priceFrom === -1 ? "" : prop.data.priceFrom.toString()} onChange={(e) => {
        //                 prop.data.setPriceFrom(e.target.value === "" ? -1 : parseInt(e.target.value))
        //             }} />
        //             <Label htmlFor="priceTo" className="text-right">Đến</Label>
        //             <Input id="priceTo" placeholder="1000000" className="w-full" value={prop.data.priceTo === -1 ? "" : prop.data.priceTo.toString()} onChange={(e) => {
        //                 prop.data.setPriceTo(e.target.value === "" ? -1 : parseInt(e.target.value))
        //             }} />
        //         </div>
        //     </div>
        // </div>
        //         <DialogFooter className="flex flex-row justify-between">
        //             <Button className="mr-auto" onClick={() => resetFilter()}>Xóa bộ lọc</Button>
        //             <Button className="ml-auto bg-green-600" onClick={() => searchProduct()}>Tìm kiếm</Button>
        //         </DialogFooter>
        //     </DialogContent>
        // </Dialog>
    )
} 