"use client";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useState } from "react";
import ProductScreen from "./_app/page";
import { AppSidebar } from "./_sidebar/app-sidebar";
import BillScreen from "./_bill/page";

type ScreenType = 'product' | 'bill';

export default function DashboardPage() {
    const [screen, setScreen] = useState<ScreenType>('product');

    return (
        <SidebarProvider>
            <AppSidebar data={{ screen, setScreen }} />
            <MainContent data={{ screen, setScreen }} />
        </SidebarProvider>
    );
}

interface MainContentProps {
    data: {
        screen: ScreenType;
        setScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
    }
}

const MainContent = (props: MainContentProps) => {
    const { open } = useSidebar();

    return (
        <main className={`${open ? 'w-[calc(100vw-16rem)]' : 'w-[100vw]'} h-screen transition-all duration-300`}>
            <SidebarTrigger className="absolute z-10" />
            {props.data.screen === 'product' ? <ProductScreen /> : null}
            {props.data.screen === 'bill' ? <BillScreen /> : null}
        </main>
    );
};
