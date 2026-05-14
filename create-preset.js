const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dlwrrxcjg',
  api_key: '658441217362522',
  api_secret: 'xQHAQAWWEbQPw72C65s_kEL1yH0',
});

async function createPreset() {
  try {
    const result = await cloudinary.api.create_upload_preset({
      name: "unsigned_preset",
      unsigned: true,
      folder: "invitations",
    });
    console.log("Preset created:", result);
  } catch (error) {
    if (error && error.error && error.error.message && error.error.message.includes('already exists')) {
        console.log("Preset already exists");
    } else {
        console.error("Error creating preset:", error);
    }
  }
}
createPreset();
