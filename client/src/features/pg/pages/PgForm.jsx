import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import LocationPicker from "../components/LocationPicker";
import { pgSchema } from "../validations/pg.validation";
import { usePg } from "../hooks/usePg";
import DiscoveryHeader from "../components/DiscoveryHeader";
import "../pg.scss";
import LoadingState from "../../../components/LoadingState";
import LoadingButtonContent from "../../../components/LoadingButtonContent";

const AMENITIES = ["WiFi", "Meals", "AC", "Laundry", "Power backup", "CCTV"];

const defaults = {
  title: "",
  description: "",
  rent: "",
  roomTypes: ["single"],
  totalBeds: "",
  availableBeds: "",
  address: "",
  lat: "",
  lng: "",
  amenities: [],
  genderPreference: "co-ed",
  contactPhone: "",
  contactEmail: "",
};

const PgForm = () => {
  const { pgId } = useParams();
  const isEditing = Boolean(pgId);
  const navigate = useNavigate();
  const location = useLocation();
  const embedded = location.pathname.startsWith("/dashboard/");
  const [images, setImages] = useState([]);
  const [serverError, setServerError] = useState("");
  const [loadingListing, setLoadingListing] = useState(isEditing);
  const { handleGetPg, handleCreatePg, handleUpdatePg, uploadPgImage } =
    usePg();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(pgSchema),
    defaultValues: defaults,
  });
  const selectedAmenities = watch("amenities");

  useEffect(() => {
    if (!isEditing) return;
    handleGetPg(pgId)
      .then((pg) => {
        reset({
          title: pg.title,
          description: pg.description,
          rent: pg.rent,
          roomTypes: pg.roomTypes,
          totalBeds: pg.totalBeds,
          availableBeds: pg.availableBeds,
          address: pg.address,
          lat: pg.location.coordinates[1],
          lng: pg.location.coordinates[0],
          amenities: pg.amenities,
          genderPreference: pg.genderPreference,
          contactPhone: pg.contact.phone,
          contactEmail: pg.contact.email || "",
        });
        setImages(pg.images || []);
      })
      .catch(() => setServerError("Could not load this listing."))
      .finally(() => setLoadingListing(false));
    // `handleGetPg` is recreated by the shared context hook on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, pgId, reset]);

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const uploadedImages = await Promise.all(
        images.map(async (image) =>
          image.file ? uploadPgImage(image.file) : image,
        ),
      );
      const payload = { ...data, images: uploadedImages, rules: "" };
      if (isEditing) await handleUpdatePg(pgId, payload);
      else await handleCreatePg(payload);
      navigate(`/dashboard`, { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Could not save your listing. Please try again.",
      );
    }
  };

  if (loadingListing)
    return (
      <>
        <main className="pg-page">
        <LoadingState label="Loading listing" />
        </main>
      </>
    );

  return (
    <>
      {!embedded && <DiscoveryHeader />}
      <main className="pg-page">
        <section className="pg-form-card">
          <header className="pg-form-header">
            <span className="brand-mark">SF</span>
            <strong>StayFinder</strong>
          </header>
          <h1>{isEditing ? "Edit PG listing" : "Add a new PG listing"}</h1>
          {serverError && <div className="form-error">{serverError}</div>}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2>Basic details</h2>
            <label>
              PG name
              <input {...register("title")} placeholder="Sunrise Nest PG" />
            </label>
            {errors.title && (
              <p className="field-error">{errors.title.message}</p>
            )}
            <label>
              Description
              <textarea
                {...register("description")}
                placeholder="Tell students what makes this place worth staying in…"
              />
            </label>
            {errors.description && (
              <p className="field-error">{errors.description.message}</p>
            )}
            <div className="two-columns">
              <label>
                Monthly rent (₹)
                <input type="number" {...register("rent")} placeholder="7500" />
              </label>
              <label>
                Room type
                <select {...register("roomTypes.0")}>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </select>
              </label>
              <label>
                Total beds
                <input type="number" {...register("totalBeds")} />
              </label>
              <label>
                Available beds
                <input type="number" {...register("availableBeds")} />
              </label>
            </div>
            {(errors.rent ||
              errors.totalBeds ||
              errors.availableBeds ||
              errors.roomTypes) && (
              <p className="field-error">
                {errors.rent?.message ||
                  errors.totalBeds?.message ||
                  errors.availableBeds?.message ||
                  errors.roomTypes?.message}
              </p>
            )}
            <h2>Location</h2>
            <label>
              Full address
              <input
                {...register("address")}
                placeholder="4th Cross Street, Thillai Nagar, Trichy"
              />
            </label>
            {errors.address && (
              <p className="field-error">{errors.address.message}</p>
            )}
          <div className="two-columns location-coordinates">
              <label>
                Latitude
                <input
                  type="number"
                  step="any"
                  {...register("lat")}
                  placeholder="10.7905"
                />
              </label>
              <label>
                Longitude
                <input
                  type="number"
                  step="any"
                  {...register("lng")}
                  placeholder="78.7047"
                />
              </label>
          </div>
          <LocationPicker lat={watch("lat")} lng={watch("lng")} onChange={({ lat, lng }) => { setValue("lat", lat.toFixed(6), { shouldValidate: true }); setValue("lng", lng.toFixed(6), { shouldValidate: true }); }} />
            {(errors.lat || errors.lng) && (
              <p className="field-error">
                {errors.lat?.message || errors.lng?.message}
              </p>
            )}
            <h2>Amenities</h2>
            <div className="amenity-list">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  className={
                    selectedAmenities.includes(amenity) ? "selected" : ""
                  }
                  onClick={() =>
                    setValue(
                      "amenities",
                      selectedAmenities.includes(amenity)
                        ? selectedAmenities.filter((item) => item !== amenity)
                        : [...selectedAmenities, amenity],
                    )
                  }
                >
                  {amenity}
                </button>
              ))}
            </div>
            <h2>Photos</h2>
            <ImageUploader images={images} onChange={setImages} />
            <h2>Contact</h2>
            <div className="two-columns">
              <label>
                Phone
                <input {...register("contactPhone")} placeholder="9876543210" />
              </label>
              <label>
                Email (optional)
                <input
                  {...register("contactEmail")}
                  placeholder="owner@example.com"
                />
              </label>
            </div>
            {(errors.contactPhone || errors.contactEmail) && (
              <p className="field-error">
                {errors.contactPhone?.message || errors.contactEmail?.message}
              </p>
            )}
            <button
              className="publish-button"
              type="submit"
              disabled={isSubmitting}
            >
            <LoadingButtonContent loading={isSubmitting} loadingLabel="Uploading photos and saving…">{isEditing ? "Save changes" : "Publish listing"}</LoadingButtonContent>
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default PgForm;
