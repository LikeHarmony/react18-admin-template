import { useRef, useState} from 'react'
import { Button } from "antd";


const Mediarecorder: React.FC = () => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<null | MediaRecorder>(null);
  const blobs = useRef<Blob[]>([]);
  
  async function handleStart() {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    })
    mediaRecorder.current.addEventListener('dataavailable',(e: BlobEvent) => {
      console.log(333,e.data);
      
      blobs.current.push(e.data)
    })
    mediaRecorder.current.start();
    console.log( mediaRecorder.current, 'start');
  }
  // const handleCanvasRecord = () => {
  //   const stream = canvas?.captureStream(60);
  //   const recorder = new MediaRecorder(stream, {
  //     mimeType: 'video/web;codecs=vp9'
  //   })
  //   recorder.ondataavailable = (e) => {
  //     setBlobs((pre) => [...pre, e.data]);
  //   }
  // }
  function handlePause() {
    console.log( mediaRecorder.current, 'pause');
    
    mediaRecorder.current?.pause();
  }
  function handleResume() {
    console.log(mediaRecorder, mediaRecorder.current, 'resume');

    mediaRecorder.current?.resume();
  }
  function handleStop() {
    mediaRecorder.current?.stop();
  }
  function handletReplay() {
    if (blobs.current.length === 0 || !playerRef) return;
    const blob = new Blob(blobs.current, {type: "vide/webm"});
    // playerRef?.current?.src = URL.createObjectURL(blob)
    playerRef.current?.play()
  }
  function handleReset() {
    blobs.current = []
    mediaRecorder.current = null
    // playerRef.current = null
  }


  return (
    <>
      <video ref={playerRef} />
      <Button onClick={handleStart}>开始录制</Button>
      <Button onClick={handlePause}>暂停录制</Button>
      <Button onClick={handleResume}>继续录制</Button>
      <Button onClick={handleStop}>结束录制</Button>
      <Button onClick={handletReplay}>播放录制</Button>
      <Button onClick={handleReset}>重置内容</Button>
    </>
  )
}

export default Mediarecorder