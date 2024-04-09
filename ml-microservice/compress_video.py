import subprocess
import sys

def compress_video(input_file, output_file, target_size_MB):
    
    cmd = ['ffprobe', '-v', 'error', '-show_entries',
           'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', input_file]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    duration_seconds = float(result.stdout)

    
    target_total_bitrate = (target_size_MB * 8 * 1024 * 1024) / duration_seconds

    
    audio_bitrate = 128000
    video_bitrate = target_total_bitrate - audio_bitrate

    
    cmd = ['ffmpeg', '-i', input_file, '-b:v', str(int(video_bitrate)) + 'b',
           '-bufsize', str(int(video_bitrate * 2)) + 'b', '-maxrate', str(int(video_bitrate)) + 'b',
           '-vcodec', 'libx264', '-preset', 'medium', '-b:a', '128k', output_file]

    subprocess.run(cmd)
    
compress_video('google.MOV', 'output.MOV', 400)