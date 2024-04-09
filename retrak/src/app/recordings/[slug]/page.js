"use client"
import { useEffect, useState } from "react";
import Navbar from "../../components/Nav";
import Sidebar from "../../components/Sidebar";
import { endpoints, headers } from "../../config/server";
import '../../styles/recordings.scss'
import axios from "axios";
import { Upload } from 'cloudinary-react';
import { useRouter } from "next/navigation";


export default function Recordings() {
    const [recordings, setRecordings] = useState(
        [
            {
                "url":"http://127.0.0.1:5555/videos/google.MOV"
            }
        ]
    );
    const [loading, setLoading] = useState(false);
 

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
      const router = useRouter()
      const [chatHistory, setChatHistory] = useState(null);
        const [message, setMessage] = useState('');

    async function getResponse() {
        if(chatHistory==null){
            setChatHistory([{message: message, who: 'user'}]);
        
        }else{
            setChatHistory([...chatHistory, {message: message, who: 'user'}]);
        }
        setLoading(true);
        const body = {
            text: message.includes('roadmap')?'what is the workshop about, need it for a roadmap,be concisde exact, short and highly specific of exact terms mentioned in the workshop':message
        }
        setMessage('');
        await axios.post(endpoints.ask_video, body, { headers: headers })
        .then((response) => {
            console.log(response.data);
            

            if(chatHistory==null){
                setChatHistory([{message: message, who: 'user'},{message: response.data.answer, who: 'bot', audioUrl: response.data.audioUrl,roadmap_status: response.data.roadmap_status}]);
            }
            else{
                setChatHistory([...chatHistory, {message: response.data.answer, who: 'bot', audioUrl: response.data.audioUrl,roadmap_status: response.data.roadmap_status}]);
            }
            setLoading(false);
        })
        
    }

    const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcription, setTranscription] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const recognition = new window.webkitSpeechRecognition();
  const PAUSE_THRESHOLD = 5000; // 1 second in milliseconds
  const [transcript, setTranscript] = useState('');
  const [segments, setSegments] = useState([]);
  const [summayData, setSummaryData] = useState(null);
  const [videoURL, setVideoURL] = useState(null);

  function stopRecording() {
    setRecording(false);
    recognition.stop();
    }
    
    useEffect(() => {
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
    
        recognition.onstart = () => {
          console.log('Speech recognition started');
          setRecognizing(true);
        };
    
        recognition.onend = () => {
          console.log('Speech recognition ended');
          setRecognizing(false);
        };
    
        let segmentStartTime = 0;
        let currentSegment = '';
        let previousSegment = '';
       
        recognition.onresult = event => {
          const currentTime = new Date().getTime();
          const transcript = Array.from(event.results)
          .map(result => result[0])
          .filter(result => result.confidence > 0.6) // Filter based on confidence
          .map(result => result.transcript)
          .join('');
      
        
          setMessage(transcript);
        
      
          
      
     
    
         
        };
        
    
        recognition.onerror = event => {
          console.error('Speech recognition error', event.error);
          setRecognizing(false);
        };
    
        return () => {
          recognition.stop();
        };
      }, []);

      const handleRecord = () => {
        if (!recording) {
          setRecording(true);
          recognition.start();
        } else {
          setRecording(false);
          recognition.stop();
        }
      };
    return (
        <div className="recordings">
            <Navbar />
            <div className="main">
                <Sidebar />
                <div className="app-content-d">
                     
                    <div className="recordings-left">
                    
                                <div   className="recording">
                                    <div className="top">
                                        <video src={recordings[0].url} controls ></video>
                                    </div>
                                  
                                </div>
                            
                    </div>
                    <div className="right">
                        <div className="chat-box">
                            <div className="top">
                                <div className="header">
                                    <label htmlFor="">QA your Videos!</label>
                                </div>
                                { 
                                                                    chatHistory && 
                          
                                <div className="chat-history">
                                {
      chatHistory.map((chat,index)=>{
      return (
        <div className={chat.who=='user'?"chat user":"chat bot"} key={index}>
            {
               chat.roadmap_status!='true'&& 
 <label htmlFor="">
 {chat.message}
</label>
            }
         
          {
            chat.who=="bot" &&
            <audio src={chat.audioUrl} controls autoPlay></audio>
          }
          {
            chat.roadmap_status=='true' && 
            <div className="gen-roadmap"
            onClick={
                () => {
        
                    router.push(`/roadmap?text=${chat.message}`)
                
                }
            }
            >
                Generate
            </div>
          }
        </div>

      )
    }
    )
  }
  {
    loading&&
    <div className="chat bot">
      <label htmlFor="">
       Generating response ...
      </label>
   
    </div>
  
  }
                                </div>
                                      }

                                {
                                    !chatHistory &&
                                    <div className="chat-empty">
                       
                                            <label htmlFor="">
                                               Ask me anything about the video.
                                            </label>
                                      
                                    </div>
                                }
                            </div>
                            <div className="bottom">
                                <div className="input">
                                    {
                                        recording ?
                                        <div className="btn"
                                        onClick={stopRecording}
                                        >
                                            <i className="bx bx-microphone"></i>
                                        </div>
                                        :
                                        <div className="btn"
                                        onClick={handleRecord}
                                        >
                                            <i className="bx bx-microphone-off"></i>
                                        </div>


                                    }
                                    <input type="text" placeholder="Ask a question"
                                    onChange={(e) => setMessage(e.target.value)}
                                    value={message}
                                    onSubmit={(e) => {
                                        if(e.key === 'Enter'){
                                            getResponse();
                                        }
                                    }
                                    }
                                    />
                                    <div className="btn"
                                    onClick={getResponse}
                                    >
                                        <i className="bx bx-send"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="action-center">
           
                    <div className={"btn active"}
                    onClick={handleUpload}

                    >
                        <i className="bx bx-upload"></i>
                        <label htmlFor="">Upload</label>
                    </div>
              
            </div> */}
        </div>
    );
}
