import { supabase } from './supabase'

(async () => {
  const { data: products } = await supabase.from("products").select(("*"))
  const duplicatesIds = []
  products.forEach(async (product) => {
    products.some((p, i) => {
      if (p.id !== product.id && p.title_ru === product.title_ru) {
        duplicatesIds.push(product.id)
        return true
      }
    })
  })
  console.log('🚀 ~ file: deleteDuplicates.js:6 ~ duplicatesIds:', duplicatesIds)
  for (const id of duplicatesIds) {
    console.log('🚀 ~ file: deleteDuplicates.js:9 ~ id', id)
    const { error, data } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    console.log('🚀 ~ file: deleteDuplicates.js:11 ~ data', data)
    console.log('🚀 ~ file: deleteDuplicates.js:12 ~ error', error)
  }
})()