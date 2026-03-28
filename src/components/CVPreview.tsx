import { useCVContext } from '@/context/CVContext';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Calendar, Briefcase, GraduationCap, Zap, Globe2, Heart, Trophy, PenLine } from 'lucide-react';
import { getPlatformIcon } from '@/components/steps/SocialsStep';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 } };

const CVPreview = () => {
  const { data, viewMode } = useCVContext();
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections, design } = data;
  const animated = viewMode === 'animated';
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  const accentColor = design.primaryColor || '#6C5CE7';

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

  return (
    <div className="bg-card text-card-foreground p-8 max-w-[210mm] mx-auto shadow-xl rounded-lg" id="cv-output" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <Wrap {...aProps(0)} className="text-center pb-6 border-b-2 mb-6" style={{ borderColor: accentColor }}>
        <div className="flex items-center justify-center gap-6">
          {p.profileImage && (
            <Wrap {...aProps(0.1)}>
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 shrink-0" style={{ ringColor: accentColor + '40' }}>
                <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
              </div>
            </Wrap>
          )}
          <div>
            <h1 className="text-3xl font-heading font-bold" style={{ color: accentColor }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-lg text-muted-foreground font-medium mt-1">{p.jobTitle}</p>}
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          {p.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.location}</span>}
          {p.website && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" style={{ color: accentColor }} />{p.website}</span>}
        </div>

        {/* Socials */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-3">
            {socials.filter(s => s.url).map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title={s.platform}>
                {getPlatformIcon(s.platform)}
              </a>
            ))}
          </div>
        )}
      </Wrap>

      {/* Summary */}
      {p.summary && (
        <Wrap {...aProps(0.15)} className="mb-6">
          <p className="text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
        </Wrap>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-6">
          <SectionTitle icon={Briefcase} title="Experience" color={accentColor} />
          <div className="space-y-4 ml-2 border-l-2 pl-5" style={{ borderColor: accentColor + '30' }}>
            {experience.map((exp, i) => (
              <Wrap key={exp.id} {...aProps(0.25 + i * 0.05)}>
                <div className="relative">
                  <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                  <h4 className="font-heading font-semibold text-sm">{exp.position}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>}
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
          <div className="space-y-3">
            {education.map((edu, i) => (
              <Wrap key={edu.id} {...aProps(0.35 + i * 0.05)} className="flex gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: accentColor + '15', color: accentColor }}>
                  {edu.grade || '🎓'}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm">{edu.degree} in {edu.field}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">{edu.startDate} — {edu.endDate}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                    {edu.percentage && ` · ${edu.percentage}`}
                  </p>
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
          <div className="grid grid-cols-2 gap-3">
            {skills.map((skill, i) => (
              <Wrap key={skill.id} {...aProps(0.42 + i * 0.03)}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={animated ? 'h-full rounded-full animate-fill-bar' : 'h-full rounded-full'}
                    style={{ width: `${skill.level}%`, backgroundColor: accentColor, animationDelay: `${0.5 + i * 0.1}s` }}
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
          <div className="flex flex-wrap gap-4">
            {languages.map((lang, i) => (
              <Wrap key={lang.id} {...aProps(0.52 + i * 0.05)} className="flex items-center gap-3">
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={accentColor} strokeWidth="8"
                      strokeDasharray="264" strokeDashoffset={264 - (264 * lang.level / 100)}
                      strokeLinecap="round"
                      className={animated ? 'animate-draw-circle' : ''}
                      style={{ animationDelay: `${0.6 + i * 0.15}s` }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{lang.level}%</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{lang.name}</p>
                  <p className="text-xs text-muted-foreground">{lang.proficiency}</p>
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
            {hobbies.map((h, i) => (
              <span key={h} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: accentColor + '12', color: accentColor }}>{h}</span>
            ))}
          </div>
        </Wrap>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Wrap {...aProps(0.65)} className="mb-6">
          <SectionTitle icon={Trophy} title="Achievements" color={accentColor} />
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((a, i) => (
              <div key={a.id} className="p-3 rounded-lg border" style={{ borderColor: accentColor + '20' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span className="font-heading font-semibold text-xs">{a.title}</span>
                </div>
                {a.description && <p className="text-xs text-muted-foreground">{a.description}</p>}
                {a.date && <p className="text-xs text-muted-foreground mt-1">{a.date}</p>}
              </div>
            ))}
          </div>
        </Wrap>
      )}

      {/* Custom Sections */}
      {customSections.filter(c => c.title).map((sec, i) => (
        <Wrap key={sec.id} {...aProps(0.7 + i * 0.05)} className="mb-6">
          <SectionTitle icon={PenLine} title={sec.title} color={accentColor} />
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{sec.content}</p>
        </Wrap>
      ))}
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
  <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: color + '20' }}>
    <Icon className="w-4 h-4" style={{ color }} />
    <h3 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color }}>{title}</h3>
  </div>
);

export default CVPreview;
