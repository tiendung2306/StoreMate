import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuItem,
    SidebarMenu
} from "@/components/ui/sidebar"
import { PackageSearch, Receipt } from "lucide-react";

interface IProps {
    data: {
        screen: 'product' | 'bill';
        setScreen: React.Dispatch<React.SetStateAction<'product' | 'bill'>>;
    }
}

export function AppSidebar(props: IProps) {
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="p-2 flex flex-col">
                        <SidebarMenu>
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
