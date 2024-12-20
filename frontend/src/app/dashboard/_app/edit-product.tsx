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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { IProduct } from "@/types/backend.d"

interface EditProductProps {
    data: {
        isProductChanged: boolean;
        setIsProductChanged: React.Dispatch<React.SetStateAction<boolean>>;
        product: IProduct;
    };

}

export default function EditProduct(props: EditProductProps) {
    const { toast } = useToast()

    const editProduct = (product_id: number) => {
        const productName = (document.getElementById('product-name') as HTMLInputElement).value;
        const price = (document.getElementById('price') as HTMLInputElement).value;
        const productImage = (document.getElementById('product-image') as HTMLInputElement).files?.[0];
        const description = (document.getElementById('description') as HTMLInputElement).value;

        axios.patch(`${process.env.API_URL}/v1/product/${product_id}`, {
            name: productName,
            price: Number.parseInt(price),
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s",
            description: description,
            category_id: 1
        })
            .then((res) => {
                props.data.setIsProductChanged(!props.data.isProductChanged);
                toast({
                    title: "Thành công",
                    description: "Chỉnh sửa sản phẩm thành công!",
                })
                console.log(res);
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
        <Dialog>
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
                        <Input id="product-name" placeholder="tên sản phẩm" defaultValue={props.data.product.name} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right" >
                            Giá(vnđ)
                        </Label>
                        <Input id="price" placeholder="100000" className="col-span-3" defaultValue={props.data.product.price} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product-image" className="text-right">
                            Chọn ảnh
                        </Label>
                        <Input type="file" id="product-image" accept="image/png, image/jpeg" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Mô tả sản phẩm
                        </Label>
                        <Input id="description" placeholder="mô tả sản phẩm" className="col-span-3" defaultValue={props.data.product.description} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => editProduct(props.data.product.id)} > Chỉnh sửa</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}