"use client"
import { useEffect, useState } from "react";
import Navbar from "../components/Nav";
import Sidebar from "../components/Sidebar";
import { endpoints, headers } from "../config/server";
import '../styles/roadmap.scss'
import axios from "axios";
import { Upload } from 'cloudinary-react';
import { data } from "./data";


export default function Recordings() {
    const [roadmap, setRoadmap] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    async function getRoadmap(text=search) {
        setLoading(true);
        try {
            const response = await axios.post(endpoints.get_roadmap,{text:text}, { headers: headers });
            setRoadmap(response.data);
            setLoading(false);
            console.log(response.data, 'roadmap');
        } catch (error) {
            console.error("Error fetching roadmap:", error);
        }
    }
useEffect(() => {
        const params = new URLSearchParams(window.location.search);
    if(params.get('text')){
        setSearch(params.get('text'));
        getRoadmap(params.get('text'));
    }

}, [])
    return (
        <div className="roadmap">
            <Navbar />
            <div className="main">
                <Sidebar />
                <div className="app-content">
                    <div className="tops">
                        <div className="searchbox">
                        <i class='bx bx-search'></i>
                            <input type="text"
                            placeholder="Search for a topic"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            
                            />
                            <a 
                            className={loading&&'loading'}
                            onClick={(e) => {
                                getRoadmap();
                                e.preventDefault();
                            }
                        }
                            >
                       {loading &&         <span class="loaderx"></span>}
                                Search
                            </a>
                        </div>
                    </div>
         
                    <div className="tree">
                        {roadmap && roadmap.path.map((group, index) => (
                            <div className="box" key={index}>
                                <div><label className='tx' htmlFor="">
                                {group.group}
                                </label>
                                    <div className="obj">
                                        {group.objectives.map((objective, index) => (
                                            <div  className='ul' key={index}>
                                                <label htmlFor="" className="exab">{objective.title}</label>
                                                <div className="ulx">
                                                    {objective.topics.map((topic, index) => (
                                                        <span className="exa" key={index}>{topic}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
             
                    </div>
                  
                </div>
            </div>
        
        </div>
    );
}
