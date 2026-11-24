import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import DeleteListingDialog from "@/components/studio/DeleteListingDialog";
import type { IStudio } from "@/types/StudioType";

const MyStudioListingList = ({ studios }: { studios: IStudio[] }) => {
  if (studios.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-base font-semibold text-slate-900">
          No studio listings yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first studio to start receiving booking requests.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/add-studio" />}
          className="mt-5 bg-[#f97316] text-white hover:bg-[#ea580c]"
        >
          Add New Studio
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[minmax(0,2fr)_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <span>Studio</span>
            <span>Category</span>
            <span>Rate</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {studios.map((studio) => (
            <div
              key={studio._id}
              className="grid grid-cols-[minmax(0,2fr)_1fr_0.8fr_0.8fr_1fr] items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={studio.imageUrl}
                    alt={studio.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {studio.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {studio.location}
                  </p>
                </div>
              </div>

              <div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {studio.category}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-900">
                ${studio.hourlyRate}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  / hr
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                <span className="size-1.5 rounded-full bg-green-600" />
                Live
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  nativeButton={false}
                  render={<Link href={`/studios/edit/${studio._id}`} />}
                  variant="outline"
                  className="rounded-lg text-xs"
                >
                  <Pencil />
                  Update
                </Button>
                <DeleteListingDialog id={studio._id} title={studio.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyStudioListingList;
