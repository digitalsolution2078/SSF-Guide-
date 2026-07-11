import type { Metadata } from "next";
import { JobLeavingGuide } from "@/components/job-leaving-guide";

export const metadata: Metadata = {
  title: "Job Leaving Scenario Guide",
  description:
    "जागिर छाड्दा वा अवकाश लिँदा SSF को रकम के हुन्छ — तपाईंको अवस्थाअनुसारको निर्देशित प्रारम्भिक जानकारी।",
};

export default function JobLeavingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        Job Leaving Scenario Guide
      </h1>
      <p className="mt-2 text-gray-600">
        ५ वटा प्रश्नको उत्तर दिनुहोस् — निवृत्तभरण र अवकाश सुविधाको के हुन्छ,
        तपाईंको अवस्थाअनुसार देखिन्छ।
      </p>
      <div className="mt-8">
        <JobLeavingGuide />
      </div>
    </div>
  );
}
