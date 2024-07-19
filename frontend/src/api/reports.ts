import { useMutation, useQuery } from "@tanstack/react-query";
import { ReportRead } from "./types";

const endpoints = {
  reports: `${process.env.API_BASE_URL}/api/v1/reports`,
  users: `${process.env.API_BASE_URL}/api/v1/users`,
};

// Get all reports of all users
export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch(endpoints.reports, {
        method: "GET",
      });
      return (await response.json()) as ReportRead[];
    },
  });
}

// Get all reports of a specific user
export function useUserReports(userId: string) {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch(`endpoints.users/${userId}/reports`, {
        method: "GET",
      });
      return (await response.json()) as ReportRead[];
    },
  });
}

// Get a specific report of any user
export function useReport(id: string) {
  return useQuery({
    queryKey: ["report", { id: id }],
    queryFn: async () => {
      const response = await fetch(`${endpoints.reports}/${id}`, {
        method: "GET",
      });
      return (await response.json()) as ReportRead;
    },
  });
}

// Create a new report for a specific user
export function useCreateReportForUser(id: string) {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`${endpoints.users}/${id}/reports`, {
        method: "POST",
        body: data,
      });
      return await response.json();
    },
  });
}

// Update a specific report of a specific user
export function useUpdateReport(userId: string, reportId: string) {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(
        `${endpoints.users}/${userId}/reports/${reportId}`,
        {
          method: "PUT",
          body: data,
        },
      );
      return await response.json();
    },
  });
}

// Delete a report of any user
export function useDeleteReport(id: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${endpoints.reports}/${id}`, {
        method: "DELETE",
      });
      return await response.json();
    },
  });
}
