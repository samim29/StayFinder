const cloudinary = require("../config/cloudinary.config.js");

/**
 * @description Creates a short-lived Cloudinary signature for an owner image upload.
 * @route GET /api/uploads/signature
 * @access Private - PG owner only
 */
const getUploadSignatureController = (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `stayfinder/pgs/${req.user._id}`;
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET,
  );

  res.status(200).json({
    timestamp,
    folder,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
};

module.exports = { getUploadSignatureController };
