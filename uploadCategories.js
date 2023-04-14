import fs from 'fs'
import categories from './loaded-categories.json'
import { supabase } from './supabase'
import { getFileUrl, omit } from './utils'

const setCategories = async () => {
  categories.forEach(async (category) => {
    const categoryRes = await supabase.from('product_categories').insert(omit(category, ['subcategories'])).select()
    category.subcategories.forEach(async (subcategory) => {
      const file = fs.readFileSync(subcategory.image)
      const fileName = subcategory.image.split('/').at(-1)
      await supabase.storage.from('product_subcategories').upload(fileName, file, {
        contentType: 'image/jpeg',
      })
      const subcategoryRes = await supabase.from('product_subcategories').insert({
        ...omit(subcategory, ['image']),
        product_category: categoryRes.data[0].id,
        image: getFileUrl('product_subcategories', fileName)
      })
    })
  })
}

setCategories()