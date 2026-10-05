"use client";

import { useEffect, useState } from 'react';
import { getLocalResume } from '@/lib/localResumes';
import ResumeView from './resumeView';
import type { ResumeData } from '@/components/resume/templates/types';

export default function LocalResumeView({ resumeId }: { resumeId: string }) {
  const [resume, setResume] = useState<ReturnType<typeof getLocalResume> | undefined>();

  useEffect(() => {
    const localResume = getLocalResume(resumeId);
    console.info('[resume-open] Local resume lookup:', resumeId, Boolean(localResume));
    setResume(localResume);
  }, [resumeId]);

  if (resume === undefined) return <div className="min-h-[80vh] p-8 text-center">Loading resume…</div>;
  if (!resume) {
    return (
      <div className="min-h-[80vh] p-8 text-center">
        <p className="text-gray-600">No resume data found.</p>
        <p className="text-sm text-gray-500">This resume may have been created in another browser.</p>
      </div>
    );
  }
  return <ResumeView resumeData={resume.data as ResumeData} resumeId={resumeId} />;
}
