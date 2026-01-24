export interface Testimonial {
  name: string;
  date: string;
  content: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Brian O',
    date: 'January 23, 2026',
    content:
      'Super professional, easy to work with. Responds quickly and work with minimal instruction. Highly recommend.',
  },
  {
    name: 'Michael K',
    date: 'October 18, 2024',
    content: "Fantastic! I'd recommend to any team.",
  },
  {
    name: 'JM',
    date: 'April 21, 2024',
    content:
      'Melnard is a machine--he works hard and tirelessly at all hours of the day. The platform we use was new to him, but he took to it remarkably well, producing a clean, professional looking product. You will not find a more hard-working, conscientious person for your project--thank you, Mel!',
  },
];

export const TESTIMONIALS_PROFILE_URL =
  'https://www.onlinejobs.ph/jobseekers/info/1552795';
