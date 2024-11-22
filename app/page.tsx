import { InfiniteCarousel, LatestUpdates,FeaturedThesis } from "@/components";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen items-center justify-center">
      <section className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-4xl font-bold text-gray-300">Welcome to Scholar Connect</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Explore and access thousands of academic theses from various fields.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block bg-slate-700 text-gray-200 px-6 py-3 rounded-md font-semibold hover:bg-gray-500 transition"
          >
            Explore Now
          </Link>
        </div>
      </section>
      <InfiniteCarousel/>
      <LatestUpdates/>
      <FeaturedThesis/>
    </div>

  );
}
