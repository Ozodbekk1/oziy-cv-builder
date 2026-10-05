"use client";

import type { TemplateProps } from './types';
import { useRenderInput } from '@/components/resume/editor/fields';
import { EditableSection, EntryChrome } from '@/components/resume/editor/chrome';

const BLUE = '#2f6699';

const EngineeringHeading = ({ title }: { title: string }) => (
  <h2
    data-rb="header"
    className="mb-2 text-[17px] font-normal leading-tight break-inside-avoid"
    style={{ color: BLUE }}
  >
    {title}
  </h2>
);

const hasContent = (value: unknown): boolean => {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    return Object.values(value).some((item) =>
      typeof item === 'string' ? item.trim() !== '' : Boolean(item)
    );
  }
  return typeof value === 'string' ? value.trim() !== '' : Boolean(value);
};

export function EngineeringTemplate({
  resumeData,
  isEditing,
  updateField,
  fontFamily = 'Arial, Helvetica, sans-serif',
  sectionOrder = [
    'education',
    'workExperience',
    'projects',
    'customSections',
    'certifications',
    'skills',
    'languages',
  ],
  customMargins,
}: TemplateProps & {
  accentColor?: string;
  fontFamily?: string;
  sectionOrder?: string[];
  showIcons?: boolean;
  showPhoto?: boolean;
  customMargins?: { top: number; bottom: number; left: number; right: number };
  isPrint?: boolean;
}) {
  const renderInput = useRenderInput(isEditing);
  const contact = resumeData.personalDetails;

  return (
    <div
      className="mx-auto w-full bg-white px-10 py-7 text-[12px] leading-[1.3] text-[#151515]"
      style={{
        fontFamily,
        paddingTop: customMargins ? `${customMargins.top}px` : undefined,
        paddingBottom: customMargins ? `${customMargins.bottom}px` : undefined,
        paddingLeft: customMargins ? `${customMargins.left}px` : undefined,
        paddingRight: customMargins ? `${customMargins.right}px` : undefined,
      }}
    >
      <header className="mb-5 break-inside-avoid">
        <div className="flex items-start justify-between gap-8">
          <div className="min-w-0">
            <h1 className="text-[28px] font-normal leading-none">
              {renderInput({
                value: contact.fullName,
                onChange: (value) => updateField('personalDetails', null, 'fullName', value),
                ariaLabel: 'Full name',
              })}
            </h1>
            <div className="mt-1 text-[17px] font-medium">
              {renderInput({
                value: [resumeData.jobTitle, contact.location].filter(Boolean).join(' | '),
                onChange: (value) => updateField('jobTitle', null, 'jobTitle', value),
                ariaLabel: 'Job title and location',
              })}
            </div>
          </div>
          <div className="shrink-0 text-right text-[14px]" style={{ color: BLUE }}>
            {(isEditing || contact.github || contact.website) && renderInput({
              value: contact.github || contact.website,
              onChange: (value) => updateField('personalDetails', null, contact.github ? 'github' : 'website', value),
              type: 'link',
              ariaLabel: 'Portfolio or GitHub URL',
            })}
            {(isEditing || resumeData.skills.length > 0) && (
              <div className="mt-2 max-w-[260px] text-[13px] leading-tight text-[#151515]">
                {resumeData.skills
                  .slice(0, 4)
                  .map((skill) => skill.skills || skill.skill || skill.category)
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
          </div>
        </div>
      </header>

      {sectionOrder.map((section) => (
        <EditableSection key={section} id={section} className="mb-5 empty:hidden">
          {section === 'objective' && (isEditing || hasContent(resumeData.objective)) && (
            <>
              <EngineeringHeading title="Profile" />
              {renderInput({
                value: resumeData.objective,
                onChange: (value) => updateField('objective', null, 'objective', value),
                multiline: true,
                className: 'w-full',
                ariaLabel: 'Professional profile',
              })}
            </>
          )}

          {section === 'education' && (isEditing || hasContent(resumeData.education)) && (
            <>
              <EngineeringHeading title="Education" />
              <div className="space-y-2">
                {resumeData.education.map((education, index) => (
                  <div key={index} className="relative break-inside-avoid">
                    <EntryChrome section="education" index={index} count={resumeData.education.length} />
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <div className="text-[15px] font-medium">
                          {renderInput({
                            value: education.institution,
                            onChange: (value) => updateField('education', index, 'institution', value),
                            ariaLabel: 'Institution',
                          })}{' '}
                          {renderInput({
                            value: education.degree,
                            onChange: (value) => updateField('education', index, 'degree', value),
                            ariaLabel: 'Degree',
                          })}
                        </div>
                        {renderInput({
                          value: education.description,
                          onChange: (value) => updateField('education', index, 'description', value),
                          multiline: true,
                          className: 'mt-1 w-full',
                          ariaLabel: 'Education details',
                        })}
                      </div>
                      <div className="shrink-0 text-right italic">
                        {education.startDate}{education.startDate || education.endDate ? ' - ' : ''}{education.endDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'workExperience' && (isEditing || hasContent(resumeData.workExperience)) && (
            <>
              <EngineeringHeading title="Experience" />
              <div className="space-y-2">
                {resumeData.workExperience.map((experience, index) => (
                  <div key={index} className="relative break-inside-avoid">
                    <EntryChrome section="workExperience" index={index} count={resumeData.workExperience.length} />
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <div className="text-[15px] font-medium">
                          {renderInput({
                            value: experience.jobTitle,
                            onChange: (value) => updateField('workExperience', index, 'jobTitle', value),
                            ariaLabel: 'Job title',
                          })}
                          {experience.companyName && `, ${experience.companyName}`}
                        </div>
                        {renderInput({
                          value: experience.description,
                          onChange: (value) => updateField('workExperience', index, 'description', value),
                          multiline: true,
                          className: 'mt-0.5 w-full pl-4',
                          ariaLabel: 'Experience details',
                        })}
                      </div>
                      <div className="shrink-0 text-right italic">
                        {experience.startDate}{experience.startDate || experience.endDate ? ' - ' : ''}{experience.endDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'projects' && (isEditing || hasContent(resumeData.projects)) && (
            <>
              <EngineeringHeading title="Projects" />
              <div className="space-y-2">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="relative break-inside-avoid">
                    <EntryChrome section="projects" index={index} count={resumeData.projects.length} />
                    <div className="text-[15px] font-medium">
                      <span style={{ color: BLUE }}>
                        {renderInput({
                          value: project.projectName,
                          onChange: (value) => updateField('projects', index, 'projectName', value),
                          ariaLabel: 'Project name',
                        })}
                      </span>
                      {project.link && `, ${project.link}`}
                    </div>
                    {renderInput({
                      value: project.description,
                      onChange: (value) => updateField('projects', index, 'description', value),
                      multiline: true,
                      className: 'mt-0.5 w-full pl-4',
                      ariaLabel: 'Project details',
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'customSections' && resumeData.customSections.map((custom, index) => (
            <div key={index} className="relative mb-5 break-inside-avoid">
              <EngineeringHeading title={custom.sectionTitle || 'Awards & Honors'} />
              {renderInput({
                value: custom.content,
                onChange: (value) => updateField('customSections', index, 'content', value),
                multiline: true,
                className: 'w-full pl-4',
                ariaLabel: custom.sectionTitle || 'Custom section',
              })}
            </div>
          ))}

          {section === 'certifications' && (isEditing || hasContent(resumeData.certifications)) && (
            <>
              <EngineeringHeading title="Certifications" />
              {resumeData.certifications.map((certification, index) => (
                <div key={index} className="relative">
                  <EntryChrome section="certifications" index={index} count={resumeData.certifications.length} />
                  {renderInput({
                    value: [certification.certificationName, certification.issuingOrganization, certification.issueDate]
                      .filter(Boolean)
                      .join(' | '),
                    onChange: (value) => updateField('certifications', index, 'certificationName', value),
                    ariaLabel: 'Certification',
                  })}
                </div>
              ))}
            </>
          )}

          {section === 'skills' && (isEditing || hasContent(resumeData.skills)) && (
            <>
              <EngineeringHeading title="Skills" />
              {renderInput({
                value: resumeData.skills.map((skill) => skill.skills || skill.skill || skill.category).filter(Boolean).join(', '),
                onChange: (value) => updateField('skills', 0, 'skills', value),
                ariaLabel: 'Skills',
              })}
            </>
          )}

          {section === 'languages' && (isEditing || hasContent(resumeData.languages)) && (
            <>
              <EngineeringHeading title="Languages" />
              {resumeData.languages.map((language, index) => (
                <span key={index}>
                  {renderInput({
                    value: `${language.language}${language.proficiency ? ` (${language.proficiency})` : ''}`,
                    onChange: (value) => updateField('languages', index, 'language', value),
                    ariaLabel: 'Language',
                  })}
                  {index < resumeData.languages.length - 1 && ', '}
                </span>
              ))}
            </>
          )}
        </EditableSection>
      ))}
    </div>
  );
}
