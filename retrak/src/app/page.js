"use client"
import Image from "next/image";
import './styles/app.scss'
import logo from './assets/logo.png';

import Navbar from "./components/Nav";
import { useEffect, useState } from "react";
import { Magicpen, Note, Setting2, SliderVertical, Sound, TaskSquare } from "iconsax-react";
import axios from "axios";
import { endpoints, headers } from "./config/server";
import Sidebar from "./components/Sidebar";
export default function Home() {
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
  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
          console.log(fileReader.result)
          setVideoURL(fileReader.result);
        };
      }
    };
    input.click();
  };

  async function processTranscript(transcript_) {
    await axios.post(endpoints.process_transcript,{
      text:transcript_,
      body:summayData?summayData:''
    },
  {headers:headers}
  ).then((res) => {
      console.log(res.data)
      setSummaryData(res.data)
    })
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
      .filter(result => result.confidence > 0.9) // Filter based on confidence
      .map(result => result.transcript)
      .join('');
  

      setTranscript(transcript);
    
 
      if (currentTime - segmentStartTime > PAUSE_THRESHOLD) {
        // Start a new segment
        segmentStartTime = currentTime;
        currentSegment = transcript 
        const datax = new Date(parseInt(segmentStartTime)).toLocaleTimeString()
        //console.log(transcript)
        // console.log('current: ',transcript.slice(previousSegment.length))
        // console.log('previousSegment: ',previousSegment)
      
        previousSegment = transcript;
        // setSegments(prevSegments => [...prevSegments, transcript.trim()]);
        processTranscript(transcript)
        // console.log("segment: ",segments)
        // console.log(transcript)
       }else{
   
        currentSegment = transcript ;

      }
      
  
 


      // setTranscriptions(prevTranscriptions => ({
      //   ...prevTranscriptions,
      //   [segmentStartTime]: currentSegment.trim()
      // }));      
    };
    

    recognition.onerror = event => {
      console.error('Speech recognition error', event.error);
      setRecognizing(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);
  const [transcriptions, setTranscriptions] = useState({});

  const handleRecord = () => {
    if (!recording) {
      setRecording(true);
      recognition.start();
    } else {
      setRecording(false);
      recognition.stop();
    }
  };

  const handlePlay = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };
  const actionitems =[
    {
      icon: 'bx bxs-microphone',
      label: 'Record',
      play:true
    },
    {
      icon: 'bx bx-upload',
      label: 'Upload'
    }
  ]
  const summary_options =[
    'Summary',
    'Action Items',
    'To Do List',
    'Reminders',
    'Resources'
  ]
  const [activeActionItem, setActiveActionItem] = useState(null)
  const [activeSummaryOption, setActiveSummaryOption] = useState(summary_options[0])
  return (
    <div className="app">
    <Navbar/>
      <div className="main">
      <Sidebar/>
        <div className="app-content">
          <div className="content-box">
            <div className="transcript-box">
              <div className="top">
                <input type="text"
                placeholder="Meeting @ 5/10/2024"
                />
              </div>
              <div className="word-box">
  
    <div   className="segbox1">
      <div className="time">
        {/* <span>
        {new Date(parseInt(segmentStartTime)).toLocaleTimeString()}
        </span> */}
      </div>
      {
        videoURL?
        <div className="video-section">
 
        <div>
          <h2>Selected Video:</h2>
          <video controls>
            <source src={videoURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
 
        </div>:
         <div className="transcript">
         {transcript
          
         }
            </div> 
      }
     
     </div>
 
</div>

            </div>
            <div className="summary-box">
            <div className="toptop">
            <div className="top">
                <div className="options">
                    {
                      summary_options.map((item, index) => (
                        <div key={index} className={item==activeSummaryOption?"option active":"option"}
                        onClick={() => setActiveSummaryOption(item)}
                        >
                          {item}
                        </div>
                      ))
                    }
                </div>
              </div>     
              {
                     summayData && 
            
              <div className="kinibox">
                

              {
                activeSummaryOption == 'Summary' &&
           
     
             
              <div className="summ-day">
 {       summayData.summary}
          
              </div>      }   
        {
                activeSummaryOption == 'Action Items' &&
           
            <div className="actionitems-box">
              {
                summayData.action_items.map((item, index) => (
                  <div key={index} className="actionitem">
                     <label htmlFor="actionitem">
                      {item}
                    </label>
                  </div>
                ))
              }
            </div>
             
   
        }
             
            </div>  }
            </div>
              <div className="bottom">
                <div className="askbox">
                  <input type="text"
                  placeholder="
                  Ask a question"
                  />
                  <a>
              
                    <label htmlFor="">
                      Ask
                    </label>
                    <Magicpen size="19" color="#fff"/>
                    
                  </a>
                </div>
              </div>
            </div>
          </div>
 
        {/* <button onClick={handleRecord}>{recording ? 'Stop Recording' : 'Record'}</button>
      <button onClick={handlePlay} disabled={!audioURL}>Play</button> */}
          <div className="action-center">
           {
              actionitems.map((item, index) => (
                <div key={index} className={item.label==activeActionItem?"btn active":"btn"}
                onClick={() =>{ setActiveActionItem(item.label)
                if(item.play){
                  handleRecord()
                }else{
                  handleButtonClick()
                }

                }}
                >
                  <i className={item.icon}></i>
                  <label htmlFor="">
                    {item.label}
                  </label>
                </div>
              ))
           }
          </div>

        </div>
      </div>
    </div>
  );
}
