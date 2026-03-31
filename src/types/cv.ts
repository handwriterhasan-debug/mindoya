export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  profileImage: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  grade: string;
  percentage: string;
  description: string;
  current: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'technical' | 'soft' | 'other';
}

export interface Language {
  id: string;
  name: string;
  level: number;
  proficiency: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface CVDesign {
  template: string;
  primaryColor: string;
  fontStyle: string;
  photoStyle: 'circle' | 'square' | 'hidden';
  spacing: 'compact' | 'normal' | 'spacious';
}

export interface CVData {
  personal: PersonalInfo;
  socials: SocialLink[];
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
  achievements: Achievement[];
  customSections: CustomSection[];
  design: CVDesign;
}

export const defaultCVData: CVData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    profileImage: '',
  },
  socials: [],
  education: [],
  experience: [],
  skills: [],
  languages: [],
  hobbies: [],
  achievements: [],
  customSections: [],
  design: {
    template: 'modern',
    primaryColor: '#6C5CE7',
    fontStyle: 'modern',
    photoStyle: 'circle',
    spacing: 'normal',
  },
};
