export type UserRole = 'Student Council' | 'Newsletter Head' | 'Club Head / General User';

export interface User {
  id: string;
  username: string;
  email: string;
  contactNumber: string;
  role: UserRole;
  collegeName: string;
  avatar?: string;
}

export interface ClubShortcut {
  id: string;
  name: string;
  targetUrl: string;
  logoUrl: string;
  category: 'Tech' | 'Cultural' | 'Sports' | 'Literary' | 'Social' | 'Academic' | 'Other';
  description: string;
  leads?: string;
  memberCount?: number;
  meetingSchedule?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  department: string;
  date: string;
  category: 'Academics' | 'Sports' | 'Cultural' | 'Examination' | 'General';
  priority?: 'high' | 'normal';
  description: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: 'Holiday' | 'Big Event';
  description: string;
  venue?: string;
}

export interface NewsletterArticle {
  id: string;
  title: string;
  edition: string;
  date: string;
  author: string;
  imageUrl: string;
  summary: string;
  tags: string[];
  likes?: number;
}

export interface CollegeSettings {
  collegeName: string;
  gateBannerUrl: string;
  logoUrl: string;
  tagline: string;
  location: string;
  establishedYear: string;
}
