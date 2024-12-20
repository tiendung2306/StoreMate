"use client"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./_sidebar/app-sidebar";
import ProductScreen from "./_app/page";
import { useState } from "react";

const [screen, setScreen] = useState<'product' | 'bill'>('product');
export default function DashboardPage() {
    return (
        <SidebarProvider>
            <AppSidebar data={{ screen, setScreen }} />
            <MainContent />
        </SidebarProvider>
    );
}

const MainContent = () => {
    const { open } = useSidebar();

    return (
        <main className={`${open ? 'w-[calc(100vw-16rem)]' : 'w-[100vw]'} h-screen transition-all duration-300`}>
            <SidebarTrigger className="absolute z-10" />
            {screen === 'product' ? <ProductScreen /> : null}
            {screen === 'bill' ? <div>Bill</div> : null}
        </main>
    );
};