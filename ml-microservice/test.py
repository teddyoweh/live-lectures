from moviepy.editor import *

def convert_mp4_to_mp3(mp4_file, mp3_file):
    video_clip = VideoFileClip(mp4_file)
    audio_clip = video_clip.audio
    audio_clip.write_audiofile(mp3_file)
    audio_clip.close()
    video_clip.close()

convert_mp4_to_mp3('state.mp4', 'output.mp3')
