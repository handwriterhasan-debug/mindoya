import { useCVContext } from '@/context/CVContext';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Calendar, Briefcase, GraduationCap, Zap, Globe2, Heart, Trophy, PenLine } from 'lucide-react';
import { getPlatformIcon } from '@/components/steps/SocialsStep';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const CVPreview = () => {
  const { data, viewMode } = useCVContext();
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections, design } = data;
  const animated = viewMode === 'animated';
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  const accentColor = design.primaryColor || '#6C5CE7';

  const fontFamily = design.fontStyle === 'classic'
    ? "'Georgia', 'Times New Roman', serif"
    : design.fontStyle === 'minimal'
    ? "'Helvetica Neue', 'Arial', sans-serif"
    : "'DM Sans', 'Plus Jakarta Sans', sans-serif";

  const hasContent = p.fullName || education.length || experience.length || skills.length;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8">
        <div>
          <div className="text-6xl mb-4">📄</div>
          <p className="font-heading font-semibold text-lg">Your CV Preview</p>
          <p className="text-sm mt-1">Start filling in your details to see the preview here</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1] || ''} ${year}`;
  };

  return (
    <div className="bg-white text-gray-900 p-8 max-w-[210mm] mx-auto shadow-xl rounded-lg" id="cv-output" style={{ fontFamily }}>
      {/* Header */}
      <Wrap {...aProps(0)} className="text-center pb-6 mb-6" style={{ borderBottom: `2px solid ${accentColor}20` }}>
        <div className="flex items-center justify-center gap-5">
          {p.profileImage && (
            <Wrap {...aProps(0.1)}>
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0" style={{ boxShadow: `0 0 0 3px ${accentColor}, 0 0 20px ${accentColor}30` }}>
                <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
              </div>
            </Wrap>
          )}
          <div className="text-left">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-base text-gray-500 font-medium mt-1">{p.jobTitle}</p>}
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-xs text-gray-500">
          {p.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.location}</span>}
          {p.website && <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.website}</span>}
        </div>

        {/* Socials */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-3">
            {socials.filter(s => s.url).map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: accentColor }} title={s.platform}>
                {getPlatformIcon(s.platform)}
              </a>
            ))}
          </div>
        )}
      </Wrap>

      {/* Summary */}
      {p.summary && (
        <Wrap {...aProps(0.15)} className="mb-6">
          <p className="text-sm leading-relaxed text-gray-600">{p.summary}</p>
        </Wrap>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-6">
          <SectionTitle icon={Briefcase} title="Experience" color={accentColor} />
          <div className="space-y-4 ml-3 border-l-2 pl-5" style={{ borderColor: accentColor + '30' }}>
            {experience.map((exp, i) => (
              <Wrap key={exp.id} {...aProps(0.25 + i * 0.05)}>
                <div className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
                  <h4 className="font-bold text-sm text-gray-900">{exp.position}</h4>
                  <p className="text-sm font-medium" style={{ color: accentColor }}>{exp.company}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {exp.description && <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              </Wrap>
            ))}
          </div>
        </Wrap>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Wrap {...aProps(0.3)} className="mb-6">
          <SectionTitle icon={GraduationCap} title="Education" color={accentColor} />
          <div className="space-y-4 ml-3 border-l-2 pl-5" style={{ borderColor: accentColor + '30' }}>
            {education.map((edu, i) => (
              <Wrap key={edu.id} {...aProps(0.35 + i * 0.05)}>
                <div className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
                  <h4 className="font-bold text-sm text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4>
                  <p className="text-sm font-medium" style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                    {edu.grade && ` · Grade: ${edu.grade}`}
                    {edu.percentage && ` · ${edu.percentage}`}
                  </p>
                  {edu.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{edu.description}</p>}
                </div>
              </Wrap>
            ))}
          </div>
        </Wrap>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Wrap {...aProps(0.4)} className="mb-6">
          <SectionTitle icon={Zap} title="Skills" color={accentColor} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {skills.map((skill, i) => (
              <Wrap key={skill.id} {...aProps(0.42 + i * 0.03)}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-gray-400">{skill.level}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accentColor }}
                    initial={animated ? { width: 0 } : { width: `${skill.level}%` }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                  />
                </div>
              </Wrap>
            ))}
          </div>
        </Wrap>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Wrap {...aProps(0.5)} className="mb-6">
          <SectionTitle icon={Globe2} title="Languages" color={accentColor} />
          <div className="flex flex-wrap gap-5">
            {languages.map((lang, i) => (
              <Wrap key={lang.id} {...aProps(0.52 + i * 0.05)} className="flex items-center gap-3">
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="6" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke={accentColor} strokeWidth="6"
                      strokeDasharray="264"
                      initial={animated ? { strokeDashoffset: 264 } : { strokeDashoffset: 264 - (264 * lang.level / 100) }}
                      animate={{ strokeDashoffset: 264 - (264 * lang.level / 100) }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">{lang.level}%</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lang.name}</p>
                  <p className="text-xs text-gray-400">{lang.proficiency}</p>
                </div>
              </Wrap>
            ))}
          </div>
        </Wrap>
      )}

      {/* Hobbies */}
      {hobbies.length > 0 && (
        <Wrap {...aProps(0.6)} className="mb-6">
          <SectionTitle icon={Heart} title="Hobbies & Interests" color={accentColor} />
          <div className="flex flex-wrap gap-2">
            {hobbies.map((h) => (
              <span key={h} className="px-3 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: accentColor + '30', color: accentColor }}>{h}</span>
            ))}
          </div>
        </Wrap>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Wrap {...aProps(0.65)} className="mb-6">
          <SectionTitle icon={Trophy} title="Achievements" color={accentColor} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div key={a.id} className="p-3 rounded-lg border" style={{ borderColor: accentColor + '20' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span className="font-bold text-xs text-gray-900">{a.title}</span>
                </div>
                {a.description && <p className="text-xs text-gray-500">{a.description}</p>}
                {a.date && <p className="text-xs text-gray-400 mt-1">{formatDate(a.date)}</p>}
              </div>
            ))}
          </div>
        </Wrap>
      )}

      {/* Custom Sections */}
      {customSections.filter(c => c.title).map((sec, i) => (
        <Wrap key={sec.id} {...aProps(0.7 + i * 0.05)} className="mb-6">
          <SectionTitle icon={PenLine} title={sec.title} color={accentColor} />
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{sec.content}</p>
        </Wrap>
      ))}
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
  <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: color + '15' }}>
    <Icon className="w-4 h-4" style={{ color }} />
    <h3 className="font-bold text-xs uppercase tracking-widest" style={{ color }}>{title}</h3>
  </div>
);

export default CVPreview;
