export const uploadToImgBB = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  if (data.success) return data.data.url
  throw new Error('Image upload failed')
}
