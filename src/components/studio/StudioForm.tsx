"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, PackageCheck, Plus, Upload } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import type { IStudio } from "@/lib/types/studios";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Other",
];

const amenities = [
  "Cyc wall",
  "Lighting kit",
  "Makeup station",
  "Air conditioning",
  "Wi-Fi",
  "Backup power",
  "Soundproofing",
  "Parking",
];

// Read a selected file and shrink it before storing it in the Image URL field.
const resizeImage = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const image = new window.Image();
      image.onerror = () => resolve(dataUrl);
      image.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(dataUrl);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      };
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });

const StudioForm = ({ studio }: { studio?: IStudio }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [preview, setPreview] = useState({
    title: studio?.title ?? "North Light Cyc Studio",
    location: studio?.location ?? "Dhanmondi, Dhaka",
    hourlyRate: studio?.hourlyRate?.toString() ?? "45",
  });
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState("");

  const ownerName = session?.user?.name ?? studio?.ownerName ?? "";
  const ownerEmail = session?.user?.email ?? studio?.ownerEmail ?? "";
  const allAmenities = [...amenities, ...customAmenities];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(studio?.imageUrl ?? "");
  const [photoPreview, setPhotoPreview] = useState(studio?.imageUrl ?? "");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.add({
        type: "error",
        title: "Unsupported file",
        description: "Please choose a JPG or PNG image.",
      });
      return;
    }

    try {
      const dataUrl = await resizeImage(file);

      // Controlled field: always one value, never appended/duplicated.
      setImageUrl(dataUrl);
      setPhotoPreview(dataUrl);

      toast.add({
        type: "success",
        title: "Photo ready",
        description: "The Image URL field has been filled for you.",
      });
    } catch {
      toast.add({
        type: "error",
        title: "Upload failed",
        description: "We could not read that image. Please try another file.",
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addCustom = () => {
    const value = customValue.trim();
    if (value && !allAmenities.includes(value)) {
      setCustomAmenities([...customAmenities, value]);
    }
    setCustomValue("");
  };

  const getPayload = (formData: FormData) => {
    const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
    const selectedAmenities = formData.getAll("amenities").map(String);

    return {
      ...raw,
      hourlyRate: Number(raw.hourlyRate),
      securityDeposit: Number(raw.securityDeposit),
      maxCapacity: Number(raw.maxCapacity),
      amenities: selectedAmenities,
      ownerName,
      ownerEmail,
    };
  };

  const handleResponse = async (res: Response) => {
    const data = (await res.json().catch(() => null)) as
      | { message?: string; error?: string }
      | null;

    if (!res.ok) {
      toast.add({
        type: "error",
        title: "Could not save studio",
        description:
          data?.message ??
          data?.error ??
          "Please check the form and try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Studio listed successfully. Taking you to your listings.",
      description: "Your listing has been saved.",
    });
    router.push("/my-listings");
  };

  // POST — add a new studio
  const handleAddStudio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-studio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getPayload(formData)),
      });
      await handleResponse(res);
    } catch {
      toast.add({
        type: "error",
        title: "Could not save studio",
        description: "The server did not respond. Please try again.",
      });
    }
  };

  // PATCH — update an existing studio
  const handleUpdateStudio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studio/${studio?._id ?? ""}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getPayload(formData)),
        }
      );
      await handleResponse(res);
    } catch {
      toast.add({
        type: "error",
        title: "Could not save studio",
        description: "The server did not respond. Please try again.",
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <form
        onSubmit={studio ? handleUpdateStudio : handleAddStudio}
        className="grid gap-6"
      >
        <input type="hidden" name="ownerName" value={ownerName} />
        <input type="hidden" name="ownerEmail" value={ownerEmail} />

        {/* Space details */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Space details</h2>
          <div className="mt-5 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="title">Studio title</Label>
              <Input
                id="title"
                name="title"
                className="h-11 rounded-lg border-slate-200 bg-white px-3"
                placeholder="North Light Cyc Studio"
                defaultValue={studio?.title ?? ""}
                onChange={(event) =>
                  setPreview({ ...preview, title: event.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  name="category"
                  defaultValue={studio?.category ?? "Photo Studio"}
                >
                  <SelectTrigger className="h-11 w-full rounded-lg border-slate-200 bg-white">
                    <SelectValue placeholder="Photo Studio" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxCapacity">Max capacity</Label>
                <Input
                  id="maxCapacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  className="h-11 rounded-lg border-slate-200 bg-white px-3"
                  placeholder="12"
                  defaultValue={studio?.maxCapacity ?? ""}
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="0"
                  className="h-11 rounded-lg border-slate-200 bg-white px-3"
                  placeholder="45"
                  defaultValue={studio?.hourlyRate ?? ""}
                  onChange={(event) =>
                    setPreview({ ...preview, hourlyRate: event.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="securityDeposit">Security deposit ($)</Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  min="0"
                  className="h-11 rounded-lg border-slate-200 bg-white px-3"
                  placeholder="100"
                  defaultValue={studio?.securityDeposit ?? ""}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location / address</Label>
              <Input
                id="location"
                name="location"
                className="h-11 rounded-lg border-slate-200 bg-white px-3"
                placeholder="House 14, Road 7, Dhanmondi, Dhaka"
                defaultValue={studio?.location ?? ""}
                onChange={(event) =>
                  setPreview({ ...preview, location: event.target.value })
                }
                required
              />
            </div>
          </div>
        </section>

        {/* Photos */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Photos</h2>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="text"
                className="h-11 rounded-lg border-slate-200 bg-white px-3"
                placeholder="Upload a photo or paste an image URL"
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  setPhotoPreview(event.target.value);
                }}
                required
              />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
                id="studio-photo-upload"
              />
              {photoPreview ? (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={photoPreview}
                    alt="Uploaded preview"
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-orange-100 text-[#ea580c]">
                  <ImagePlus className="size-5" />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {photoPreview ? "Photo uploaded" : "Upload a photo instead"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG or PNG. We&apos;ll fill in the URL for you.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="ml-auto rounded-lg"
              >
                <Upload />
                Choose file
              </Button>
            </div>
          </div>
        </section>

        {/* Amenities & overview */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            Amenities &amp; overview
          </h2>
          <div className="mt-5 grid gap-5">
            <div className="grid gap-2">
              <Label>Amenities</Label>
              <div className="flex flex-wrap items-center gap-2">
                {allAmenities.map((amenity) => (
                  <label key={amenity} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      defaultChecked={studio?.amenities?.includes(amenity) ?? false}
                      className="peer sr-only"
                    />
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground peer-checked:border-orange-400 peer-checked:bg-orange-50 peer-checked:text-orange-700">
                      <Check className="size-3.5 opacity-0 peer-checked:opacity-100" />
                      {amenity}
                    </span>
                  </label>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    aria-label="Custom amenity"
                    className="h-9 w-36 rounded-lg border-slate-200 bg-white px-3 text-xs"
                    placeholder="Custom"
                    value={customValue}
                    onChange={(event) => setCustomValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustom();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustom}
                    className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-xs font-medium text-muted-foreground"
                  >
                    <Plus className="size-3.5" />
                    Add custom
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="overview">Detailed overview</Label>
              <Textarea
                id="overview"
                name="overview"
                className="min-h-36 rounded-lg border-slate-200 bg-white"
                placeholder="A bright corner studio with a seamless white cyc wall and large north-facing windows..."
                defaultValue={studio?.overview ?? ""}
                required
              />
            </div>
          </div>
        </section>

        {/* Host information */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Host information</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Host name</Label>
              <Input readOnly className="h-11 rounded-lg bg-muted" value={ownerName} />
            </div>
            <div className="grid gap-2">
              <Label>Host email</Label>
              <Input
                type="email"
                readOnly
                className="h-11 rounded-lg bg-muted"
                value={ownerEmail}
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-2">
          <Button type="button" variant="outline" className="h-11 rounded-lg px-6">
            Cancel
          </Button>
          <button
            type="submit"
            className={buttonVariants({
              className:
                "h-11 rounded-lg bg-[#f97316] px-6 text-white hover:bg-[#ea580c]",
            })}
          >
            <PackageCheck />
            {studio ? "Edit Studio" : "Add Studio"}
          </button>
        </div>
      </form>

      {/* Live preview */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#dbeafe] to-[#eff6ff]">
            {photoPreview && (
              <Image
                src={photoPreview}
                alt="Studio preview"
                fill
                unoptimized
                sizes="300px"
                className="object-cover"
              />
            )}
            <div className="absolute -top-12 -right-10 size-44 rounded-full bg-white/70" />
            <span className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-foreground uppercase">
              Photo preview
            </span>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold tracking-[0.14em] text-[#ea580c] uppercase">
              Live preview
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              {preview.title || "Your studio title"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {preview.location || "Your location"}
            </p>
            <p className="mt-3 text-xl font-semibold text-foreground">
              ${preview.hourlyRate || "0"}
              <span className="text-xs font-normal text-muted-foreground"> /hr</span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              This is how your card will look on the Explore page.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StudioForm;
