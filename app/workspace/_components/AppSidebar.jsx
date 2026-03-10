"use client"

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../../../@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '../../../@/components/ui/button'
import { Book, Compass, LayoutDashboard, Plus, UserCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AddNewCourseDialog from '../_components/AddNewCourseDialog'

const SideBarOptions = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        path: '/workspace'
    },
    {
        title: 'My Learning',
        icon: Book,
        path: '/workspace/my-learning'
    },
    {
        title: 'Explore Courses',
        icon: Compass,
        path: '/workspace/explore'
    },
    {
        title: 'Profile',
        icon: UserCircle2Icon,
        path: '/workspace/profile'
    },
]

function AppSidebar() {
    const path = usePathname();

    return (
        <Sidebar className="border-r-0">
            <div className="flex h-full flex-col bg-primary text-white">
                <SidebarHeader className="px-4 pt-5 pb-3">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex w-full justify-center rounded-3xl bg-white px-4 py-5 shadow-md backdrop-blur">
                            <Image
                                src={'/text-logo.png'}
                                alt='logo'
                                width={145}
                                height={100}
                                className="object-contain"
                            />
                        </div>

                        <AddNewCourseDialog>
                            <Button className="w-full rounded-2xl bg-white text-primary shadow-md hover:bg-white/95 font-bold text-base py-6">
                                <Plus className="h-5 w-5 mr-2" />
                                Create New Course
                            </Button>
                        </AddNewCourseDialog>
                    </div>
                </SidebarHeader>

                <SidebarContent className="px-3 pb-3">
                    <SidebarGroup className="p-0">
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-3">
                                {SideBarOptions.map((item, index) => {
                                    const isActive =
                                        item.path === '/workspace'
                                            ? path === '/workspace'
                                            : path.includes(item.path);

                                    return (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
                                                <Link
                                                    href={item.path}
                                                    className={`group flex items-center gap-4 rounded-2xl px-4 py-4 text-[16px] font-semibold transition-all duration-200
                                                    ${
                                                        isActive
                                                            ? 'bg-white text-primary shadow-md'
                                                            : 'text-white/95 hover:bg-white/15 hover:text-white'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all
                                                        ${
                                                            isActive
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'bg-white/10 text-white group-hover:bg-white/20'
                                                        }`}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                    </div>

                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="mt-auto p-4">
                    <div className="rounded-3xl bg-white/10 p-3 shadow-md backdrop-blur">
                        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                                <UserCircle2Icon className="h-7 w-7" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                    Your Workspace
                                </p>
                                <p className="truncate text-xs text-white/75">
                                    Keep learning daily
                                </p>
                            </div>
                        </div>
                    </div>
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}

export default AppSidebar