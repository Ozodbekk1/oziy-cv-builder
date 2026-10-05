"use client";

import type { TemplateProps } from './types';
import { useRenderInput } from '@/components/resume/editor/fields';
import { EditableSection, EntryChrome } from '@/components/resume/editor/chrome';

const ClassicSectionHeader = ({ title }: { title: string }) => (
  <div
    data-rb="header"
    className="mb-2 flex items-center gap-2 border-b border-gray-800 pb-1 text-[13px] font-bold uppercase tracking-[0.02em] break-inside-avoid"
  >
    <h2>{title}</h2>
    <div className="h-px flex-1 bg-gray-800" />
  </div>
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

export function ClassicTemplate({
  resumeData,
  isEditing,
  updateField,
  fontFamily = 'Georgia, "Times New Roman", serif',
  sectionOrder = [
    'objective',
    'skills',
    'workExperience',
    'projects',
    'education',
    'certifications',
    'languages',
    'customSections',
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
      className="mx-auto w-full bg-white px-8 py-6 text-[11px] leading-[1.28] text-gray-900"
      style={{
        fontFamily,
        paddingTop: customMargins ? `${customMargins.top}px` : undefined,
        paddingBottom: customMargins ? `${customMargins.bottom}px` : undefined,
        paddingLeft: customMargins ? `${customMargins.left}px` : undefined,
        paddingRight: customMargins ? `${customMargins.right}px` : undefined,
      }}
    >
      <header className="mb-4 border-t border-gray-800 pt-1 text-center break-inside-avoid">
        <h1 className="text-[17px] font-bold">
          {renderInput({
            value: contact.fullName,
            onChange: (value) => updateField('personalDetails', null, 'fullName', value),
            ariaLabel: 'Full name',
          })}
        </h1>
        {(isEditing || resumeData.jobTitle) && (
          <div className="text-[10px] italic">
            {renderInput({
              value: resumeData.jobTitle,
              onChange: (value) => updateField('jobTitle', null, 'jobTitle', value),
              ariaLabel: 'Job title',
            })}
          </div>
        )}
        <div className="mt-0.5 flex flex-wrap justify-center gap-x-1 text-[9px]">
          {[
            ['phone', contact.phone],
            ['email', contact.email],
            ['location', contact.location],
            ['linkedin', contact.linkedin],
            ['website', contact.website],
          ].map(([field, value], index, fields) => (
            <span key={field} className="inline-flex items-center">
              {(isEditing || value) &&
                renderInput({
                  value,
                  onChange: (next) => updateField('personalDetails', null, field, next),
                  type: field === 'email' ? 'mail' : field === 'linkedin' || field === 'website' ? 'link' : undefined,
                  className: 'break-all',
                  ariaLabel: field,
                })}
              {index < fields.length - 1 && (isEditing || value) && <span className="mx-1">|</span>}
            </span>
          ))}
        </div>
      </header>

      {sectionOrder.map((section) => (
        <EditableSection key={section} id={section} className="mb-4 empty:hidden">
          {section === 'objective' && (isEditing || hasContent(resumeData.objective)) && (
            <>
              <ClassicSectionHeader title="Profile" />
              {renderInput({
                value: resumeData.objective,
                onChange: (value) => updateField('objective', null, 'objective', value),
                multiline: true,
                className: 'w-full text-justify',
                ariaLabel: 'Professional profile',
              })}
            </>
          )}

          {section === 'skills' && (isEditing || hasContent(resumeData.skills)) && (
            <>
              <ClassicSectionHeader title="Technical Skills and Strengths" />
              <div className="grid grid-cols-2 gap-x-8">
                {[resumeData.skills.filter((_, index) => index % 2 === 0), resumeData.skills.filter((_, index) => index % 2 === 1)].map(
                  (column, columnIndex) => (
                    <ul key={columnIndex} className="list-disc pl-5">
                      {column.map((skill, index) => (
                        <li key={`${columnIndex}-${index}`} className="relative">
                          <EntryChrome section="skills" index={columnIndex * Math.ceil(resumeData.skills.length / 2) + index} count={resumeData.skills.length} />
                          {renderInput({
                            value: skill.skills || skill.skill || skill.category,
                            onChange: (value) =>
                              updateField('skills', columnIndex * Math.ceil(resumeData.skills.length / 2) + index, 'skills', value),
                            ariaLabel: 'Skill',
                          })}
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </>
          )}

          {section === 'workExperience' && (isEditing || hasContent(resumeData.workExperience)) && (
            <>
              <ClassicSectionHeader title="Experience" />
              <div className="space-y-3">
                {resumeData.workExperience.map((experience, index) => (
                  <div key={index} className="relative break-inside-avoid">
                    <EntryChrome section="workExperience" index={index} count={resumeData.workExperience.length} />
                    <div className="flex items-start justify-between gap-4 font-bold">
                      <div>
                        {renderInput({
                          value: experience.companyName,
                          onChange: (value) => updateField('workExperience', index, 'companyName', value),
                          ariaLabel: 'Company',
                        })}
                        <div className="font-normal italic">
                          {renderInput({
                            value: experience.jobTitle,
                            onChange: (value) => updateField('workExperience', index, 'jobTitle', value),
                            ariaLabel: 'Job title',
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        {(isEditing || experience.location) && renderInput({
                          value: experience.location,
                          onChange: (value) => updateField('workExperience', index, 'location', value),
                          ariaLabel: 'Work location',
                        })}
                        <div className="italic">
                          {renderInput({
                            value: experience.startDate,
                            onChange: (value) => updateField('workExperience', index, 'startDate', value),
                            ariaLabel: 'Employment start date',
                          })}
                          {(isEditing || experience.startDate || experience.endDate) && ' - '}
                          {renderInput({
                            value: experience.endDate,
                            onChange: (value) => updateField('workExperience', index, 'endDate', value),
                            ariaLabel: 'Employment end date',
                          })}
                        </div>
                      </div>
                    </div>
                    {renderInput({
                      value: experience.description,
                      onChange: (value) => updateField('workExperience', index, 'description', value),
                      multiline: true,
                      className: 'mt-0.5 w-full pl-4',
                      ariaLabel: 'Work description',
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'projects' && (isEditing || hasContent(resumeData.projects)) && (
            <>
              <ClassicSectionHeader title="Projects" />
              <div className="space-y-2">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="relative break-inside-avoid">
                    <EntryChrome section="projects" index={index} count={resumeData.projects.length} />
                    <strong>
                      {renderInput({
                        value: project.projectName,
                        onChange: (value) => updateField('projects', index, 'projectName', value),
                        ariaLabel: 'Project name',
                      })}
                    </strong>
                    {renderInput({
                      value: project.description,
                      onChange: (value) => updateField('projects', index, 'description', value),
                      multiline: true,
                      className: 'ml-2',
                      ariaLabel: 'Project description',
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'education' && (isEditing || hasContent(resumeData.education)) && (
            <>
              <ClassicSectionHeader title="Education and Qualifications" />
              <div className="space-y-2">
                {resumeData.education.map((education, index) => (
                  <div key={index} className="relative break-inside-avoid">
                    <EntryChrome section="education" index={index} count={resumeData.education.length} />
                    <strong>
                      {renderInput({
                        value: education.institution,
                        onChange: (value) => updateField('education', index, 'institution', value),
                        ariaLabel: 'Institution',
                      })}
                    </strong>
                    <div>
                      {renderInput({
                        value: education.degree,
                        onChange: (value) => updateField('education', index, 'degree', value),
                        ariaLabel: 'Qualification',
                      })}
                      {(isEditing || education.startDate || education.endDate) && (
                        <span className="ml-1">
                          | {education.startDate}{education.startDate || education.endDate ? ' - ' : ''}
                          {education.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'languages' && (isEditing || hasContent(resumeData.languages)) && (
            <>
              <ClassicSectionHeader title="Languages" />
              {resumeData.languages.map((language, index) => (
                <span key={index}>
                  <EntryChrome section="languages" index={index} count={resumeData.languages.length} />
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

          {section === 'certifications' && (isEditing || hasContent(resumeData.certifications)) && (
            <>
              <ClassicSectionHeader title="Certifications" />
              {resumeData.certifications.map((certification, index) => (
                <div key={index} className="relative">
                  <EntryChrome section="certifications" index={index} count={resumeData.certifications.length} />
                  {renderInput({
                    value: [certification.certificationName, certification.issuingOrganization, certification.issueDate].filter(Boolean).join(' | '),
                    onChange: (value) => updateField('certifications', index, 'certificationName', value),
                    ariaLabel: 'Certification',
                  })}
                </div>
              ))}
            </>
          )}
        </EditableSection>
      ))}
    </div>
  );
}
