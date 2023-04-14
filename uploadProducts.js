import fs from 'fs'
import { supabase } from './supabase'
import { getFileUrl } from './utils'

const basePath = './loaded'

try {
  fs.readdirSync(basePath).forEach(async file => {
    const baseDir = fs.readdirSync(`${basePath}/${file}`)
    for (const subfile of baseDir) {
      console.log('🚀 ~ file: uploadProducts.js:11 ~ fs.readdirSync ~ subfile:', subfile)
      const [alias] = subfile.split('.')
      const { data } = await supabase.from('product_subcategories').select('id').eq('alias', alias)
      const subcategoryId = data[0].id
      const subcategory = await JSON.parse(fs.readFileSync(`${basePath}/${file}/${subfile}`))
      for (const product of subcategory) {
        const file = fs.readFileSync(product.image)
        const fileName = product.image.split('/').at(-1)
        await supabase.storage.from('products').upload(fileName, file, {
          contentType: 'image/png',
        })
        // console.log(getFileUrl('products', fileName))
        await supabase.from('products').insert({
          ...product,
          image: getFileUrl('products', fileName),
          product_subcategory: subcategoryId
        }).select('*')
      }
    }
  })
} catch (error) {
  console.error(error)
}
