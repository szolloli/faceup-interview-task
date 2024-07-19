import { useReports } from "@/api/reports";
import { Button } from "@/components/ui/button";
import Report from "@/components/Report";
import { useState } from "react";
import ReportModal from "@/components/ReportModal";
import { ReportRead } from "@/api/types";

function ReportsScreen() {
  const { data, isLoading } = useReports();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<ReportRead | undefined>(
    undefined,
  );

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-5xl font-bold">Reports</h1>
      <br />
      <div className="grid w-[50%]">
        <div className="mb-4 justify-self-end">
          <ReportModal
            // Key ensures updating of data inside modal
            key={detailData?.id}
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setDetailData(undefined);
            }}
            data={detailData}
          />
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
          >
            + Create report
          </Button>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-secondary rounded-lg">
          {isLoading
            ? "Loading..."
            : !data || data?.length == 0
            ? "No reports"
            : data?.map((report: ReportRead) => (
                <button
                  key={report.id}
                  onClick={() => {
                    setDetailData(report);
                    setModalOpen(true);
                  }}
                >
                  <Report content={report.content ?? "No content"} />
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}

export default ReportsScreen;
