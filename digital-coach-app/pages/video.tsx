import { useEffect, useRef } from "react";
import useAuthContext from "@App/lib/auth/AuthContext";
import { useReactMediaRecorder } from "react-media-recorder";
import StorageService from "@App/lib/storage/StorageService";
import { v4 as uuidv4 } from "uuid";
import styles from "@App/styles/VideoPage.module.scss";

export default function VideoPage() {
  const { currentUser, fetchUser } = useAuthContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({ video: true });

  const saveRecording = async () => {
    const getFile = async () => {
      const url = mediaBlobUrl ? mediaBlobUrl : "";
      let blob = await fetch(url).then((res) => res.blob());
      // const blob = new Blob([data as BlobPart], {
      // type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // });
      // const blobPart = new Blob([blob as BlobPart]);
      return new File([blob], "video.mp4");
    };
    const file = await getFile();
    const url = await StorageService.uploadAnswerVideo(file, uuidv4());
    console.log(url);
  };

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  return (
    <div>
      <p className={styles.thing}>{status}</p>
      <div className={styles.videoBox}>
        <video src={mediaBlobUrl!} controls autoPlay loop />
        <video ref={videoRef} controls autoPlay />
      </div>
      <div className={styles.buttonBox}>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
        {mediaBlobUrl && (
          <button onClick={saveRecording}>Save Recording</button>
        )}
      </div>
    </div>
  );
}
