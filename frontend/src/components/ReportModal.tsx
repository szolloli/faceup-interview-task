import {
  useCreateReportForUser,
  useDeleteReport,
  useUpdateReport,
} from "@/api/reports";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogControls,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleDashed, Edit, Trash, X } from "lucide-react";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { ReportRead } from "@/api/types";

function ReportModal({
  data,
  open,
  onClose,
}: {
  data?: ReportRead | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteReport } = useDeleteReport(data?.id ?? "");
  //  Since there is no way to change users yet, we'll just hardcode the user id to 1
  //  it is the same id as the user in the seed file in the backend app
  const { mutateAsync: createReportForUser, isPending: isCreating } =
    useCreateReportForUser("1");
  const { mutateAsync: updateReport, isPending: isUpdating } = useUpdateReport(
    "1",
    data?.id ?? "",
  );

  const [editing, setEditing] = useState(false);

  const editMode = !!data && editing;
  const createMode = !data;
  const viewMode = !!data && !editMode;

  const [reportData, setReportData] = useState<
    Omit<ReportRead, "id" | "createdAt" | "updatedAt">
  >({
    name: data?.name,
    age: data?.age,
    content: data?.content,
    attachmentURL: data?.attachmentURL,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setEditing(false);
        }
      }}
    >
      <DialogContent onInteractOutside={onClose} className="sm:max-w-[425px]">
        <DialogControls>
          {/* Edit and delete buttons only show when in view mode or edit mode */}
          {(viewMode || editMode) && (
            <>
              <Edit
                onClick={() => setEditing(true)}
                size={16}
                className="text-blue-500"
              />
              <Trash
                size={16}
                className="text-red-500"
                onClick={async () => {
                  await deleteReport();
                  onClose();
                  queryClient.invalidateQueries({ queryKey: ["reports"] });
                }}
              />
            </>
          )}
          <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X onClick={onClose} className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogControls>
        <DialogHeader>
          <div className="flex flex-row justify-between items-center">
            <DialogTitle>
              {createMode ? "Create report" : "Report details"}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-bold">
              Name
            </Label>
            <Input
              onChange={(e) =>
                setReportData({ ...reportData, name: e.target.value })
              }
              disabled={viewMode}
              id="name"
              value={reportData.name}
              className="col-span-3 disabled:border-transparent disabled:opacity-100 disabled:cursor-default"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right font-bold">
              Age
            </Label>
            <Input
              onChange={(e) =>
                setReportData({
                  ...reportData,
                  age:
                    e.target.value === ""
                      ? undefined
                      : parseInt(e.target.value),
                })
              }
              type="number"
              disabled={viewMode}
              id="age"
              value={reportData.age ?? ""}
              className="col-span-3 disabled:border-transparent disabled:opacity-100 disabled:cursor-default"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right font-bold">
              Content
            </Label>
            <Input
              onChange={(e) =>
                setReportData({ ...reportData, content: e.target.value })
              }
              disabled={viewMode}
              id="content"
              value={reportData.content}
              className="col-span-3 disabled:border-transparent disabled:opacity-100 disabled:cursor-default"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right font-bold">
              Attachment
            </Label>

            {viewMode ? (
              data?.attachmentURL ? (
                <a
                  href={data?.attachmentURL as string}
                  target="_blank"
                  className="text-sm ml-3"
                >
                  Download
                </a>
              ) : (
                <p className="text-sm ml-3">None</p>
              )
            ) : (
              <Input
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    attachmentURL: e.target.files
                      ? e.target.files[0]
                      : undefined,
                  })
                }
                id="picture"
                type="file"
                className="col-span-3 disabled:border-transparent disabled:opacity-100 disabled:cursor-default"
              />
            )}
          </div>
        </div>
        {!viewMode && (
          <DialogFooter>
            {editMode && (
              <Button
                type="reset"
                variant={"secondary"}
                onClick={() => {
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="w-32"
              disabled={
                !reportData.name || !reportData.age || !reportData.content
              }
              onClick={async () => {
                if (!reportData.name || !reportData.age || !reportData.content)
                  return;

                const formData = new FormData();
                formData.append("name", reportData.name);
                formData.append("age", reportData.age.toString());
                formData.append("content", reportData.content);
                if (typeof reportData.attachmentURL === "object") {
                  // If the attachment is a file, we need to append it to the form data
                  // otherwise it's undefined or string which means there was no change to the attachment
                  formData.append(
                    "attachment",
                    reportData.attachmentURL as Blob,
                  );
                }
                if (createMode) {
                  await createReportForUser(formData);
                } else if (editMode) {
                  await updateReport(formData);
                }
                onClose();
                queryClient.invalidateQueries({ queryKey: ["reports"] });
              }}
            >
              {isUpdating || isCreating ? (
                <CircleDashed className=" h-4 w-4 animate-spin" />
              ) : createMode ? (
                "Create report"
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReportModal;
