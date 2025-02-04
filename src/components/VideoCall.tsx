import React, { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, Link, Copy, Check } from 'lucide-react';

// Initialize Agora client
const client: IAgoraRTCClient = AgoraRTC.createClient({ 
  mode: 'rtc', 
  codec: 'vp8'
});

const AGORA_APP_ID = 'd5254e15d07b4169b1d0d2b4bedc07c0';

const VideoCall: React.FC = () => {
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Generate or get meeting ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const meetId = urlParams.get('meetingId');
    if (meetId) {
      setMeetingId(meetId);
    } else {
      // Generate a random meeting ID if not provided
      const newMeetingId = Math.random().toString(36).substring(2, 10);
      setMeetingId(newMeetingId);
    }
  }, []);

  useEffect(() => {
    // Set up event listeners
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        if (remoteVideoTrack) {
          remoteVideoTrack.play(`remote-video-${user.uid}`);
        }
      }
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        if (remoteAudioTrack) {
          remoteAudioTrack.play();
        }
      }
      setUsers(prev => [...prev, user.uid.toString()]);
    });

    client.on('user-unpublished', (user) => {
      setUsers(prev => prev.filter(uid => uid !== user.uid.toString()));
    });

    client.on('user-left', (user) => {
      setUsers(prev => prev.filter(uid => uid !== user.uid.toString()));
    });

    return () => {
      client.removeAllListeners();
      if (isInCall) {
        leaveCall();
      }
    };
  }, []);

  const initializeAgora = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Join the channel using meetingId as channel name
      const generatedUid = await client.join(AGORA_APP_ID, meetingId, null, null);
      console.log('Joined with UID:', generatedUid);
      
      // Create and publish local tracks
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);

      await client.publish([audioTrack, videoTrack]);
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      setIsInCall(true);

      // Play local video
      videoTrack.play('local-video');
      
    } catch (err) {
      setError('Failed to initialize video call. Please check your camera and microphone permissions.');
      console.error('Error initializing video call:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMeetingLink = async () => {
    const meetingLink = `${window.location.origin}${window.location.pathname}?meetingId=${meetingId}`;
    try {
      await navigator.clipboard.writeText(meetingLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy meeting link:', err);
    }
  };

  const leaveCall = async () => {
    try {
      localVideoTrack?.close();
      localAudioTrack?.close();
      await client.leave();
      setIsInCall(false);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setUsers([]);
    } catch (err) {
      console.error('Error leaving call:', err);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Video Call</h2>
          {users.length > 0 && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Users size={16} />
              {users.length} participant{users.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {!isInCall && (
            <button 
              className="btn btn-primary flex items-center gap-2"
              onClick={initializeAgora}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Start Call'}
            </button>
          )}
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={copyMeetingLink}
          >
            {isCopied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Link size={16} />
                Share Link
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Meeting ID display */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Meeting ID: </span>
          <span className="font-mono">{meetingId}</span>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={copyMeetingLink}
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      <div className="relative">
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Video */}
          <div 
            id="local-video" 
            className="w-full h-[300px] bg-gray-800 rounded-lg overflow-hidden relative"
          >
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Camera Off
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {users.map(uid => (
            <div
              key={uid}
              id={`remote-video-${uid}`}
              className="w-full h-[300px] bg-gray-800 rounded-lg overflow-hidden"
            />
          ))}
        </div>

        {/* Controls */}
        {isInCall && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/50 p-3 rounded-full">
            <button
              className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
              onClick={toggleVideo}
            >
              {isVideoEnabled ? 
                <Video className="w-6 h-6 text-white" /> : 
                <VideoOff className="w-6 h-6 text-white" />
              }
            </button>
            <button
              className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
              onClick={toggleAudio}
            >
              {isAudioEnabled ? 
                <Mic className="w-6 h-6 text-white" /> : 
                <MicOff className="w-6 h-6 text-white" />
              }
            </button>
            <button
              className="p-3 rounded-full bg-red-600"
              onClick={leaveCall}
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;