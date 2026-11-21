"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";

const DeleteListingDialog = ({
  id,
  title,
}: {
  id: string;
  title: string;
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/studio/${id}`,
      { method: "DELETE" }
    );

    await res.json().catch(() => null);

    if (!res.ok) {
      toast.add({
        type: "error",
        title: "Could not delete listing",
        description: "Please try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Listing deleted successfully.",
      description: `${title} has been removed.`,
    });
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 />
            Delete
          </Button>
        }
      >
        Show Dialog
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{title}&quot; will be removed from Explore and can&apos;t be restored.
            Pending booking requests for it will be cancelled.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep listing</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Yes, delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteListingDialog;
