export type TeamMember = {
  name: string;
  role: string;
  /** Optional headshot path under /public/team — falls back to initials avatar */
  photo?: string;
};

export const team: TeamMember[] = [
  { name: "Abid Fareed", role: "Founder & Lead Editor" },
  { name: "Laiba Khan", role: "Video Editor" },
  { name: "Qayyum Raza", role: "Video Editor" },
  { name: "Noman Shabbier", role: "UI/UX Designer" },
  { name: "Usama Saleem", role: "Graphic Designer" },
  { name: "Ahmad Raza", role: "Graphic Designer" },
];
