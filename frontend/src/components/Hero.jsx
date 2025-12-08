import React from "react";
import { ArrowRight, Play } from "lucide-react";

const Avatar = ({ src, alt, className = "" }) => (
    <img
        src={src}
        alt={alt}
        className={
            "h-8 w-8 rounded-full ring-2 ring-[#0c0f17] object-cover " + className
        }
    />
);

const Hero = () => {
    return (
        <section className="mx-auto max-w-7xl px-4">
            <div className="rounded-3xl border border-white/10 bg-[radial-gradient(1200px 600px at 70% -20%, rgba(232, 241, 244, 0.25), transparent),
                  linear-gradient(180deg, #FFFFFF, #0F52BA)] p-6 shadow-2xl md:p-10">
                {/* media area */}
                <div className="grid items-center gap-10 md:grid-cols-2">
                    {/* Left content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                            MediFine{" "}
                            <span className="text-white/90">Medical Services,</span>{" "}
                            Answers for Your Health Journey
                        </h1>

                        <p className="max-w-xl text-base text-gray-300">
                            Manage your medications entirely online. Our seamless digital platform allows you to request refills, schedule same-day delivery, and consult with a pharmacist—all from your computer or mobile device. Take control of your health with ultimate convenience.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <button className="group inline-flex items-center gap-3 rounded-full border border-violet-500/40 bg-violet-600/20 px-5 py-3 font-semibold text-white hover:bg-violet-600/30">
                                Get Started
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 transition-transform group-hover:translate-x-0.5">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </button>

                            <button className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-medium text-white hover:bg-white/10">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                                    <Play className="h-4 w-4" />
                                </span>
                                Watch Reviews
                            </button>

                            {/* social proof */}
                            <div className="flex items-center gap-2 pl-2">
                                <div className="flex -space-x-2">
                                    <Avatar src="https://i.pravatar.cc/100?img=1" alt="A" />
                                    <Avatar src="https://i.pravatar.cc/100?img=2" alt="B" />
                                    <Avatar src="https://i.pravatar.cc/100?img=3" alt="C" />
                                </div>
                                <div className="text-sm text-gray-300">
                                    <span className="font-semibold text-white">2.7k+</span>{" "}
                                    Positive Reviews
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right decorative image */}
                    <div className="relative">
                        <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1600&auto=format&fit=crop"
                                alt="Hero"
                                className="h-full w-full object-cover opacity-80"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
