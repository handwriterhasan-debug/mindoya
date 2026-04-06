import { useCVContext } from '@/context/CVContext';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Calendar, Briefcase, GraduationCap, Zap, Globe2, Heart, Trophy, PenLine, UserCircle, Rocket, Cpu, Star } from 'lucide-react';
import { getPlatformIcon } from '@/components/steps/SocialsStep';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const getFontFamily = (style: string) => {
  const fonts: Record<string, string> = {
    modern: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
    classic: "'Georgia', 'Cambria', 'Times New Roman', serif",
    mono: "'Courier New', 'Consolas', 'Liberation Mono', monospace",
    elegant: "'Georgia', 'Palatino Linotype', 'Book Antiqua', serif",
    bold: "'Arial Black', 'Impact', 'Gadget', sans-serif",
    minimal: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    corporate: "'Segoe UI', 'Calibri', 'Tahoma', sans-serif",
    creative: "'DM Sans', 'Trebuchet MS', 'Gill Sans', sans-serif",
  };
  return fonts[style] || fonts.modern;
};

const formatDate = (date: string) => {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1] || ''} ${year}`;
};

// ======= SHARED COMPONENTS =======

const ContactRow = ({ p, color }: { p: any; color: string }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-500">
    {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color }} />{p.email}</span>}
    {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color }} />{p.phone}</span>}
    {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color }} />{p.location}</span>}
    {p.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color }} />{p.website}</span>}
  </div>
);

const SocialsRow = ({ socials, color }: { socials: any[]; color: string }) => (
  socials.length > 0 ? (
    <div className="flex items-center gap-3 mt-3">
      {socials.filter((s: any) => s.url).map((s: any, i: number) => (
        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color }} title={s.platform}>
          {getPlatformIcon(s.platform)}
        </a>
      ))}
    </div>
  ) : null
);

const SectionTitle = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
  <div className="flex items-center gap-2 mb-3 pb-1.5 border-b" style={{ borderColor: color + '20' }}>
    <Icon className="w-3.5 h-3.5" style={{ color }} />
    <h3 className="font-bold text-[11px] uppercase tracking-widest" style={{ color }}>{title}</h3>
  </div>
);

const TimelineItems = ({ items, color, animated, type }: { items: any[]; color: string; animated: boolean; type: 'experience' | 'education' }) => {
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <div className="space-y-4 ml-3 border-l-2 pl-5" style={{ borderColor: color + '25' }}>
      {items.map((item: any, i: number) => (
        <Wrap key={item.id} {...aProps(0.05 * i)}>
          <div className="relative">
            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: color }} />
            {type === 'experience' ? (
              <>
                <h4 className="font-bold text-sm text-gray-900">{item.position}</h4>
                <p className="text-xs font-semibold" style={{ color }}>{item.company}</p>
              </>
            ) : (
              <>
                <h4 className="font-bold text-sm text-gray-900">{item.degree}{item.field ? ` in ${item.field}` : ''}</h4>
                <p className="text-xs font-semibold" style={{ color }}>{item.institution}</p>
              </>
            )}
            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
              <Calendar className="w-2.5 h-2.5" />
              {formatDate(item.startDate)} — {item.current ? 'Present' : formatDate(item.endDate)}
              {type === 'education' && item.gpa && ` · GPA: ${item.gpa}`}
            </p>
            {item.description && <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{item.description}</p>}
          </div>
        </Wrap>
      ))}
    </div>
  );
};

const SkillsSection = ({ skills, color, animated }: { skills: any[]; color: string; animated: boolean }) => {
  if (skills.length === 0) return null;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <Wrap {...aProps(0.4)} className="mb-6">
      <SectionTitle icon={Zap} title="Skills" color={color} />
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {skills.map((skill: any, i: number) => (
          <div key={skill.id}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-medium text-gray-900">{skill.name}</span>
              <span className="text-gray-400 text-[10px]">{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                initial={animated ? { width: 0 } : { width: `${skill.level}%` }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }} />
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  );
};

const LanguagesSection = ({ languages, color, animated }: { languages: any[]; color: string; animated: boolean }) => {
  if (languages.length === 0) return null;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <Wrap {...aProps(0.5)} className="mb-6">
      <SectionTitle icon={Globe2} title="Languages" color={color} />
      <div className="flex flex-wrap gap-5">
        {languages.map((lang: any, i: number) => (
          <div key={lang.id} className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="7" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="7"
                  strokeDasharray="264"
                  initial={animated ? { strokeDashoffset: 264 } : { strokeDashoffset: 264 - (264 * lang.level / 100) }}
                  animate={{ strokeDashoffset: 264 - (264 * lang.level / 100) }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700">{lang.level}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">{lang.name}</p>
              <p className="text-[10px] text-gray-400">{lang.proficiency}</p>
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  );
};

const HobbiesSection = ({ hobbies, color, animated }: { hobbies: string[]; color: string; animated: boolean }) => {
  if (hobbies.length === 0) return null;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <Wrap {...aProps(0.6)} className="mb-6">
      <SectionTitle icon={Heart} title="Hobbies & Interests" color={color} />
      <div className="flex flex-wrap gap-1.5">
        {hobbies.map((h) => (
          <span key={h} className="px-2.5 py-1 rounded-full text-[10px] font-medium border" style={{ borderColor: color + '25', color }}>{h}</span>
        ))}
      </div>
    </Wrap>
  );
};

const AchievementsSection = ({ achievements, color, animated }: { achievements: any[]; color: string; animated: boolean }) => {
  if (achievements.length === 0) return null;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <Wrap {...aProps(0.65)} className="mb-6">
      <SectionTitle icon={Trophy} title="Achievements" color={color} />
      <div className="space-y-2">
        {achievements.map((a: any) => (
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
  );
};

const CustomSectionsRender = ({ customSections, color, animated }: { customSections: any[]; color: string; animated: boolean }) => {
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <>
      {customSections.filter((c: any) => c.title).map((sec: any, i: number) => (
        <Wrap key={sec.id} {...aProps(0.7 + i * 0.05)} className="mb-6">
          <SectionTitle icon={PenLine} title={sec.title} color={color} />
          <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line">{sec.content}</p>
        </Wrap>
      ))}
    </>
  );
};

// ======= TEMPLATE RENDERERS =======

const ModernTimeline = ({ data, color, fontFamily, animated, spacingClass, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections, design } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const sectionSpacing = design.spacing === 'compact' ? 'mb-4' : design.spacing === 'spacious' ? 'mb-8' : 'mb-6';
  const padding = design.spacing === 'compact' ? 'p-6' : design.spacing === 'spacious' ? 'p-10' : 'p-8';

  return (
    <div className={`bg-white text-gray-900 ${padding}`} style={{ fontFamily }}>
      <Wrap {...aProps(0)} className={sectionSpacing} style={{ borderBottom: `2px solid ${color}15`, paddingBottom: '20px' }}>
        <div className="flex items-center gap-5">
          {showPhoto && (
            <div className="w-20 h-20 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, boxShadow: `0 0 0 3px ${color}, 0 4px 16px ${color}25` }}>
              <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-sm text-gray-500 font-medium mt-0.5">{p.jobTitle}</p>}
            <ContactRow p={p} color={color} />
          </div>
        </div>
        <SocialsRow socials={socials} color={color} />
      </Wrap>
      {p.summary && <Wrap {...aProps(0.15)} className={sectionSpacing}><SectionTitle icon={UserCircle} title="About Me" color={color} /><p className="text-xs leading-relaxed text-gray-600">{p.summary}</p></Wrap>}
      {experience.length > 0 && <Wrap {...aProps(0.2)} className={sectionSpacing}><SectionTitle icon={Briefcase} title="Experience" color={color} /><TimelineItems items={experience} color={color} animated={animated} type="experience" /></Wrap>}
      {education.length > 0 && <Wrap {...aProps(0.3)} className={sectionSpacing}><SectionTitle icon={GraduationCap} title="Education" color={color} /><TimelineItems items={education} color={color} animated={animated} type="education" /></Wrap>}
      <SkillsSection skills={skills} color={color} animated={animated} />
      <LanguagesSection languages={languages} color={color} animated={animated} />
      <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
      <AchievementsSection achievements={achievements} color={color} animated={animated} />
      <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
    </div>
  );
};

const ExecutiveDark = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const goldAccent = '#D4AF37';
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  return (
    <div className="flex min-h-[800px]" style={{ fontFamily }}>
      <div className="w-[35%] text-white p-6 flex flex-col" style={{ backgroundColor: '#1B2A4A' }}>
        {showPhoto && (
          <div className="w-24 h-24 mx-auto mb-4 overflow-hidden" style={{ borderRadius: photoRadius, border: `3px solid ${goldAccent}` }}>
            <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-lg font-bold text-center mb-1" style={{ color: goldAccent }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p className="text-[11px] text-center text-gray-300 mb-4">{p.jobTitle}</p>}
        <div className="space-y-2 text-[10px] text-gray-300 mb-6">
          {p.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" style={{ color: goldAccent }} />{p.email}</div>}
          {p.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" style={{ color: goldAccent }} />{p.phone}</div>}
          {p.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3" style={{ color: goldAccent }} />{p.location}</div>}
        </div>
        {skills.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: goldAccent }}>Skills</h3>
            <div className="space-y-2">
              {skills.map((s: any) => (
                <div key={s.id}>
                  <div className="flex justify-between text-[10px] mb-0.5"><span>{s.name}</span><span>{s.level}%</span></div>
                  <div className="h-1 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${s.level}%`, backgroundColor: goldAccent }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: goldAccent }}>Languages</h3>
            <div className="space-y-1.5">
              {languages.map((l: any) => (<div key={l.id} className="flex justify-between text-[10px]"><span>{l.name}</span><span className="text-gray-400">{l.proficiency}</span></div>))}
            </div>
          </div>
        )}
        <SocialsRow socials={socials} color={goldAccent} />
      </div>
      <div className="flex-1 bg-white p-7 text-gray-900">
        {p.summary && <Wrap {...aProps(0.1)} className="mb-6"><h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: goldAccent }}>About Me</h3><p className="text-xs leading-relaxed text-gray-600 border-l-2 pl-3" style={{ borderColor: goldAccent }}>{p.summary}</p></Wrap>}
        {experience.length > 0 && <Wrap {...aProps(0.2)} className="mb-6"><SectionTitle icon={Briefcase} title="Experience" color={goldAccent} /><TimelineItems items={experience} color={goldAccent} animated={animated} type="experience" /></Wrap>}
        {education.length > 0 && <Wrap {...aProps(0.3)} className="mb-6"><SectionTitle icon={GraduationCap} title="Education" color={goldAccent} /><TimelineItems items={education} color={goldAccent} animated={animated} type="education" /></Wrap>}
        <AchievementsSection achievements={achievements} color={goldAccent} animated={animated} />
        <HobbiesSection hobbies={hobbies} color={goldAccent} animated={animated} />
        <CustomSectionsRender customSections={customSections} color={goldAccent} animated={animated} />
      </div>
    </div>
  );
};

