import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Working with StrucAxis has been seamless. Their team understands execution challenges and solves them before they become roadblocks. Timely handovers and excellent workmanship make them my go-to contracting partner.",
      name: "Ar. Meenakshi Rao",
      designation: "Principal Architect, Bengaluru",
      src: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      quote:
        "They coordinated brilliantly with our consultants and site team. From manpower control to vendor approvals, everything was managed professionally. The project was delivered within the budgeted timeline.",
      name: "Mr. Prashant Sharma",
      designation: "Project Manager, Prestige Group",
      src: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote:
        "For us, speed and quality were critical. StrucAxis delivered a fast-track fit-out for our new café outlet in just 6 weeks. Their in-house carpentry and joinery units gave us an edge with precise finishes and no delays.",
      name: "Mr. Ramesh Iyer",
      designation: "Owner, Café Eleven – Mumbai",
      src: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      quote:
        "We entrusted StrucAxis with a hotel renovation project. Their ability to handle complex MEP coordination and safety impressed us. Minimal disruption and maximum attention to detail throughout execution.",
      name: "Ms. Priya Verma",
      designation: "GM Operations, Lemon Tree Hotels",
      src: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      quote:
        "The StrucAxis team handled our villa project with complete professionalism — transparent costing, clear communication, and excellent execution. The finishing is of international standard.",
      name: "Mr. Suresh Reddy",
      designation: "Villa Owner, Hyderabad",
      src: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
      quote:
        "For schools, deadlines are non-negotiable. StrucAxis delivered our new academic block before the session started. Their engineers and civil team ensured quality without compromise.",
      name: "Dr. Anjali Menon",
      designation: "Principal, Greenwood International School – Hyderabad",
      src: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    {
      quote:
        "StrucAxis executed our corporate office interiors with precision. Procurement and manpower were handled smoothly. The project was delivered on time, and the quality speaks for itself.",
      name: "Mr. Nikhil Kapoor",
      designation: "Facility Head, Infosys Pune",
      src: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
      quote:
        "We trusted StrucAxis for our clinic interiors. Their joinery and furniture packages helped us achieve a high-end finish while maintaining hygiene standards. Very professional team.",
      name: "Dr. Kavita Nair",
      designation: "Clinic Owner, Kochi",
      src: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    {
      quote:
        "The StrucAxis team was highly responsive and detail-oriented. Their in-house joinery and furniture helped us achieve the modern villa look we wanted in Riyadh, without delays in procurement.",
      name: "Mr. Khalid Al-Mutairi",
      designation: "Villa Owner, Riyadh (KSA)",
      src: "https://randomuser.me/api/portraits/men/29.jpg",
    },
    {
      quote:
        "They understood our brand guidelines and executed the interiors perfectly. The coordination with mall authorities in Jeddah was smooth, making our café expansion stress-free.",
      name: "Mr. Faisal Al-Harbi",
      designation: "Franchise Owner, Jeddah",
      src: "https://randomuser.me/api/portraits/men/41.jpg",
    },
  ];

  return <AnimatedTestimonials testimonials={testimonials} />;
}