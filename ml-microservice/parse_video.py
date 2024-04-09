from cache_base import Cache
import os
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from moviepy.editor import *


class ParseVideo:
    def __init__(self, video_path):
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
        self.cached_folder = "cached"
        self.cached_folder = "cached"
        self.model_cache_file = os.path.join(self.cached_folder, "model_cache.pkl")
        self.processor_cache_file = os.path.join(self.cached_folder, "processor_cache.pkl")


        os.makedirs(self.cached_folder, exist_ok=True)

        

        self.model_cache = Cache(self.model_cache_file)
        processor_cache = Cache(self.processor_cache_file)

        

        self.loaded_model = self.model_cache.load()
        self.loaded_processor = processor_cache.load()
        self.convert_video_to_audio(video_path, 'state.mp3')
    def convert_video_to_audio(self,video_path, audio_path):
        video_clip = VideoFileClip(video_path)
        audio_clip = video_clip.audio
        audio_clip.write_audiofile(audio_path)
        audio_clip.close()
        video_clip.close()
    def run(self, audio_file="state.mp3"):
        print("Running")
        pipe = pipeline(
            "automatic-speech-recognition",
            model=self.loaded_model,
            tokenizer=self.loaded_processor.tokenizer,
            feature_extractor=self.loaded_processor.feature_extractor,
            max_new_tokens=128,
            torch_dtype=self.torch_dtype,
            device=self.device,
        )
        x = pipe(audio_file)
        return x['text']

driver = ParseVideo('google.MOV')
out = driver.run()
print(out)

open('output1.txt', 'w').write(out)