const CreativeSplit = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  return (
    <div className="flex min-h-[800px]" style={{ fontFamily }}>
      <div className="w-[38%] text-white p-6 flex flex-col" style={{ backgroundColor: color }}>
        {showPhoto && (
          <div className="w-28 h-28 mx-auto mb-5 overflow-hidden bg-white/20" style={{ borderRadius: photoRadius, border: '3px solid rgba(255,255,255,0.5)' }}>
            <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-xl font-extrabold text-center mb-1">{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p className="text-xs text-center opacity-80 mb-5">{p.jobTitle}</p>}
        <div className="space-y-2 text-[10px] opacity-90 mb-5">
          {p.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" />{p.email}</div>}
          {p.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" />{p.phone}</div>}
          {p.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3" />{p.location}</div>}
        </div>
        {skills.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3 opacity-80">Skills</h3>
            {skills.map((s: any) => (
              <div key={s.id} className="mb-2">
                <div className="flex justify-between text-[10px] mb-0.5"><span>{s.name}</span><span>{s.level}%</span></div>
                <div className="h-1.5 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${s.level}%` }} /></div>
              </div>
            ))}
          </div>
        )}
        {languages.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-80">Languages</h3>
            {languages.map((l: any) => (<div key={l.id} className="text-[10px] mb-1">{l.name} — {l.proficiency}</div>))}
          </div>
        )}
        <SocialsRow socials={socials} color="rgba(255,255,255,0.8)" />
      </div>
      <div className="flex-1 bg-white p-7 text-gray-900">
        {p.summary && <Wrap {...aProps(0.1)} className="mb-6"><h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-80">About Me</h3><p className="text-xs leading-relaxed text-gray-600">{p.summary}</p></Wrap>}
        {experience.length > 0 && <Wrap {...aProps(0.2)} className="mb-6"><SectionTitle icon={Briefcase} title="Experience" color={color} /><TimelineItems items={experience} color={color} animated={animated} type="experience" /></Wrap>}
        {education.length > 0 && <Wrap {...aProps(0.3)} className="mb-6"><SectionTitle icon={GraduationCap} title="Education" color={color} /><TimelineItems items={education} color={color} animated={animated} type="education" /></Wrap>}
        <AchievementsSection achievements={achievements} color={color} animated={animated} />
        <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
        <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
      </div>
    </div>
  );
};

const MinimalSwiss = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  return (
    <div className="bg-white text-gray-900 p-10" style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif" }}>
      <Wrap {...aProps(0)} className="mb-10">
        <div className="flex items-end gap-5">
          {showPhoto && <div className="w-16 h-16 overflow-hidden shrink-0" style={{ borderRadius: photoRadius }}><img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" /></div>}
          <div>
            <h1 className="text-3xl font-light tracking-tight text-gray-900">{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-sm text-gray-400 mt-1">{p.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-[11px] text-gray-400">
          {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}
        </div>
        <hr className="mt-4 border-gray-100" />
      </Wrap>
      {p.summary && <Wrap {...aProps(0.1)} className="mb-8"><h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-3 font-medium">About Me</h3><p className="text-xs leading-relaxed text-gray-500 max-w-[500px]">{p.summary}</p></Wrap>}
      {experience.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-8">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-4 font-medium">Experience</h3>
          {experience.map((exp: any) => (
            <div key={exp.id} className="mb-4 pb-4 border-b border-gray-50">
              <div className="flex justify-between items-baseline"><h4 className="font-medium text-sm">{exp.position}</h4><span className="text-[10px] text-gray-400">{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span></div>
              <p className="text-[11px] text-gray-400">{exp.company}</p>
              {exp.description && <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </Wrap>
      )}
      {education.length > 0 && (
        <Wrap {...aProps(0.3)} className="mb-8">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-4 font-medium">Education</h3>
          {education.map((edu: any) => (
            <div key={edu.id} className="mb-3"><h4 className="font-medium text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4><p className="text-[11px] text-gray-400">{edu.institution} · {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</p></div>
          ))}
        </Wrap>
      )}
      {skills.length > 0 && <Wrap {...aProps(0.4)} className="mb-8"><h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-3 font-medium">Skills</h3><div className="flex flex-wrap gap-1.5">{skills.map((s: any) => (<span key={s.id} className="text-[10px] px-2 py-0.5 border border-gray-200 rounded text-gray-600">{s.name}</span>))}</div></Wrap>}
      {languages.length > 0 && <Wrap {...aProps(0.5)} className="mb-8"><h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-3 font-medium">Languages</h3><div className="flex flex-wrap gap-3 text-[11px] text-gray-600">{languages.map((l: any) => (<span key={l.id}>{l.name} ({l.proficiency})</span>))}</div></Wrap>}
      <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
      <AchievementsSection achievements={achievements} color={color} animated={animated} />
      <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
    </div>
  );
};

const TechDeveloper = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const monoFont = "'Courier New', 'Consolas', monospace";

  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] p-8" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <Wrap {...aProps(0)} className="mb-6 pb-4 border-b border-[#21262d]">
        <div className="flex items-center gap-4">
          {showPhoto && <div className="w-16 h-16 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, border: '2px solid #30363d' }}><img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" /></div>}
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: monoFont, color: '#58a6ff' }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-xs text-[#8b949e] mt-0.5" style={{ fontFamily: monoFont }}>{p.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-[#8b949e]">
          {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#58a6ff]" />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#58a6ff]" />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#58a6ff]" />{p.location}</span>}
        </div>
      </Wrap>
      {p.summary && <Wrap {...aProps(0.1)} className="mb-6"><h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[#58a6ff]" style={{ fontFamily: monoFont }}>{'// About Me'}</h3><p className="text-xs leading-relaxed text-[#8b949e] border-l-2 border-[#58a6ff] pl-3">{p.summary}</p></Wrap>}
      {skills.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3 text-[#58a6ff]" style={{ fontFamily: monoFont }}>{'// Skills'}</h3>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((s: any) => (
              <div key={s.id}>
                <div className="flex justify-between text-[10px] mb-1"><span>{s.name}</span><span className="text-[#8b949e]">{s.level}%</span></div>
                <div className="h-1.5 rounded bg-[#21262d]"><div className="h-full rounded bg-[#238636]" style={{ width: `${s.level}%` }} /></div>
              </div>
            ))}
          </div>
        </Wrap>
      )}
      {experience.length > 0 && (
        <Wrap {...aProps(0.3)} className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3 text-[#58a6ff]" style={{ fontFamily: monoFont }}>{'// Experience'}</h3>
          {experience.map((exp: any) => (
            <div key={exp.id} className="mb-4 pl-3 border-l border-[#21262d]">
              <h4 className="font-semibold text-sm text-[#c9d1d9]">{exp.position}</h4>
              <p className="text-[11px] text-[#58a6ff]">{exp.company}</p>
              <p className="text-[10px] text-[#8b949e]">{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
              {exp.description && <p className="text-[10px] text-[#8b949e] mt-1 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </Wrap>
      )}
      {education.length > 0 && (
        <Wrap {...aProps(0.35)} className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3 text-[#58a6ff]" style={{ fontFamily: monoFont }}>{'// Education'}</h3>
          {education.map((edu: any) => (
            <div key={edu.id} className="mb-3 pl-3 border-l border-[#21262d]">
              <h4 className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4>
              <p className="text-[11px] text-[#58a6ff]">{edu.institution}</p>
              <p className="text-[10px] text-[#8b949e]">{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</p>
            </div>
          ))}
        </Wrap>
      )}
      {languages.length > 0 && (
        <Wrap {...aProps(0.4)} className="mb-6">
          <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3 text-[#58a6ff]" style={{ fontFamily: monoFont }}>{'// Languages'}</h3>
          <div className="flex flex-wrap gap-2">{languages.map((l: any) => (<span key={l.id} className="text-[10px] px-2 py-0.5 rounded border border-[#30363d] text-[#c9d1d9]">{l.name} · {l.proficiency}</span>))}</div>
        </Wrap>
      )}
      <div className="text-[#c9d1d9]">
        <HobbiesSection hobbies={hobbies} color="#58a6ff" animated={animated} />
        <AchievementsSection achievements={achievements} color="#58a6ff" animated={animated} />
      </div>
      <CustomSectionsRender customSections={customSections} color="#58a6ff" animated={animated} />
    </div>
  );
};

const InfographicTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  return (
    <div className="bg-white text-gray-900 p-8" style={{ fontFamily }}>
      <Wrap {...aProps(0)} className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: color }}>
        {showPhoto && <div className="w-24 h-24 mx-auto mb-3 overflow-hidden" style={{ borderRadius: photoRadius, boxShadow: `0 0 0 4px ${color}` }}><img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" /></div>}
        <h1 className="text-2xl font-extrabold" style={{ color }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p className="text-sm text-gray-500 mt-1">{p.jobTitle}</p>}
        <div className="flex justify-center flex-wrap gap-4 mt-3 text-[10px] text-gray-500">
          {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color }} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color }} />{p.location}</span>}
        </div>
      </Wrap>
      {p.summary && <Wrap {...aProps(0.1)} className="mb-6 text-center"><SectionTitle icon={UserCircle} title="About Me" color={color} /><p className="text-xs text-gray-500 leading-relaxed max-w-[450px] mx-auto">{p.summary}</p></Wrap>}
      {skills.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-6">
          <SectionTitle icon={Zap} title="Skills" color={color} />
          <div className="flex flex-wrap justify-center gap-5">
            {skills.map((s: any, i: number) => (
              <div key={s.id} className="text-center">
                <div className="relative w-14 h-14 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8" strokeDasharray="264"
                      initial={animated ? { strokeDashoffset: 264 } : { strokeDashoffset: 264 - (264 * s.level / 100) }}
                      animate={{ strokeDashoffset: 264 - (264 * s.level / 100) }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">{s.level}%</span>
                </div>
                <p className="text-[10px] font-medium mt-1">{s.name}</p>
              </div>
            ))}
          </div>
        </Wrap>
      )}
      <LanguagesSection languages={languages} color={color} animated={animated} />
      {experience.length > 0 && <Wrap {...aProps(0.3)} className="mb-6"><SectionTitle icon={Briefcase} title="Experience" color={color} /><TimelineItems items={experience} color={color} animated={animated} type="experience" /></Wrap>}
      {education.length > 0 && <Wrap {...aProps(0.35)} className="mb-6"><SectionTitle icon={GraduationCap} title="Education" color={color} /><TimelineItems items={education} color={color} animated={animated} type="education" /></Wrap>}
      <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
      <AchievementsSection achievements={achievements} color={color} animated={animated} />
      <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
    </div>
  );
};

const MagazineTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily }}>
      <Wrap {...aProps(0)} className="p-8 pb-6 mb-6" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-5">
          {showPhoto && <div className="w-20 h-20 overflow-hidden shrink-0 bg-white/20" style={{ borderRadius: photoRadius }}><img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" /></div>}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-sm text-white/80 mt-0.5">{p.jobTitle}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-white/70">{p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}</div>
          </div>
        </div>
      </Wrap>
      <div className="px-8 pb-8">
        {p.summary && <Wrap {...aProps(0.1)} className="mb-6"><h3 className="text-lg font-extrabold uppercase tracking-tight mb-3" style={{ color }}>About Me</h3><p className="text-sm leading-relaxed text-gray-600 font-light italic border-l-4 pl-4" style={{ borderColor: color }}>"{p.summary}"</p></Wrap>}
        {experience.length > 0 && (
          <Wrap {...aProps(0.2)} className="mb-6">
            <h3 className="text-lg font-extrabold uppercase tracking-tight mb-4" style={{ color }}>Experience</h3>
            {experience.map((exp: any) => (
              <div key={exp.id} className="mb-4 pb-3 border-b border-gray-100">
                <div className="flex justify-between items-baseline"><h4 className="font-bold text-sm">{exp.position}</h4><span className="text-[10px] text-gray-400">{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span></div>
                <p className="text-xs font-semibold" style={{ color }}>{exp.company}</p>
                {exp.description && <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </Wrap>
        )}
        {education.length > 0 && (
          <Wrap {...aProps(0.3)} className="mb-6">
            <h3 className="text-lg font-extrabold uppercase tracking-tight mb-4" style={{ color }}>Education</h3>
            {education.map((edu: any) => (<div key={edu.id} className="mb-3"><h4 className="font-bold text-sm">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h4><p className="text-xs" style={{ color }}>{edu.institution}</p><p className="text-[10px] text-gray-400">{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</p></div>))}
          </Wrap>
        )}
        <div className="grid grid-cols-2 gap-6">
          {skills.length > 0 && (
            <Wrap {...aProps(0.35)}>
              <h3 className="text-sm font-extrabold uppercase mb-3" style={{ color }}>Skills</h3>
              {skills.map((s: any) => (<div key={s.id} className="mb-2"><div className="flex justify-between text-[10px] mb-0.5"><span className="font-medium">{s.name}</span><span className="text-gray-400">{s.level}%</span></div><div className="h-1.5 rounded-full bg-gray-100"><div className="h-full rounded-full" style={{ width: `${s.level}%`, backgroundColor: color }} /></div></div>))}
            </Wrap>
          )}
          {languages.length > 0 && (
            <Wrap {...aProps(0.4)}>
              <h3 className="text-sm font-extrabold uppercase mb-3" style={{ color }}>Languages</h3>
              {languages.map((l: any) => (<div key={l.id} className="text-[11px] mb-1"><span className="font-medium">{l.name}</span> — <span className="text-gray-400">{l.proficiency}</span></div>))}
            </Wrap>
          )}
        </div>
        <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
        <AchievementsSection achievements={achievements} color={color} animated={animated} />
        <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
      </div>
    </div>
  );
};

const ClassicCorporate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  return (
    <div className="bg-white text-gray-900 p-8" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <Wrap {...aProps(0)} className="text-center mb-6 pb-4 border-b-2 border-gray-900">
        <h1 className="text-2xl font-bold tracking-wide uppercase">{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p className="text-sm text-gray-600 mt-1">{p.jobTitle}</p>}
        <div className="flex justify-center flex-wrap gap-x-4 mt-2 text-[11px] text-gray-600">{p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}{p.website && <span>{p.website}</span>}</div>
      </Wrap>
      {p.summary && <Wrap {...aProps(0.1)} className="mb-5"><h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3">About Me</h3><p className="text-xs leading-relaxed text-gray-700">{p.summary}</p></Wrap>}
      {experience.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3">Professional Experience</h3>
          {experience.map((exp: any) => (<div key={exp.id} className="mb-3"><div className="flex justify-between"><h4 className="font-bold text-sm">{exp.position}</h4><span className="text-[10px] text-gray-500">{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span></div><p className="text-xs italic text-gray-600">{exp.company}</p>{exp.description && <p className="text-[11px] text-gray-700 mt-1 leading-relaxed">{exp.description}</p>}</div>))}
        </Wrap>
      )}
      {education.length > 0 && (
        <Wrap {...aProps(0.3)} className="mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3">Education</h3>
          {education.map((edu: any) => (<div key={edu.id} className="mb-2"><div className="flex justify-between"><h4 className="font-bold text-sm">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h4><span className="text-[10px] text-gray-500">{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</span></div><p className="text-xs italic text-gray-600">{edu.institution}</p></div>))}
        </Wrap>
      )}
      {skills.length > 0 && <Wrap {...aProps(0.4)} className="mb-5"><h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3">Skills</h3><p className="text-[11px] text-gray-700">{skills.map((s: any) => s.name).join(' · ')}</p></Wrap>}
      {languages.length > 0 && <Wrap {...aProps(0.45)} className="mb-5"><h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3">Languages</h3><p className="text-[11px] text-gray-700">{languages.map((l: any) => `${l.name} (${l.proficiency})`).join(' · ')}</p></Wrap>}
      <HobbiesSection hobbies={hobbies} color="#333" animated={animated} />
      <AchievementsSection achievements={achievements} color="#333" animated={animated} />
      <CustomSectionsRender customSections={customSections} color="#333" animated={animated} />
    </div>
  );
};

// ======= NEW TEMPLATE: Two Column =======
const TwoColumnTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily }}>
      {/* Header */}
      <div className="p-6 pb-4 border-b-2" style={{ borderColor: color }}>
        <div className="flex items-center gap-4">
          {showPhoto && <div className="w-16 h-16 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, border: `2px solid ${color}` }}><img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" /></div>}
          <div>
            <h1 className="text-2xl font-bold" style={{ color }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-sm text-gray-500">{p.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-gray-500">
          {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color }} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color }} />{p.location}</span>}
        </div>
      </div>

      <div className="flex">
        {/* Left column - 35% */}
        <div className="w-[35%] p-5 border-r" style={{ borderColor: color + '15', backgroundColor: color + '05' }}>
          {p.summary && <Wrap {...aProps(0.1)} className="mb-5"><h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color }}>About</h3><p className="text-[11px] text-gray-600 leading-relaxed">{p.summary}</p></Wrap>}
          {skills.length > 0 && (
            <Wrap {...aProps(0.2)} className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color }}>Skills</h3>
              {skills.map((s: any) => (
                <div key={s.id} className="mb-2">
                  <div className="flex justify-between text-[10px] mb-0.5"><span className="font-medium">{s.name}</span><span className="text-gray-400">{s.level}%</span></div>
                  <div className="h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full" style={{ width: `${s.level}%`, backgroundColor: color }} /></div>
                </div>
              ))}
            </Wrap>
          )}
          {languages.length > 0 && (
            <Wrap {...aProps(0.3)} className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color }}>Languages</h3>
              {languages.map((l: any) => (<div key={l.id} className="text-[11px] mb-1.5 flex justify-between"><span>{l.name}</span><span className="text-gray-400 text-[10px]">{l.proficiency}</span></div>))}
            </Wrap>
          )}
          {hobbies.length > 0 && (
            <Wrap {...aProps(0.35)} className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color }}>Interests</h3>
              <div className="flex flex-wrap gap-1">{hobbies.map((h) => (<span key={h} className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '15', color }}>{h}</span>))}</div>
            </Wrap>
          )}
          <SocialsRow socials={socials} color={color} />
        </div>

        {/* Right column - 65% */}
        <div className="flex-1 p-5">
          {experience.length > 0 && <Wrap {...aProps(0.15)} className="mb-5"><SectionTitle icon={Briefcase} title="Experience" color={color} /><TimelineItems items={experience} color={color} animated={animated} type="experience" /></Wrap>}
          {education.length > 0 && <Wrap {...aProps(0.25)} className="mb-5"><SectionTitle icon={GraduationCap} title="Education" color={color} /><TimelineItems items={education} color={color} animated={animated} type="education" /></Wrap>}
          <AchievementsSection achievements={achievements} color={color} animated={animated} />
          <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
        </div>
      </div>
    </div>
  );
};

// ======= NEW TEMPLATE: Gradient Header =======
const GradientHeaderTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};

  // Create a lighter version for gradient
  const lighterColor = color + 'CC';

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily }}>
      {/* Gradient header */}
      <Wrap {...aProps(0)} className="p-8 pb-6 text-white" style={{ background: `linear-gradient(135deg, ${color}, ${lighterColor})` }}>
        <div className="flex items-center gap-5">
          {showPhoto && <div className="w-24 h-24 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, border: '3px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}><img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" /></div>}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-sm opacity-90 mt-1 font-medium">{p.jobTitle}</p>}
            <div className="flex flex-wrap gap-3 mt-3 text-[10px] opacity-80">
              {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>}
              {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>}
            </div>
          </div>
        </div>
        <SocialsRow socials={socials} color="rgba(255,255,255,0.8)" />
      </Wrap>

      <div className="p-8">
        {p.summary && <Wrap {...aProps(0.1)} className="mb-6"><SectionTitle icon={UserCircle} title="About Me" color={color} /><p className="text-xs leading-relaxed text-gray-600 border-l-3 pl-4" style={{ borderLeft: `3px solid ${color}` }}>{p.summary}</p></Wrap>}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {skills.length > 0 && (
            <Wrap {...aProps(0.2)} className="col-span-2">
              <SectionTitle icon={Zap} title="Skills" color={color} />
              <div className="grid grid-cols-2 gap-2">
                {skills.map((s: any) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-[10px] mb-0.5"><span className="font-medium">{s.name}</span><span className="text-gray-400">{s.level}%</span></div>
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-full rounded-full" style={{ width: `${s.level}%`, background: `linear-gradient(90deg, ${color}, ${lighterColor})` }} /></div>
                  </div>
                ))}
              </div>
            </Wrap>
          )}
          {languages.length > 0 && (
            <Wrap {...aProps(0.25)}>
              <SectionTitle icon={Globe2} title="Languages" color={color} />
              {languages.map((l: any) => (<div key={l.id} className="mb-2"><p className="text-[11px] font-medium">{l.name}</p><p className="text-[9px] text-gray-400">{l.proficiency} · {l.level}%</p></div>))}
            </Wrap>
          )}
        </div>

        {experience.length > 0 && <Wrap {...aProps(0.3)} className="mb-6"><SectionTitle icon={Briefcase} title="Experience" color={color} /><TimelineItems items={experience} color={color} animated={animated} type="experience" /></Wrap>}
        {education.length > 0 && <Wrap {...aProps(0.35)} className="mb-6"><SectionTitle icon={GraduationCap} title="Education" color={color} /><TimelineItems items={education} color={color} animated={animated} type="education" /></Wrap>}
        <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
        <AchievementsSection achievements={achievements} color={color} animated={animated} />
        <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
      </div>
    </div>
  );
};

