import { useCVContext } from '@/context/CVContext';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Calendar, Briefcase, GraduationCap, Zap, Globe2, Heart, Trophy, PenLine } from 'lucide-react';
import { getPlatformIcon } from '@/components/steps/SocialsStep';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const getFontFamily = (style: string) => {
  const fonts: Record<string, string> = {
    modern: "'DM Sans', 'Plus Jakarta Sans', sans-serif",
    classic: "'Georgia', 'Times New Roman', serif",
    mono: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    elegant: "'Playfair Display', 'Georgia', serif",
    bold: "'Plus Jakarta Sans', 'Arial Black', sans-serif",
    minimal: "'Helvetica Neue', 'Arial', sans-serif",
    corporate: "'Calibri', 'Segoe UI', sans-serif",
    creative: "'DM Sans', 'Futura', sans-serif",
  };
  return fonts[style] || fonts.modern;
};

const CVPreview = () => {
  const { data, viewMode } = useCVContext();
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections, design } = data;
  const animated = viewMode === 'animated';
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  const color = design.primaryColor || '#6C5CE7';
  const fontFamily = getFontFamily(design.fontStyle);
  const spacingClass = design.spacing === 'compact' ? 'space-y-3' : design.spacing === 'spacious' ? 'space-y-8' : 'space-y-5';
  const sectionSpacing = design.spacing === 'compact' ? 'mb-4' : design.spacing === 'spacious' ? 'mb-8' : 'mb-6';
  const padding = design.spacing === 'compact' ? 'p-6' : design.spacing === 'spacious' ? 'p-10' : 'p-8';

  const hasContent = p.fullName || education.length || experience.length || skills.length;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-96 text-center p-8">
        <div>
          <div className="text-5xl mb-3">📄</div>
          <p className="font-heading font-semibold text-base text-foreground">Your CV Preview</p>
          <p className="text-xs text-muted-foreground mt-1">Start filling in your details to see the live preview</p>
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

  const showPhoto = design.photoStyle !== 'hidden' && p.profileImage;
  const photoRadius = design.photoStyle === 'square' ? '12px' : '50%';

  return (
    <div className={`bg-white text-gray-900 ${padding} max-w-[210mm] mx-auto shadow-xl rounded-lg`} id="cv-output" style={{ fontFamily }}>
      {/* Header */}
      <Wrap {...aProps(0)} className={sectionSpacing} style={{ borderBottom: `2px solid ${color}15`, paddingBottom: '20px' }}>
        <div className="flex items-center gap-5">
          {showPhoto && (
            <Wrap {...aProps(0.1)}>
              <div className="w-20 h-20 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, boxShadow: `0 0 0 3px ${color}, 0 4px 16px ${color}25` }}>
                <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
              </div>
            </Wrap>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight" style={{ color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {p.fullName || 'Your Name'}
            </h1>
            {p.jobTitle && <p className="text-sm text-gray-500 font-medium mt-0.5">{p.jobTitle}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-500">
              {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color }} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color }} />{p.phone}</span>}
              {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color }} />{p.location}</span>}
              {p.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color }} />{p.website}</span>}
            </div>
          </div>
        </div>

        {socials.length > 0 && (
          <div className="flex items-center gap-3 mt-3">
            {socials.filter(s => s.url).map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color }} title={s.platform}>
                {getPlatformIcon(s.platform)}
              </a>
            ))}
          </div>
        )}
      </Wrap>

      {/* Summary */}
      {p.summary && (
        <Wrap {...aProps(0.15)} className={sectionSpacing}>
          <p className="text-xs leading-relaxed text-gray-600">{p.summary}</p>
        </Wrap>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Wrap {...aProps(0.2)} className={sectionSpacing}>
          <SectionTitle icon={Briefcase} title="Experience" color={color} />
          <div className="space-y-4 ml-3 border-l-2 pl-5" style={{ borderColor: color + '25' }}>
            {experience.map((exp, i) => (
              <Wrap key={exp.id} {...aProps(0.25 + i * 0.05)}>
                <div className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: color }} />
                  <h4 className="font-bold text-sm text-gray-900">{exp.position}</h4>
                  <p className="text-xs font-semibold" style={{ color }}>{exp.company}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5" />
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {exp.description && <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              </Wrap>
            ))}
          </div>
        </Wrap>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Wrap {...aProps(0.3)} className={sectionSpacing}>
          <SectionTitle icon={GraduationCap} title="Education" color={color} />
          <div className="space-y-4 ml-3 border-l-2 pl-5" style={{ borderColor: color + '25' }}>
            {education.map((edu, i) => (
              <Wrap key={edu.id} {...aProps(0.35 + i * 0.05)}>
                <div className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: color }} />
                  <h4 className="font-bold text-sm text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4>
                  <p className="text-xs font-semibold" style={{ color }}>{edu.institution}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                    {edu.grade && ` · Grade: ${edu.grade}`}
                    {edu.percentage && ` · ${edu.percentage}`}
                  </p>
                  {edu.description && <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{edu.description}</p>}
                </div>
              </Wrap>
            ))}
          </div>
        </Wrap>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Wrap {...aProps(0.4)} className={sectionSpacing}>
          <SectionTitle icon={Zap} title="Skills" color={color} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {skills.map((skill, i) => (
              <Wrap key={skill.id} {...aProps(0.42 + i * 0.03)}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-gray-400 text-[10px]">{skill.level}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
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
        <Wrap {...aProps(0.5)} className={sectionSpacing}>
          <SectionTitle icon={Globe2} title="Languages" color={color} />
          <div className="flex flex-wrap gap-5">
            {languages.map((lang, i) => (
              <Wrap key={lang.id} {...aProps(0.52 + i * 0.05)} className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="7" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="7"
                      strokeDasharray="264"
                      initial={animated ? { strokeDashoffset: 264 } : { strokeDashoffset: 264 - (264 * lang.level / 100) }}
                      animate={{ strokeDashoffset: 264 - (264 * lang.level / 100) }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700">{lang.level}%</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{lang.name}</p>
                  <p className="text-[10px] text-gray-400">{lang.proficiency}</p>
                </div>
              </Wrap>
            ))}
          </div>
        </Wrap>
      )}

      {/* Hobbies */}
      {hobbies.length > 0 && (
        <Wrap {...aProps(0.6)} className={sectionSpacing}>
          <SectionTitle icon={Heart} title="Hobbies & Interests" color={color} />
          <div className="flex flex-wrap gap-1.5">
            {hobbies.map((h) => (
              <span key={h} className="px-2.5 py-1 rounded-full text-[10px] font-medium border" style={{ borderColor: color + '25', color }}>{h}</span>
            ))}
          </div>
        </Wrap>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Wrap {...aProps(0.65)} className={sectionSpacing}>
          <SectionTitle icon={Trophy} title="Achievements" color={color} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {achievements.map((a) => (
              <div key={a.id} className="p-3 rounded-lg border" style={{ borderColor: color + '15', backgroundColor: color + '05' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Trophy className="w-3 h-3" style={{ color }} />
                  <span className="font-bold text-[11px] text-gray-900">{a.title}</span>
                </div>
                {a.description && <p className="text-[10px] text-gray-500">{a.description}</p>}
                {a.date && <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(a.date)}</p>}
              </div>
            ))}
          </div>
        </Wrap>
      )}

      {/* Custom Sections */}
      {customSections.filter(c => c.title).map((sec, i) => (
        <Wrap key={sec.id} {...aProps(0.7 + i * 0.05)} className={sectionSpacing}>
          <SectionTitle icon={PenLine} title={sec.title} color={color} />
          <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line">{sec.content}</p>
        </Wrap>
      ))}
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
  <div className="flex items-center gap-2 mb-3 pb-1.5 border-b" style={{ borderColor: color + '12' }}>
    <Icon className="w-3.5 h-3.5" style={{ color }} />
    <h3 className="font-bold text-[11px] uppercase tracking-widest" style={{ color }}>{title}</h3>
  </div>
);

export default CVPreview;
