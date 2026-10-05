import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import ResumeView from './resumeView';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LocalResumeView from './localResumeView';

// Types remain the same as in your original code
interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  location: string;
}

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  skillType?: "group" | "individual";
  category: string;
  skills: string;
  skill: string;
}

interface Project {
  projectName: string;
  description: string;
  link: string;
}

interface Language {
  language: string;
  proficiency: string;
}

interface Certification {
  certificationName: string;
  issuingOrganization: string;
  issueDate: string;
}

interface CustomSection {
  sectionTitle: string;
  content: string;
}

interface ResumeData {
  personalDetails: PersonalDetails;
  objective: string;
  jobTitle: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  customSections: CustomSection[];
  accentColor?: string;
  fontFamily?: string;
  sectionOrder?: string[];
  showIcons?: boolean;
  showPhoto?: boolean;
  editorMode?: 'visual' | 'latex';
  latexContent?: string;
  margins?: 'normal' | 'narrow';
  template?: string;
}

async function getResumeData(resumeId: string): Promise<ResumeData | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    console.info('[resume-open] No authenticated user; using local resume storage.');
    return null;
  }
  try {
    const resumeRef = doc(db, `users/${session.user.email}/resumes/${resumeId}`);
    const resumeSnap = await getDoc(resumeRef);
    
    if (!resumeSnap.exists()) {
      return null;
    }
    
    return resumeSnap.data() as ResumeData;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  const resumeData = await getResumeData(resumeId);

  if (!resumeData) {
    return (
      <LocalResumeView resumeId={resumeId} />
    );
  }

  return <ResumeView resumeData={resumeData} resumeId={resumeId} />;
}