// ======= NEW TEMPLATE: Sci-Fi CV =======
const SciFiTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const neonColor = '#00f0ff';
  const bgDark = '#0a0e17';
  const bgCard = '#111827';

  return (
    <div className="text-gray-200" style={{ fontFamily: "'Consolas', 'Courier New', monospace", backgroundColor: bgDark, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,240,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,240,255,0.03) 0%, transparent 50%)' }}>
      {/* Header with cyber grid */}
      <Wrap {...aProps(0)} className="p-7 pb-5 relative" style={{ borderBottom: `1px solid ${neonColor}30` }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(${neonColor}20 1px, transparent 1px), linear-gradient(90deg, ${neonColor}20 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
        <div className="flex items-center gap-5 relative z-10">
          {showPhoto && (
            <div className="w-20 h-20 overflow-hidden shrink-0 relative" style={{ borderRadius: photoRadius, border: `2px solid ${neonColor}`, boxShadow: `0 0 20px ${neonColor}40, inset 0 0 20px ${neonColor}10` }}>
              <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-wider uppercase" style={{ color: neonColor, textShadow: `0 0 10px ${neonColor}50` }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">{p.jobTitle}</p>}
            <div className="flex flex-wrap gap-3 mt-2.5 text-[10px] text-gray-400">
              {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: neonColor }} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: neonColor }} />{p.phone}</span>}
              {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: neonColor }} />{p.location}</span>}
            </div>
          </div>
        </div>
        <SocialsRow socials={socials} color={neonColor} />
      </Wrap>

      <div className="p-7 space-y-6">
        {p.summary && (
          <Wrap {...aProps(0.1)} className="p-4 rounded-lg" style={{ backgroundColor: bgCard, border: `1px solid ${neonColor}15` }}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 flex items-center gap-2" style={{ color: neonColor }}>
              <Rocket className="w-3.5 h-3.5" /> SYSTEM::ABOUT_ME
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">{p.summary}</p>
          </Wrap>
        )}

        {skills.length > 0 && (
          <Wrap {...aProps(0.2)}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3 flex items-center gap-2" style={{ color: neonColor }}>
              <Zap className="w-3.5 h-3.5" /> SKILL_MATRIX
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((s: any, i: number) => (
                <div key={s.id} className="p-2.5 rounded-lg" style={{ backgroundColor: bgCard, border: `1px solid ${neonColor}10` }}>
                  <div className="flex justify-between text-[10px] mb-1.5">
                    <span className="font-medium text-gray-300">{s.name}</span>
                    <span style={{ color: neonColor }}>{s.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: neonColor, boxShadow: `0 0 6px ${neonColor}60` }}
                      initial={animated ? { width: 0 } : { width: `${s.level}%` }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }} />
                  </div>
                </div>
              ))}
            </div>
          </Wrap>
        )}

        {experience.length > 0 && (
          <Wrap {...aProps(0.3)}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3 flex items-center gap-2" style={{ color: neonColor }}>
              <Briefcase className="w-3.5 h-3.5" /> EXPERIENCE_LOG
            </h3>
            <div className="space-y-3 ml-3 border-l" style={{ borderColor: neonColor + '30' }}>
              {experience.map((exp: any) => (
                <div key={exp.id} className="pl-4 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: neonColor, boxShadow: `0 0 8px ${neonColor}` }} />
                  <h4 className="font-bold text-sm text-gray-200">{exp.position}</h4>
                  <p className="text-[11px]" style={{ color: neonColor }}>{exp.company}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5" />
                    {formatDate(exp.startDate)} — {exp.current ? 'Active' : formatDate(exp.endDate)}
                  </p>
                  {exp.description && <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </Wrap>
        )}

        {education.length > 0 && (
          <Wrap {...aProps(0.35)}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3 flex items-center gap-2" style={{ color: neonColor }}>
              <GraduationCap className="w-3.5 h-3.5" /> EDUCATION_DATA
            </h3>
            {education.map((edu: any) => (
              <div key={edu.id} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: bgCard, border: `1px solid ${neonColor}10` }}>
                <h4 className="font-bold text-sm text-gray-200">{edu.degree}{edu.field ? ` // ${edu.field}` : ''}</h4>
                <p className="text-[11px]" style={{ color: neonColor }}>{edu.institution}</p>
                <p className="text-[10px] text-gray-500">{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</p>
              </div>
            ))}
          </Wrap>
        )}

        {languages.length > 0 && (
          <Wrap {...aProps(0.4)}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3" style={{ color: neonColor }}>LANGUAGES</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((l: any) => (
                <span key={l.id} className="text-[10px] px-3 py-1 rounded-full" style={{ border: `1px solid ${neonColor}40`, color: neonColor, backgroundColor: `${neonColor}08` }}>
                  {l.name} · {l.proficiency}
                </span>
              ))}
            </div>
          </Wrap>
        )}

        {hobbies.length > 0 && (
          <Wrap {...aProps(0.45)}>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: neonColor }}>INTERESTS</h3>
            <div className="flex flex-wrap gap-1.5">
              {hobbies.map((h) => (<span key={h} className="px-2.5 py-1 rounded text-[10px]" style={{ backgroundColor: `${neonColor}10`, color: neonColor, border: `1px solid ${neonColor}20` }}>{h}</span>))}
            </div>
          </Wrap>
        )}

        <AchievementsSection achievements={achievements} color={neonColor} animated={animated} />
        <CustomSectionsRender customSections={customSections} color={neonColor} animated={animated} />
      </div>
    </div>
  );
};

