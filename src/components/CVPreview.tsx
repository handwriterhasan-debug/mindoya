import { useCVContext } from '@/context/CVContext';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Calendar, Briefcase, GraduationCap, Zap, Globe2, Heart, Trophy, PenLine, UserCircle, Rocket, Cpu, Star } from 'lucide-react';
import { getPlatformIcon } from '@/components/steps/SocialsStep';
import { hexToRgba } from '@/lib/color';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const getFontFamily = (style: string) => {
  const fonts: Record<string, string> = {
    modern: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
    classic: "'Georgia', 'Cambria', 'Times New Roman', serif",
    mono: "'JetBrains Mono', 'Courier New', 'Consolas', monospace",
    elegant: "'Playfair Display', 'Georgia', 'Palatino Linotype', serif",
    bold: "'Bebas Neue', 'Arial Black', 'Impact', sans-serif",
    minimal: "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
    corporate: "'Montserrat', 'Segoe UI', 'Calibri', sans-serif",
    creative: "'DM Sans', 'Trebuchet MS', 'Gill Sans', sans-serif",
    // New fonts
    royal: "'Playfair Display', 'Times New Roman', serif",
    editorial: "'Merriweather', 'Georgia', serif",
    futuristic: "'Orbitron', 'Arial', sans-serif",
    techsharp: "'Space Grotesk', 'Inter', sans-serif",
    handwritten: "'Caveat', 'Brush Script MT', cursive",
    literary: "'Lora', 'Georgia', serif",
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
  <div data-export-inline-row className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-500">
    {p.email && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1 whitespace-nowrap align-middle leading-[1.2] shrink-0"><Mail className="w-3 h-3 shrink-0" style={{ color }} />{p.email}</span>}
    {p.phone && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1 whitespace-nowrap align-middle leading-[1.2] shrink-0"><Phone className="w-3 h-3 shrink-0" style={{ color }} />{p.phone}</span>}
    {p.location && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1 whitespace-nowrap align-middle leading-[1.2] shrink-0"><MapPin className="w-3 h-3 shrink-0" style={{ color }} />{p.location}</span>}
    {p.website && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1 whitespace-nowrap align-middle leading-[1.2] shrink-0"><Globe className="w-3 h-3 shrink-0" style={{ color }} />{p.website}</span>}
  </div>
);

const SocialsRow = ({ socials, color }: { socials: any[]; color: string }) => (
  socials.length > 0 ? (
    <div data-export-inline-row className="flex flex-wrap items-center gap-3 mt-3">
      {socials.filter((s: any) => s.url).map((s: any, i: number) => (
        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" data-export-lock-size data-export-inline-item className="inline-flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" style={{ color }} title={s.platform}>
          {getPlatformIcon(s.platform)}
        </a>
      ))}
    </div>
  ) : null
);

const SectionTitle = ({ icon: Icon, title, color }: { icon: any; title: string; color: string }) => (
  <div className="flex items-center gap-2 mb-3 pb-1.5 border-b" style={{ borderColor: hexToRgba(color, 0.125) }}>
    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
    <h3 className="font-bold text-[11px] uppercase tracking-widest" style={{ color }}>{title}</h3>
  </div>
);

const TimelineItems = ({ items, color, animated, type }: { items: any[]; color: string; animated: boolean; type: 'experience' | 'education' }) => {
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <div className="space-y-4 ml-3 border-l-2 pl-5" style={{ borderColor: hexToRgba(color, 0.145) }}>
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
            <p data-export-inline-item className="text-[10px] text-gray-400 inline-flex items-center gap-1 mt-0.5 whitespace-nowrap align-middle leading-[1.2]">
              <Calendar className="w-2.5 h-2.5 shrink-0" />
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
      <div data-export-lock-size className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {skills.map((skill: any, i: number) => (
          <div key={skill.id} data-export-lock-size>
            <div data-export-inline-row className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-medium text-gray-900">{skill.name}</span>
              <span className="text-gray-400 text-[10px]">{skill.level}%</span>
            </div>
            <div data-export-lock-size className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${skill.level}%` }}
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
      <div data-export-inline-row className="flex flex-wrap gap-5">
        {languages.map((lang: any, i: number) => (
          <div key={lang.id} data-export-lock-size className="flex items-center gap-3 shrink-0">
            <div data-export-lock-size className="relative w-12 h-12 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="7" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="7"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * lang.level / 100)}
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
      <div data-export-inline-row className="flex flex-wrap gap-1.5">
        {hobbies.map((h) => (
          <span key={h} data-export-lock-size data-export-inline-item className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border whitespace-nowrap leading-none shrink-0" style={{ borderColor: hexToRgba(color, 0.145), color }}>{h}</span>
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
          <div key={a.id} className="p-3 rounded-lg border" style={{ borderColor: hexToRgba(color, 0.082), backgroundColor: hexToRgba(color, 0.02) }}>
            <div data-export-inline-item className="inline-flex items-center gap-1.5 mb-1 whitespace-nowrap align-middle leading-[1.2]">
              <Trophy className="w-3 h-3 shrink-0" style={{ color }} />
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
      <Wrap {...aProps(0)} className={sectionSpacing} style={{ borderBottom: `2px solid ${hexToRgba(color, 0.082)}`, paddingBottom: '20px' }}>
        <div className="flex items-center gap-5">
          {showPhoto && (
            <div className="w-20 h-20 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, boxShadow: `0 0 0 3px ${color}, 0 4px 16px ${hexToRgba(color, 0.145)}` }}>
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
    <div className="bg-white text-gray-900 p-10" style={{ fontFamily: fontFamily || "'Helvetica Neue', 'Arial', sans-serif" }}>
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
    <div className="bg-[#0d1117] text-[#c9d1d9] p-8" style={{ fontFamily: fontFamily || "'Segoe UI', sans-serif" }}>
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
        {showPhoto && <div data-export-lock-size className="w-24 h-24 mx-auto mb-3 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, boxShadow: `0 0 0 4px ${color}` }}><img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover block" /></div>}
        <h1 className="text-2xl font-extrabold" style={{ color }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p className="text-sm text-gray-500 mt-1">{p.jobTitle}</p>}
        <div data-export-inline-row className="flex justify-center flex-wrap gap-4 mt-3 text-[10px] text-gray-500">
          {p.email && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1 whitespace-nowrap align-middle leading-[1.2] shrink-0"><Mail className="w-3 h-3 shrink-0" style={{ color }} />{p.email}</span>}
          {p.phone && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1 whitespace-nowrap align-middle leading-[1.2] shrink-0"><Phone className="w-3 h-3 shrink-0" style={{ color }} />{p.phone}</span>}
          {p.location && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1 whitespace-nowrap align-middle leading-[1.2] shrink-0"><MapPin className="w-3 h-3 shrink-0" style={{ color }} />{p.location}</span>}
        </div>
      </Wrap>
      {p.summary && <Wrap {...aProps(0.1)} className="mb-6 text-center"><SectionTitle icon={UserCircle} title="About Me" color={color} /><p className="text-xs text-gray-500 leading-relaxed max-w-[450px] mx-auto">{p.summary}</p></Wrap>}
      {skills.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-6">
          <SectionTitle icon={Zap} title="Skills" color={color} />
          <div data-export-inline-row className="flex flex-wrap justify-center gap-5">
            {skills.map((s: any, i: number) => (
              <div key={s.id} data-export-lock-size className="text-center shrink-0">
                <div data-export-lock-size className="relative w-14 h-14 mx-auto shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8" strokeDasharray="264"
                      strokeDashoffset={264 - (264 * s.level / 100)}
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
    <div className="bg-white text-gray-900 p-8" style={{ fontFamily: fontFamily || "'Georgia', 'Times New Roman', serif" }}>
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
        <div className="w-[35%] p-5 border-r" style={{ borderColor: hexToRgba(color, 0.082), backgroundColor: hexToRgba(color, 0.02) }}>
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
              <div className="flex flex-wrap gap-1">{hobbies.map((h) => (<span key={h} className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: hexToRgba(color, 0.082), color }}>{h}</span>))}</div>
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

  // Create safe rgba versions for gradients - avoids html2canvas "addColorStop non-finite" crash
  const safeMainColor = hexToRgba(color, 1.0);
  const lighterColor = hexToRgba(color, 0.75);

  return (
    <div className="bg-white text-gray-900" style={{ fontFamily }}>
      {/* Gradient header */}
      <Wrap {...aProps(0)} className="p-8 pb-6 text-white" style={{ background: `linear-gradient(135deg, ${safeMainColor}, ${lighterColor})` }}>
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
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-full rounded-full" style={{ width: `${s.level}%`, background: `linear-gradient(90deg, ${safeMainColor}, ${lighterColor})` }} /></div>
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
    <div className="text-gray-200" style={{ fontFamily: fontFamily || "'Consolas', 'Courier New', monospace", backgroundColor: bgDark, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,240,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,240,255,0.03) 0%, transparent 50%)' }}>
      {/* Header with cyber grid */}
      <Wrap {...aProps(0)} className="p-7 pb-5 relative" style={{ borderBottom: `1px solid ${hexToRgba(neonColor, 0.188)}` }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(${hexToRgba(neonColor, 0.125)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(neonColor, 0.125)} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
        <div className="flex items-center gap-5 relative z-10">
          {showPhoto && (
            <div className="w-20 h-20 overflow-hidden shrink-0 relative" style={{ borderRadius: photoRadius, border: `2px solid ${neonColor}`, boxShadow: `0 0 20px ${hexToRgba(neonColor, 0.251)}, inset 0 0 20px ${hexToRgba(neonColor, 0.063)}` }}>
              <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-wider uppercase" style={{ color: neonColor, textShadow: `0 0 10px ${hexToRgba(neonColor, 0.314)}` }}>{p.fullName || 'Your Name'}</h1>
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
          <Wrap {...aProps(0.1)} className="p-4 rounded-lg" style={{ backgroundColor: bgCard, border: `1px solid ${hexToRgba(neonColor, 0.082)}` }}>
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
                <div key={s.id} className="p-2.5 rounded-lg" style={{ backgroundColor: bgCard, border: `1px solid ${hexToRgba(neonColor, 0.063)}` }}>
                  <div className="flex justify-between text-[10px] mb-1.5">
                    <span className="font-medium text-gray-300">{s.name}</span>
                    <span style={{ color: neonColor }}>{s.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: neonColor, boxShadow: `0 0 6px ${hexToRgba(neonColor, 0.376)}` }}
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
            <div className="space-y-3 ml-3 border-l" style={{ borderColor: hexToRgba(neonColor, 0.188) }}>
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
              <div key={edu.id} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: bgCard, border: `1px solid ${hexToRgba(neonColor, 0.063)}` }}>
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
                <span key={l.id} className="text-[10px] px-3 py-1 rounded-full" style={{ border: `1px solid ${hexToRgba(neonColor, 0.251)}`, color: neonColor, backgroundColor: `${hexToRgba(neonColor, 0.031)}` }}>
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
              {hobbies.map((h) => (<span key={h} className="px-2.5 py-1 rounded text-[10px]" style={{ backgroundColor: `${hexToRgba(neonColor, 0.063)}`, color: neonColor, border: `1px solid ${hexToRgba(neonColor, 0.125)}` }}>{h}</span>))}
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
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: hexToRgba(accent, 0.082) }}>
        <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
      </div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{title}</h3>
      <div className="flex-1 h-px" style={{ backgroundColor: hexToRgba(accent, 0.082) }} />
    </div>
  );

  return (
    <div style={{ fontFamily: fontFamily || "'DM Sans', 'Inter', sans-serif", backgroundColor: bgMain }}>
      {/* Premium dark header - no radial gradients for export compatibility */}
      <Wrap {...aProps(0)} style={{ background: `linear-gradient(160deg, ${bgDark} 0%, #1e1b4b 50%, ${bgDark} 100%)` }}>
        <div className="p-8 pb-0">
          <div className="flex items-start gap-6">
            {showPhoto && p.profileImage && (
              <div className="w-24 h-24 overflow-hidden shrink-0 relative" style={{ borderRadius: photoRadius || '16px', border: `2px solid ${hexToRgba(accent, 0.251)}` }}>
                <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-[inherit]" style={{ boxShadow: `inset 0 0 0 1px ${hexToRgba(accent, 0.125)}` }} />
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
          <Wrap {...aProps(0.1)} className="mb-6 p-4 rounded-xl" style={{ backgroundColor: hexToRgba(accent, 0.031), border: `1px solid ${hexToRgba(accent, 0.082)}` }}>
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
                    <div key={exp.id} className="relative pl-5" style={{ borderLeft: `2px solid ${i === 0 ? accent : hexToRgba(accent, 0.145)}` }}>
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? accent : hexToRgba(accent, 0.376), border: i === 0 ? `2px solid ${hexToRgba(accent, 0.188)}` : 'none' }} />
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-[13px] text-gray-900">{exp.position}</h4>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-2" style={{ backgroundColor: hexToRgba(accent, 0.063), color: accent }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
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
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: hexToRgba(accent, 0.071) }}>
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
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: hexToRgba(accent, 0.063), color: accent }}>{l.proficiency}</span>
                  </div>
                ))}
              </Wrap>
            )}

            {hobbies.length > 0 && (
              <Wrap {...aProps(0.4)}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: accent }}>Interests</h3>
                <div className="flex flex-wrap gap-1.5">
                  {hobbies.map((h) => (
                    <span key={h} className="text-[9px] px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: hexToRgba(accent, 0.063), color: accent }}>{h}</span>
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

// ======= NEW TEMPLATES =======

const ElegantSerifTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const serif = fontFamily || "'Playfair Display', 'Georgia', serif";
  return (
    <div className="bg-white text-gray-900 p-10" style={{ fontFamily: serif }}>
      <Wrap {...aProps(0)} className="text-center mb-8">
        {showPhoto && (
          <div className="w-24 h-24 mx-auto mb-4 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, border: `2px solid ${color}` }}>
            <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight" style={{ color }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p className="text-sm italic text-gray-500 mt-2">{p.jobTitle}</p>}
        <div className="mt-3 inline-flex items-center gap-3 mx-auto">
          <span className="h-px w-10" style={{ backgroundColor: color }} />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Curriculum Vitae</span>
          <span className="h-px w-10" style={{ backgroundColor: color }} />
        </div>
        <div className="flex justify-center flex-wrap gap-x-5 gap-y-1 mt-4 text-[11px] text-gray-500">
          {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color }} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color }} />{p.location}</span>}
        </div>
        <div className="flex justify-center"><SocialsRow socials={socials} color={color} /></div>
      </Wrap>
      {p.summary && <Wrap {...aProps(0.1)} className="mb-7 max-w-[560px] mx-auto text-center"><p className="text-[13px] italic leading-relaxed text-gray-600">"{p.summary}"</p></Wrap>}
      {experience.length > 0 && <Wrap {...aProps(0.2)} className="mb-6"><SectionTitle icon={Briefcase} title="Experience" color={color} /><TimelineItems items={experience} color={color} animated={animated} type="experience" /></Wrap>}
      {education.length > 0 && <Wrap {...aProps(0.3)} className="mb-6"><SectionTitle icon={GraduationCap} title="Education" color={color} /><TimelineItems items={education} color={color} animated={animated} type="education" /></Wrap>}
      <SkillsSection skills={skills} color={color} animated={animated} />
      <LanguagesSection languages={languages} color={color} animated={animated} />
      <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
      <AchievementsSection achievements={achievements} color={color} animated={animated} />
      <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
    </div>
  );
};

const CompactProTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  return (
    <div className="bg-white text-gray-900 p-6" style={{ fontFamily }}>
      <Wrap {...aProps(0)} className="flex items-center gap-4 mb-4 pb-3" style={{ borderBottom: `3px solid ${color}` }}>
        {showPhoto && (
          <div className="w-16 h-16 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, border: `2px solid ${color}` }}>
            <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">{p.fullName || 'Your Name'}</h1>
          {p.jobTitle && <p className="text-xs font-medium" style={{ color }}>{p.jobTitle}</p>}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500">
            {p.email && <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" style={{ color }} />{p.email}</span>}
            {p.phone && <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" style={{ color }} />{p.phone}</span>}
            {p.location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" style={{ color }} />{p.location}</span>}
            {p.website && <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" style={{ color }} />{p.website}</span>}
          </div>
        </div>
      </Wrap>
      {p.summary && <Wrap {...aProps(0.08)} className="mb-4"><p className="text-[11px] leading-snug text-gray-600">{p.summary}</p></Wrap>}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {experience.length > 0 && <Wrap {...aProps(0.15)}><SectionTitle icon={Briefcase} title="Experience" color={color} /><TimelineItems items={experience} color={color} animated={animated} type="experience" /></Wrap>}
          {education.length > 0 && <Wrap {...aProps(0.25)}><SectionTitle icon={GraduationCap} title="Education" color={color} /><TimelineItems items={education} color={color} animated={animated} type="education" /></Wrap>}
          <AchievementsSection achievements={achievements} color={color} animated={animated} />
          <CustomSectionsRender customSections={customSections} color={color} animated={animated} />
        </div>
        <div className="col-span-1 space-y-4">
          <SkillsSection skills={skills} color={color} animated={animated} />
          <LanguagesSection languages={languages} color={color} animated={animated} />
          <HobbiesSection hobbies={hobbies} color={color} animated={animated} />
          {socials.length > 0 && (
            <div>
              <SectionTitle icon={Globe} title="Connect" color={color} />
              <SocialsRow socials={socials} color={color} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NeonVibrantTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const bg = '#0a0a14';
  const panel = '#111122';
  const textMain = '#e6e6ef';
  const textMuted = '#8b8ba0';
  return (
    <div className="p-8" style={{ fontFamily, backgroundColor: bg, color: textMain }}>
      <Wrap {...aProps(0)} className="mb-6 p-6 rounded-2xl" style={{ background: `linear-gradient(135deg, ${hexToRgba(color, 0.18)} 0%, ${panel} 100%)`, border: `1px solid ${hexToRgba(color, 0.35)}`, boxShadow: `0 0 32px ${hexToRgba(color, 0.25)}` }}>
        <div className="flex items-center gap-5">
          {showPhoto && (
            <div className="w-24 h-24 overflow-hidden shrink-0" style={{ borderRadius: photoRadius, border: `2px solid ${color}`, boxShadow: `0 0 18px ${hexToRgba(color, 0.55)}` }}>
              <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color, textShadow: `0 0 12px ${hexToRgba(color, 0.65)}` }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && <p className="text-sm mt-1" style={{ color: textMuted }}>{p.jobTitle}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px]" style={{ color: textMuted }}>
              {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color }} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color }} />{p.phone}</span>}
              {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color }} />{p.location}</span>}
            </div>
            <SocialsRow socials={socials} color={color} />
          </div>
        </div>
      </Wrap>
      {p.summary && (
        <Wrap {...aProps(0.1)} className="mb-5 p-4 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color }}>About</h3>
          <p className="text-[12px] leading-relaxed" style={{ color: textMain }}>{p.summary}</p>
        </Wrap>
      )}
      {experience.length > 0 && (
        <Wrap {...aProps(0.2)} className="mb-5 p-5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color }}>// Experience</h3>
          {experience.map((exp: any) => (
            <div key={exp.id} className="mb-3 pl-3" style={{ borderLeft: `2px solid ${color}` }}>
              <div className="flex justify-between items-baseline"><h4 className="font-bold text-sm" style={{ color: textMain }}>{exp.position}</h4><span className="text-[10px]" style={{ color: textMuted }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span></div>
              <p className="text-[11px] font-semibold" style={{ color }}>{exp.company}</p>
              {exp.description && <p className="text-[11px] mt-1 leading-relaxed" style={{ color: textMuted }}>{exp.description}</p>}
            </div>
          ))}
        </Wrap>
      )}
      {education.length > 0 && (
        <Wrap {...aProps(0.3)} className="mb-5 p-5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color }}>// Education</h3>
          {education.map((edu: any) => (
            <div key={edu.id} className="mb-2"><h4 className="font-bold text-sm" style={{ color: textMain }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4><p className="text-[11px]" style={{ color }}>{edu.institution}</p><p className="text-[10px]" style={{ color: textMuted }}>{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</p></div>
          ))}
        </Wrap>
      )}
      {skills.length > 0 && (
        <Wrap {...aProps(0.4)} className="mb-5 p-5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color }}>// Skills</h3>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            {skills.map((s: any, i: number) => (
              <div key={s.id}>
                <div className="flex justify-between text-[11px] mb-1"><span style={{ color: textMain }}>{s.name}</span><span style={{ color }}>{s.level}%</span></div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: hexToRgba(color, 0.12) }}>
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${s.level}%`, boxShadow: `0 0 8px ${hexToRgba(color, 0.7)}` }}
                    initial={animated ? { width: 0 } : { width: `${s.level}%` }}
                    animate={{ width: `${s.level}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }} />
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      )}
      {languages.length > 0 && (
        <Wrap {...aProps(0.5)} className="mb-5 p-5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color }}>// Languages</h3>
          <div className="flex flex-wrap gap-2">{languages.map((l: any) => (<span key={l.id} className="text-[11px] px-3 py-1 rounded-full" style={{ border: `1px solid ${color}`, color }}>{l.name} · {l.proficiency}</span>))}</div>
        </Wrap>
      )}
      {hobbies.length > 0 && (
        <Wrap {...aProps(0.6)} className="mb-5 p-5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color }}>// Interests</h3>
          <div className="flex flex-wrap gap-1.5">{hobbies.map((h) => (<span key={h} className="text-[10px] px-2.5 py-1 rounded-full" style={{ backgroundColor: hexToRgba(color, 0.12), color }}>{h}</span>))}</div>
        </Wrap>
      )}
      {achievements.length > 0 && (
        <Wrap {...aProps(0.65)} className="mb-5 p-5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color }}>// Achievements</h3>
          {achievements.map((a: any) => (
            <div key={a.id} className="mb-2"><div className="flex items-center gap-1.5"><Trophy className="w-3 h-3" style={{ color }} /><span className="font-bold text-[12px]" style={{ color: textMain }}>{a.title}</span></div>{a.description && <p className="text-[10px] mt-0.5" style={{ color: textMuted }}>{a.description}</p>}</div>
          ))}
        </Wrap>
      )}
      {customSections.filter((c: any) => c.title).map((sec: any) => (
        <Wrap key={sec.id} {...aProps(0.7)} className="mb-5 p-5 rounded-xl" style={{ backgroundColor: panel, border: `1px solid ${hexToRgba(color, 0.18)}` }}>
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color }}>// {sec.title}</h3>
          <p className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: textMain }}>{sec.content}</p>
        </Wrap>
      ))}
    </div>
  );
};

