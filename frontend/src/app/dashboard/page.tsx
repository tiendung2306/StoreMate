"use client";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { use, useEffect, useState } from "react";
import ProductScreen from "./_admin/_product/page";
import { AppSidebar } from "./_admin/_sidebar/app-sidebar";
import BillScreen from "./_admin/_bill/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomerPage from "./_customer/page";
import { IUser } from "@/types/backend.d";

type ScreenType = 'product' | 'bill';

export default function DashboardPage() {
    const router = useRouter();
    const [screen, setScreen] = useState<ScreenType>('product');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        axios.get(`${process.env.API_URL}/v1/users/status`, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                if (res.data.status !== "authenticated") {
                    router.push('/login');
                }
                else {
                    setIsLoading(false);
                    setUser(res.data.user);
                }
            })
    }, []);

    return (
        !isLoading && (user?.role === 'ADMIN' ? < SidebarProvider >
            <AppSidebar data={{ screen, setScreen, user, setUser }} />
            <MainContent data={{ screen, setScreen, user, setUser }} />
        </ SidebarProvider> : <CustomerPage data={{ user, setUser }} />)
    );
}

interface MainContentProps {
    data: {
        screen: ScreenType;
        setScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
        user: IUser | null;
        setUser: React.Dispatch<React.SetStateAction<IUser | null | undefined>>;
    }
}

const MainContent = (props: MainContentProps) => {
    const { open } = useSidebar();

    return (
        <main className={`${open ? 'w-[calc(100vw-16rem)]' : 'w-[100vw]'} h-screen transition-all duration-300`}>
            <SidebarTrigger className="absolute z-10" />
            {props.data.screen === 'product' ? <ProductScreen /> : null}
            {props.data.screen === 'bill' ? <BillScreen data={{ user: props.data.user, setUser: props.data.setUser }} /> : null}
        </main>
    );
};
