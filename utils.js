export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getFileUrl = (bucket, fileName) => `https://zbgtpwphigiimgkmmvkq.supabase.co/storage/v1/object/public/${bucket}/${fileName}`

export const omit = (obj, keys) => {
  const result = {}
  for (const key in obj) {
    if (keys.includes(key)) {
      continue
    }
    result[key] = obj[key]
  }
  return result
}