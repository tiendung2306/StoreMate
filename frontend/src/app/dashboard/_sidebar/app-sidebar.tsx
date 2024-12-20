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
                    <SidebarGroupContent>
                        <h1>Application</h1>
                        <SidebarMenu>
                            <SidebarMenuItem >
                                <Button onClick={() => props.data.setScreen('product')}>Product</Button>
                            </SidebarMenuItem>
                            <SidebarMenuItem >
                                <Button onClick={() => props.data.setScreen('bill')}>Bill</Button>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
