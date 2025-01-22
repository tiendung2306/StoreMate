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
import { IProduct } from "@/types/backend.d"
import React from "react"

interface EditProductProps {
    data: {
        isProductChanged: boolean;
        setIsProductChanged: React.Dispatch<React.SetStateAction<boolean>>;
        product: IProduct;
    };

}

export default function EditProduct(props: EditProductProps) {
    const { toast } = useToast()

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const productNameRef = React.useRef<HTMLInputElement>(null);
    const priceRef = React.useRef<HTMLInputElement>(null);
    const descriptionRef = React.useRef<HTMLInputElement>(null);

    const editProduct = async (product_id: number) => {
        const productName = productNameRef.current?.value;
        const price = priceRef.current?.value;
        const productImage = (document.getElementById('product-image') as HTMLInputElement).files?.[0];
        const description = descriptionRef.current?.value;

        if (!productName || productName?.length === 0 || !price || price.length === 0) {
            toast({
                variant: "destructive",
                title: "Thất bại",
                description: "Tên sản phẩm hoặc giá không hợp lệ!",
            })
            return;
        }

        let imageUrl = "";
        if (productImage) {
            //Luu anh len server
            const formData = new FormData();
            formData.append('file', productImage as Blob);
            await axios.post(`${process.env.API_URL}/v1/upload`, formData)
                .then((res) => {
                    imageUrl = process.env.API_URL + '/public' + res.data.imageUrl;

                })
                .catch(() => {
                    toast({
                        variant: "destructive",
                        title: "Thất bại",
                        description: "Thêm ảnh sản phẩm thất bại, hãy thử lại ảnh khác!",
                    })
                    // console.error(err);
                });

            console.log(imageUrl);
        }

        axios.patch(`${process.env.API_URL}/v1/product/${product_id}`, {
            name: productName,
            price: price ? Number.parseInt(price) : undefined,
            image: productImage ? imageUrl : undefined,
            description: description,
        })
            .then(() => {
                setTimeout(() => {
                    props.data.setIsProductChanged(!props.data.isProductChanged);
                }, 0);
                toast({
                    title: "Thành công",
                    description: "Chỉnh sửa sản phẩm thành công!",
                })
                setIsDialogOpen(false);
            })
            .catch((err) => {
                toast({
                    variant: "destructive",
                    title: "Thất bại",
                    description: "Chỉnh sửa sản phẩm thất bại!",
                })
                console.error(err);
            });
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="absolute right-0 top-0 bottom-0 left-0">

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
                    <DialogDescription>Chỉnh sửa sản phẩm có id {props.data.product.id}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-name" className="text-right">
                            Tên sản phẩm
                        </Label>
                        <Input id="product-name" ref={productNameRef} placeholder="tên sản phẩm" defaultValue={props.data.product.name} maxLength={150} className="col-span-3"
                            autoFocus
                            autoComplete="off"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right" >
                            Giá(vnđ)
                        </Label>
                        <Input
                            autoComplete="off"
                            id="price" ref={priceRef} placeholder="100000" className="col-span-3" defaultValue={props.data.product.price}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-image" className="text-right">
                            Chọn ảnh
                        </Label>
                        <Input type="file" id="product-image" accept="image/png, image/jpeg" className="col-span-3"
                            autoComplete="off"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Mô tả sản phẩm
                        </Label>
                        <Input id="description" ref={descriptionRef} placeholder="mô tả sản phẩm" className="col-span-3" defaultValue={props.data.product.description}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => editProduct(props.data.product.id)} > Chỉnh sửa</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}