import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_sidebar/app-sidebar";

import { ReactNode } from "react";
import App from "./_app/page";


export default function DashboardPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                <App />
            </main>
        </SidebarProvider>
    );
}