// ======= NEW TEMPLATE: Modern AI CV =======
const ModernAITemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const accent = '#6366f1';
  const accentLight = '#818cf8';
  const bgDark = '#0f0f1a';
  const bgCard = '#16162a';
  const bgMain = '#f8f9fc';
  const textMuted = '#94a3b8';

  const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent + '15' }}>
        <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
      </div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{title}</h3>
      <div className="flex-1 h-px" style={{ backgroundColor: accent + '15' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", backgroundColor: bgMain }}>
      {/* Premium dark header - no radial gradients for export compatibility */}
      <Wrap {...aProps(0)} style={{ background: `linear-gradient(160deg, ${bgDark} 0%, #1e1b4b 50%, ${bgDark} 100%)` }}>
        <div className="p-8 pb-0">
          <div className="flex items-start gap-6">
            {showPhoto && p.profileImage && (
              <div className="w-24 h-24 overflow-hidden shrink-0 relative" style={{ borderRadius: photoRadius || '16px', border: `2px solid ${accent}40` }}>
                <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-[inherit]" style={{ boxShadow: `inset 0 0 0 1px ${accent}20` }} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e80' }} />
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium" style={{ color: '#22c55e' }}>Available for work</span>
              </div>
              <h1 className="text-[28px] font-extrabold tracking-tight text-white leading-tight">{p.fullName || 'Your Name'}</h1>
              {p.jobTitle && (
                <p className="text-sm font-medium mt-1" style={{ color: accentLight }}>{p.jobTitle}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {p.email && <span className="flex items-center gap-1.5 text-[10px]" style={{ color: textMuted }}><Mail className="w-3 h-3" style={{ color: accent }} />{p.email}</span>}
                {p.phone && <span className="flex items-center gap-1.5 text-[10px]" style={{ color: textMuted }}><Phone className="w-3 h-3" style={{ color: accent }} />{p.phone}</span>}
                {p.location && <span className="flex items-center gap-1.5 text-[10px]" style={{ color: textMuted }}><MapPin className="w-3 h-3" style={{ color: accent }} />{p.location}</span>}
                {p.website && <span className="flex items-center gap-1.5 text-[10px]" style={{ color: textMuted }}><Globe className="w-3 h-3" style={{ color: accent }} />{p.website}</span>}
              </div>
              <SocialsRow socials={socials} color={textMuted} />
            </div>
          </div>
        </div>
        {/* Clean geometric divider */}
        <div className="mt-6 flex">
          <div className="h-1 flex-1" style={{ backgroundColor: accent }} />
          <div className="h-1 w-20" style={{ backgroundColor: accentLight }} />
          <div className="h-1 w-10" style={{ backgroundColor: '#22c55e' }} />
        </div>
      </Wrap>

      <div className="p-8 pt-6">
        {/* About section as a card */}
        {p.summary && (
          <Wrap {...aProps(0.1)} className="mb-6 p-4 rounded-xl" style={{ backgroundColor: accent + '08', border: `1px solid ${accent}15` }}>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-3.5 h-3.5" style={{ color: accent }} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>About Me</h3>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: '#475569' }}>{p.summary}</p>
          </Wrap>
        )}

        <div className="grid grid-cols-3 gap-7">
          {/* Main content - left 2 cols */}
          <div className="col-span-2 space-y-6">
            {experience.length > 0 && (
              <Wrap {...aProps(0.2)}>
                <SectionHeader icon={Briefcase} title="Experience" />
                <div className="space-y-4 ml-1">
                  {experience.map((exp: any, i: number) => (
                    <div key={exp.id} className="relative pl-5" style={{ borderLeft: `2px solid ${i === 0 ? accent : accent + '25'}` }}>
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? accent : accent + '60', border: i === 0 ? `2px solid ${accent}30` : 'none' }} />
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-[13px] text-gray-900">{exp.position}</h4>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-2" style={{ backgroundColor: accent + '10', color: accent }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                      </div>
                      <p className="text-[11px] font-semibold" style={{ color: accent }}>{exp.company}</p>
                      {exp.description && <p className="text-[10px] mt-1.5 leading-relaxed whitespace-pre-line" style={{ color: '#64748b' }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </Wrap>
            )}

            {education.length > 0 && (
              <Wrap {...aProps(0.3)}>
                <SectionHeader icon={GraduationCap} title="Education" />
                <div className="space-y-3">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="p-3 rounded-lg" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                      <h4 className="font-bold text-[12px] text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4>
                      <p className="text-[11px] font-medium" style={{ color: accent }}>{edu.institution}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: textMuted }}>{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</p>
                    </div>
                  ))}
                </div>
              </Wrap>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {skills.length > 0 && (
              <Wrap {...aProps(0.25)}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2" style={{ color: accent }}>
                  <Star className="w-3 h-3" /> Skills
                </h3>
                {skills.map((s: any, i: number) => (
                  <div key={s.id} className="mb-2.5">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-medium text-gray-700">{s.name}</span>
                      <span className="font-mono text-[9px]" style={{ color: accent }}>{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: accent + '12' }}>
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: accent }}
                        initial={animated ? { width: 0 } : { width: `${s.level}%` }}
                        animate={{ width: `${s.level}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }} />
                    </div>
                  </div>
                ))}
              </Wrap>
            )}

            {languages.length > 0 && (
              <Wrap {...aProps(0.35)}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2.5" style={{ color: accent }}>Languages</h3>
                {languages.map((l: any) => (
                  <div key={l.id} className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-gray-700">{l.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: accent + '10', color: accent }}>{l.proficiency}</span>
                  </div>
                ))}
              </Wrap>
            )}

            {hobbies.length > 0 && (
              <Wrap {...aProps(0.4)}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: accent }}>Interests</h3>
                <div className="flex flex-wrap gap-1.5">
                  {hobbies.map((h) => (
                    <span key={h} className="text-[9px] px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: accent + '10', color: accent }}>{h}</span>
                  ))}
                </div>
              </Wrap>
            )}
          </div>
        </div>

        <AchievementsSection achievements={achievements} color={accent} animated={animated} />
        <CustomSectionsRender customSections={customSections} color={accent} animated={animated} />
      </div>
    </div>
  );
};

// ======= MAIN COMPONENT =======

const TEMPLATE_MAP: Record<string, React.ComponentType<any>> = {
  modern: ModernTimeline,
  executive: ExecutiveDark,
  creative: CreativeSplit,
  minimal: MinimalSwiss,
  tech: TechDeveloper,
  infographic: InfographicTemplate,
  magazine: MagazineTemplate,
  classic: ClassicCorporate,
  twocolumn: TwoColumnTemplate,
  gradient: GradientHeaderTemplate,
  scifi: SciFiTemplate,
  modernai: ModernAITemplate,
};

const CVPreview = () => {
  const { data, viewMode } = useCVContext();
  const { design } = data;
  const animated = viewMode === 'animated';
  const color = design.primaryColor || '#6C5CE7';
  const fontFamily = getFontFamily(design.fontStyle);
  const showPhoto = design.photoStyle !== 'hidden' && !!data.personal.profileImage;
  const photoRadius = design.photoStyle === 'square' ? '12px' : '50%';
  const spacingClass = design.spacing === 'compact' ? 'space-y-3' : design.spacing === 'spacious' ? 'space-y-8' : 'space-y-5';

  const hasContent = data.personal.fullName || data.education.length || data.experience.length || data.skills.length;

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

  const TemplateComponent = TEMPLATE_MAP[design.template] || ModernTimeline;

  return (
    <div id="cv-output" className="mx-auto shadow-xl rounded-lg overflow-hidden" style={{ width: '794px', minHeight: '1123px', maxWidth: '100%' }}>
      <TemplateComponent
        data={data}
        color={color}
        fontFamily={fontFamily}
        animated={animated}
        spacingClass={spacingClass}
        showPhoto={showPhoto}
        photoRadius={photoRadius}
      />
    </div>
  );
};

export default CVPreview;