// ======= NEW TEMPLATE: Portfolio Card (rounded cards, premium portfolio style) =======
const PortfolioCardTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const bg = '#f5f7fb';
  const card = '#ffffff';
  const soft = hexToRgba(color, 0.08);
  const border = hexToRgba(color, 0.14);

  const Card: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => (
    <Wrap {...aProps(delay)} className={`rounded-2xl p-5 ${className}`} style={{ backgroundColor: card, border: `1px solid ${border}`, boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
      {children}
    </Wrap>
  );

  const Heading = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div data-export-inline-row className="flex items-center gap-2 mb-3">
      <span data-export-lock-size className="inline-flex items-center justify-center shrink-0 w-6 h-6 rounded-md" style={{ backgroundColor: soft, color }}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: '#0f172a' }}>{title}</h3>
    </div>
  );

  return (
    <div className="p-5" style={{ fontFamily, backgroundColor: bg, color: '#0f172a' }}>
      <div className="grid gap-4" style={{ gridTemplateColumns: '34% 1fr' }}>
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <Card delay={0}>
            <div className="flex flex-col items-center text-center">
              {showPhoto ? (
                <div className="w-32 h-32 overflow-hidden shrink-0 mb-3" style={{ borderRadius: photoRadius, border: `3px solid ${color}`, boxShadow: `0 0 0 4px ${soft}` }}>
                  <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover block" />
                </div>
              ) : null}
              <div data-export-inline-item className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap leading-none" style={{ backgroundColor: soft, color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} /> Available for Work
              </div>
              {p.jobTitle && <p className="text-[10px] text-gray-500 mt-1.5">{p.jobTitle}</p>}
            </div>
          </Card>

          <Card delay={0.1}>
            <Heading icon={UserCircle} title="Contact" />
            <div className="space-y-2 text-[11px] text-gray-700">
              {p.email && <div data-export-inline-item className="inline-flex items-center gap-2 whitespace-nowrap leading-[1.2]"><Mail className="w-3 h-3 shrink-0" style={{ color }} />{p.email}</div>}
              {p.phone && <div data-export-inline-item className="inline-flex items-center gap-2 whitespace-nowrap leading-[1.2]"><Phone className="w-3 h-3 shrink-0" style={{ color }} />{p.phone}</div>}
              {p.website && <div data-export-inline-item className="inline-flex items-center gap-2 whitespace-nowrap leading-[1.2]"><Globe className="w-3 h-3 shrink-0" style={{ color }} />{p.website}</div>}
              {p.location && <div data-export-inline-item className="inline-flex items-center gap-2 whitespace-nowrap leading-[1.2]"><MapPin className="w-3 h-3 shrink-0" style={{ color }} />{p.location}</div>}
              {socials.filter((s: any) => s.url).map((s: any, i: number) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" data-export-inline-item className="inline-flex items-center gap-2 whitespace-nowrap leading-[1.2] text-gray-700">
                  <span style={{ color }} className="shrink-0 inline-flex">{getPlatformIcon(s.platform)}</span>
                  {s.platform}
                </a>
              ))}
            </div>
          </Card>

          {hobbies.length > 0 && (
            <Card delay={0.2}>
              <Heading icon={Heart} title="Expertise" />
              <div data-export-inline-row className="flex flex-wrap gap-1.5">
                {hobbies.map((h) => (
                  <span key={h} data-export-lock-size data-export-inline-item className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap leading-none shrink-0" style={{ backgroundColor: soft, color }}>{h}</span>
                ))}
              </div>
            </Card>
          )}

          {skills.length > 0 && (
            <Card delay={0.25}>
              <Heading icon={Cpu} title="Software" />
              <div className="space-y-2">
                {skills.map((s: any, i: number) => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-medium text-gray-800">{s.name}</span>
                      <span className="text-gray-400 text-[10px]">{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: '#eef0f5' }}>
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: `${s.level}%` }}
                        initial={animated ? { width: 0 } : { width: `${s.level}%` }}
                        animate={{ width: `${s.level}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.08 }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {languages.length > 0 && (
            <Card delay={0.3}>
              <Heading icon={Globe2} title="Languages" />
              <div className="space-y-2">
                {languages.map((l: any) => (
                  <div key={l.id} className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-gray-800">{l.name}</span>
                    <span className="text-gray-500 text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <Card delay={0.05}>
            <h1 className="text-4xl font-extrabold tracking-tight leading-[1.05]" style={{ color: '#0f172a' }}>
              {(p.fullName || 'Your Name').split(' ').map((w: string, i: number, arr: string[]) => (
                <span key={i} style={{ color: i === arr.length - 1 && arr.length > 1 ? color : '#0f172a' }}>{w}{i < arr.length - 1 ? ' ' : ''}</span>
              ))}
            </h1>
            {p.jobTitle && <p className="text-[11px] font-bold uppercase tracking-[0.18em] mt-2" style={{ color }}>{p.jobTitle}</p>}
            {p.summary && <p className="text-[12px] text-gray-600 leading-relaxed mt-3">{p.summary}</p>}
            <div data-export-inline-row className="flex flex-wrap gap-2 mt-4">
              {p.location && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap leading-none border" style={{ borderColor: border, color: '#475569' }}><MapPin className="w-3 h-3" style={{ color }} />{p.location}</span>}
              {p.website && <span data-export-lock-size data-export-inline-item className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap leading-none border" style={{ borderColor: border, color: '#475569' }}><Globe className="w-3 h-3" style={{ color }} />{p.website}</span>}
            </div>
          </Card>

          {experience.length > 0 && (
            <Card delay={0.15}>
              <Heading icon={Briefcase} title="Work Experience" />
              <div className="space-y-4 ml-2 border-l-2 pl-5" style={{ borderColor: soft }}>
                {experience.map((exp: any) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2" style={{ borderColor: color, backgroundColor: '#fff' }} />
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-bold text-sm" style={{ color: '#0f172a' }}>{exp.position}</h4>
                      <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                    </div>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color }}>{exp.company}</p>
                    {exp.description && <p className="text-[11px] mt-1.5 text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {education.length > 0 && (
            <Card delay={0.25}>
              <Heading icon={GraduationCap} title="Education" />
              <div className="space-y-3">
                {education.map((edu: any) => (
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4>
                      <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color }}>{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</span>
                    </div>
                    <p className="text-[11px] text-gray-600">{edu.institution}</p>
                    {edu.description && <p className="text-[11px] text-gray-500 mt-1 whitespace-pre-line">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {achievements.length > 0 && (
            <Card delay={0.35}>
              <Heading icon={Trophy} title="Achievements" />
              <div className="space-y-2">
                {achievements.map((a: any) => (
                  <div key={a.id} className="p-3 rounded-lg" style={{ backgroundColor: soft }}>
                    <div data-export-inline-item className="inline-flex items-center gap-1.5 whitespace-nowrap leading-[1.2]"><Star className="w-3 h-3 shrink-0" style={{ color }} /><span className="font-bold text-[11px]">{a.title}</span></div>
                    {a.description && <p className="text-[10px] text-gray-600 mt-1">{a.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {customSections.filter((c: any) => c.title).map((sec: any) => (
            <Card key={sec.id} delay={0.4}>
              <Heading icon={PenLine} title={sec.title} />
              <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line">{sec.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ======= NEW TEMPLATE: Blue Sidebar (academic / scholarship style) =======
const BlueSidebarTemplate = ({ data, color, fontFamily, animated, showPhoto, photoRadius }: any) => {
  const { personal: p, socials, education, experience, skills, languages, hobbies, achievements, customSections } = data;
  const Wrap = animated ? motion.div : 'div' as any;
  const aProps = (delay = 0) => animated ? { ...fadeUp, transition: { delay, duration: 0.5 } } : {};
  const sidebarBg = hexToRgba(color, 0.18);

  const SideHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[13px] font-extrabold tracking-tight mb-2 mt-5 first:mt-0" style={{ color: '#0f172a' }}>
      {children}:
    </h3>
  );

  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <li data-export-inline-item className="flex items-start gap-2 text-[11px] leading-snug text-gray-800 mb-1">
      <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#0f172a' }} />
      <span>{children}</span>
    </li>
  );

  const MainHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[15px] font-extrabold underline decoration-2 underline-offset-4 mb-3 mt-5 first:mt-0" style={{ color: '#0f172a' }}>
      {children}:
    </h3>
  );

  return (
    <div className="grid" style={{ fontFamily, gridTemplateColumns: '32% 1fr', backgroundColor: '#ffffff', color: '#0f172a' }}>
      {/* SIDEBAR */}
      <div className="p-6" style={{ backgroundColor: sidebarBg }}>
        {showPhoto && (
          <div className="flex justify-center mb-5">
            <div className="w-36 h-36 overflow-hidden" style={{ borderRadius: photoRadius, border: '3px solid #0f172a' }}>
              <img src={p.profileImage} alt={p.fullName} className="w-full h-full object-cover block" />
            </div>
          </div>
        )}

        <SideHeading>Personal Information</SideHeading>
        <ul className="space-y-0.5">
          {p.fullName && <Bullet>Name: {p.fullName}</Bullet>}
          {p.jobTitle && <Bullet>Role: {p.jobTitle}</Bullet>}
          {p.location && <Bullet>Location: {p.location}</Bullet>}
          {p.email && <Bullet>Email: {p.email}</Bullet>}
          {p.website && <Bullet>Portfolio: {p.website}</Bullet>}
          {p.phone && <Bullet>{p.phone}</Bullet>}
          {socials.filter((s: any) => s.url).map((s: any, i: number) => (
            <Bullet key={i}>{s.platform}</Bullet>
          ))}
        </ul>

        {skills.length > 0 && (
          <>
            <SideHeading>Software</SideHeading>
            <ul className="space-y-0.5">
              {skills.map((s: any) => (<Bullet key={s.id}><span className="uppercase tracking-wide">{s.name}</span></Bullet>))}
            </ul>
          </>
        )}

        {hobbies.length > 0 && (
          <>
            <SideHeading>Hobbies</SideHeading>
            <ul className="space-y-0.5">
              {hobbies.map((h) => (<Bullet key={h}><span className="uppercase tracking-wide">{h}</span></Bullet>))}
            </ul>
          </>
        )}

        {languages.length > 0 && (
          <>
            <SideHeading>Language</SideHeading>
            <ul className="space-y-0.5">
              {languages.map((l: any) => (<Bullet key={l.id}><span className="uppercase tracking-wide">{l.name}</span></Bullet>))}
            </ul>
          </>
        )}

        {achievements.length > 0 && (
          <>
            <SideHeading>Motivation Note</SideHeading>
            <ul className="space-y-0.5">
              {achievements.map((a: any) => (<Bullet key={a.id}>{a.title}{a.description ? `. ${a.description}` : ''}</Bullet>))}
            </ul>
          </>
        )}
      </div>

      {/* MAIN */}
      <div className="p-7">
        <Wrap {...aProps(0)} className="mb-2">
          <h1 className="text-5xl font-extrabold tracking-tight uppercase" style={{ color: '#0f172a' }}>{p.fullName || 'Your Name'}</h1>
          {p.jobTitle && <p className="text-[12px] mt-2 text-gray-700">{p.jobTitle}</p>}
        </Wrap>

        {p.summary && (
          <Wrap {...aProps(0.1)}>
            <MainHeading>Profile</MainHeading>
            <ul className="space-y-1.5">
              <Bullet>{p.summary}</Bullet>
            </ul>
          </Wrap>
        )}

        {experience.length > 0 && (
          <Wrap {...aProps(0.2)}>
            <MainHeading>Work Experience</MainHeading>
            <div className="space-y-4">
              {experience.map((exp: any) => (
                <div key={exp.id}>
                  <h4 className="text-[13px] font-bold">{exp.position}</h4>
                  <p data-export-inline-item className="text-[11px] text-gray-600 inline-flex items-center gap-2 whitespace-nowrap leading-[1.2]">
                    <span>{exp.company}</span>
                    {exp.startDate && <span>· {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>}
                  </p>
                  {exp.description && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                        <Bullet key={i}>{line.replace(/^[-•]\s*/, '')}</Bullet>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Wrap>
        )}

        {education.length > 0 && (
          <Wrap {...aProps(0.3)}>
            <MainHeading>Education</MainHeading>
            <div className="space-y-3">
              {education.map((edu: any) => (
                <div key={edu.id}>
                  <h4 className="text-[13px] font-bold">{edu.institution}</h4>
                  <p className="text-[11px] text-gray-700">{edu.degree}{edu.field ? ` (${edu.field})` : ''}</p>
                  <ul className="mt-1 space-y-0.5">
                    <Bullet>{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</Bullet>
                    {edu.description && <Bullet>{edu.description}</Bullet>}
                  </ul>
                </div>
              ))}
            </div>
          </Wrap>
        )}

        {customSections.filter((c: any) => c.title).map((sec: any) => (
          <Wrap key={sec.id} {...aProps(0.4)}>
            <MainHeading>{sec.title}</MainHeading>
            <ul className="space-y-1.5">
              {sec.content.split('\n').filter(Boolean).map((line: string, i: number) => (
                <Bullet key={i}>{line.replace(/^[-•]\s*/, '')}</Bullet>
              ))}
            </ul>
          </Wrap>
        ))}
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
  elegantserif: ElegantSerifTemplate,
  compactpro: CompactProTemplate,
  neonvibrant: NeonVibrantTemplate,
  portfoliocard: PortfolioCardTemplate,
  bluesidebar: BlueSidebarTemplate,
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
    <div id="cv-output" data-cv-page className="cv-page-shell mx-auto shadow-xl rounded-lg overflow-hidden">
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
