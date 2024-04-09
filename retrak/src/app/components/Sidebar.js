"use client"
import { Magicpen, Note, Setting2, SliderVertical, Sound, TaskSquare } from "iconsax-react";
import { useState } from "react";
import '../styles/sidebar.scss'
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar(){
    const sidebar_data = [
        {
            icon: <Sound size="26" color="#0d1436"/>,
            label: "Home",
            path: "/"
        },
        {
            icon: <SliderVertical size="26" color="#0d1436"/>,
            label: "Recordings",
            path: "/recordings"

        },
        {
            icon: <TaskSquare size="26" color="#0d1436"/>,
            label: "Tasks",
            path: "/tasks"
        },
        {
            icon: <Magicpen size="26" color="#0d1436"/>,
            label: "Practice (AI)",
            path: "/roadmap"
        },
        {
            icon: <Note size="26" color="#0d1436"/>,
            label: "Revision Notes",
            path: "/notes"
        },
        {
            icon: <Setting2 size="26" color="#0d1436"/>,
            label: "Settings",
            path: "/settings"
        }
    ]
    const [active, setActive] = useState(0)
    const pathname = usePathname()
    const router = useRouter()
    return (
        <div className="sidebar">
         
        <div className="menu">
        {
            sidebar_data.map((item, index) => (
                <div key={index} className={`item ${ pathname === item.path ? 'active' : ''}`} onClick={() => {
                  
                    router.push(item.path)
                }}>
                    {item.icon}
                    <label>{item.label}</label>
                </div>
            ))
        }
       
        </div>
      </div>
    )
}