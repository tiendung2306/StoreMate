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
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface AddProductProps {
    data: {
        isProductChanged: boolean;
        setIsProductChanged: React.Dispatch<React.SetStateAction<boolean>>;

    };

}

export default function AddProduct(props: AddProductProps) {
    const { toast } = useToast();

    const addProduct = async () => {
        const productName = (document.getElementById('product-name') as HTMLInputElement).value;
        const price = (document.getElementById('price') as HTMLInputElement).value;
        const productImage = (document.getElementById('product-image') as HTMLInputElement).files?.[0];
        const description = (document.getElementById('description') as HTMLInputElement).value;

        let imageUrl = "";

        //Luu anh len server
        const formData = new FormData();
        formData.append('file', productImage as Blob);
        await axios.post(`${process.env.API_URL}/v1/upload`, formData)
            .then((res) => {
                imageUrl = process.env.API_URL + '/public' + res.data.imageUrl;

            })
            .catch((err) => {
                toast({
                    variant: "destructive",
                    title: "Thất bại",
                    description: "Thêm ảnh sản phẩm thất bại, hãy thử lại ảnh khác!",
                })
                console.error(err);
            });

        console.log(imageUrl);
        axios.post(`${process.env.API_URL}/v1/product`, {
            name: productName,
            price: Number.parseInt(price),
            image: imageUrl,
            description: description,
            category_id: 1
        })
            .then((res) => {
                props.data.setIsProductChanged(!props.data.isProductChanged);
                toast({
                    title: "Thành công",
                    description: "Thêm sản phẩm vào danh mục sản phẩm thành công!",
                })
            })
            .catch((err) => {
                toast({
                    variant: "destructive",
                    title: "Thất bại",
                    description: "Thêm sản phẩm vào danh mục sản phẩm thất bại!",
                })
                console.error(err);
            });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-700 mr-12">Thêm sản phẩm</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm sản phẩm</DialogTitle>
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
                        <Input id="price" placeholder="100000" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-image" className="text-right">
                            Chọn ảnh
                        </Label>
                        <Input
                            type="file"
                            id="product-image"
                            accept="image/png, image/jpeg"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Mô tả sản phẩm
                        </Label>
                        <Input id="description" placeholder="mô tả sản phẩm" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => addProduct()}>Thêm sản phẩm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}