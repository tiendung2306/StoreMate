import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface IProp {
    data: {
        searchFilter: string,
        setSearchFilter: (searchFilter: string) => void,
        priceFrom: number,
        setPriceFrom: (priceFrom: number) => void,
        priceTo: number,
        setPriceTo: (priceTo: number) => void,
    }
}

export default function SearchProduct(prop: IProp) {

    const resetFilter = () => {
        (document.getElementById('product-name') as HTMLInputElement).value = '';
        (document.getElementById('priceFrom') as HTMLInputElement).value = '';
        (document.getElementById('priceTo') as HTMLInputElement).value = '';

        prop.data.setSearchFilter('');
        prop.data.setPriceFrom(-1);
        prop.data.setPriceTo(-1);
    }

    const searchProduct = () => {
        const productName = (document.getElementById('product-name') as HTMLInputElement).value;
        const priceFrom = (document.getElementById('priceFrom') as HTMLInputElement).value;
        const priceTo = (document.getElementById('priceTo') as HTMLInputElement).value;

        prop.data.setSearchFilter(productName);
        if (priceFrom !== '') prop.data.setPriceFrom(parseInt(priceFrom));
        else prop.data.setPriceFrom(-1);
        if (priceTo !== '') prop.data.setPriceTo(parseInt(priceTo));
        else prop.data.setPriceTo(-1);
    }

    return (
        <Dialog>
            <DialogTrigger asChild><Button className="bg-blue-500 text-white ml-12" variant={"outline"}>Tìm kiếm</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-name" className="text-right">
                            Tên sản phẩm
                        </Label>
                        <Input id="product-name" placeholder="Tên sản phẩm" className="col-span-3" value={prop.data.searchFilter} onChange={(e) => { prop.data.setSearchFilter(e.target.value) }} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Giá(vnđ)
                        </Label>
                        <div className="col-span-3 flex items-center gap-4">
                            <Label htmlFor="priceFrom" className="text-right">Từ</Label>
                            <Input id="priceFrom" placeholder="0" className="w-full" value={prop.data.priceFrom === -1 ? "" : prop.data.priceFrom.toString()} onChange={(e) => {
                                prop.data.setPriceFrom(e.target.value === "" ? -1 : parseInt(e.target.value))
                            }} />
                            <Label htmlFor="priceTo" className="text-right">Đến</Label>
                            <Input id="priceTo" placeholder="1000000" className="w-full" value={prop.data.priceTo === -1 ? "" : prop.data.priceTo.toString()} onChange={(e) => {
                                prop.data.setPriceTo(e.target.value === "" ? -1 : parseInt(e.target.value))
                            }} />
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex flex-row justify-between">
                    <Button className="mr-auto" onClick={() => resetFilter()}>Xóa bộ lọc</Button>
                    <Button className="ml-auto bg-green-600" onClick={() => searchProduct()}>Tìm kiếm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 