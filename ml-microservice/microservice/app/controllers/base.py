from openai import OpenAI
from app.controllers.text import data_source
from elevenlabs import play,Voice,save
from elevenlabs.client import ElevenLabs
import cloudinary.uploader
import requests
from tempfile import NamedTemporaryFile
import os
cloudinary.config(
    cloud_name = os.getenv("cloudinary_cloud_name"),
    api_secret=os.getenv("cloudinary_api_secret"),
    api_key=os.getenv("cloudinary_api_key")
)

 
elevenlabs_client = ElevenLabs(
  api_key=os.getenv("elevenlabs_api_key"),  
)
print(os.getenv("elevenlabs_api_key"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


 
elevenlabs_client = ElevenLabs(
  api_key=elevenlabs_api_key,  
)
 
client = OpenAI(api_key=OPENAI_API_KEY)

 
def prcoess_transcript(text,body):
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that returns summary, actions items, todo, questions, reminders (such as date)."},
        {"role": "user", "content": f"this is the transcript of the conversation -{text}"},
        {"role": "system", "content": "Please summarize the conversation and provide action items, todo, questions, and reminders in this json format. {'summary: , action_items: , todo: , questions: , reminders: }"},
        {"role": "user", "content": "the summary should be conscise and to the point, the action items should be an array of short key stuff mentioned, the todo should be only key details mentioned in the transcript of things to do stated by the speaker do not make up todos, the questions should only key questions that what asked in the transcript, the reminders should be clear and actionable, questions should be in this format [{'questions:'','answers:''}], have the question and the answer to the question ensure to task inivatatin and not just answer the question, but say why & how, be creative and innovative the answers, make the reminders be in a hashmap, description,time,day of week,day(number),year,month."},
            {"role": "user", "content": f"this prior and data of the converation leading up to present transcript - {body} keep the summary in arrays each element should be a concise simplified explaination of the transcript, and summary transcripts with more and current converstatin transcript"},

        {"role": "system", "content": "only add the the overall hashmap, do not take anything out "},

    
    ],
        response_format={ "type": "json_object" },
        max_tokens=1000,
    )
    return eval(response.choices[0].message.content)



def generate_roadmap(text):
    formaz = """
    "path": [
			{
				"group",
				"objectives": [
					{
         title:'',
         topics:[]
         ....
    """
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that returns a roadmap of any topic from zero to hero, be very very broad like cover every all the essesntila topics and advnaced topic within that field, like from absolute beginner to PHD level advanced. make it very detailed,ensure every single thing in that field is listed, perfectely concise, and highly innovative and easy to understand. "},
        {"role": "user", "content": f"this is the top -{text}"},
        {"role": "system", "content": f"Please provide a roadmap in a tree format, in this json format, ensure the json is always complete. {formaz}"},
    ],
        response_format={ "type": "json_object" },
        max_tokens=3000,
    )
    
    ans = response.choices[0].message.content
    print(ans)
    return eval(ans)

def generate_audio(text):
    print('Generating audio for:', text)
    try:
        audio = elevenlabs_client.generate(
            text=text,
            voice=Voice(
                voice_id='TWUKKXAylkYxxlPe4gx0',
            )
        )

        with NamedTemporaryFile(suffix='.mp3', delete=False) as temp_audio_file:
            save(audio, temp_audio_file.name)
            temp_audio = temp_audio_file.name

        response = cloudinary.uploader.upload(temp_audio,
                                               resource_type="video",
                                               upload_preset="e4rpkaay")
        print('Audio uploaded to Cloudinary:', response['secure_url'])
        return response['secure_url']
    except Exception as e:
        print('Failed to generate and upload audio to Cloudinary:', e)
def ask_video(text):
    response = client.chat.completions.create(
    model="gpt-4-turbo-preview",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that answers a question based of the transcript of a video., also make a very casual, smart response sound very human, use uhh, ahhs or umms return the answer in a json format. {'answer': str(), human_readable_answer: ''}"},
        {"role": "system", "content": f"this the video transcript, {data_source}"},
        
                {"role": "user", "content": f"this is the question -{text}"},
                 
    
    ],
        response_format={ "type": "json_object" },
        max_tokens=1000,
    )
    
    ans = response.choices[0].message.content
    print(ans)
    xa = eval(ans)
    if('roadmap' in text):
        xa['roadmap_status'] = 'true'
    else:
        xa['audioUrl'] = generate_audio(xa['human_readable_answer'])
    return xa