"use client";
import Image from "next/image";
import herobg from '@/assets/hero/herobg.jpg'
export default function Hero() {
  return (
    <section className="bg- md:px-0 px-4">
      {/* Headline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-0 pt-10 sm:pt-10">
        <h1 className="
          md:text-5xl text-2xl text-right font-semibold leading-tight
         
        "> 
          we are <span className="bg-[#234D7E] text-white px-2 rounded-md"> 
            architects
            </span>  & <span className="bg-[#234D7E] text-white px-2 rounded-md">interior designers</span><br className="" />
          we create timeless spaces,<br className="hidden sm:block" />
          integrating form, function, and detail,<br className="hidden sm:block" />
          to craft places people remember.
        </h1>
      </div>

      {/* Image */}
      <div className="max-w-7xl mx-auto mt-6 sm:mt-8 px-4 sm:px-0 pb-8">
        <div className="relative w-full h-[220px] sm:h-[360px] md:h-[440px] lg:h-[520px]">
          <Image
            src={herobg}
            alt="Modern home exterior"
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover rounded-none"
            priority
          />
        </div>
      </div>
    </section>
  );
}