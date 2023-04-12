import asyncio
import glob
import json
import os
import shutil
import requests
from slugify import slugify

shutil.rmtree('images')
shutil.rmtree('loaded')
os.makedirs('images', exist_ok=True)
os.makedirs('loaded', exist_ok=True)

async def getImages():
   for filename in glob.glob('data/**/*.json'):
      with open(os.path.join(os.getcwd(), filename), 'r') as f:
         new_filename: list = filename.split('/')
         os.makedirs(f'loaded/{new_filename[1]}', exist_ok=True)
         new_filename.pop(0)
         with open(os.path.join(os.getcwd(), 'loaded/', '/'.join(new_filename)), 'w+') as f2:
            editedArray = []
            data = json.load(f)
            for item in data:
               try:
                  response = requests.get(item['image'])
                  slugifiedTitle = slugify(item['title_ro']) 
                  print("🐍 File: products-parser/images-downloader.py | Line: 21 ~ slugifiedTitle", slugifiedTitle)
                  item['image'] = f'./images/{slugifiedTitle}.png'
                  editedArray.append(item) 
                  with open(f"./images/{slugifiedTitle}.png", "wb") as f:
                     f.write(response.content)
               except:
                  print('Error')
            print(editedArray)
            f2.write(json.dumps(editedArray, indent=2, ensure_ascii=False))
            f2.close()
               
asyncio.run(getImages())