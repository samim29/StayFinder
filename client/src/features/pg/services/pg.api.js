import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
/**
 * Fetch a specific pg by its ID
 * @param {string} pgId - The ID of the pg to fetch
 * @returns {Promise} - A promise resolving to the pg data
 */
export async function getPg(pgId) {
  const response = await api.get(`/api/pg/${pgId}/manage`);
  return response.data;
}

/**
 * Fetch all pgs associated with the authenticated user
 * @returns {Promise} - A promise resolving to an array of pgs
 */
export async function getMyPgs() {
  const response = await api.get("/api/pg/mine");
  return response.data;
}
/**
 * Create a new pg listing
 * @param {Object} pgData - The data for the new pg listing
 * @returns {Promise} - A promise resolving to the created pg data
 */
export async function createPg(pgData) {
  const response = await api.post("/api/pg", pgData);
  return response.data;
}

/**
 * Update an existing pg listing
 * @param {string} pgId - The ID of the pg to update
 * @param {Object} pgData - The updated data for the pg listing
 * @returns {Promise} - A promise resolving to the updated pg data
 */
export async function updatePg(pgId, pgData) {
  const response = await api.put(`/api/pg/${pgId}`, pgData);
  return response.data;
}
/**
 * Delete a specific pg listing
 * @param {string} pgId - The ID of the pg to delete
 * @returns {Promise} - A promise resolving to the deletion result
 */
export async function deletePg(pgId) {
  const response = await api.delete(`/api/pg/${pgId}`);
  return response.data;
}

/**
 * Fetch the upload signature for Cloudinary
 * @returns {Promise} - A promise resolving to the upload signature data
 */
export async function getUploadSignature() {
  const response = await api.get("/api/uploads/signature");
  return response.data;
}

/**
 * Upload an image for a pg listing
 * @param {File} file - The image file to upload
 * @returns {Promise} - A promise resolving to the uploaded image data
 */
export async function uploadPgImage(file) {
  const { timestamp, folder, signature, apiKey, cloudName } = await getUploadSignature();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("signature", signature);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
  );

  return { url: response.data.secure_url, publicId: response.data.public_id };
}
