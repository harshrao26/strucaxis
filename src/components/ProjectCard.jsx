import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';

export default function ProjectCard({ title, location, image, href }) {
  return (
    <a href={href || '#'} className="group block no-underline">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border bg-neutral-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-neutral-500">{location}</p>
        </div>
        <FiArrowUpRight className="opacity-0 transition group-hover:opacity-100" />
      </div>
    </a>
  );
}