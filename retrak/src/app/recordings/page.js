"use client"
import { useEffect, useState } from "react";
import Navbar from "../components/Nav";
import Sidebar from "../components/Sidebar";
import { endpoints, headers } from "../config/server";
import '../styles/recordings.scss'
import axios from "axios";
import { Upload } from 'cloudinary-react';
import { useRouter } from "next/navigation";


export default function Recordings() {
    const [recordings, setRecordings] = useState(
        [
            {
                "url":"http://127.0.0.1:5555/videos/google.MOV",
                "text":"Web Dev: HTML, CSS, and JavaScript Explained"
            }
        ]
    );

 
    //hash function
    const hash = (s) => {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }
    const router = useRouter()
    const [selectedFile, setSelectedFile] = useState(null);
    const handleUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.click();
    
        input.onchange = async () => {
          const file = input.files[0];
          const formData = new FormData();
          formData.append('video', file);
    
          try {
            const response = await axios.post(endpoints.upload_video, formData);
            console.log('Video uploaded successfully:', response.data);
            // You can perform additional actions after successful upload
          } catch (error) {
            console.error('Error uploading video:', error);
            // Handle error
          }
        };
      };


    return (
        <div className="recordings">
            <Navbar />
            <div className="main">
                <Sidebar />
                <div className="app-content">
                    <div className="tops">
                        <label htmlFor="">Recordings (1)</label>
                    </div>
                    <div className="recordings-list">
                        {recordings &&
                            recordings.map((item, index) => (
                                <div key={index} className="recording">
                           
                                        <video src={item.url}
                                        onClick={() => {
                                            router.push(`/recordings/${hash(item.url)}`)
                                        }
                                        }
                                        ></video>
                                        <label htmlFor="">
                                            {item.text}
                                        </label>
                                   
                                  
                                </div>
                            ))}
                    </div>
                    {recordings && recordings.length === 0 && (
                        <div className="empty">
                            <i className="bx bxs-package"></i>
                            <label htmlFor="">No recordings available</label>
                        </div>
                    )}
                </div>
            </div>
            <div className="action-center">
           
                    <div className={"btn active"}
                    onClick={handleUpload}

                    >
                        <i className="bx bx-upload"></i>
                        <label htmlFor="">Upload</label>
                    </div>
              
            </div>
        </div>
    );
}
