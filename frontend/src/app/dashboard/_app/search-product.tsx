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

export default function SearchProduct() {

    const resetFilter = () => {
        (document.getElementById('product-name') as HTMLInputElement).value = '';
        (document.getElementById('priceFrom') as HTMLInputElement).value = '';
        (document.getElementById('priceTo') as HTMLInputElement).value = '';
    }

    const searchProduct = () => {
        const productName = (document.getElementById('product-name') as HTMLInputElement).value;
        const priceFrom = (document.getElementById('priceFrom') as HTMLInputElement).value;
        const priceTo = (document.getElementById('priceTo') as HTMLInputElement).value;

        console.log({ productName, priceFrom, priceTo });
    }

    return (
        <Dialog>
            <DialogTrigger asChild><Button className="bg-blue-500 text-white ml-12" variant={"outline"}>Tìm kiếm</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-name" className="text-right">
                            Tên sản phẩm
                        </Label>
                        <Input id="product-name" placeholder="tên sản phẩm" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Giá(vnđ)
                        </Label>
                        <div className="col-span-3 flex items-center gap-4">
                            <Label htmlFor="priceFrom" className="text-right">Từ</Label>
                            <Input id="priceFrom" placeholder="0" className="w-full" />
                            <Label htmlFor="priceTo" className="text-right">Đến</Label>
                            <Input id="priceTo" placeholder="1000000" className="w-full" />
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