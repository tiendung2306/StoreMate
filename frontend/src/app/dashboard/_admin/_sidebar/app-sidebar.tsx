import React from "react";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenuItem,
    SidebarMenu
} from "@/components/ui/sidebar"
import { IUser } from "@/types/backend.d";
import axios from "axios";
import { ChevronDown, PackageSearch, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface IProps {
    data: {
        screen: 'product' | 'bill';
        setScreen: React.Dispatch<React.SetStateAction<'product' | 'bill'>>;
        user: IUser | null;
        setUser: React.Dispatch<React.SetStateAction<IUser | null | undefined>>;
    }
}

export function AppSidebar(props: IProps) {

    const router = useRouter();

    function logOut() {
        axios.get(`${process.env.API_URL}/v1/auth/logout`, { withCredentials: true })
            .then((res) => {
                router.push('/login');
                console.log(res.data);
                document.cookie.split(";").forEach((c) => {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                // Đặt lại trạng thái người dùng
                props.data.setUser(null);
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    }

    const openMyProfile = () => {
        router.push('/myprofile');
    }

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="p-2 flex flex-col">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <div>Xin chào
                                        <DropdownMenuTrigger className="ml-1 cursor-pointer hover:underline inline-block">
                                            {props.data.user?.name}
                                            <ChevronDown className="inline size-4 hover:text-gray-500" />
                                        </DropdownMenuTrigger>
                                    </div>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => openMyProfile()}>Profile</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => logOut()}>Log out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                            <SidebarMenuItem >
                                <Button onClick={() => props.data.setScreen('product')} className="w-[95%]"><PackageSearch />Product</Button>
                            </SidebarMenuItem>
                            <SidebarMenuItem >
                                <Button onClick={() => props.data.setScreen('bill')} className="w-[95%]"><Receipt />Bill</Button>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
