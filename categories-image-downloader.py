import asyncio
import json
import os
import shutil

import requests
from slugify import slugify

shutil.rmtree('subcategories-images', ignore_errors=True)
os.makedirs('subcategories-images', exist_ok=True)

async def getImages():
   with open ('categories.json', 'r') as f:
      categories: list = json.load(f)
      newCategories = []
      for category_index, category in enumerate(categories):
         newCategory = {
            **category,
            'subcategories': []
         }
         for subcategory_index, subcategory in enumerate(category['subcategories']):
            response = requests.get(subcategory['image'])
            slugifiedTitle = slugify(subcategory['title_ro']) 
            subcategory['image'] = f'./subcategories-images/{slugifiedTitle}.png'
            newCategory['subcategories'].append(subcategory) 
            with open(f"./subcategories-images/{slugifiedTitle}.png", "wb") as image:
               image.write(response.content)
            print(subcategory['image'])
         newCategories.append(newCategory)
      with open('loaded-categories.json', 'w') as f:
         json.dump(newCategories, f, indent=2, ensure_ascii=False)
            
asyncio.run(getImages())